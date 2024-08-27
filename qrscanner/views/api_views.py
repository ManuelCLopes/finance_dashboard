from http.client import HTTPResponse
import json
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..models import Expense, Income, Investment
from ..serializers import ExpenseSerializer, IncomeSerializer, InvestmentSerializer
from django.http import JsonResponse
from django.db.models import Sum
import qrcode
from io import BytesIO

@api_view(['POST'])
def receive_all_data(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            
            # Clear previous data if needed
            Expense.objects.all().delete()
            Income.objects.all().delete()
            Investment.objects.all().delete()

            # Save Expenses
            for expense in data.get('expenses', []):
                Expense.objects.create(
                    category=expense['category'],
                    amount=expense['amount'],
                    date_spent=expense['date_spent']
                )

            # Save Incomes
            for income in data.get('incomes', []):
                Income.objects.create(
                    category=income['category'],
                    amount=income['amount'],
                    date_received=income['date_received'],
                    tax_amount=income.get('tax_amount', 0)  # Assuming tax_amount might be optional
                )

            # Save Investments
            for investment in data.get('investments', []):
                Investment.objects.create(
                    investment_type=investment['investment_type'],
                    initial_value=investment['initial_value'],
                    date_invested=investment['date_invested'],
                    current_value=investment.get('current_value', None),  # Assuming current_value might be optional
                    symbol=investment.get('symbol', '')  # Assuming symbol might be optional
                )

            request.session['data_received'] = True  # Set session variable

            return JsonResponse({'status': 'success'}, status=201)
        except (ValueError, KeyError, TypeError) as e:
            print(f"Error processing request data: {e}")
            return JsonResponse({'error': 'Invalid data format'}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

def fetch_data(request):
    # Check if data has been received
    data_received = request.session.get('data_received', False)

    if data_received:
        # Fetch the data from the database
        expenses = Expense.objects.values('category', 'amount', 'date_spent')
        incomes = Income.objects.values('category', 'amount', 'date_received')
        investments = Investment.objects.values('investment_type', 'initial_value', 'date_invested')

        expenses_data = {
            'labels': [e['category'] for e in expenses],
            'values': [e['amount'] for e in expenses]
        }
        incomes_data = {
            'labels': [i['category'] for i in incomes],
            'values': [i['amount'] for i in incomes]
        }
        investments_data = {
            'labels': [inv['investment_type'] for inv in investments],
            'values': [inv['initial_value'] for inv in investments]
        }

        return JsonResponse({
            'data_available': True,
            'expenses': expenses_data,
            'incomes': incomes_data,
            'investments': investments_data
        })
    else:
        return JsonResponse({'data_available': False})


def generate_qr_code(request):
    # The data to encode in the QR code
    data = request.build_absolute_uri('/receive_all_data/')  # or any relevant data

    # Generate the QR code
    qr = qrcode.make(data)
    img_io = BytesIO()
    qr.save(img_io, 'PNG')
    img_io.seek(0)

    # Return the image as an HTTP response
    return HTTPResponse(img_io, content_type='image/png')