from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import viewsets, status, pagination
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from django.contrib.auth import login, logout
from rest_framework.authtoken.models import Token
from django.conf import settings
from .models import (
    Ingredient, Recipe, RecipeIngredient,
    UserPreference, MealPlan, MealPlanRecipe, UserPantry
)
from .serializers import (
    IngredientSerializer, RecipeSerializer,
    UserPreferenceSerializer, MealPlanSerializer,
    UserSerializer, UserRegistrationSerializer,
    UserPantryCreateSerializer, UserPantrySerializer
)
import openai
from datetime import datetime, timedelta
import json
import os
from django.db import models
from django.db.models import Q

# Configure OpenAI
openai.api_key = os.getenv('OPENAI_API_KEY')
if not openai.api_key:
    raise ValueError("OPENAI_API_KEY environment variable is not set")

def check_openai_api():
    try:
        # Make a simple API call to verify the key
        openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": "Test"}],
            max_tokens=5
        )
        return True
    except Exception as e:
        print(f"OpenAI API Error: {str(e)}")
        return False

# Create your views here.

@api_view(['GET'])
def test_api(request):
    api_status = check_openai_api()
    return Response({
        'message': 'API is working!',
        'status': 'success',
        'openai_api': 'connected' if api_status else 'failed'
    })

@api_view(['POST'])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    try:
        user = User.objects.get(username=username)
        if user.check_password(password):
            login(request, user)
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'user': UserSerializer(user).data,
                'token': token.key
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    request.user.auth_token.delete()
    logout(request)
    return Response({'message': 'Successfully logged out'})

class CustomPagination(pagination.PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class RecipeViewSet(viewsets.ModelViewSet):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination

    def get_queryset(self):
        queryset = Recipe.objects.all()
        
        # Search by recipe name
        name = self.request.query_params.get('name', None)
        if name:
            queryset = queryset.filter(name__icontains=name)
        
        # Filter by ingredients
        ingredients = self.request.query_params.get('ingredients', None)
        if ingredients:
            ingredient_list = ingredients.split(',')
            for ingredient in ingredient_list:
                queryset = queryset.filter(
                    recipeingredient_set__ingredient__name__icontains=ingredient.strip()
                )
        
        # Filter by dietary restrictions
        dietary_restrictions = self.request.query_params.get('dietary_restrictions', None)
        if dietary_restrictions:
            restrictions = dietary_restrictions.split(',')
            for restriction in restrictions:
                restriction = restriction.strip().lower()
                if restriction == 'vegetarian':
                    queryset = queryset.exclude(
                        recipeingredient_set__ingredient__category__in=['meat', 'fish']
                    )
                elif restriction == 'vegan':
                    queryset = queryset.exclude(
                        recipeingredient_set__ingredient__category__in=['meat', 'fish', 'dairy', 'eggs']
                    )
                elif restriction == 'gluten-free':
                    queryset = queryset.exclude(
                        recipeingredient_set__ingredient__name__icontains='wheat'
                    ).exclude(
                        recipeingredient_set__ingredient__name__icontains='gluten'
                    )
        
        # Filter by prep time
        max_prep_time = self.request.query_params.get('max_prep_time', None)
        if max_prep_time:
            queryset = queryset.filter(prep_time__lte=int(max_prep_time))
        
        # Filter by cook time
        max_cook_time = self.request.query_params.get('max_cook_time', None)
        if max_cook_time:
            queryset = queryset.filter(cook_time__lte=int(max_cook_time))
        
        # Filter by cost range
        min_cost = self.request.query_params.get('min_cost', None)
        max_cost = self.request.query_params.get('max_cost', None)
        if min_cost or max_cost:
            # Annotate each recipe with its total cost
            queryset = queryset.annotate(
                total_cost=models.Sum(
                    models.F('recipeingredient_set__quantity') * 
                    models.F('recipeingredient_set__ingredient__cost_per_unit')
                )
            )
            if min_cost:
                queryset = queryset.filter(total_cost__gte=float(min_cost))
            if max_cost:
                queryset = queryset.filter(total_cost__lte=float(max_cost))
        
        return queryset.distinct()

    def perform_create(self, serializer):
        serializer.save()

    @action(detail=False, methods=['post'])
    def suggest(self, request):
        try:
            # Get available ingredients from pantry
            pantry_items = UserPantry.objects.filter(user=request.user)
            pantry_ingredients = [
                {
                    'name': item.ingredient.name,
                    'quantity': float(item.quantity),
                    'unit': item.ingredient.unit
                }
                for item in pantry_items
            ]

            # Get user preferences
            user_preferences = UserPreference.objects.get(user=request.user)

            # Prepare the prompt for OpenAI
            prompt = f"""
            Suggest 3 recipes that:
            1. Use these available ingredients: {json.dumps(pantry_ingredients)}
            2. Consider these dietary restrictions: {json.dumps(user_preferences.dietary_restrictions)}
            3. Prefer these cuisines: {json.dumps(user_preferences.preferred_cuisines)}
            4. Avoid these ingredients: {[ing.name for ing in user_preferences.disliked_ingredients.all()]}
            5. Are budget-friendly (around ${user_preferences.weekly_budget/7} per meal)

            For each recipe, provide:
            - Name
            - Brief description
            - List of ingredients (with quantities and units)
            - Step-by-step instructions
            - Estimated prep and cook time
            - Number of servings
            - Total estimated cost

            Format the response as a JSON array of recipes.
            """

            # Call OpenAI API
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a helpful recipe suggestion assistant."},
                    {"role": "user", "content": prompt}
                ]
            )

            suggested_recipes = json.loads(response.choices[0].message.content)
            return Response(suggested_recipes, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['post'])
    def generate_variations(self, request):
        try:
            recipe_id = request.data.get('recipe_id')
            variations_count = request.data.get('variations', 3)
            
            original_recipe = Recipe.objects.get(id=recipe_id)
            ingredients = [
                {
                    'name': ri.ingredient.name,
                    'quantity': float(ri.quantity),
                    'unit': ri.unit
                }
                for ri in original_recipe.recipeingredient_set.all()
            ]

            prompt = f"""
            Create {variations_count} variations of this recipe:
            Name: {original_recipe.name}
            Description: {original_recipe.description}
            Ingredients: {json.dumps(ingredients)}
            Instructions: {original_recipe.instructions}

            For each variation:
            1. Keep the same basic structure but change some ingredients or techniques
            2. Maintain similar cooking time and difficulty level
            3. Keep the same number of servings
            4. Provide a new name, description, and modified ingredients list
            5. Adjust the instructions accordingly

            Format the response as a JSON array of recipe variations.
            """

            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a creative recipe variation generator."},
                    {"role": "user", "content": prompt}
                ]
            )

            variations = json.loads(response.choices[0].message.content)
            return Response(variations, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class IngredientViewSet(viewsets.ModelViewSet):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer
    permission_classes = [IsAuthenticated]

class UserPreferenceViewSet(viewsets.ModelViewSet):
    queryset = UserPreference.objects.all()
    serializer_class = UserPreferenceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserPreference.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class MealPlanViewSet(viewsets.ModelViewSet):
    queryset = MealPlan.objects.all()
    serializer_class = MealPlanSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination

    def get_queryset(self):
        queryset = MealPlan.objects.filter(user=self.request.user)
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        if start_date:
            queryset = queryset.filter(start_date__gte=start_date)
        if end_date:
            queryset = queryset.filter(end_date__lte=end_date)
        
        # Order by most recent first
        return queryset.order_by('-created_at')

    @action(detail=False, methods=['post'])
    def generate(self, request):
        try:
            user_preferences = UserPreference.objects.get(user=request.user)
            
            # Get parameters from request
            days = int(request.data.get('days', 7))  # Default to 7 days
            meals_per_day = int(request.data.get('meals_per_day', 3))  # Default to 3 meals
            use_pantry = request.data.get('use_pantry', True)  # Default to using pantry items
            
            # Get available ingredients from pantry
            pantry_ingredients = []
            if use_pantry:
                pantry_items = UserPantry.objects.filter(user=request.user)
                pantry_ingredients = [
                    {
                        'name': item.ingredient.name,
                        'quantity': float(item.quantity),
                        'unit': item.ingredient.unit
                    }
                    for item in pantry_items
                ]
            
            # Prepare the prompt for OpenAI
            prompt = f"""
            Create a {days}-day meal plan that:
            1. Stays within a budget of ${user_preferences.weekly_budget}
            2. Uses similar ingredients across meals to minimize waste
            3. Considers these dietary restrictions: {json.dumps(user_preferences.dietary_restrictions)}
            4. Prefers these cuisines: {json.dumps(user_preferences.preferred_cuisines)}
            5. Avoids these ingredients: {[ing.name for ing in user_preferences.disliked_ingredients.all()]}
            6. Includes {meals_per_day} meals per day
            {f"7. Uses these available ingredients: {json.dumps(pantry_ingredients)}" if pantry_ingredients else ""}

            Format the response as a JSON with this structure:
            {{
                "meals": [
                    {{
                        "day": 1,
                        "meal_type": "breakfast/lunch/dinner",
                        "recipe": {{
                            "name": "Recipe Name",
                            "description": "Brief description",
                            "instructions": "Step by step instructions",
                            "ingredients": [
                                {{
                                    "name": "Ingredient Name",
                                    "quantity": 1.5,
                                    "unit": "cups"
                                }}
                            ]
                        }}
                    }}
                ]
            }}
            """

            # Call OpenAI API
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a helpful meal planning assistant."},
                    {"role": "user", "content": prompt}
                ]
            )

            meal_plan_data = json.loads(response.choices[0].message.content)
            
            # Create the meal plan
            start_date = datetime.now().date()
            end_date = start_date + timedelta(days=days-1)
            
            meal_plan = MealPlan.objects.create(
                user=request.user,
                start_date=start_date,
                end_date=end_date,
                total_cost=0  # Will be calculated based on ingredients
            )

            # Process each meal and create recipes
            for meal in meal_plan_data['meals']:
                recipe_data = meal['recipe']
                
                # Create or get ingredients
                ingredients = []
                for ing_data in recipe_data['ingredients']:
                    ingredient, _ = Ingredient.objects.get_or_create(
                        name=ing_data['name'],
                        defaults={
                            'cost_per_unit': 0,  # You'll need to implement price lookup
                            'unit': ing_data['unit'],
                            'category': 'other'
                        }
                    )
                    ingredients.append(ingredient)

                # Create recipe
                recipe = Recipe.objects.create(
                    name=recipe_data['name'],
                    description=recipe_data['description'],
                    instructions=recipe_data['instructions'],
                    prep_time=30,  # Default values, can be adjusted
                    cook_time=30,
                    servings=4
                )

                # Add ingredients to recipe
                for ing_data, ingredient in zip(recipe_data['ingredients'], ingredients):
                    RecipeIngredient.objects.create(
                        recipe=recipe,
                        ingredient=ingredient,
                        quantity=ing_data['quantity'],
                        unit=ing_data['unit']
                    )

                # Add recipe to meal plan
                MealPlanRecipe.objects.create(
                    meal_plan=meal_plan,
                    recipe=recipe,
                    day=meal['day'],
                    meal_type=meal['meal_type']
                )

            return Response(MealPlanSerializer(meal_plan).data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['get'])
    def shopping_list(self, request, pk=None):
        meal_plan = self.get_object()
        recipes = meal_plan.recipes.all()
        
        # Calculate total ingredients needed
        shopping_list = {}
        for recipe in recipes:
            for recipe_ingredient in recipe.recipeingredient_set.all():
                ingredient = recipe_ingredient.ingredient
                key = f"{ingredient.name}_{ingredient.unit}"
                if key not in shopping_list:
                    shopping_list[key] = {
                        'ingredient': ingredient.name,
                        'unit': ingredient.unit,
                        'total_quantity': 0,
                        'cost_per_unit': ingredient.cost_per_unit
                    }
                shopping_list[key]['total_quantity'] += float(recipe_ingredient.quantity)
        
        # Subtract pantry items
        pantry_items = UserPantry.objects.filter(user=request.user)
        for item in pantry_items:
            key = f"{item.ingredient.name}_{item.ingredient.unit}"
            if key in shopping_list:
                shopping_list[key]['total_quantity'] = max(
                    0,
                    shopping_list[key]['total_quantity'] - float(item.quantity)
                )
        
        return Response(list(shopping_list.values()))

class UserPantryViewSet(viewsets.ModelViewSet):
    queryset = UserPantry.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return UserPantryCreateSerializer
        return UserPantrySerializer

    def get_queryset(self):
        return UserPantry.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def expiring_soon(self, request):
        """Get pantry items that are expiring soon (within 7 days)"""
        from datetime import datetime, timedelta
        from django.db.models import Q
        
        # Get items expiring in the next 7 days
        expiry_date = datetime.now().date() + timedelta(days=7)
        items = self.get_queryset().filter(
            Q(expiry_date__lte=expiry_date) & 
            Q(expiry_date__gte=datetime.now().date())
        )
        
        serializer = self.get_serializer(items, many=True)
        return Response(serializer.data)