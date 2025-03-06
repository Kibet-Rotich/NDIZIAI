from django.urls import path
from .views import classify_banana

urlpatterns = [
    path('classify/', classify_banana, name='classify_banana')
]
