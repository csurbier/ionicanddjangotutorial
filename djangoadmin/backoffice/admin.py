from django.contrib import admin
from backoffice.models import *
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from django.contrib.admin import AdminSite
from django.contrib.auth.models import User, Group

class shopplanning_inline(admin.TabularInline):
    model = ShopPlanning
    extra = 4
    max_num=7


class ShopAdmin(admin.ModelAdmin):
    inlines = [shopplanning_inline]
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


class productplanning_inline(admin.TabularInline):
    model = ProductPlanning
    extra = 4
    max_num=7


class ProductAdmin(admin.ModelAdmin):
    inlines = [productplanning_inline]
    fieldsets = [
        (None, {'fields': ['user','refShop','title','price','withEndDate','endDate','description']}),
    ]
    list_display = ('user','goToEditProduct','refShop','title','has_low_price',)
    ordering = ('user','refShop',)

    def has_low_price(self, obj):
        return obj.price < 5
    has_low_price.boolean=True

    @mark_safe
    def goToEditProduct(self, obj):
        return format_html(
            '<a class="button" href="/admin/backoffice/product/%s/change/?_changelist_filters=id__exact=%s" target="blank">Edit</a>&nbsp;' % (obj.pk,obj.pk))

    goToEditProduct.short_description = 'Edit'
    goToEditProduct.allow_tags = True

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

    def save_model(self, request, obj, form, change):
        if request.user.is_superuser:
            pass
        else:
            #do your own custom code
            pass
        obj.save()

from django.contrib.admin import AdminSite
class MyAdminSite(AdminSite):
    login_template = 'backoffice/templates/admin/login.html'

site = MyAdminSite()
# Register your models here.
site.register(Shop,ShopAdmin)
site.register(Product,ProductAdmin)
site.register(User)
site.register(Group)
