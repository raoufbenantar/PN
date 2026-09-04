from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

User = get_user_model()


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
