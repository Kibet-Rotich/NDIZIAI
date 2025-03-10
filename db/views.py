from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import ValueAdditionMethod
from .serializers import ValueAdditionMethodSerializer


@api_view(["GET"])
def value_addition_list(request):
    ripeness_stage = request.GET.get("ripeness_stage", None)

    if not ripeness_stage:
        return Response({"error": "Ripeness stage is required"}, status=400)

    # Fetch matching records from the database
    records = ValueAdditionMethod.objects.filter(ripeness_stage__iexact=ripeness_stage)

    if not records.exists():
        return Response({"message": "No records found for this ripeness stage."}, status=404)

    # Serialize the records with nested data
    serializer = ValueAdditionMethodSerializer(records, many=True)
    return Response({"results": serializer.data})
