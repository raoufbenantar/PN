import os
import uuid

from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator
from django.utils.deconstruct import deconstructible

ALLOWED_SELFIE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp']

validate_image_extension = FileExtensionValidator(
    allowed_extensions=ALLOWED_SELFIE_EXTENSIONS
)

MAX_SELFIE_SIZE = 5 * 1024 * 1024  # 5 MB


@deconstructible
class FileSizeValidator:
    """Reject files larger than max_size bytes. Migration-safe."""
    def __init__(self, max_size):
        self.max_size = max_size

    def __call__(self, value):
        if value.size > self.max_size:
            mb = self.max_size // (1024 * 1024)
            raise ValidationError(f'File too large. Maximum size is {mb} MB.')

    def __eq__(self, other):
        return isinstance(other, FileSizeValidator) and self.max_size == other.max_size


validate_selfie_size = FileSizeValidator(MAX_SELFIE_SIZE)


def sanitized_filename(instance, filename):
    ext = os.path.splitext(filename)[1].lower()
    if ext not in ('.jpg', '.jpeg', '.png', '.webp'):
        ext = '.jpg'
    return f'{uuid.uuid4().hex}{ext}'


def selfie_upload_to(instance, filename):
    return f'inquiries/selfies/{sanitized_filename(instance, filename)}'
