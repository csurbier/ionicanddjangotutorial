from django.contrib import admin
from django.contrib.admin import AdminSite
from django.apps import apps
from django.urls import path

# Register your models here.
from django.contrib.sites.models import Site


class StripeAdminSite(AdminSite):
    site_header = 'Stripe checkout administration'

    def get_urls(self):
        urls = super().get_urls()
        my_urls = [
        ]
        return my_urls + urls


admin.site = StripeAdminSite(name='StripeAdminSite')

models = apps.get_models()

for model in models:
    admin.site.register(model)

admin.autodiscover()
