
# -*- coding: utf-8 -*-
import logging
from django.contrib import admin
from bo.models import User


logger = logging.getLogger('django')

class UserAdmin(admin.ModelAdmin):
    list_display = ('email','first_name','last_name','date_joined','is_active','is_staff',)
    list_filter = ('email','first_name','last_name',)
    search_fields = ('is_superuser','email','first_name','last_name','date_joined','is_active','is_staff','avatar',)

admin.site.register(User,UserAdmin) 
