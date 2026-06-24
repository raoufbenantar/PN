from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from .models import EmailVerificationCode, PasswordResetToken

User = get_user_model()


class SendVerificationViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = '/api/auth/send-verification/'

    def test_send_verification_code(self):
        response = self.client.post(self.url, {'email': 'test@example.com'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(EmailVerificationCode.objects.count(), 1)

    def test_send_verification_missing_email(self):
        response = self.client.post(self.url, {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_send_verification_nonexistent_email(self):
        """Should not reveal whether user exists."""
        response = self.client.post(self.url, {'email': 'nobody@example.com'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class VerifyEmailViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = '/api/auth/verify-email/'
        self.code = EmailVerificationCode.generate('test@example.com')

    def test_verify_email_success(self):
        response = self.client.post(self.url, {
            'email': 'test@example.com',
            'code': self.code.code,
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_verify_email_invalid_code(self):
        response = self.client.post(self.url, {
            'email': 'test@example.com',
            'code': '000000',
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_verify_email_missing_fields(self):
        response = self.client.post(self.url, {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class PasswordResetRequestViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = '/api/auth/password-reset/'

    def test_password_reset_request(self):
        response = self.client.post(self.url, {'email': 'test@example.com'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_password_reset_nonexistent_email(self):
        """Should not reveal whether user exists."""
        response = self.client.post(self.url, {'email': 'nobody@example.com'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class PasswordResetConfirmViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = '/api/auth/password-reset/confirm/'
        self.user = User.objects.create_user(
            username='test@example.com',
            email='test@example.com',
            password='OldPassword123!',
        )
        self.token = PasswordResetToken.generate('test@example.com')

    def test_password_reset_confirm_success(self):
        response = self.client.post(self.url, {
            'token': self.token.token,
            'new_password': 'NewSecurePass99!',
            'confirm_password': 'NewSecurePass99!',
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('NewSecurePass99!'))

    def test_password_reset_confirm_mismatch(self):
        response = self.client.post(self.url, {
            'token': self.token.token,
            'new_password': 'NewSecurePass99!',
            'confirm_password': 'DifferentPass99!',
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_password_reset_confirm_invalid_token(self):
        response = self.client.post(self.url, {
            'token': 'invalid-token',
            'new_password': 'NewSecurePass99!',
            'confirm_password': 'NewSecurePass99!',
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_password_reset_confirm_short_password(self):
        response = self.client.post(self.url, {
            'token': self.token.token,
            'new_password': 'short',
            'confirm_password': 'short',
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class ChangePasswordViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = '/api/auth/change-password/'
        self.user = User.objects.create_user(
            username='test@example.com',
            email='test@example.com',
            password='OldPassword123!',
        )

    def test_change_password_unauthenticated(self):
        response = self.client.post(self.url, {
            'old_password': 'OldPassword123!',
            'new_password': 'NewSecurePass99!',
            'confirm_password': 'NewSecurePass99!',
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_change_password_success(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.url, {
            'old_password': 'OldPassword123!',
            'new_password': 'NewSecurePass99!',
            'confirm_password': 'NewSecurePass99!',
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('NewSecurePass99!'))

    def test_change_password_wrong_old(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.url, {
            'old_password': 'WrongPassword123!',
            'new_password': 'NewSecurePass99!',
            'confirm_password': 'NewSecurePass99!',
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_change_password_mismatch(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.url, {
            'old_password': 'OldPassword123!',
            'new_password': 'NewSecurePass99!',
            'confirm_password': 'DifferentPass99!',
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
