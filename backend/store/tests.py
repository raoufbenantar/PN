from django.contrib.auth import get_user_model
from django.core.cache import cache
from rest_framework import status
from rest_framework.test import APITestCase

from store.models import Order, OrderItem, Product, ProductVariant

User = get_user_model()


class StoreTestCase(APITestCase):
    def setUp(self):
        cache.clear()  # reset throttle cache between tests
        self.staff = User.objects.create_superuser('staff', 'staff@x.com', 'pass12345')
        self.user = User.objects.create_user('client', 'client@x.com', 'pass12345')

    def make_product(self, name='Trail Hoodie', category='hoodie', price=2500.00, is_active=True):
        return Product.objects.create(
            name=name,
            slug=name.lower().replace(' ', '-'),
            description='A warm hoodie for the trails.',
            price=price,
            category=category,
            is_active=is_active,
        )

    def make_variant(self, product, size='m', color='Black', stock=10):
        return ProductVariant.objects.create(
            product=product, size=size, color=color, stock=stock
        )

    def order_payload(self, variant, quantity=2, **overrides):
        payload = {
            'full_name': 'Yacine Amrani',
            'phone_number': '0555123456',
            'delivery_address': '12 Rue des Oliviers, Algiers',
            'items': [{'variant_id': variant.id, 'quantity': quantity}],
        }
        payload.update(overrides)
        return payload


# ── Product catalogue ──────────────────────────────────────────────


class ProductTests(StoreTestCase):
    def test_list_only_active_products_with_variants(self):
        active = self.make_product(name='Active Hoodie', is_active=True)
        self.make_variant(active, stock=5)
        self.make_product(name='Hidden Hoodie', is_active=False)

        res = self.client.get('/api/store/products/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        results = res.data['results']
        slugs = {p['slug'] for p in results}
        self.assertIn('active-hoodie', slugs)
        self.assertNotIn('hidden-hoodie', slugs)
        active_h = next(p for p in results if p['slug'] == 'active-hoodie')
        self.assertEqual(len(active_h['variants']), 1)
        self.assertEqual(active_h['variants'][0]['stock'], 5)

    def test_detail_by_slug(self):
        product = self.make_product(name='Cap Collection')
        res = self.client.get(f"/api/store/products/{product.slug}/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['name'], 'Cap Collection')

    def test_write_requires_staff(self):
        payload = {
            'name': 'New Shirt', 'description': 'desc', 'price': '1500.00',
            'category': 't-shirt', 'is_active': True,
        }
        # Normal user -> forbidden
        self.client.force_authenticate(user=self.user)
        res = self.client.post('/api/store/products/', payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        # Staff -> created
        self.client.force_authenticate(user=self.staff)
        res = self.client.post('/api/store/products/', payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['slug'], 'new-shirt')


# ── Order creation + stock ─────────────────────────────────────────


class OrderCreateTests(StoreTestCase):
    def test_create_order_decrements_stock(self):
        product = self.make_product(price=2500.00)
        variant = self.make_variant(product, stock=10)
        res = self.client.post('/api/store/orders/', self.order_payload(variant, 3), format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        variant.refresh_from_db()
        self.assertEqual(variant.stock, 7)

        order = Order.objects.get(pk=res.data['id'])
        self.assertEqual(order.status, 'new')
        self.assertFalse(order.stock_restored)
        item = order.items.get()
        self.assertEqual(item.quantity, 3)
        self.assertEqual(item.unit_price_snapshot, 2500.00)  # price snapshot
        self.assertEqual(item.quantity * item.unit_price_snapshot, 7500.00)  # line total

    def test_create_order_rejects_insufficient_stock(self):
        product = self.make_product()
        variant = self.make_variant(product, stock=2)
        res = self.client.post('/api/store/orders/', self.order_payload(variant, 5), format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        variant.refresh_from_db()
        self.assertEqual(variant.stock, 2)  # unchanged

    def test_create_order_rejects_empty_items(self):
        payload = {
            'full_name': 'Yacine Amrani', 'phone_number': '0555123456',
            'delivery_address': 'Algiers', 'items': [],
        }
        res = self.client.post('/api/store/orders/', payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_order_list_staff_only(self):
        # Normal user cannot list orders
        self.client.force_authenticate(user=self.user)
        res = self.client.get('/api/store/orders/')
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)


# ── Cancel -> restore stock (idempotent) ───────────────────────────


class OrderCancelRestockTests(StoreTestCase):
    def _order_and_variant(self, qty=4):
        product = self.make_product(price=2000.00)
        variant = self.make_variant(product, stock=20)
        res = self.client.post('/api/store/orders/', self.order_payload(variant, qty), format='json')
        order = Order.objects.get(pk=res.data['id'])
        variant.refresh_from_db()
        return order, variant, qty

    def test_cancel_restores_stock(self):
        order, variant, qty = self._order_and_variant(4)
        self.assertEqual(variant.stock, 16)

        self.client.force_authenticate(user=self.staff)
        res = self.client.patch(f'/api/store/orders/{order.id}/', {'status': 'cancelled'}, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        variant.refresh_from_db()
        order.refresh_from_db()
        self.assertEqual(variant.stock, 20)   # restored
        self.assertTrue(order.stock_restored)
        self.assertEqual(order.status, 'cancelled')

    def test_cancel_is_idempotent(self):
        order, variant, qty = self._order_and_variant(4)
        self.client.force_authenticate(user=self.staff)

        self.client.patch(f'/api/store/orders/{order.id}/', {'status': 'cancelled'}, format='json')
        variant.refresh_from_db()
        self.assertEqual(variant.stock, 20)

        # Re-save as cancelled again -> must NOT double-restore.
        self.client.patch(f'/api/store/orders/{order.id}/', {'status': 'cancelled'}, format='json')
        variant.refresh_from_db()
        order.refresh_from_db()
        self.assertEqual(variant.stock, 20)   # still 20, not 24
        self.assertTrue(order.stock_restored)

    def test_cancel_new_order_restores_stock_too(self):
        product = self.make_product(price=1500.00)
        variant = self.make_variant(product, stock=5)
        res = self.client.post('/api/store/orders/', self.order_payload(variant, 2), format='json')
        order = Order.objects.get(pk=res.data['id'])
        variant.refresh_from_db()
        self.assertEqual(variant.stock, 3)

        self.client.force_authenticate(user=self.staff)
        self.client.patch(f'/api/store/orders/{order.id}/', {'status': 'cancelled'}, format='json')
        variant.refresh_from_db()
        self.assertEqual(variant.stock, 5)
