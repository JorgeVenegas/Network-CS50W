
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("handle_like/<state>", views.handle_like, name="handle_like"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register")
]
