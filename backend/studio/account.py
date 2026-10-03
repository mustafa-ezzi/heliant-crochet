from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.decorators import api_view
from rest_framework.response import Response

from studio.api import EMAIL, serialize_order, text
from studio.models import Order


def account_payload(user):
    orders = Order.objects.filter(customer=user).prefetch_related("lines").order_by("-created_at", "-id")
    return {
        "user": {
            "name": user.first_name or user.email,
            "email": user.email,
            "staff": user.is_staff,
        },
        "orders": [serialize_order(order) for order in orders],
    }


@api_view(["GET"])
@ensure_csrf_cookie
def account(request):
    if not request.user.is_authenticated:
        return Response({"user": None, "orders": []})
    return Response(account_payload(request.user))


@api_view(["POST"])
def register(request):
    name = text(request.data.get("name"))
    email = text(request.data.get("email")).lower()
    password = str(request.data.get("password") or "")
    errors = {}
    if not name:
        errors["name"] = "Add your name so the studio knows who you are."
    if not EMAIL.match(email):
        errors["email"] = "That email does not look complete."
    elif User.objects.filter(username=email).exists():
        errors["email"] = "That email already has an account."
    if len(password) < 8:
        errors["password"] = "Use at least 8 characters."
    if errors:
        return Response(errors, status=400)
    user = User.objects.create_user(
        username=email,
        email=email,
        password=password,
        first_name=name[:150],
    )
    login(request, user)
    return Response(account_payload(user), status=201)


@api_view(["POST"])
def sign_in(request):
    email = text(request.data.get("email")).lower()
    password = str(request.data.get("password") or "")
    user = authenticate(request, username=email, password=password)
    if user is None:
        return Response({"detail": "That email and password do not match."}, status=400)
    login(request, user)
    return Response(account_payload(user))


@api_view(["POST"])
def sign_out(request):
    logout(request)
    return Response({"user": None, "orders": []})
