# NLP-Based Complaint Management System

An intelligent Complaint Management System that uses **Natural Language Processing (NLP)** and **Machine Learning** to automatically classify user complaints into appropriate categories and determine their urgency level. The system provides a user-friendly web interface for complaint submission and efficient complaint management.

---

## Features

- User-friendly complaint submission interface
- Automatic complaint category classification
- Urgency prediction (Low, Medium, High)
- NLP-based text preprocessing
- Machine Learning models for prediction
- React frontend
- Node.js & Express backend
- Separate ML API for model inference
- Organized complaint management

---

## Tech Stack

### Frontend
- React.js
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js

### Machine Learning
- Python
- Scikit-learn
- Pandas
- NumPy
- Pickle

### NLP
- TF-IDF Vectorization
- Text Preprocessing
- Tokenization

---

## Project Structure

```
NLP-Based-Complaint-Management-System
│
├── client/                 # React Frontend
├── server/                 # Node.js Backend
├── ml-api/                 # Machine Learning API
├── dataset/                # Dataset used for training
│
├── vectorizer.pkl          # TF-IDF Vectorizer
├── category_model.pkl      # Category Prediction Model
├── urgency_model.pkl       # Urgency Prediction Model
│
└── README.md
```

---

## Workflow

1. User submits a complaint.
2. Complaint text is sent to the ML API.
3. NLP preprocessing is performed.
4. TF-IDF Vectorizer converts text into numerical features.
5. Category prediction model predicts the complaint category.
6. Urgency model predicts complaint priority.
7. Results are displayed on the frontend and stored by the backend.

---

## Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/NLP-Based-Complaint-Management-System.git
cd NLP-Based-Complaint-Management-System
```

---

### Install Frontend

```bash
cd client
npm install
npm start
```

---

### Install Backend

```bash
cd server
npm install
npm start
```

---

### Install ML API

```bash
cd ml-api

pip install -r requirements.txt

python app.py
```

---

## Technologies Used

- React
- Node.js
- Express
- Python
- Scikit-learn
- NLP
- TF-IDF
- Pickle
- REST APIs

---

## Machine Learning Models

### Category Classification
Predicts the category of the complaint such as:
- Academic
- Hostel
- Transport
- Administration
- Others

### Urgency Prediction
Predicts complaint urgency:
- Low
- Medium
- High

---

## Future Enhancements

- User Authentication
- Admin Dashboard
- Complaint Tracking
- Email Notifications
- Sentiment Analysis
- Deep Learning Models (BERT)
- MongoDB Integration
- Deployment on Cloud
