from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import os
import uuid
from ultralytics import YOLO

# Load the model
model = YOLO("best.pt")

@csrf_exempt
def classify_banana(request):
    if request.method == 'POST' and 'image' in request.FILES:
        # Save uploaded image temporarily
        image = request.FILES['image']
        temp_filename = f"/tmp/{uuid.uuid4().hex}.jpg"
        with open(temp_filename, 'wb') as f:
            for chunk in image.chunks():
                f.write(chunk)

        # Run the model
        results = model(temp_filename)

        # Extract classification results
        output = []
        for result in results:
            if hasattr(result, 'probs') and result.probs is not None:
                # Get class names and probabilities
                class_names = model.names  
                probs = result.probs.data.tolist()  

                # Format probabilities
                predictions = {class_names[i]: round(probs[i], 4) for i in range(len(probs))}

                # Sort predictions by probability (highest first)
                sorted_predictions = dict(sorted(predictions.items(), key=lambda item: item[1], reverse=True))

                # Get the most confident class
                top_class = max(predictions, key=predictions.get)
                top_confidence = predictions[top_class]

                output.append({
                    "top_prediction": {"class": top_class, "confidence": top_confidence},
                    "all_predictions": sorted_predictions
                })
            else:
                output.append({"message": "No classification result"})

        # Cleanup the image
        try:
            os.remove(temp_filename)
        except FileNotFoundError:
            pass  # Ignore if file was already deleted

        return JsonResponse({"results": output})

    return JsonResponse({"error": "Invalid request"}, status=400)
