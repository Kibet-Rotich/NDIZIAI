from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
import torch
from PIL import Image
import io

# Load YOLO model
model = torch.hub.load('ultralytics/yolov5', 'custom', path='best.pt', force_reload=True)

class PredictView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        file = request.FILES['image']
        
        # Convert file to PIL Image
        img = Image.open(file)
        
        # Perform prediction
        results = model(img)
        
        # Format results
        response_data = results.pandas().xyxy[0].to_dict(orient="records")

        return Response({"predictions": response_data})
