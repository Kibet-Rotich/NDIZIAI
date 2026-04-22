# NDIZIAI

AI-powered banana ripeness classification with value-addition recommendations.

This project combines:
- A Django + Django REST Framework backend
- A YOLO model for banana ripeness classification
- A simple frontend for image upload and result display
- A value-addition knowledge base stored in SQLite

## What The System Does

1. Accepts a banana image upload.
2. Classifies the banana stage (for example: unripe, ripe, overripe, rotten).
3. Returns prediction confidence scores.
4. Retrieves value-addition methods for the predicted ripeness stage.

## Tech Stack

- Backend: Django, Django REST Framework
- AI inference: Ultralytics YOLO
- Database: SQLite
- Frontend: HTML, Tailwind CSS (CDN), JavaScript
- API docs UI: Swagger / ReDoc via drf-yasg

## Project Structure

NDIZIAI/
- api/ : Classification endpoint and model inference logic
- db/ : Value-addition models, serializers, and API endpoint
- backend/ : Placeholder app (currently minimal)
- ndiziai/ : Django project settings and root URLs
- frontend/ : Static frontend demo (HTML/CSS/JS)
- dataset/ : Training/validation/test image dataset
- best.pt : Trained YOLO weights file used by inference
- manage.py : Django management entry point
- requirements.txt : Python dependencies
- documentation/ : Detailed technical documentation

## Quick Start

1. Create and activate a virtual environment.
2. Install dependencies:
	 pip install -r requirements.txt
3. Run migrations:
	 python manage.py migrate
4. Start server:
	 python manage.py runserver
5. Open frontend demo:
	 Open frontend/index.html in a browser.

Default API base URL:
- http://127.0.0.1:8000

## Main API Endpoints

- POST /api/classify/
	Upload an image file under form key image.

- GET /db/value-addition/?ripeness_stage=<stage>
	Fetch value-addition methods for a ripeness stage.

- GET /swagger/
	Interactive Swagger API docs.

- GET /redoc/
	ReDoc API documentation UI.

## Detailed Documentation

- Setup guide: documentation/setup.md
- Architecture: documentation/architecture.md
- API reference: documentation/api-reference.md

## Notes

- The model weights file best.pt is loaded from the project root.
- CORS is currently open for all origins in development settings.
- Current test files are placeholders and should be expanded for production readiness.
