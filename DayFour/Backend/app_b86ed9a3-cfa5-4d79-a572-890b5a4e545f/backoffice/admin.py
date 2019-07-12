from django.contrib import admin
# *coding: utf-8*

from django.contrib import admin
from .models import *

admin.site.register(User)
admin.site.register(Bike)