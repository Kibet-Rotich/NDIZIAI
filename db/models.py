from django.db import models

class ValueAdditionMethod(models.Model):
    RIPENESS_CHOICES = [
        ("unripe", "Unripe"),
        ("ripe", "Ripe"),
        ("overripe", "Overripe"),
        ("rotten", "Rotten"),
    ]

    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    guide = models.TextField()
    youtube_link = models.URLField(blank=True, null=True)
    time_required = models.CharField(max_length=100, blank=True, null=True)  # e.g., "2 hours"
    equipment_needed = models.TextField(blank=True, null=True)  # Comma-separated list
    category = models.CharField(max_length=50, choices=[
        ("snacks", "Snacks"),
        ("beverages", "Beverages"),
        ("baking", "Baking"),
        ("animal_feed", "Animal Feed"),
        ("fertilizer", "Fertilizer"),
        ("other", "Other"),
    ], default="other")
    ripeness_stage = models.CharField(max_length=20, choices=RIPENESS_CHOICES, default="ripe")

    def __str__(self):
        return self.name



class Ingredient(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name


class MethodIngredient(models.Model):
    method = models.ForeignKey(ValueAdditionMethod, on_delete=models.CASCADE)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    quantity = models.CharField(max_length=100, blank=True, null=True)  # e.g., "1 tsp", "500ml"

    def __str__(self):
        return f"{self.ingredient.name} for {self.method.name}"


class SellingPlace(models.Model):
    name = models.CharField(max_length=255, unique=True)
    location_details = models.TextField(blank=True, null=True)  # Physical address or website

    def __str__(self):
        return self.name


class MethodSellingPlace(models.Model):
    method = models.ForeignKey(ValueAdditionMethod, on_delete=models.CASCADE)
    selling_place = models.ForeignKey(SellingPlace, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.method.name} sold at {self.selling_place.name}"


class StorageTip(models.Model):
    method = models.ForeignKey(ValueAdditionMethod, on_delete=models.CASCADE)
    tips = models.TextField()

    def __str__(self):
        return f"Storage Tips for {self.method.name}"


class MarketTrend(models.Model):
    method = models.ForeignKey(ValueAdditionMethod, on_delete=models.CASCADE)
    trend_analysis = models.TextField()

    def __str__(self):
        return f"Market Trend for {self.method.name}"
