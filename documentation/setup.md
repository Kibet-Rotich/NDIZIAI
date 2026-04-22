# Setup Guide

This guide explains how to run NDIZIAI locally for development and testing.

## Prerequisites

- Linux, macOS, or Windows
- Python 3.10+
- pip
- Virtual environment tool (venv recommended)

## 1. Clone Project

git clone https://github.com/Kibet-Rotich/NDIZIAI.git
cd NDIZIAI

## 2. Create Virtual Environment

Linux/macOS:

python3 -m venv .venv
source .venv/bin/activate

Windows (PowerShell):

python -m venv .venv
.venv\Scripts\Activate.ps1

## 3. Install Dependencies

pip install -r requirements.txt

Note:
- The URL configuration uses drf-yasg for Swagger/ReDoc routes.
- If not present in your environment, install it with:
  pip install drf-yasg

## 4. Apply Database Migrations

python manage.py migrate

## 5. Start Development Server

python manage.py runserver

Server default:
- http://127.0.0.1:8000

## 6. Access the Frontend Demo

Open frontend/index.html in your browser.

The demo sends requests to:
- http://127.0.0.1:8000/api/classify/
- http://127.0.0.1:8000/db/value-addition/

## 7. API Docs

- Swagger: http://127.0.0.1:8000/swagger/
- ReDoc: http://127.0.0.1:8000/redoc/

## Common Setup Issues

## ImportError: ultralytics or torch
- Ensure dependencies were installed in the active virtual environment.
- Re-run pip install -r requirements.txt.

## API classify endpoint fails on startup
- Confirm best.pt exists at the project root.
- The model is loaded during module import in api/views.py.

## CORS issues in browser
- Development settings currently allow all origins.
- If changed, ensure frontend origin is whitelisted.

## Missing value-addition results
- The endpoint returns 404 when no matching records exist for a stage.
- Seed your SQLite database with ValueAdditionMethod records.