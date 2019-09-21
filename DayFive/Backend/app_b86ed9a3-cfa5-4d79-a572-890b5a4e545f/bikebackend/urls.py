"""bikebackend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,re_path
from django.conf.urls import include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from resetpassword.utils.views import sendPasswordLink,PasswordResetConfirmView,pwdenvoye

router = DefaultRouter()

urlpatterns = [
    path('', include(router.urls)),
    path('jet/', include('jet.urls', 'jet')),  # Django JET URLS
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('doc/', include('rest_framework_docs.urls')),
    path('o/', include('oauth2_provider.urls')),
    path('account/reset_password', sendPasswordLink, name="reset_password"),
    re_path('account/reset_password_confirm/(?P<uidb64>[0-9A-Za-z]+)/(?P<token>.+)',PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('account/pwdenvoye', pwdenvoye, name="pwdenvoye"),
]+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
