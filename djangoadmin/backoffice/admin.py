from django.contrib import admin
from backoffice.models import *
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from django.contrib.admin import AdminSite
from django.contrib.auth.models import User, Group
from django.forms.models import BaseInlineFormSet
from django.core.exceptions import ValidationError

class shopplanning_inline(admin.TabularInline):
    model = ShopPlanning
    extra = 7
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


class ProductPlanningFormSet(BaseInlineFormSet):

    def clean(self):
        super(ProductPlanningFormSet, self).clean()

        for form in self.forms:
            if not form.is_valid():
                return
            if form.cleaned_data and not form.cleaned_data.get('DELETE'):
                startHour = form.cleaned_data['startHour']
                endHour = form.cleaned_data['endHour']
                if endHour <= startHour:
                    raise ValidationError(
                        "The end hour should be after the startHour (for day %s)" % form.cleaned_data["day"])

                if startHour >= endHour:
                    raise ValidationError(
                        "The startHour should be before the endHour (for day %s)" % form.cleaned_data["day"])



class productplanning_inline(admin.TabularInline):
    model = ProductPlanning
    extra = 7
    max_num=7
    formset = ProductPlanningFormSet

    def get_formset(self, request, obj=None, **kwargs):
        initial = []
        if request.method == "GET":
            # get user
            user = User.objects.get(id=request.user.id)
            #check if current connected user has a shop
            shops = Shop.objects.filter(user_id=user.id)
            if shops:
                # we assume there is only one shop for a user
                shop = shops[0]
                # get planning shop
                plannings = ShopPlanning.objects.filter(refShop=shop.id)
                if obj == None:
                    if plannings:
                        #no planning set and we have planning for the shop
                        import datetime
                        for planning in plannings:
                            initial.append({
                                'day': planning.day,
                                'startHour': planning.startHour,
                                'endHour': planning.endHour

                            })
                else:
                    if plannings:
                        pass
                    else:
                        import datetime
                        for planning in plannings:
                            initial.append({
                                'day': planning.day,
                                'startHour': planning.startHour,
                                'endHour': planning.endHour

                            })
        formset = super(productplanning_inline, self).get_formset(request, obj, **kwargs)
        from functools import partialmethod
        formset.__init__ = partialmethod(formset.__init__, initial=initial)
        return formset

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
    index_template = 'backoffice/templates/admin/index.html'

site = MyAdminSite()
# Register your models here.
site.register(Shop,ShopAdmin)
site.register(Product,ProductAdmin)
site.register(User)
site.register(Group)