from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Company, User, Customer, InsurancePolicy
from .serializers import *
from .permissions import IsCompanyUserOrAdmin
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    user = request.user
    return Response({
        'username': user.username,
        'is_superuser': user.is_superuser
    })

class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated]

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class CustomerViewSet(viewsets.ModelViewSet):
    serializer_class = CustomerSerializer
    permission_classes = [IsCompanyUserOrAdmin]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or getattr(user, 'is_superadmin', False):
            return Customer.objects.all()
        return Customer.objects.filter(company=user.company)

class InsurancePolicyViewSet(viewsets.ModelViewSet):
    queryset = InsurancePolicy.objects.none()  # 👈 Add this line
    serializer_class = InsurancePolicySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or getattr(user, 'is_superadmin', False):
            return InsurancePolicy.objects.all()
        return InsurancePolicy.objects.filter(customer__company=user.company)
