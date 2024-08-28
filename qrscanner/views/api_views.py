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
            expense_data = data.get('expenses', [])
            expense_serializer = ExpenseSerializer(data=expense_data, many=True)
            if expense_serializer.is_valid():
                expense_serializer.save()
            else:
                return JsonResponse({'error': 'Invalid expense data', 'details': expense_serializer.errors}, status=400)

            # Save Incomes
            income_data = data.get('incomes', [])
            income_serializer = IncomeSerializer(data=income_data, many=True)
            if income_serializer.is_valid():
                income_serializer.save()
            else:
                return JsonResponse({'error': 'Invalid income data', 'details': income_serializer.errors}, status=400)

            # Save Investments
            investment_data = data.get('investments', [])
            investment_serializer = InvestmentSerializer(data=investment_data, many=True)
            if investment_serializer.is_valid():
                investment_serializer.save()
            else:
                return JsonResponse({'error': 'Invalid investment data', 'details': investment_serializer.errors}, status=400)

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

@api_view(['GET'])
def fetch_detailed_data(request):
    """
    Fetch detailed data for expenses, incomes, or investments.
    """
    # Retrieve the data type from the query parameters
    data_type = request.query_params.get('type')

    if data_type == 'expenses':
        # Fetch all expenses with more details
        expenses = Expense.objects.all()
        expenses_serializer = ExpenseSerializer(expenses, many=True)
        return Response(expenses_serializer.data, status=status.HTTP_200_OK)

    elif data_type == 'incomes':
        # Fetch all incomes with more details
        incomes = Income.objects.all()
        incomes_serializer = IncomeSerializer(incomes, many=True)
        return Response(incomes_serializer.data, status=status.HTTP_200_OK)

    elif data_type == 'investments':
        # Fetch all investments with more details
        investments = Investment.objects.values()
        investments_serializer = InvestmentSerializer(investments, many=True)
        return Response(investments_serializer.data, status=status.HTTP_200_OK)

    else:
        return Response({'error': 'Invalid data type'}, status=status.HTTP_400_BAD_REQUEST)

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