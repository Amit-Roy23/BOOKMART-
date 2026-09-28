from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.marketplace.views import (
    BookListingViewSet,
    WishlistViewSet,
    PlatformNotificationViewSet,
    BookContactLedgerViewSet,
    BoostPlanViewSet,
    BoostOrderViewSet,
)

router = DefaultRouter()
router.register("listings", BookListingViewSet, basename="book-listing")
router.register("wishlist", WishlistViewSet, basename="wishlist")
router.register("notifications", PlatformNotificationViewSet, basename="notification")
router.register("contacts", BookContactLedgerViewSet, basename="contact-ledger")
router.register("boost-plans", BoostPlanViewSet, basename="boost-plan")
router.register("boost-orders", BoostOrderViewSet, basename="boost-order")

urlpatterns = [
    path("", include(router.urls)),
]

