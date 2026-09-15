import logging
from celery import shared_task
import requests

logger = logging.getLogger(__name__)


@shared_task(
    bind=True,
    max_retries=3,
    default_retry_delay=5,
    autoretry_for=(requests.RequestException,),
    retry_backoff=True,
    ignore_result=True,
)
def send_expo_push_notifications_task(
    self, expo_tokens: list[str], title: str, body: str, extra_data: dict = None
):
    """
    Asynchronously delivers Expo push notifications via Celery worker.
    """
    if not expo_tokens:
        return

    payload = [
        {
            "to": token,
            "sound": "default",
            "title": title,
            "body": body,
            "data": extra_data or {},
        }
        for token in expo_tokens
    ]

    try:
        response = requests.post(
            "https://exp.host/--/api/v2/push/send",
            json=payload,
            headers={
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Accept-encoding": "gzip, deflate",
            },
            timeout=10,
        )
        if response.status_code != 200:
            logger.error(
                f"Failed to send push notifications: {response.text}"
            )
        else:
            logger.info(f"Successfully sent push notification to {len(expo_tokens)} token(s)")
    except requests.RequestException as exc:
        logger.error(
            f"Error dispatching push notifications on attempt {self.request.retries + 1}: {exc}",
            exc_info=True,
        )
        raise exc
