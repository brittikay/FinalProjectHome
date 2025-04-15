from django.contrib import admin
from .models import (
    Ingredient, Recipe, RecipeIngredient,
    UserPreference, MealPlan, MealPlanRecipe
)

@admin.register(Ingredient)
class IngredientAdmin(admin.ModelAdmin):
    list_display = ('name', 'cost_per_unit', 'unit', 'category')
    search_fields = ('name', 'category')
    list_filter = ('category',)

class RecipeIngredientInline(admin.TabularInline):
    model = RecipeIngredient
    extra = 1

@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    list_display = ('name', 'prep_time', 'cook_time', 'servings')
    search_fields = ('name', 'description')
    inlines = [RecipeIngredientInline]

@admin.register(UserPreference)
class UserPreferenceAdmin(admin.ModelAdmin):
    list_display = ('user', 'weekly_budget')
    search_fields = ('user__username',)

class MealPlanRecipeInline(admin.TabularInline):
    model = MealPlanRecipe
    extra = 1

@admin.register(MealPlan)
class MealPlanAdmin(admin.ModelAdmin):
    list_display = ('user', 'start_date', 'end_date', 'total_cost')
    search_fields = ('user__username',)
    inlines = [MealPlanRecipeInline]
