# Banana Ripeness Classification & Value Addition

## 📌 Project Overview
This project aims to classify banana ripeness stages using AI and provide value addition recommendations. It consists of four main modules:
- **Frontend**: A user-friendly interface for uploading images and viewing results.
- **Backend**: Handles API requests and business logic.
- **AI Module**: Uses YOLOv8 to classify banana ripeness.
- **Database Module**: Stores classification results and value addition data.

## 🔧 Tech Stack
- **AI Model**: YOLOv8 (Ultralytics)
- **Backend**: Django REST Framework
- **Frontend**: Html, css & JS
- **Database**: PostgreSQL
- **Deployment**: Google Colab (for training), Docker (for API deployment)

## 📂 Folder Structure
```
banana_ripeness_classification/
│-- frontend/        # frontend
│-- backend/         # Django backend
│-- ai/       # YOLOv8 training and inference
│-- database/        # PostgreSQL setup
│-- README.md        # Project documentation
```

## ⚙️ Installation & Setup
### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Kibet-Rotich/NDIZIAI.git 
cd ndiziai
```
### 2️⃣ Set Up Backend
```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## 🏋️‍♂️ Training the Model
- **Dataset**: Images of bananas labeled in different ripeness stages.
- **Training**: Run on Google Colab using YOLOv8 lightweight models.
- **Optimization**: Using mixed precision, reduced image size, and batch normalization.

## 🚀 API Usage
- **POST /classify** → Upload an image and get ripeness stage.
- **GET /recommendations** → Get value addition suggestions for classified ripeness.

## 👨‍💻 Contributors
- **AI Module**: @rotich Kibet
- **Backend**: @Meshack
- **Frontend**: @Mike
- **Database**: @Christine
