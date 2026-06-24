import os
import uuid

from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator
from django.utils.deconstruct import deconstructible

# ── Allowed types ──────────────────────────────────────────────────
ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp']

validate_image_extension = FileExtensionValidator(
    allowed_extensions=ALLOWED_IMAGE_EXTENSIONS
)

# ── File size limits ───────────────────────────────────────────────
MAX_COVER_SIZE = 5 * 1024 * 1024       # 5 MB
MAX_GALLERY_SIZE = 10 * 1024 * 1024    # 10 MB


@deconstructible
class FileSizeValidator:
    """Reject files larger than max_size bytes.  Migration-safe."""
    def __init__(self, max_size):
        self.max_size = max_size

    def __call__(self, value):
        if value.size > self.max_size:
            mb = self.max_size // (1024 * 1024)
            raise ValidationError(f'File too large. Maximum size is {mb} MB.')

    def __eq__(self, other):
        return isinstance(other, FileSizeValidator) and self.max_size == other.max_size


validate_cover_size = FileSizeValidator(MAX_COVER_SIZE)
validate_gallery_size = FileSizeValidator(MAX_GALLERY_SIZE)


# ── Upload path helpers ────────────────────────────────────────────
def sanitized_filename(instance, filename):
    """
    Clean upload filename:
      - Strip path separators (prevent directory traversal)
      - Normalise extension to lowercase
      - Prefix with UUID to avoid collisions
    """
    ext = os.path.splitext(filename)[1].lower()
    if ext not in ('.jpg', '.jpeg', '.png', '.webp'):
        ext = '.jpg'
    return f'{uuid.uuid4().hex}{ext}'


def cover_image_upload_to(instance, filename):
    return f'expeditions/covers/{sanitized_filename(instance, filename)}'


def gallery_image_upload_to(instance, filename):
    return f'expeditions/gallery/{sanitized_filename(instance, filename)}'
