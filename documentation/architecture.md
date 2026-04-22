# Architecture

## Overview

NDIZIAI is organized as a Django monolith with modular apps:
- api app for banana image classification
- db app for value-addition knowledge retrieval
- frontend static client for user interaction

The system flow:
1. User uploads a banana image.
2. Backend classifies image ripeness using YOLO weights.
3. Frontend uses the predicted class to request value-addition methods.
4. Backend returns structured method details from SQLite.

## High-Level Components

- Django project: ndiziai/
  - Global settings, middleware, URL routing

- Classification service: api/
  - Endpoint: POST /api/classify/
  - Loads YOLO model from best.pt
  - Writes upload to a temporary file and runs inference

- Value-addition service: db/
  - Endpoint: GET /db/value-addition/
  - Filters records by ripeness stage
  - Serializes nested related data (ingredients, selling places, tips, trends)

- UI client: frontend/
  - Uploads image
  - Displays prediction and confidence
  - Fetches and renders value-addition recommendations

## Runtime Request Flow

1. Frontend submits multipart form data with image.
2. api.views.classify_banana receives POST request.
3. Uploaded file is saved in /tmp with a generated UUID filename.
4. Ultralytics YOLO model runs inference on temp file.
5. Response returns top prediction and all class probabilities.
6. Frontend extracts top_prediction.class.
7. Frontend requests db/value-addition/?ripeness_stage=<class>.
8. db.views.value_addition_list queries ValueAdditionMethod by stage.
9. Serializer returns nested relational data for display.

## Data Model (db app)

Primary entity:
- ValueAdditionMethod

Related entities:
- Ingredient
- MethodIngredient (joins method and ingredient with quantity)
- SellingPlace
- MethodSellingPlace (joins method and selling place)
- StorageTip
- MarketTrend

This enables one-to-many and many-to-many-like patterns through explicit join models.

## API Documentation Layer

Root URLs include:
- /swagger/
- /redoc/

These are configured through drf-yasg in ndiziai/urls.py.

## Key Design Decisions

- YOLO model is loaded once at module import for faster per-request inference.
- SQLite is used for easy local development and portability.
- CORS is open in current settings to simplify frontend-backend integration in development.
- Nested serializers provide a single response payload for rich UI rendering.

## Current Limitations

- classify endpoint is CSRF-exempt and has no authentication.
- No request size limits or image validation rules beyond presence of image field.
- Placeholder tests exist but do not yet validate API behavior.
- The backend app currently contains minimal placeholder code.

## Future Improvements

- Add authentication and rate limiting for API endpoints.
- Add robust validation and content-type checks for uploaded files.
- Add async/background processing for heavy inference loads.
- Expand automated tests for classification and value-addition workflows.
- Move environment-specific configuration to .env variables.