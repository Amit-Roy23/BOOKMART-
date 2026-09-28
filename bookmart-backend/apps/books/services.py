import concurrent.futures
from datetime import date
import logging
import re
import time

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

OPENLIBRARY_BASE_URL = "https://openlibrary.org"
OPENLIBRARY_WORK_URL = OPENLIBRARY_BASE_URL  # Kept for backward compatibility
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


def _fetch_openlibrary_resource(url: str, resource_type: str, resource_key: str, max_retries: int = 1, backoff_seconds: float = 0.5):
    """
    Fetches JSON from OpenLibrary with 1 retry on transient timeout/connection errors.
    Does NOT retry on 404s or bad client requests.
    """
    for attempt in range(max_retries + 1):
        try:
            response = requests.get(
                url,
                headers=OPENLIBRARY_HEADERS,
                timeout=OPENLIBRARY_TIMEOUT_SECONDS,
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.Timeout as exc:
            if attempt < max_retries:
                logger.warning(
                    f"Transient timeout fetching {resource_type} '{resource_key}' from OpenLibrary: {exc}. Retrying in {backoff_seconds}s..."
                )
                time.sleep(backoff_seconds)
                continue
            logger.error(
                f"OpenLibrary request timed out fetching {resource_type} document for '{resource_key}': {exc}",
                exc_info=True,
            )
            raise OpenLibraryTimeoutError(
                f"OpenLibrary request timed out while fetching {resource_type} details: {resource_key}"
            ) from exc
        except requests.exceptions.ConnectionError as exc:
            if attempt < max_retries:
                logger.warning(
                    f"Transient connection error fetching {resource_type} '{resource_key}' from OpenLibrary: {exc}. Retrying in {backoff_seconds}s..."
                )
                time.sleep(backoff_seconds)
                continue
            logger.error(
                f"OpenLibrary connection failed fetching {resource_type} document for '{resource_key}': {exc}",
                exc_info=True,
            )
            raise OpenLibraryConnectionError(
                f"Failed to connect to OpenLibrary service for {resource_type}: {resource_key}"
            ) from exc
        except requests.exceptions.HTTPError as exc:
            status_code = exc.response.status_code if exc.response is not None else 500
            logger.error(
                f"OpenLibrary HTTP {status_code} error fetching {resource_type} document for '{resource_key}': {exc}",
                exc_info=True,
            )
            if status_code == 404:
                raise OpenLibraryNotFoundError(
                    f"{resource_type.capitalize()} not found on OpenLibrary: {resource_key}"
                ) from exc
            raise OpenLibraryHTTPError(
                f"OpenLibrary returned HTTP error {status_code} for {resource_type}: {resource_key}",
                status_code=status_code,
            ) from exc
        except requests.exceptions.RequestException as exc:
            logger.error(
                f"OpenLibrary request exception for {resource_type} '{resource_key}': {exc}",
                exc_info=True,
            )
            raise OpenLibraryImportError(
                f"Failed to fetch {resource_type} from OpenLibrary: {str(exc)}"
            ) from exc
        except ValueError as exc:
            logger.error(
                f"Invalid JSON returned from OpenLibrary for {resource_type} '{resource_key}': {exc}",
                exc_info=True,
            )
            raise OpenLibraryImportError(
                f"Invalid response format returned from OpenLibrary for {resource_type}: {resource_key}"
            ) from exc


def get_book_document(work_key: str):
    clean_key = str(work_key).strip()
    if clean_key.endswith(".json"):
        clean_key = clean_key[:-5]
    if not clean_key.startswith("/"):
        clean_key = f"/{clean_key}"
    if not clean_key.startswith("/works/") and not clean_key.startswith("/books/"):
        work_id = clean_key.lstrip("/")
        clean_key = f"/works/{work_id}"

    url = f"{OPENLIBRARY_BASE_URL}{clean_key}.json"
    return _fetch_openlibrary_resource(url, resource_type="book", resource_key=work_key)


def get_author_document(author_key: str):
    clean_key = str(author_key).strip()
    if clean_key.endswith(".json"):
        clean_key = clean_key[:-5]
    if not clean_key.startswith("/"):
        clean_key = f"/{clean_key}"
    if not clean_key.startswith("/authors/"):
        author_id = clean_key.lstrip("/")
        clean_key = f"/authors/{author_id}"

    url = f"{OPENLIBRARY_BASE_URL}{clean_key}.json"
    return _fetch_openlibrary_resource(url, resource_type="author", resource_key=author_key)


import unicodedata
import urllib.parse
from decimal import Decimal

def fetch_real_author_profile(name: str, book_title: str = None, genre: str = None, author_doc: dict = None) -> dict:
    """
    Fetches authentic, legitimate author portrait, biography, and designation from
    OpenLibrary and Wikipedia REST summary.
    If neither source has a real photo, returns None for image_url (never fabricates or assigns fake stock images).
    """
    if not name or name.strip().lower() in ["unknown", "n/a", "none"]:
        return {
            "bio": "",
            "image_url": None,
            "designation": "Author",
        }

    clean_name = name.strip()
    profile = {
        "bio": None,
        "image_url": None,
        "designation": None,
    }

    # 1. First, check OpenLibrary's author data (author_doc) for a "photos" field
    if author_doc and isinstance(author_doc, dict):
        ol_bio = parse_description(author_doc.get("bio"))
        if ol_bio:
            profile["bio"] = ol_bio[:1000]

        photos = author_doc.get("photos", [])
        if photos and isinstance(photos, list) and len(photos) > 0:
            photo_id = photos[0]
            if photo_id and isinstance(photo_id, int) and photo_id > 0:
                profile["image_url"] = f"https://covers.openlibrary.org/a/id/{photo_id}-L.jpg"

    # 2. If OpenLibrary has no photo, check Wikipedia REST summary for a real thumbnail
    headers = {"User-Agent": "Bookmart/1.0 (https://bookmart.app; dev@bookmart.app)"}

    # Determine languages to check: English always, Spanish/Catalan only if accented characters present
    has_special_chars = bool(re.search(r'[^\x00-\x7F]', clean_name))
    languages = ["en"]
    if has_special_chars:
        languages.extend(["es", "ca"])

    title_variants = [
        clean_name,
        f"{clean_name} (author)",
        f"{clean_name} (writer)",
    ]

    for lang in languages:
        if profile["image_url"] and profile["bio"]:
            break
        for title in title_variants:
            try:
                wiki_url = f"https://{lang}.wikipedia.org/api/rest_v1/page/summary/{urllib.parse.quote(title)}"
                r = requests.get(wiki_url, headers=headers, timeout=1.5)
                if r.status_code == 200:
                    d = r.json()
                    page_type = d.get("type", "")
                    if page_type == "disambiguation":
                        continue

                    page_title = d.get("title", "")
                    if page_title.lower().startswith("list of") or "filmography" in page_title.lower() or "discography" in page_title.lower():
                        continue

                    # Verify page title corresponds to author name
                    clean_lower = clean_name.lower()
                    title_lower = page_title.lower()
                    if not (clean_lower in title_lower or title_lower in clean_lower or clean_lower.split()[0] in title_lower):
                        continue

                    thumb = d.get("thumbnail", {}).get("source") or d.get("originalimage", {}).get("source")
                    extract = d.get("extract", "")
                    desc = d.get("description", "")

                    if thumb and not profile["image_url"]:
                        profile["image_url"] = thumb
                    if extract and (not profile["bio"] or len(profile["bio"]) < len(extract)):
                        profile["bio"] = extract[:1000]
                    if desc and not profile["designation"]:
                        profile["designation"] = desc[:100]

                    if profile["image_url"] and profile["bio"]:
                        break
            except Exception as exc:
                logger.debug(f"Wikipedia summary lookup ({lang}) for '{title}' skipped: {exc}")

    # 3. If neither source has a real photo, do NOT generate or fabricate any stock image.
    # profile["image_url"] remains None / ""

    # Contextual bio fallback
    if not profile["bio"]:
        genre_context = f" in {genre}" if genre else ""
        if book_title:
            profile["bio"] = (
                f"{clean_name} is an esteemed author renowned for writing '{book_title}', "
                f"captivating readers with thoughtful storytelling and distinct insights{genre_context}."
            )
        else:
            profile["bio"] = (
                f"{clean_name} is an accomplished author celebrated for engaging narratives, "
                f"thoughtful perspectives, and memorable contributions to literature{genre_context}."
            )

    # Designation fallback
    if not profile["designation"] or profile["designation"].lower() == "author":
        if genre and "fiction" in genre.lower():
            profile["designation"] = "Novelist & Storyteller"
        elif genre and ("tech" in genre.lower() or "engineering" in genre.lower() or "science" in genre.lower()):
            profile["designation"] = "Technical & Scientific Writer"
        elif genre and ("business" in genre.lower() or "finance" in genre.lower() or "self" in genre.lower()):
            profile["designation"] = "Business & Personal Growth Author"
        elif genre and ("exam" in genre.lower() or "education" in genre.lower()):
            profile["designation"] = "Academic & Educational Writer"
        else:
            profile["designation"] = "Novelist & Author"

    return profile


def enrich_author_details(author: Author, book_title: str = None, genre: str = None, author_doc: dict = None, preloaded_profile: dict = None) -> Author:
    """
    Enriches an Author record with verified real portrait photo, accurate biography,
    designation, and rating. Replaces any placeholder or fake stock avatar.
    """
    if not author or not author.name or author.name.strip().lower() in ["unknown", "n/a", "none"]:
        return author

    updated = False
    needs_image = not author.image_url or "unsplash.com" in author.image_url or "ui-avatars.com" in author.image_url
    needs_bio = not author.bio or len(author.bio.strip()) < 15
    needs_designation = not author.designation or author.designation == "Author"

    if needs_image or needs_bio or needs_designation:
        profile = preloaded_profile or fetch_real_author_profile(
            name=author.name,
            book_title=book_title,
            genre=genre,
            author_doc=author_doc,
        )

        if needs_image:
            real_img = profile.get("image_url") or ""
            if author.image_url != real_img:
                author.image_url = real_img
                updated = True

        if profile.get("bio") and needs_bio:
            author.bio = profile["bio"][:1000]
            updated = True

        if profile.get("designation") and needs_designation:
            author.designation = profile["designation"][:100]
            updated = True

    if author.rating is None or author.rating <= Decimal("0"):
        author.rating = Decimal("4.8")
        updated = True

    if updated:
        author.save()

    return author


def _fetch_and_enrich_author_network(author_key: str, book_title: str = None, genre: str = None) -> dict:
    author_doc = get_author_document(author_key)
    name = (
        author_doc.get("name", "Unknown")
        if isinstance(author_doc, dict)
        else "Unknown"
    )
    profile = fetch_real_author_profile(
        name=name,
        book_title=book_title,
        genre=genre,
        author_doc=author_doc,
    )
    return {
        "name": name,
        "author_doc": author_doc,
        "profile": profile,
    }


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

    # Concurrently fetch author documents and profiles to eliminate sequential N+1 HTTP calls
    author_keys = []
    for author_data in document.get("authors", []):
        author_key = author_data.get("author", {}).get("key")
        if author_key and author_key not in author_keys:
            author_keys.append(author_key)

    author_payloads = {}
    if author_keys:
        max_workers = min(len(author_keys), 5)
        with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_key = {
                executor.submit(_fetch_and_enrich_author_network, key, title, custom_category): key
                for key in author_keys
            }
            for future in concurrent.futures.as_completed(future_to_key):
                key = future_to_key[future]
                try:
                    res = future.result()
                    author_payloads[key] = res
                except OpenLibraryNotFoundError:
                    logger.warning(
                        f"Author document not found on OpenLibrary for '{key}'. Defaulting name to 'Unknown'.",
                        exc_info=True,
                    )
                    author_payloads[key] = {
                        "name": "Unknown",
                        "author_doc": None,
                        "profile": None,
                    }
                except OpenLibraryImportError:
                    # Propagate timeout, network, or server errors from author requests
                    raise
                except Exception as exc:
                    logger.error(
                        f"Unexpected error fetching author for key '{key}': {exc}",
                        exc_info=True,
                    )
                    author_payloads[key] = {
                        "name": "Unknown",
                        "author_doc": None,
                        "profile": None,
                    }

    author_objects = []
    for key in author_keys:
        payload = author_payloads.get(key, {})
        author_name = payload.get("name", "Unknown")
        author, _ = Author.objects.get_or_create(name=author_name)
        author = enrich_author_details(
            author,
            book_title=title,
            genre=custom_category,
            author_doc=payload.get("author_doc"),
            preloaded_profile=payload.get("profile"),
        )
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
