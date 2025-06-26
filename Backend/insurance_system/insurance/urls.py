from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register('companies', CompanyViewSet)
router.register('users', UserViewSet)
router.register('customers', CustomerViewSet, basename='customer')

router.register('policies', InsurancePolicyViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

