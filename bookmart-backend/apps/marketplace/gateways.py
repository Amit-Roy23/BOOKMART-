import uuid
from abc import ABC, abstractmethod

from django.conf import settings
from django.utils.module_loading import import_string


class PaymentGateway(ABC):
    """
    Abstract payment gateway interface for Bookmart.
    Pluggable architecture allowing easy swapping between DummyGateway and real
    gateways (e.g., Razorpay, Stripe, PayU) via settings.PAYMENT_GATEWAY.
    """

    @abstractmethod
    def initiate_payment(self, order) -> dict:
        """
        Initiates payment for a given BoostOrder.

        Returns:
            dict: Session / checkout initiation payload (e.g. order_id, amount,
                  gateway_order_id, payment_session_id, currency, status).
        """
        pass

    @abstractmethod
    def verify_payment(self, order, verification_data: dict) -> bool:
        """
        Verifies payment authenticity (e.g. HMAC signature check).

        Args:
            order: The BoostOrder instance.
            verification_data (dict): Data sent from client/webhook (e.g. razorpay_payment_id,
                                      razorpay_order_id, razorpay_signature).

        Returns:
            bool: True if payment is authentic and successful, False otherwise.
        """
        pass


class DummyGateway(PaymentGateway):
    """
    Dummy/Simulation Payment Gateway for development and testing.
    Auto-succeeds on verification while mirroring the exact lifecycle of real gateways.
    """

    def initiate_payment(self, order) -> dict:
        fake_tx_id = f"dummy_txn_{uuid.uuid4().hex[:12]}"
        order.gateway_transaction_id = fake_tx_id
        order.save(update_fields=["gateway_transaction_id"])

        return {
            "gateway": "dummy",
            "order_id": order.id,
            "amount": str(order.amount),
            "currency": "INR",
            "gateway_order_id": fake_tx_id,
            "payment_session_id": f"sess_{uuid.uuid4().hex}",
            "status": "INITIATED",
        }

    def verify_payment(self, order, verification_data: dict) -> bool:
        # For testing failure simulation, client can pass { "force_fail": True }
        if verification_data and verification_data.get("force_fail") is True:
            return False
        return True


GATEWAY_REGISTRY = {
    "dummy": DummyGateway,
}


def get_payment_gateway() -> PaymentGateway:
    """
    Factory function returning the active PaymentGateway instance
    configured in settings.PAYMENT_GATEWAY.
    """
    gateway_setting = getattr(settings, "PAYMENT_GATEWAY", "dummy")

    if isinstance(gateway_setting, str):
        if gateway_setting in GATEWAY_REGISTRY:
            return GATEWAY_REGISTRY[gateway_setting]()
        try:
            gateway_cls = import_string(gateway_setting)
            return gateway_cls()
        except (ImportError, AttributeError):
            pass

    return DummyGateway()
