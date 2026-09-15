from rest_framework.throttling import AnonRateThrottle


class LoginRateThrottle(AnonRateThrottle):
    scope = "login"


class RegisterRateThrottle(AnonRateThrottle):
    scope = "register"


class OTPSendRateThrottle(AnonRateThrottle):
    scope = "otp_send"


class OTPVerifyRateThrottle(AnonRateThrottle):
    scope = "otp_verify"


class PasswordResetRateThrottle(AnonRateThrottle):
    scope = "password_reset"
