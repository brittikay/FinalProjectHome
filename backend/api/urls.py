from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'recipes', views.RecipeViewSet)
router.register(r'ingredients', views.IngredientViewSet)
router.register(r'preferences', views.UserPreferenceViewSet)
router.register(r'meal-plans', views.MealPlanViewSet)
router.register(r'pantry', views.UserPantryViewSet, basename='pantry')

urlpatterns = [
    path('', include(router.urls)),
    path('test/', views.test_api, name='test_api'),
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login_view, name='login'),
    path('auth/logout/', views.logout_view, name='logout'),
] 