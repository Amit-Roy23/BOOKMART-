import logging
from celery import shared_task
from templated_mail.mail import BaseEmailMessage

logger = logging.getLogger(__name__)


@shared_task(
    bind=True,
    max_retries=3,
    default_retry_delay=5,
    autoretry_for=(Exception,),
    retry_backoff=True,
    ignore_result=True,
)
def send_otp_email_task(
    self, email: str, full_name: str, otp_code: str, purpose: str = "ACTIVATION"
):
    """
    Asynchronously delivers transactional OTP emails using Celery worker with automatic retries.
    """
    subject = (
        "Verify your Bookmart Account"
        if purpose == "ACTIVATION"
        else "Reset your Bookmart Password"
    )
    context = {
        "full_name": full_name,
        "otp_code": otp_code,
        "subject": subject,
    }
    try:
        msg = BaseEmailMessage(
            template_name="emails/otp_notification.html",
            context=context,
        )
        msg.send([email])
        logger.info(f"Successfully sent OTP email to {email} ({purpose})")
    except Exception as exc:
        logger.error(
            f"Failed to deliver OTP email to {email} on attempt {self.request.retries + 1}: {exc}",
            exc_info=True,
        )
        raise exc
