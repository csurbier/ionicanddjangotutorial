from django.conf.urls import url
from api.views import sendSmsCode
from rest_framework.routers import DefaultRouter
router = DefaultRouter()
urlpatterns = [
    url(r'^sendSmsCode/$',
        sendSmsCode,
        name='sendSmsCode'),
]
