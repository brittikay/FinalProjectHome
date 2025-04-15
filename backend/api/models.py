from django.db import models
from django.contrib.auth.models import User

class Ingredient(models.Model):
    CATEGORY_CHOICES = [
        ('vegetables', 'Vegetables'),
        ('fruits', 'Fruits'),
        ('meat', 'Meat'),
        ('fish', 'Fish'),
        ('dairy', 'Dairy'),
        ('grains', 'Grains'),
        ('legumes', 'Legumes'),
        ('nuts', 'Nuts'),
        ('spices', 'Spices'),
        ('condiments', 'Condiments'),
        ('beverages', 'Beverages'),
        ('other', 'Other'),
    ]

    UNIT_CHOICES = [
        ('grams', 'Grams'),
        ('kg', 'Kilograms'),
        ('oz', 'Ounces'),
        ('lbs', 'Pounds'),
        ('cups', 'Cups'),
        ('tbsp', 'Tablespoons'),
        ('tsp', 'Teaspoons'),
        ('ml', 'Milliliters'),
        ('l', 'Liters'),
        ('pieces', 'Pieces'),
        ('cloves', 'Cloves'),
        ('whole', 'Whole'),
    ]

    name = models.CharField(max_length=100, unique=True)
    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        default='other'
    )
    unit = models.CharField(
        max_length=20,
        choices=UNIT_CHOICES,
        default='pieces'
    )
    cost_per_unit = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self):
        return self.name

class UserPantry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=6, decimal_places=2)
    expiry_date = models.DateField(null=True, blank=True)
    added_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.quantity} {self.ingredient.unit} of {self.ingredient.name} for {self.user.username}"

class Recipe(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    instructions = models.TextField()
    prep_time = models.IntegerField()  # in minutes
    cook_time = models.IntegerField()  # in minutes
    servings = models.IntegerField()
    ingredients = models.ManyToManyField(Ingredient, through='RecipeIngredient')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class RecipeIngredient(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=6, decimal_places=2)
    unit = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.quantity} {self.unit} of {self.ingredient.name} for {self.recipe.name}"

class UserPreference(models.Model):
    DIETARY_CHOICES = [
        ('none', 'No Restrictions'),
        ('vegetarian', 'Vegetarian'),
        ('vegan', 'Vegan'),
        ('gluten_free', 'Gluten Free'),
        ('dairy_free', 'Dairy Free'),
        ('keto', 'Keto'),
        ('paleo', 'Paleo'),
    ]

    CUISINE_CHOICES = [
        ('american', 'American'),
        ('italian', 'Italian'),
        ('mexican', 'Mexican'),
        ('chinese', 'Chinese'),
        ('japanese', 'Japanese'),
        ('thai', 'Thai'),
        ('indian', 'Indian'),
        ('mediterranean', 'Mediterranean'),
        ('french', 'French'),
        ('korean', 'Korean'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    dietary_restrictions = models.CharField(
        max_length=20,
        choices=DIETARY_CHOICES,
        default='none'
    )
    preferred_cuisines = models.CharField(
        max_length=20,
        choices=CUISINE_CHOICES,
        default='american'
    )
    weekly_budget = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        default=150.00
    )
    disliked_ingredients = models.ManyToManyField(Ingredient, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Preferences"

class MealPlan(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    recipes = models.ManyToManyField(Recipe, through='MealPlanRecipe')
    total_cost = models.DecimalField(max_digits=8, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Meal Plan for {self.user.username} ({self.start_date} to {self.end_date})"

class MealPlanRecipe(models.Model):
    meal_plan = models.ForeignKey(MealPlan, on_delete=models.CASCADE)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    day = models.IntegerField()  # 1-7 for Monday-Sunday
    meal_type = models.CharField(max_length=20)  # e.g., 'breakfast', 'lunch', 'dinner'

    def __str__(self):
        return f"{self.meal_type} on day {self.day} for {self.meal_plan}"
