from django.contrib.auth.models import AbstractUser
from django.db import models

class Company(models.Model):
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)

class User(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    username = models.CharField(max_length=100)
    password = models.CharField(max_length=255)
    email = models.EmailField()
    is_superadmin = models.BooleanField(default=False) 

class Customer(models.Model):
    full_name = models.CharField(max_length=100)
    national_id = models.CharField(max_length=10)
    address = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    service_expiration = models.DateField(null=True, blank=True)

class InsurancePolicy(models.Model):
    POLICY_TYPES = [
        ('Car', 'Car'),
        ('Fire', 'Fire'),
        ('Life', 'Life'),
    ]
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    policy_type = models.CharField(max_length=10, choices=POLICY_TYPES)
    start_date = models.DateField()
    end_date = models.DateField()
    details = models.TextField()
    payment_amount = models.DecimalField(max_digits=10, decimal_places=2)