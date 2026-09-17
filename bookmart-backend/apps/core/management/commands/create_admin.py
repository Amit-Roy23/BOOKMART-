import os
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Creates a superuser from environment variables if one does not already exist."

    def handle(self, *args, **options):
        User = get_user_model()

        username = os.getenv("DJANGO_SUPERUSER_USERNAME", "").strip()
        email = os.getenv("DJANGO_SUPERUSER_EMAIL", "").strip()
        password = os.getenv("DJANGO_SUPERUSER_PASSWORD", "")

        # Fallback between email and username if only one is provided
        if not email and username and "@" in username:
            email = username
        if not username and email:
            username = email

        username_field = getattr(User, "USERNAME_FIELD", "username")

        # Determine identifier based on the model's primary USERNAME_FIELD
        lookup_value = email if username_field == "email" else (username or email)

        if not lookup_value or not password:
            self.stdout.write(
                self.style.WARNING(
                    "Superuser credentials not fully provided in environment variables (DJANGO_SUPERUSER_USERNAME/EMAIL, DJANGO_SUPERUSER_PASSWORD). Skipping."
                )
            )
            return

        # Check if a user with this identifier already exists (case-insensitive)
        lookup_kwargs = {f"{username_field}__iexact": lookup_value}
        if User.objects.filter(**lookup_kwargs).exists():
            self.stdout.write("Superuser already exists, skipping")
            return

        # Prepare field values according to model definition
        extra_fields = {}
        field_names = [f.name for f in User._meta.fields]

        if "full_name" in field_names:
            extra_fields["full_name"] = (
                os.getenv("DJANGO_SUPERUSER_FULL_NAME") or username or "Admin"
            )
        if "email_verified" in field_names:
            extra_fields["email_verified"] = True
        if "is_staff" in field_names:
            extra_fields["is_staff"] = True
        if "is_superuser" in field_names:
            extra_fields["is_superuser"] = True
        if "is_active" in field_names:
            extra_fields["is_active"] = True

        try:
            if username_field == "email":
                User.objects.create_superuser(
                    email=email or lookup_value,
                    password=password,
                    **extra_fields,
                )
            else:
                if email and "email" in field_names:
                    extra_fields["email"] = email
                User.objects.create_superuser(
                    username=username or lookup_value,
                    password=password,
                    **extra_fields,
                )

            self.stdout.write(self.style.SUCCESS("Superuser created"))
        except Exception as e:
            self.stderr.write(self.style.ERROR(f"Error creating superuser: {e}"))
            raise
