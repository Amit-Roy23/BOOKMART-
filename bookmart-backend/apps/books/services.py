import concurrent.futures
from datetime import date
import logging
import re

import requests
from django.db import transaction
from django.db.models import Q

from apps.books.exceptions import (
    OpenLibraryConnectionError,
    OpenLibraryHTTPError,
    OpenLibraryImportError,
    OpenLibraryNotFoundError,
    OpenLibraryTimeoutError,
)
from apps.books.models import Author, Book, Genre
from apps.tags.services import tag_item

logger = logging.getLogger(__name__)

OPENLIBRARY_WORK_URL = "https://openlibrary.org"
OPENLIBRARY_SEARCH_URL = "https://openlibrary.org/search.json"
OPENLIBRARY_TIMEOUT_SECONDS = 5
OPENLIBRARY_HEADERS = {
    "User-Agent": "Bookmart/1.0 (https://bookmart.app; dev@bookmart.app)",
    "Accept": "application/json",
}


def parse_description(description):
    if isinstance(description, dict):
        return description.get("value", "")

    return description or ""


def parse_first_publish_date(date_str):
    if not date_str:
        return None
    match = re.search(r"\b\d{4}\b", str(date_str))
    if match:
        year = int(match.group(0))
        return date(year, 1, 1)
    return None


def process_genre_input(genre_input):
    """
    Parses string or list input into Genre model instances.
    Accepts single string (e.g. 'Fiction' or 'Fiction, Exam Prep') or list of strings/IDs.
    """
    if not genre_input:
        return []

    genres = []
    items = []

    if isinstance(genre_input, str):
        items = [c.strip() for c in genre_input.split(",") if c.strip()]
    elif isinstance(genre_input, (list, tuple, set)):
        items = list(genre_input)

    for item in items:
        if isinstance(item, Genre):
            genres.append(item)
        elif isinstance(item, int):
            try:
                gen = Genre.objects.get(pk=item)
                genres.append(gen)
            except Genre.DoesNotExist:
                pass
        elif isinstance(item, str) and item.strip():
            name = item.strip()
            if len(name) > 100:
                name = name[:100]
            gen, _ = Genre.objects.get_or_create(name=name)
            genres.append(gen)

    return genres


def get_book_document(work_key: str):
    clean_key = str(work_key).strip()
    if not clean_key.startswith("/"):
        clean_key = f"/{clean_key}"
    if clean_key.endswith(".json"):
        clean_key = clean_key[:-5]

    url = f"{OPENLIBRARY_WORK_URL}{clean_key}.json"

    try:
        response = requests.get(
            url,
            headers=OPENLIBRARY_HEADERS,
            timeout=OPENLIBRARY_TIMEOUT_SECONDS,
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.Timeout as exc:
        logger.error(
            f"OpenLibrary request timed out fetching book document for '{work_key}': {exc}",
            exc_info=True,
        )
        raise OpenLibraryTimeoutError(
            f"OpenLibrary request timed out while fetching book details: {work_key}"
        ) from exc
    except requests.exceptions.ConnectionError as exc:
        logger.error(
            f"OpenLibrary connection failed fetching book document for '{work_key}': {exc}",
            exc_info=True,
        )
        raise OpenLibraryConnectionError(
            f"Failed to connect to OpenLibrary service for book: {work_key}"
        ) from exc
    except requests.exceptions.HTTPError as exc:
        status_code = exc.response.status_code if exc.response is not None else 500
        logger.error(
            f"OpenLibrary HTTP {status_code} error fetching book document for '{work_key}': {exc}",
            exc_info=True,
        )
        if status_code == 404:
            raise OpenLibraryNotFoundError(
                f"Book not found on OpenLibrary: {work_key}"
            ) from exc
        raise OpenLibraryHTTPError(
            f"OpenLibrary returned HTTP error {status_code} for book: {work_key}",
            status_code=status_code,
        ) from exc
    except requests.exceptions.RequestException as exc:
        logger.error(
            f"OpenLibrary request exception for '{work_key}': {exc}",
            exc_info=True,
        )
        raise OpenLibraryImportError(
            f"Failed to fetch book from OpenLibrary: {str(exc)}"
        ) from exc
    except ValueError as exc:
        logger.error(
            f"Invalid JSON returned from OpenLibrary for '{work_key}': {exc}",
            exc_info=True,
        )
        raise OpenLibraryImportError(
            f"Invalid response format returned from OpenLibrary for book: {work_key}"
        ) from exc


def get_author_document(author_key: str):
    clean_key = str(author_key).strip()
    if not clean_key.startswith("/"):
        clean_key = f"/{clean_key}"
    if clean_key.endswith(".json"):
        clean_key = clean_key[:-5]

    url = f"{OPENLIBRARY_WORK_URL}{clean_key}.json"

    try:
        response = requests.get(
            url,
            headers=OPENLIBRARY_HEADERS,
            timeout=OPENLIBRARY_TIMEOUT_SECONDS,
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.Timeout as exc:
        logger.error(
            f"OpenLibrary request timed out fetching author document for '{author_key}': {exc}",
            exc_info=True,
        )
        raise OpenLibraryTimeoutError(
            f"OpenLibrary request timed out while fetching author details: {author_key}"
        ) from exc
    except requests.exceptions.ConnectionError as exc:
        logger.error(
            f"OpenLibrary connection failed fetching author document for '{author_key}': {exc}",
            exc_info=True,
        )
        raise OpenLibraryConnectionError(
            f"Failed to connect to OpenLibrary service for author: {author_key}"
        ) from exc
    except requests.exceptions.HTTPError as exc:
        status_code = exc.response.status_code if exc.response is not None else 500
        logger.error(
            f"OpenLibrary HTTP {status_code} error fetching author document for '{author_key}': {exc}",
            exc_info=True,
        )
        if status_code == 404:
            raise OpenLibraryNotFoundError(
                f"Author not found on OpenLibrary: {author_key}"
            ) from exc
        raise OpenLibraryHTTPError(
            f"OpenLibrary returned HTTP error {status_code} for author: {author_key}",
            status_code=status_code,
        ) from exc
    except requests.exceptions.RequestException as exc:
        logger.error(
            f"OpenLibrary request exception for author '{author_key}': {exc}",
            exc_info=True,
        )
        raise OpenLibraryImportError(
            f"Failed to fetch author from OpenLibrary: {str(exc)}"
        ) from exc
    except ValueError as exc:
        logger.error(
            f"Invalid JSON returned from OpenLibrary for author '{author_key}': {exc}",
            exc_info=True,
        )
        raise OpenLibraryImportError(
            f"Invalid response format returned from OpenLibrary for author: {author_key}"
        ) from exc


def import_book_from_openlibrary(work_key, custom_category=None):
    # Check if book already exists in local database
    existing_book = Book.objects.filter(openlibrary_key=work_key).first()
    if existing_book:
        if custom_category:
            manual_genres = process_genre_input(custom_category)
            for gen in manual_genres:
                existing_book.genres.add(gen)
        return existing_book, False

    document = get_book_document(work_key)
    title = document.get("title")
    covers = document.get("covers", [])
    cover_url = None

    if covers:
        cover_url = f"https://covers.openlibrary.org/b/id/{covers[0]}-L.jpg"

    # Concurrently fetch author documents to eliminate sequential N+1 HTTP calls
    author_keys = []
    for author_data in document.get("authors", []):
        author_key = author_data.get("author", {}).get("key")
        if author_key and author_key not in author_keys:
            author_keys.append(author_key)

    author_names = {}
    if author_keys:
        max_workers = min(len(author_keys), 5)
        with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_key = {
                executor.submit(get_author_document, key): key
                for key in author_keys
            }
            for future in concurrent.futures.as_completed(future_to_key):
                key = future_to_key[future]
                try:
                    author_doc = future.result()
                    name = (
                        author_doc.get("name", "Unknown")
                        if isinstance(author_doc, dict)
                        else "Unknown"
                    )
                    author_names[key] = name
                except OpenLibraryNotFoundError:
                    logger.warning(
                        f"Author document not found on OpenLibrary for '{key}'. Defaulting name to 'Unknown'.",
                        exc_info=True,
                    )
                    author_names[key] = "Unknown"
                except OpenLibraryImportError:
                    # Propagate timeout, network, or server errors from author requests
                    raise
                except Exception as exc:
                    logger.error(
                        f"Unexpected error fetching author for key '{key}': {exc}",
                        exc_info=True,
                    )
                    author_names[key] = "Unknown"

    author_objects = []
    for key in author_keys:
        author_name = author_names.get(key, "Unknown")
        author, _ = Author.objects.get_or_create(name=author_name)
        author_objects.append(author)

    first_publish_date_str = document.get("first_publish_date")
    published_date = parse_first_publish_date(first_publish_date_str)

    with transaction.atomic():
        book, created = Book.objects.update_or_create(
            openlibrary_key=work_key,
            defaults={
                "title": title,
                "cover_url": cover_url or "",
                "published_date": published_date,
            },
        )

        # ManyToMany assignment
        book.authors.set(author_objects)

        # Parse and assign genres from subjects (limit to top 10)
        genre_objects = []
        subjects = document.get("subjects", [])
        for subject in subjects[:10]:
            subject_name = subject.strip()
            if len(subject_name) > 100:
                subject_name = subject_name[:100]
            if not subject_name:
                continue
            genre, _ = Genre.objects.get_or_create(name=subject_name)
            genre_objects.append(genre)

        # Handle manual custom genre input
        if custom_category:
            manual_genres = process_genre_input(custom_category)
            for gen in manual_genres:
                if gen not in genre_objects:
                    genre_objects.append(gen)

        book.genres.set(genre_objects)

        # Tag the book with OpenLibrary subjects as tags
        if subjects:
            tag_item(book, subjects)

    return book, created


@transaction.atomic
def create_manual_book(data):
    """
    Manually creates a Book entry in the catalog when not found in external search.
    """
    title = data.get("title", "").strip()

    author_input = data.get("authors") or data.get("author") or []
    author_names = []
    if isinstance(author_input, str):
        author_names = [a.strip() for a in author_input.split(",") if a.strip()]
    elif isinstance(author_input, (list, tuple)):
        author_names = [str(a).strip() for a in author_input if str(a).strip()]

    author_objects = []
    for name in author_names:
        author, _ = Author.objects.get_or_create(name=name)
        author_objects.append(author)

    published_year = data.get("published_year")
    published_date = None
    if published_year:
        try:
            published_date = date(int(published_year), 1, 1)
        except (ValueError, TypeError):
            pass

    book = Book.objects.create(
        title=title,
        description=data.get("description", ""),
        publisher=data.get("publisher", ""),
        published_date=published_date,
        isbn_13=data.get("isbn_13") or None,
        isbn_10=data.get("isbn_10") or None,
        cover_url=data.get("cover_url", ""),
    )

    if author_objects:
        book.authors.set(author_objects)

    genre_input = data.get("genre") or data.get("genres")
    if genre_input:
        genres = process_genre_input(genre_input)
        if genres:
            book.genres.set(genres)

    return book


def search_books(query: str, limit: int = 10):
    query_str = query.strip()
    results = []

    # 1. Search local database first
    local_books = (
        Book.objects.filter(
            Q(title__icontains=query_str)
            | Q(authors__name__icontains=query_str)
            | Q(isbn_13__icontains=query_str)
            | Q(isbn_10__icontains=query_str)
            | Q(openlibrary_key=query_str)
        )
        .prefetch_related("authors", "genres")
        .distinct()[:limit]
    )

    for b in local_books:
        results.append(
            {
                "id": b.id,
                "openlibrary_key": b.openlibrary_key,
                "title": b.title,
                "authors": [author.name for author in b.authors.all()],
                "isbn13": b.isbn_13,
                "published_year": b.published_date.year if b.published_date else None,
                "cover_url": b.cover_url or None,
                "categories": [genre.name for genre in b.genres.all()],
                "is_local": True,
            }
        )

    # 2. If matching books exist locally, return them without searching OpenLibrary
    if results:
        return results[:limit]

    # 3. Switch to OpenLibrary search ONLY if no local books are found
    try:
        params = {
            "q": query_str,
            "limit": limit,
            "fields": "key,title,author_name,isbn,first_publish_year,cover_i",
        }
        response = requests.get(
            OPENLIBRARY_SEARCH_URL,
            params=params,
            headers=OPENLIBRARY_HEADERS,
            timeout=OPENLIBRARY_TIMEOUT_SECONDS,
        )
        response.raise_for_status()
        data = response.json()

        for book in data.get("docs", []):
            ol_key = book.get("key")
            isbn = book.get("isbn", [])

            isbn13 = next(
                (code for code in isbn if len(code) == 13 and code.startswith("978")),
                None,
            )

            cover_id = book.get("cover_i")
            results.append(
                {
                    "id": None,
                    "openlibrary_key": ol_key,
                    "title": book.get("title"),
                    "authors": book.get("author_name", []),
                    "isbn13": isbn13,
                    "published_year": book.get("first_publish_year"),
                    "cover_url": (
                        f"https://covers.openlibrary.org/b/id/{cover_id}-L.jpg"
                        if cover_id
                        else None
                    ),
                    "categories": [],
                    "is_local": False,
                }
            )
    except requests.RequestException as exc:
        logger.warning(
            f"OpenLibrary search request failed for query '{query_str}': {exc}",
            exc_info=True,
        )

    return results[:limit]
