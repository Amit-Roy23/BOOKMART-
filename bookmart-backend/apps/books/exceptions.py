class OpenLibraryImportError(Exception):
    """Base exception for OpenLibrary import and API failures."""

    def __init__(
        self,
        message: str = "Failed to import book from OpenLibrary.",
        status_code: int = 502,
    ):
        super().__init__(message)
        self.message = message
        self.status_code = status_code


class OpenLibraryTimeoutError(OpenLibraryImportError):
    """Raised when an OpenLibrary HTTP request times out."""

    def __init__(
        self,
        message: str = "OpenLibrary request timed out, please try again.",
    ):
        super().__init__(message, status_code=504)


class OpenLibraryNotFoundError(OpenLibraryImportError):
    """Raised when a requested book work or author is not found on OpenLibrary (HTTP 404)."""

    def __init__(
        self,
        message: str = "Book not found on OpenLibrary.",
    ):
        super().__init__(message, status_code=404)


class OpenLibraryConnectionError(OpenLibraryImportError):
    """Raised when network connection to OpenLibrary fails or drops."""

    def __init__(
        self,
        message: str = "Unable to connect to OpenLibrary service. Please check your network or try again.",
    ):
        super().__init__(message, status_code=503)


class OpenLibraryHTTPError(OpenLibraryImportError):
    """Raised when OpenLibrary returns an unexpected HTTP error code."""

    def __init__(self, message: str, status_code: int = 502):
        super().__init__(message, status_code=status_code)
