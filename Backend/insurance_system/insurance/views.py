from rest_framework import viewsets
from .models import Company, User, Customer, InsurancePolicy
from .serializers import *
from rest_framework.permissions import AllowAny


class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [AllowAny]

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

class InsurancePolicyViewSet(viewsets.ModelViewSet):
    queryset = InsurancePolicy.objects.all()
    serializer_class = InsurancePolicySerializer

