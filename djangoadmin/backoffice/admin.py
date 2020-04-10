from django.contrib import admin
from backoffice.models import *


class ShopAdmin(admin.ModelAdmin):
    fieldsets = [
        (None, {'fields': ['user','name','email','address']}),
    ]
    list_display = ('user','name', 'email',  )
    ordering = ('user',)

    def get_queryset(self, request):
        qs = super(ShopAdmin, self).get_queryset(request)
        if request.user.is_superuser:
            return qs
        else:
            return qs.filter(user=request.user)


class ProductAdmin(admin.ModelAdmin):
    fieldsets = [
        (None, {'fields': ['user','refShop','title','price','withEndDate','endDate','description']}),
    ]
    list_display = ('user','refShop','title')
    ordering = ('user','refShop',)

    def get_queryset(self, request):
        qs = super(ProductAdmin, self).get_queryset(request)
        if request.user.is_superuser:
            return qs
        else:
            return qs.filter(user=request.user)

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        try:
            user = request.user
            if request.user.is_superuser:
                return super(ProductAdmin, self).formfield_for_foreignkey(db_field, request, **kwargs)
            else:
                if db_field.name == "user":
                    kwargs["queryset"] = User.objects.filter(id=user.id)
                    return super(ProductAdmin, self).formfield_for_foreignkey(db_field, request, **kwargs)
                if db_field.name == "refShop":
                    kwargs["queryset"] = Shop.objects.filter(user=user.id)
                    return super(ProductAdmin, self).formfield_for_foreignkey(db_field, request, **kwargs)
        except Exception as e:
            print(e)

    def get_form(self, request, obj=None, **kwargs):
        form = super(ProductAdmin, self).get_form(request, obj=obj, **kwargs)
        user = User.objects.get(id=request.user.id)
        form.base_fields['user'].initial = user
        if request.user.is_superuser:
            pass
        else:
            shops = Shop.objects.filter(user_id=user.id)
            form.base_fields['refShop'].initial = shops[0]

        return form

# Register your models here.
admin.site.register(Shop,ShopAdmin)
admin.site.register(Product,ProductAdmin)
