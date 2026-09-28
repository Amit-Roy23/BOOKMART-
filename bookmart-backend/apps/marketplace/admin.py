from django.contrib import admin

from apps.marketplace.models import (
    BookListing,
    BookListingImage,
    BookRequirement,
    ListingAnalyticsDaily,
    PlatformReport,
    BoostPlan,
    BoostOrder,
)


class BookListingImageInline(admin.TabularInline):
    model = BookListingImage
    extra = 1


@admin.register(BookListing)
class BookListingAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "book",
        "seller",
        "price",
        "condition",
        "status",
        "is_boosted",
        "boost_expires_at",
        "created_at",
    )
    list_filter = ("is_boosted", "condition", "status", "created_at")
    search_fields = ("book__title", "seller__full_name", "seller__email")
    # Keeps spatial coordinate entries secure
    readonly_fields = ("latitude", "longitude")
    inlines = [BookListingImageInline]


@admin.register(BoostPlan)
class BoostPlanAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "duration_days", "price", "is_active", "created_at")
    list_filter = ("is_active", "duration_days")
    search_fields = ("name",)


@admin.register(BoostOrder)
class BoostOrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "listing",
        "user",
        "plan",
        "amount",
        "status",
        "payment_method",
        "gateway_transaction_id",
        "created_at",
        "paid_at",
    )
    list_filter = ("status", "payment_method", "created_at")
    search_fields = ("listing__book__title", "user__full_name", "user__email", "gateway_transaction_id")
    readonly_fields = ("created_at",)


@admin.register(BookListingImage)
class BookListingImageAdmin(admin.ModelAdmin):
    list_display = ("id", "book_listing", "label", "image", "created_at")
    list_filter = ("label", "created_at")



@admin.register(BookRequirement)
class BookRequirementAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "book",
        "user",
        "min_budget",
        "max_budget",
        "status",
        "created_at",
    )
    list_filter = ("status", "created_at")
    search_fields = ("book__title", "user__username", "user__email")


@admin.register(ListingAnalyticsDaily)
class ListingAnalyticsDailyAdmin(admin.ModelAdmin):
    list_display = (
        "listing",
        "date",
        "views_count",
        "clicks_count",
        "wa_contacts_count",
    )
    list_filter = ("date",)
    date_hierarchy = "date"  # Adds a neat horizontal time-navigation filter widget


@admin.register(PlatformReport)
class PlatformReportAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "reporter",
        "report_type",
        "category",
        "is_reviewed",
        "created_at",
    )
    list_filter = ("report_type", "category", "is_reviewed", "created_at")
    search_fields = ("reporter__full_name", "details")
    actions = ["mark_as_reviewed"]

    @admin.action(description="Mark selected reports as reviewed")
    def mark_as_reviewed(self, request, queryset):
        queryset.update(is_reviewed=True)
