from django.http import JsonResponse

def checkPrice(request):
    price = request.GET['price']
    if int(price) > 10:
       data = {"status": "KO"}
    else:
        data = {"status":"OK"}
    return JsonResponse(data)