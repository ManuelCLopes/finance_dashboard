from django.shortcuts import render
from ..models import Expense, Income, Investment
from django.http import JsonResponse

def home(request):
    # Clear session data and reset page state
    request.session['data_received'] = False

    # Optionally, clear data from database
    Expense.objects.all().delete()
    Income.objects.all().delete()
    Investment.objects.all().delete()

    context = {
        'data_received': False,  # Initially, no data has been received
    }
    return render(request, 'qrscanner/home.html', context)

def check_data_status(request):
    # Check if data has been received
    data_received = request.session.get('data_received', False)
    return JsonResponse({'data_received': data_received})

def privacy_policy(request):
    return render(request, 'privacy_policy.html')