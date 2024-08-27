from ..models import Expense, Income, Investment
from django.http import JsonResponse
from django.db.models import Sum


def fetch_expense_data(request):
    expenses = Expense.objects.values('category__name').annotate(total=Sum('amount'))
    data = {
        'labels': [expense['category__name'] for expense in expenses],
        'values': [expense['total'] for expense in expenses]
    }
    return JsonResponse(data)

def fetch_income_data(request):
    incomes = Income.objects.values('category__name').annotate(total=Sum('amount'))
    data = {
        'labels': [income['category__name'] for income in incomes],
        'values': [income['total'] for income in incomes]
    }
    return JsonResponse(data)

def fetch_investment_data(request):
    investments = Investment.objects.values('investment_type').annotate(total=Sum('initial_value'))
    data = {
        'labels': [investment['investment_type'] for investment in investments],
        'values': [investment['total'] for investment in investments]
    }
    return JsonResponse(data)