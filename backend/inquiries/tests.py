"""Tests for the inquiries app: selfie upload + computed 'ticket' action."""
import base64
import tempfile

from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings
from rest_framework import status
from rest_framework.test import APITestCase

from expeditions.models import Expedition
from inquiries.models import Inquiry

User = get_user_model()

# A tiny, valid 1x1 white JPEG (real bytes so Pillow/ImageField validation passes).
JPEG_BYTES = base64.b64decode(
    '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0a'
    'HBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIy'
    'MjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAB'
    'AAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIE'
    'AwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJico'
    'KSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5i'
    'ZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+P'
    'n6/9oADAMBAAIRAxEAPwD3+iiigD//2Q=='
)


def _selfie(name='selfie.jpg', content=None):
    """A valid selfie upload (real JPEG bytes by default)."""
    return SimpleUploadedFile(
        name=name,
        content=content if content is not None else JPEG_BYTES,
        content_type='image/jpeg',
    )


@override_settings(MEDIA_ROOT=tempfile.mkdtemp())
class InquiryCreateTests(APITestCase):
    url = '/api/inquiries/'

    def setUp(self):
        # Reset the inquiry_create throttle counter so multiple POSTs across
        # the suite never trigger a 429 (it is capped at 3/hour in settings).
        cache.clear()

    def _payload(self, **overrides):
        base = {
            'name': 'Yacine Amrani',
            'phone': '0555123456',
            'email': 'yacine@example.com',
            'message': 'I would like to join this expedition please.',
        }
        return {**base, **overrides}

    def test_create_requires_selfie(self):
        """(a) POST without a selfie must be rejected (400)."""
        res = self.client.post(self.url, self._payload(), format='multipart')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('selfie', res.data)

    def test_create_with_selfie_succeeds(self):
        """(b) POST with a selfie returns 201 and an absolute selfie_url."""
        res = self.client.post(
            self.url,
            {**self._payload(), 'selfie': _selfie()},
            format='multipart',
        )
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertIn('selfie_url', res.data)
        self.assertTrue(res.data['selfie_url'].startswith('http'))
        inquiry = Inquiry.objects.get(pk=res.data['id'])
        self.assertIsNotNone(inquiry.selfie)

    def test_rejects_wrong_extension(self):
        res = self.client.post(
            self.url,
            {**self._payload(), 'selfie': SimpleUploadedFile('evil.exe', b'MZ', content_type='application/octet-stream')},
            format='multipart',
        )
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_rejects_oversized_selfie(self):
        big = SimpleUploadedFile(
            'big.jpg',
            b'\xff\xd8\xff\xe0' + b'\x00' * (5 * 1024 * 1024 + 1),
            content_type='image/jpeg',
        )
        res = self.client.post(self.url, {**self._payload(), 'selfie': big}, format='multipart')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)


@override_settings(MEDIA_ROOT=tempfile.mkdtemp())
class InquiryTicketTests(APITestCase):
    def setUp(self):
        cache.clear()
        self.user = User.objects.create_user(username='client', password='pass12345')
        self.client.force_authenticate(user=self.user)
        self.expedition = Expedition.objects.create(
            title='Tassili Night Trek',
            slug='tassili-night-trek',
            description='A night trek.',
            category='trekking',
            difficulty='moderate',
            duration_days=3,
            price_dzd=15000,
            location='Djanet',
        )

    def _make_inquiry(self, status_val='new'):
        return Inquiry.objects.create(
            name='Yacine Amrani',
            phone='0555123456',
            email='yacine@example.com',
            message='Booking a spot.',
            expedition=self.expedition,
            status=status_val,
            selfie=_selfie(),
        )

    def test_ticket_404_when_not_confirmed(self):
        """(c) ticket returns 404 for non-confirmed inquiries."""
        for st in ('new', 'contacted', 'cancelled'):
            inquiry = self._make_inquiry(status_val=st)
            res = self.client.get(f'/api/inquiries/{inquiry.id}/ticket/')
            self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND, msg=st)

    def test_ticket_200_when_confirmed(self):
        """(d) ticket returns 200 with ticket fields when confirmed."""
        inquiry = self._make_inquiry(status_val='confirmed')
        res = self.client.get(f'/api/inquiries/{inquiry.id}/ticket/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['name'], 'Yacine Amrani')
        self.assertEqual(res.data['phone'], '0555123456')
        self.assertEqual(res.data['expedition_title'], 'Tassili Night Trek')
        self.assertTrue(res.data['selfie_url'].startswith('http'))

    def test_ticket_requires_auth(self):
        self.client.force_authenticate(user=None)
        inquiry = self._make_inquiry(status_val='confirmed')
        res = self.client.get(f'/api/inquiries/{inquiry.id}/ticket/')
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)
