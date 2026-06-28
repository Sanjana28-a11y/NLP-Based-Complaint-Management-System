from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import string
import os

app = Flask(__name__)
CORS(app)

# Load Models
try:
    model_dir = os.path.dirname(os.path.abspath(__file__))
    with open(os.path.join(model_dir, 'vectorizer.pkl'), 'rb') as f:
        vectorizer = pickle.load(f)
    with open(os.path.join(model_dir, 'category_model.pkl'), 'rb') as f:
        cat_model = pickle.load(f)
    with open(os.path.join(model_dir, 'urgency_model.pkl'), 'rb') as f:
        urg_model = pickle.load(f)
    print("Models loaded successfully.")
except FileNotFoundError:
    print("Model files not found. Please run train.py first.")
    vectorizer = None

def clean_text(text):
    text = text.lower()
    text = text.translate(str.maketrans(' ', ' ', string.punctuation))
    text = ' '.join(text.split())
    return text

@app.route('/')
def home():
    return "Smart Complaint Analyzer ML API is running. Please go to the React app (typically http://localhost:5173) in your browser to view the UI!"

@app.route('/predict', methods=['POST'])
def predict():
    if not vectorizer:
        return jsonify({"error": "Models not loaded. Train the model first."}), 500
        
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({"error": "No text provided"}), 400
        
    raw_text = data['text']
    processed_text = clean_text(raw_text)
    
    # Vectorize
    X = vectorizer.transform([processed_text])
    
    # Predict
    category = cat_model.predict(X)[0]
    urgency = urg_model.predict(X)[0]
    
    # In some datasets, we might get generic outputs if dataset is small.
    # To improve demo presentation, we compute generic confidence (mock if needed)
    
    return jsonify({
        "category": str(category),
        "urgency": str(urgency),
        "processed_text": processed_text
    })

if __name__ == "__main__":
    app.run(port=5000, debug=True)
