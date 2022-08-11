from http.client import SWITCHING_PROTOCOLS
import json
from django.utils import timezone
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator

from network.decorators import user_is_post_author
from .models import Comment, Follow, Like, Post, User


def index(request):
    return render(request, "network/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        firstname = request.POST["firstname"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(
                username, email, password, first_name=firstname)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")


@csrf_exempt
def new(request, option):
    """ Adds new post or comment """

    if request.method == "POST":
        data = json.loads(request.body)
        if option == 'post':
            try:
                post = Post(author=request.user, content=data.get('content'))
                post.save()
                return JsonResponse({"message": "Post created successfully"})
            except:
                return JsonResponse({"error": "Unnable to create post"}, status=400)
        elif option == 'comment':
            try:
                post = Post.objects.get(id=data.get("post_id"))
                comment = Comment(post=post, author=request.user,
                                  content=data.get('content'))
                comment.save()
                return JsonResponse({"message": "Comment created successfully"})
            except:
                return JsonResponse({"error": "Unnable to create comment"}, status=400)
    return JsonResponse({"error": "Unsupported HTTP request method"}, status=400)


@csrf_exempt
@user_is_post_author
def edit(request, post_id):
    """
    Edits specific post.

    Returns:
        Edited post via JSON Response
    """

    try:
        post = Post.objects.get(id=post_id)
    except:
        return JsonResponse({"error": "Unnable to get post"}, status=400)

    if request.method == "GET":
        return JsonResponse(post.serialize(), safe=False)
    elif request.method == "POST":
        data = json.loads(request.body)
        post.content = data['content']
        post.timestamp = timezone.now()
        post.save()
        return HttpResponse(status=200)


def profile(request, username):
    """
    Returns:
        Specified user info via JSON Response
    """

    if request.method == "GET":
        try:
            # Attempt to get user
            user = User.objects.get(username=username)
            followers = user.followers.all().count()
            following = Follow.objects.filter(follower=user).count()
            is_followed = True
            if request.user.is_authenticated:
                is_followed = Follow.objects.filter(
                    follower=request.user, followed=user).exists()
            user = user.serialize()
            user["followers_count"] = followers
            user["following_count"] = following
            user["is_followed"] = is_followed
            return JsonResponse(user, status=200)
        except:
            return JsonResponse({"error": "Profile not found."}, status=400)
    return JsonResponse({"error": "Unsupported HTTP request method"}, status=400)


def posts(request, keyword, page_no):
    """
    Parameters:
        keyword -- Can be a username, feed or following

        page_no -- Specific page number of requested posts

    Returns:
        Posts according to keyword and page specified
    """

    if request.method == "GET":
        if keyword == "feed":
            posts = Post.objects.all().order_by("-timestamp")
        elif keyword == "following":
            followings = Follow.objects.filter(
                follower=request.user).values_list("followed")
            posts = Post.objects.filter(
                author__in=followings).order_by("-timestamp")
        else:
            try:
                # Attempt to get user ad user's posts
                author = User.objects.get(username=keyword)
                posts = Post.objects.filter(
                    author=author).order_by("-timestamp")
            except:
                return JsonResponse({"error": "User not found"}, status=400)
        posts_paginator = Paginator(posts, 10)
        page = posts_paginator.get_page(page_no)
        return JsonResponse({
            "posts": [post.serialize() for post in page],
            "page": {
                "has_previous": page.has_previous(),
                "has_next": page.has_next(),
                "number": page.number
            }
        }, safe=False)
    return JsonResponse({"error": "Unsupported HTTP request method"}, status=400)


@csrf_exempt
def handle_like(request):
    """
    Creates or deletes a Like instance
    """

    if request.method == "POST":
        data = json.loads(request.body)
        try:
            # Attempt to get post
            post = Post.objects.get(id=data['post_id'])
            try:
                # Attempt to delete like if exists
                Like.objects.get(post=post, user=request.user).delete()
                liked = False
            except:
                # Create like
                Like.objects.create(post=post, user=request.user)
                liked = True
            likes_count = post.likes.count()
            return JsonResponse({"liked": liked, "likes_count": likes_count})
        except:
            return JsonResponse({"error": "Post does not exists"}, status=400)
    return JsonResponse({"error": "Unsupported HTTP request method"}, status=400)


@csrf_exempt
def handle_follow(request):
    """
    Creates or deletes a Follow instance
    """

    if request.method == "POST":
        data = json.loads(request.body)
        try:
            # Attempt to get post
            followed_user = User.objects.get(username=data['profile_username'])
            try:
                # Attempt to delete like if exists
                Follow.objects.get(follower=request.user,
                                   followed=followed_user).delete()
                followed = False
            except:
                # Create like
                Follow.objects.create(follower=request.user,
                                      followed=followed_user)
                followed = True
            try:
                follow_count = followed_user.followers.count()
            except:
                return JsonResponse({"error": "F"}, status=400)
            return JsonResponse({"followed": followed, "follow_count": follow_count})
        except:
            return JsonResponse({"error": "User does not exists"}, status=400)
    return JsonResponse({"error": "Unsupported HTTP request method"}, status=400)
