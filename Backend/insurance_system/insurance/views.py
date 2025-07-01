from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Company, User, Customer, InsurancePolicy
from .serializers import *
from .permissions import IsCompanyUserOrAdmin
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from .models import User
from .serializers import UserSerializer
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework import status
from .serializers import RegisterSerializer
from rest_framework.generics import GenericAPIView

class RegisterView(GenericAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Registration successful"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated]


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]

class CustomerViewSet(viewsets.ModelViewSet):
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Prevent crash when Swagger is generating schema
        if getattr(self, 'swagger_fake_view', False):
            return Customer.objects.none()

        user = self.request.user
        if user.is_superuser:
            return Customer.objects.all()
        return Customer.objects.filter(company=user.company)


class InsurancePolicyViewSet(viewsets.ModelViewSet):
    serializer_class = InsurancePolicySerializer
    permission_classes = [IsAuthenticated]
    queryset = InsurancePolicy.objects.all()  # ✅ ADD THIS LINE

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return InsurancePolicy.objects.none()

        user = self.request.user
        if user.is_superuser:
            return InsurancePolicy.objects.all()
        return InsurancePolicy.objects.filter(customer__company=user.company)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    return Response({
        'id': request.user.id,
        'username': request.user.username,
        'is_superuser': request.user.is_superuser
    })