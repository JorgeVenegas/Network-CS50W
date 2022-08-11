from django.core.exceptions import PermissionDenied
from .models import Post

# Check that post is form user logged in
def user_is_post_author(function):
    def wrap(request, *args, **kwargs):
        post = Post.objects.get(pk=kwargs['post_id'])
        if post.author == request.user:
            return function(request, *args, **kwargs)
        else:
            raise PermissionDenied
    wrap.__doc__ = function.__doc__
    wrap.__name__ = function.__name__
    return wrap
