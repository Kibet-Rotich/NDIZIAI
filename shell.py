from db.models import ValueAdditionMethod, Ingredient, MethodIngredient, SellingPlace

# Create a value addition method
chips = ValueAdditionMethod.objects.create(
    name="Banana Chips",
    description="Crispy banana slices fried in oil.",
    guide="1. Slice bananas...\n2. Fry in hot oil...\n3. Season...",
    youtube_link="https://youtube.com/example",
    time_required="2 hours",
    equipment_needed="Knife, Frying Pan, Oil"
)

# Create ingredients
salt = Ingredient.objects.create(name="Salt")
oil = Ingredient.objects.create(name="Oil")

# Link ingredients to method
MethodIngredient.objects.create(method=chips, ingredient=salt, quantity="1 tsp")
MethodIngredient.objects.create(method=chips, ingredient=oil, quantity="500ml")

# Create selling places
market = SellingPlace.objects.create(name="Local Market", location_details="Town Center")
supermarket = SellingPlace.objects.create(name="Supermarket", location_details="Retail Chain")


