from rest_framework.authentication import SessionAuthentication


class CsrfExemptSessionAuthentication(SessionAuthentication):
    """
    SessionAuthentication without CSRF enforcement.
    CSRF is handled by the browser's SameSite cookie policy.
    This is safe for same-origin requests in development and
    when deployed behind a load-balancer with HTTPS.
    """
    def enforce_csrf(self, request):
        return  # skip CSRF enforcement
