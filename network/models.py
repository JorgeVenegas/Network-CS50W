from pyexpat import model
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "last_login": self.last_login,
            "date_joined": self.date_joined,
        }


class Post(models.Model):
    id = models.AutoField(primary_key=True)
    author = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name='posts')
    content = models.CharField(max_length=280)
    timestamp = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        return {
            "id": self.id,
            "author": self.author.first_name,
            "username": self.author.username,
            "content": self.content,
            "timestamp": self.timestamp.strftime('%d %b, %Y at  %H:%M'),
            "likes_count": self.likes.count(),
            "likes": [like.user.username for like in self.likes.all()],
            "comments_count": self.comments.count(),
            "comments": [comment.user for comment in self.comments.all()],
        }


class Follow(models.Model):
    follower = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name='followed')
    followed = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name='followers')


class Like(models.Model):
    post = models.ForeignKey(
        'Post', on_delete=models.CASCADE, related_name="likes")
    user = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name="likes")


class Comment(models.Model):
    post = models.ForeignKey(
        'Post', on_delete=models.CASCADE, related_name="comments")
    author = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name="comments")
    content = models.CharField(max_length=280)
    timestamp = models.DateTimeField(auto_now_add=True)
