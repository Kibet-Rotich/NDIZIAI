from django.urls import path
from .views import value_addition_list

urlpatterns = [
    path("value-addition/", value_addition_list, name="value-addition-list"),
]
