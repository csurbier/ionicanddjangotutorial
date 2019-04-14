from django.urls import path
from django.conf.urls import include,url
from rest_framework.routers import DefaultRouter
router = DefaultRouter()
from api.views import *

urlpatterns = [
    path('users/', UserListCreateView.as_view(), name='users_list'),
   # url(r'^user/(?P<pk>[0-9A-Fa-f-]+)/$', UserDetailView.as_view(), name='user_detail'),
    path('user/<uuid:pk>/',  UserDetailView.as_view(), name='user_detail'),
    path('', include(router.urls))
]
