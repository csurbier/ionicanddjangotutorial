from django.conf.urls import include, url
from .views import *
from rest_framework.decorators import api_view
from rest_framework.routers import DefaultRouter
router = DefaultRouter()

urlpatterns = [
  url(r'^user/(?P<pk>[0-9A-Fa-f-]+)/$', UserDetailView.as_view()),
  url(r'^user/$', UserListView.as_view()),
]
