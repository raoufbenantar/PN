import secrets
from datetime import timedelta

from django.conf import settings
from django.db import models
from django.utils import timezone


class UserProfile(models.Model):
    """Extended profile for User. Stores flags that don't exist on Django's default User."""
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profile',
    )
    email_verified = models.BooleanField(default=False)

    def __str__(self):
        return f"Profile for {self.user.username}"


class EmailVerificationCode(models.Model):
    """Stores a 6-digit code sent to verify a user's email address."""

    email = models.EmailField()
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Verification for {self.email}"

    def is_expired(self):
        return timezone.now() > self.expires_at

    @classmethod
    def generate(cls, email, ttl_minutes=15):
        """Create a new verification code for the given email."""
        code = f"{secrets.randbelow(900000) + 100000}"  # 6-digit
        return cls.objects.create(
            email=email,
            code=code,
            expires_at=timezone.now() + timedelta(minutes=ttl_minutes),
        )


class PasswordResetToken(models.Model):
    """Stores a token sent via email for password reset."""

    email = models.EmailField()
    token = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    used = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Reset token for {self.email}"

    def is_valid(self):
        return not self.used and timezone.now() <= self.expires_at

    @classmethod
    def generate(cls, email, ttl_minutes=30):
        """Create a new reset token for the given email."""
        return cls.objects.create(
            email=email,
            token=secrets.token_urlsafe(48),
            expires_at=timezone.now() + timedelta(minutes=ttl_minutes),
        )


class NewsletterSubscription(models.Model):
    """Stores newsletter subscriber emails."""
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Newsletter: {self.email}"
