from django.db import models

class Expense(models.Model):
    category = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date_spent = models.DateField()

    def __str__(self):
        return f"{self.user_id} - {self.amount} on {self.date_spent}"

class Income(models.Model):
    category = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2)
    date_received = models.DateField()

    def __str__(self):
        return f"{self.user_id} - {self.amount} received on {self.date_received}"

class Investment(models.Model):
    symbol = models.CharField(max_length=10, null=True, blank=True)
    investment_type = models.CharField(max_length=50, null=True, blank=True)
    initial_value = models.DecimalField(max_digits=15, decimal_places=2)
    current_value = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    date_invested = models.DateField()
    investment_product = models.CharField(max_length=100, null=True, blank=True)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    annual_return = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    duration = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return f"{self.investment_type} - {self.symbol} invested on {self.date_invested}"