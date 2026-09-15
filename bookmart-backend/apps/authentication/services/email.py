import logging

from django.conf import settings
from apps.authentication.models import User
from apps.authentication.tasks import send_otp_email_task

logger = logging.getLogger(__name__)


def _is_smtp_configured() -> bool:
    return bool(
        getattr(settings, "EMAIL_HOST", None)
        and getattr(settings, "EMAIL_HOST_USER", None)
        and getattr(settings, "EMAIL_HOST_PASSWORD", None)
    )


class EmailNotificationService:
    @staticmethod
    def send_otp_email(user: User, otp_code: str, purpose="ACTIVATION") -> bool:
        """
        Dispatches a transactional HTML email containing the security verification OTP
        asynchronously via Celery task queue with automatic retries.
        """
        if not _is_smtp_configured():
            print(
                f"\n{'=' * 50}\n"
                f"BOOKMART DEVELOPMENT OTP\n"
                f"Email : {user.email}\n"
                f"OTP   : {otp_code}\n"
                f"Expires: 10 minutes\n"
                f"{'=' * 50}\n"
            )
            return True

        try:
            send_otp_email_task.delay(
                email=user.email,
                full_name=user.full_name,
                otp_code=otp_code,
                purpose=purpose,
            )
            return True
        except Exception as e:
            logger.error(f"Failed to queue OTP email task for {user.email}: {e}", exc_info=True)
            # Graceful fallback: send directly if worker/broker connection failed in non-strict env
            try:
                send_otp_email_task(
                    email=user.email,
                    full_name=user.full_name,
                    otp_code=otp_code,
                    purpose=purpose,
                )
                return True
            except Exception as fallback_err:
                logger.error(f"Synchronous fallback failed for {user.email}: {fallback_err}", exc_info=True)
                return False
