from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import EmailVerificationCode, PasswordResetToken, UserProfile, NewsletterSubscription

User = get_user_model()


def send_verification_email(email):
    """Generate and return a verification code. Returns True on success."""
    try:
        EmailVerificationCode.generate(email)
        return True
    except Exception:
        return False


def send_password_reset_email(email):
    """Generate and return a reset token. Returns True on success."""
    try:
        PasswordResetToken.generate(email)
        return True
    except Exception:
        return False


class SendVerificationView(APIView):
    """Send a 6-digit verification code to the given email."""
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip()
        if not email:
            return Response(
                {'detail': 'Email is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if send_verification_email(email):
            return Response({'detail': 'Verification code sent.'})
        return Response(
            {'detail': 'Failed to send verification code. Please try again.'},
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )


class VerifyEmailView(APIView):
    """Verify an email with the 6-digit code."""
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip()
        code = request.data.get('code', '').strip()

        if not email or not code:
            return Response(
                {'detail': 'Email and code are required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        verification = (
            EmailVerificationCode.objects
            .filter(email=email, code=code)
            .order_by('-created_at')
            .first()
        )

        if not verification:
            return Response(
                {'detail': 'Invalid verification code.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if verification.is_expired():
            return Response(
                {'detail': 'Verification code has expired. Please request a new one.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Mark email as verified on the user profile if they exist
        try:
            user = User.objects.get(email=email)
            profile, _ = UserProfile.objects.get_or_create(user=user)
            profile.email_verified = True
            profile.save(update_fields=['email_verified'])
        except User.DoesNotExist:
            pass

        return Response({'detail': 'Email verified successfully.'})


class PasswordResetRequestView(APIView):
    """Request a password reset email — disabled (no SMTP)."""
    permission_classes = [AllowAny]

    def post(self, request):
        return Response(
            {'detail': 'Password reset is not available yet. Please contact support.'},
            status=status.HTTP_501_NOT_IMPLEMENTED,
        )


class PasswordResetConfirmView(APIView):
    """Reset password with a valid token — disabled (no SMTP)."""
    permission_classes = [AllowAny]

    def post(self, request):
        return Response(
            {'detail': 'Password reset is not available yet. Please contact support.'},
            status=status.HTTP_501_NOT_IMPLEMENTED,
        )


class ChangePasswordView(APIView):
    """Change password for an authenticated user."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        old_password = request.data.get('old_password', '')
        new_password = request.data.get('new_password', '')
        confirm_password = request.data.get('confirm_password', '')

        if not old_password or not new_password or not confirm_password:
            return Response(
                {'detail': 'All fields are required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not request.user.check_password(old_password):
            return Response(
                {'detail': 'Current password is incorrect.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if new_password != confirm_password:
            return Response(
                {'detail': 'New passwords do not match.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            validate_password(new_password, user=request.user)
        except ValidationError as e:
            return Response(
                {'detail': ' '.join(e.messages)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        request.user.set_password(new_password)
        request.user.save()

        return Response({'detail': 'Password changed successfully.'})


class NewsletterSubscribeView(APIView):
    """Subscribe an email to the newsletter."""
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip()
        if not email:
            return Response(
                {'detail': 'Email is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        subscription, created = NewsletterSubscription.objects.get_or_create(
            email=email,
            defaults={'is_active': True},
        )
        if not created and not subscription.is_active:
            subscription.is_active = True
            subscription.save(update_fields=['is_active'])

        return Response({'detail': 'Subscribed successfully!'}, status=status.HTTP_201_CREATED)
