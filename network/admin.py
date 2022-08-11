from django.contrib import admin

# Register your models here.
from .models import User, Post, Like, Follow


class FollowedInLine(admin.TabularInline):
    model = Follow
    fk_name = "followed"


class FollowerInLine(admin.TabularInline):
    model = Follow
    fk_name = "follower"


class UserAdmin(admin.ModelAdmin):
    inlines = [FollowedInLine, FollowerInLine]


admin.site.register(User, UserAdmin)
admin.site.register(Post)
admin.site.register(Like)
admin.site.register(Follow)
