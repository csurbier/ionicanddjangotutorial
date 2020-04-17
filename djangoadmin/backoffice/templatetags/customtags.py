from django import template
from backoffice.models import *
from django.utils.safestring import mark_safe
import uuid

register = template.Library()


@register.simple_tag
def displayPlanning(refShop):
    plannings = ShopPlanning.objects.filter(refShop=refShop).select_related("refShop")
    fullHtml=""
    for planning in plannings:

        html="<tr><td>"+planning.get_dayName()+"</td><td>"+str(planning.startHour)+"</td><td>"+str(planning.endHour)+"</td></tr>"
        fullHtml+=html
    return mark_safe(fullHtml)
