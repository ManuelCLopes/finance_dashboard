# Generated by Django 5.1 on 2024-08-26 10:16

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Expense',
            fields=[
                ('id', models.CharField(max_length=100, primary_key=True, serialize=False)),
                ('category', models.CharField(max_length=100)),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('date_spent', models.DateField()),
            ],
        ),
        migrations.CreateModel(
            name='Income',
            fields=[
                ('id', models.CharField(max_length=100, primary_key=True, serialize=False)),
                ('category', models.CharField(max_length=100)),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('tax_amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('date_received', models.DateField()),
            ],
        ),
        migrations.CreateModel(
            name='Investment',
            fields=[
                ('id', models.CharField(max_length=100, primary_key=True, serialize=False)),
                ('symbol', models.CharField(blank=True, max_length=10, null=True)),
                ('investment_type', models.CharField(blank=True, max_length=50, null=True)),
                ('initial_value', models.DecimalField(decimal_places=2, max_digits=15)),
                ('current_value', models.DecimalField(blank=True, decimal_places=2, max_digits=15, null=True)),
                ('date_invested', models.DateField()),
                ('investment_product', models.CharField(blank=True, max_length=100, null=True)),
                ('quantity', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('annual_return', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True)),
                ('duration', models.CharField(blank=True, max_length=50, null=True)),
            ],
        ),
    ]
