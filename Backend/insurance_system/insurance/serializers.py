from rest_framework import serializers
from .models import Company, User, Customer, InsurancePolicy

class RegisterSerializer(serializers.Serializer):
    company_name = serializers.CharField(max_length=255)
    company_address = serializers.CharField()
    company_phone = serializers.CharField()
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        company = Company.objects.create(
            name=validated_data['company_name'],
            address=validated_data['company_address'],
            phone=validated_data['company_phone'],
        )
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            company=company,
        )
        return user

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'company', 'is_superuser']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

class InsurancePolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = InsurancePolicy
        fields = '__all__'
