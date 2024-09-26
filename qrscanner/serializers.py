from rest_framework import serializers
from .models import Expense, Income, Investment

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = ['category', 'amount', 'date_spent']

class IncomeSerializer(serializers.ModelSerializer):
    date_received = serializers.DateField(format="%Y-%m-%d")  
    class Meta:
        model = Income
        fields = ['category', 'amount', 'tax_amount', 'date_received']

class InvestmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Investment
        fields = [
            'symbol', 
            'investment_type', 
            'initial_value', 
            'current_value', 
            'date_invested', 
            'investment_product',
        ]
      
   