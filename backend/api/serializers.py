from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Ingredient, Recipe, RecipeIngredient,
    UserPreference, MealPlan, MealPlanRecipe,
    UserPantry
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'first_name', 'last_name']

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords don't match")
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user

class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ['id', 'name', 'cost_per_unit', 'unit', 'category']

class RecipeIngredientSerializer(serializers.ModelSerializer):
    ingredient = IngredientSerializer()

    class Meta:
        model = RecipeIngredient
        fields = ['ingredient', 'quantity', 'unit']

class RecipeSerializer(serializers.ModelSerializer):
    ingredients = RecipeIngredientSerializer(source='recipeingredient_set', many=True)

    class Meta:
        model = Recipe
        fields = [
            'id', 'name', 'description', 'instructions',
            'prep_time', 'cook_time', 'servings', 'ingredients'
        ]

class UserPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreference
        fields = [
            'weekly_budget', 'dietary_restrictions',
            'preferred_cuisines', 'disliked_ingredients'
        ]

class MealPlanRecipeSerializer(serializers.ModelSerializer):
    recipe = RecipeSerializer()

    class Meta:
        model = MealPlanRecipe
        fields = ['recipe', 'day', 'meal_type']

class MealPlanSerializer(serializers.ModelSerializer):
    recipes = MealPlanRecipeSerializer(source='mealplanrecipe_set', many=True)

    class Meta:
        model = MealPlan
        fields = [
            'id', 'start_date', 'end_date',
            'total_cost', 'recipes'
        ]

class UserPantrySerializer(serializers.ModelSerializer):
    ingredient = IngredientSerializer()

    class Meta:
        model = UserPantry
        fields = ['id', 'ingredient', 'quantity', 'expiry_date', 'added_date', 'updated_date']

class UserPantryCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPantry
        fields = ['ingredient', 'quantity', 'expiry_date'] 