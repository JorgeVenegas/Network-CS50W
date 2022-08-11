
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("profile/<username>", views.profile, name="profile"),
    path("new/<option>", views.new, name="new"),
    path("posts/<keyword>/<int:page_no>", views.posts, name="posts"),
    path("edit/<int:post_id>", views.edit, name="edit"),
    path("handle_like", views.handle_like, name="handle_like"),
    path("handle_follow", views.handle_follow, name="handle_follow"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register")
]
