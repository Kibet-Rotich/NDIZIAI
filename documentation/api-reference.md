# API Reference

Base URL (local development):
- http://127.0.0.1:8000

## Authentication

Current endpoints are publicly accessible and do not require authentication.

## Content Types

- Classification endpoint expects multipart/form-data.
- Value-addition endpoint uses query parameters and returns JSON.

## 1) Classify Banana Image

Endpoint:
- POST /api/classify/

Description:
- Uploads an image and returns the top class with confidence plus full probability scores.

Request:
- Method: POST
- Body type: multipart/form-data
- Required field:
  - image: image file

Example curl:

curl -X POST http://127.0.0.1:8000/api/classify/ \
  -F "image=@/path/to/banana.jpg"

Success response (200):

{
  "results": [
    {
      "top_prediction": {
        "class": "ripe",
        "confidence": 0.9821
      },
      "all_predictions": {
        "ripe": 0.9821,
        "overripe": 0.0132,
        "unripe": 0.0036,
        "rotten": 0.0011
      }
    }
  ]
}

Error response (400):

{
  "error": "Invalid request"
}

Notes:
- If no classification probabilities are returned by the model output, response may include:
  - { "message": "No classification result" }

## 2) Get Value-Addition Methods

Endpoint:
- GET /db/value-addition/

Description:
- Returns value-addition methods filtered by ripeness stage.

Query parameters:
- ripeness_stage (required)
  - expected values: unripe, ripe, overripe, rotten

Example request:

curl "http://127.0.0.1:8000/db/value-addition/?ripeness_stage=ripe"

Success response (200):

{
  "results": [
    {
      "id": 1,
      "name": "Banana Chips",
      "description": "Thin sliced bananas fried until crispy.",
      "guide": "Peel, slice, season, fry, and cool.",
      "youtube_link": "https://example.com/video",
      "time_required": "45 minutes",
      "equipment_needed": "Knife, Frying pan, Oil",
      "category": "snacks",
      "ripeness_stage": "ripe",
      "ingredients": [
        {
          "ingredient": { "name": "Banana" },
          "quantity": "4 pieces"
        }
      ],
      "selling_places": [
        {
          "selling_place": {
            "name": "Local Market",
            "location_details": "Town center"
          }
        }
      ],
      "storage_tips": [
        { "tips": "Store in an airtight container." }
      ],
      "market_trends": [
        { "trend_analysis": "High weekend demand." }
      ]
    }
  ]
}

Validation error (400):

{
  "error": "Ripeness stage is required"
}

No results (404):

{
  "message": "No records found for this ripeness stage."
}

## 3) Interactive API Documentation

- GET /swagger/ : Swagger UI
- GET /redoc/ : ReDoc UI

## Data Fields Returned By Value-Addition API

ValueAdditionMethod fields:
- id
- name
- description
- guide
- youtube_link
- time_required
- equipment_needed
- category
- ripeness_stage
- ingredients (nested)
- selling_places (nested)
- storage_tips (nested)
- market_trends (nested)

## Error Handling Summary

- 200: Request successful
- 400: Invalid request or missing required query parameter
- 404: No matching value-addition records found

## Integration Notes

- Frontend currently assumes classify response has at least one result.
- For robustness, clients should handle empty or malformed result arrays.
- Endpoint URLs in frontend/script.js are hardcoded to localhost.