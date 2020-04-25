from django.http import JsonResponse

def checkPrice(request):
    price = request.GET['price']
    if int(price) > 10:
       data = {"status": "KO"}
    else:
        data = {"status":"OK"}
    return JsonResponse(data)

from chartjs.views.lines import BaseLineChartView
from django.db.models import Count
from django.views.generic import TemplateView

class NewProductMonthChartJSONView(BaseLineChartView):
    def get_labels(self):
        """Return 12 labels for the x-axis."""
        return ["January", "February", "March", "April", "Mai", "June", "July","August","September","October","November","December"]

    def get_providers(self):
        """Return names of datasets."""
        return ["New products"]

    def get_data(self):
        """Return datasets to plot."""
        #get product per month
        from django.db.models import Count
        from django.db.models.functions import TruncMonth
        from backoffice.models import Product
        import datetime
        date = datetime.date.today()
        items = Product.objects.filter(createdAt__year=date.year).annotate(month=TruncMonth('createdAt')).values(
            'month').annotate(total=Count('id'))
        totalMonth={}
        #initialisation
        for i in range(1, 13):
            totalMonth[i]='0'
        for item in items:
            month = item["month"]
            totalMonth[month.month]= item["total"]
        return [[int(totalMonth.get(1)), int(totalMonth.get(2)), int(totalMonth.get(3)), int(totalMonth.get(4)), int(totalMonth.get(5)), int(totalMonth.get(6)), int(totalMonth.get(7)),int(totalMonth.get(8))
                    ,int(totalMonth.get(9)),int(totalMonth.get(10)),int(totalMonth.get(11)),int(totalMonth.get(12))]]

line_chart = TemplateView.as_view(template_name='line_chart.html')
line_chart_json = NewProductMonthChartJSONView.as_view()
