# coding=utf-8
from django.conf.urls import url,include
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls import url
from . import views
from django.contrib.auth import views as auth_views
from bo.views import *
urlpatterns = [
    url(r'^create-checkout-session/', createCheckoutSession, name='create-checkout-session'),
    url(r'^checkout-session-success/', checkoutSessionSuccess, name='checkout-session-success'),
    url(r'^checkout-session-failure/', checkoutSessionFailure, name='checkout-session-failure'),
    url(r"^paymentCheckStatus/",paymentCheckStatus,name="paymentCheckStatus"),
    url("",index,name="index"),
]+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

