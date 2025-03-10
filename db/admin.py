from django.contrib import admin
from .models import (
    ValueAdditionMethod, Ingredient, MethodIngredient, SellingPlace, 
    MethodSellingPlace, StorageTip, MarketTrend
)

admin.site.register(ValueAdditionMethod)
admin.site.register(Ingredient)
admin.site.register(MethodIngredient)
admin.site.register(SellingPlace)
admin.site.register(MethodSellingPlace)
admin.site.register(StorageTip)
admin.site.register(MarketTrend)
