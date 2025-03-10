from rest_framework import serializers
from .models import ValueAdditionMethod, MethodIngredient, Ingredient, MethodSellingPlace, SellingPlace, StorageTip, MarketTrend


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ["name"]


class MethodIngredientSerializer(serializers.ModelSerializer):
    ingredient = IngredientSerializer()  # Nest ingredient details

    class Meta:
        model = MethodIngredient
        fields = ["ingredient", "quantity"]


class SellingPlaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellingPlace
        fields = ["name", "location_details"]


class MethodSellingPlaceSerializer(serializers.ModelSerializer):
    selling_place = SellingPlaceSerializer()  # Nest selling place details

    class Meta:
        model = MethodSellingPlace
        fields = ["selling_place"]


class StorageTipSerializer(serializers.ModelSerializer):
    class Meta:
        model = StorageTip
        fields = ["tips"]


class MarketTrendSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketTrend
        fields = ["trend_analysis"]


class ValueAdditionMethodSerializer(serializers.ModelSerializer):
    ingredients = MethodIngredientSerializer(source="methodingredient_set", many=True, read_only=True)
    selling_places = MethodSellingPlaceSerializer(source="methodsellingplace_set", many=True, read_only=True)
    storage_tips = StorageTipSerializer(source="storagetip_set", many=True, read_only=True)
    market_trends = MarketTrendSerializer(source="markettrend_set", many=True, read_only=True)

    class Meta:
        model = ValueAdditionMethod
        fields = [
            "id", "name", "description", "guide", "youtube_link", "time_required",
            "equipment_needed", "category", "ripeness_stage",
            "ingredients", "selling_places", "storage_tips", "market_trends"
        ]
