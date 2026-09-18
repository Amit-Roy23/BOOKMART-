import logging
import threading

from django.conf import settings
from templated_mail.mail import BaseEmailMessage

from apps.authentication.models import User

logger = logging.getLogger(__name__)


def _is_smtp_configured() -> bool:
    return bool(
        getattr(settings, "EMAIL_HOST", None)
        and getattr(settings, "EMAIL_HOST_USER", None)
        and getattr(settings, "EMAIL_HOST_PASSWORD", None)
    )


class EmailNotificationService:
    @staticmethod
    def _send_email_async(email: str, template_name: str, context: dict):
        try:
            from_email = (
                getattr(settings, "DEFAULT_FROM_EMAIL", None)
                or getattr(settings, "EMAIL_HOST_USER", None)
            )
            msg = BaseEmailMessage(
                template_name=template_name,
                context=context,
                from_email=from_email or None,
            )
            msg.send([email])
            logger.info(f"Successfully sent transactional email to {email}")
        except Exception as e:
            logger.error(
                f"Failed to dispatch transactional mail to {email}. Error: {str(e)}",
                exc_info=True,
            )

    @staticmethod
    def send_otp_email(user: User, otp_code: str, purpose="ACTIVATION") -> bool:
        """
        Dispatches a transactional HTML email containing the security verification OTP
        in a background thread to prevent HTTP request blocking.
        Always prints the OTP directly to the terminal / server logs for instant access.
        """
        print(
            f"\n{'=' * 50}\n"
            f"[BOOKMART OTP DISPATCH]\n"
            f"Purpose : {purpose}\n"
            f"User    : {getattr(user, 'full_name', '')} ({user.email})\n"
            f"OTP Code: >>> {otp_code} <<<\n"
            f"Expires : 15 minutes\n"
            f"{'=' * 50}\n",
            flush=True,
        )

        if not _is_smtp_configured():
            logger.info("SMTP not configured. OTP printed to terminal.")
            return True

        subject = (
            "Verify your Bookmart Account"
            if purpose == "ACTIVATION"
            else "Reset your Bookmart Password"
        )

        context = {
            "full_name": getattr(user, "full_name", "") or user.email,
            "otp_code": otp_code,
            "subject": subject,
        }

        thread = threading.Thread(
            target=EmailNotificationService._send_email_async,
            args=(user.email, "emails/otp_notification.html", context),
            daemon=True,
        )
        thread.start()
        return True
