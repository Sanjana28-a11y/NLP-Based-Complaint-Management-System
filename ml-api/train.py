import pandas as pd
import string
import pickle
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

def clean_text(text):
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = text.translate(str.maketrans(' ', ' ', string.punctuation))
    text = ' '.join(text.split())
    return text

def train_model():
    dataset_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'dataset', 'complaints.csv')
    print(f"Loading dataset from: {dataset_path}")
    
    try:
        df = pd.read_csv(dataset_path)
    except FileNotFoundError:
        print("Dataset not found. Please ensure complaints.csv is in the dataset folder.")
        return

    # Preprocessing
    df.dropna(subset=['Complaint_Text', 'Category'], inplace=True)
    df.drop_duplicates(inplace=True)
    
    # We also need to predict urgency. Let's make sure it exists or infer it.
    if 'Urgency' not in df.columns:
        df['Urgency'] = 'Medium' # Default
        
    df['Clean_Text'] = df['Complaint_Text'].apply(clean_text)
    
    # Feature Engineering
    vectorizer = TfidfVectorizer(stop_words='english', max_features=1000)
    X = vectorizer.fit_transform(df['Clean_Text'])
    
    # We will train two models: one for Category, one for Urgency
    y_cat = df['Category']
    y_urg = df['Urgency']
    
    # Train Category Model
    X_train_c, X_test_c, y_train_c, y_test_c = train_test_split(X, y_cat, test_size=0.2, random_state=42)
    cat_model = LogisticRegression(max_iter=1000)
    cat_model.fit(X_train_c, y_train_c)
    acc_cat = accuracy_score(y_test_c, cat_model.predict(X_test_c))
    print(f"Category Model Accuracy: {acc_cat * 100:.2f}%")
    
    # Train Urgency Model
    X_train_u, X_test_u, y_train_u, y_test_u = train_test_split(X, y_urg, test_size=0.2, random_state=42)
    urg_model = LogisticRegression(max_iter=1000)
    urg_model.fit(X_train_u, y_train_u)
    acc_urg = accuracy_score(y_test_u, urg_model.predict(X_test_u))
    print(f"Urgency Model Accuracy: {acc_urg * 100:.2f}%")
    
    # Save Models
    import os
    model_dir = os.path.dirname(os.path.abspath(__file__))
    with open(os.path.join(model_dir, 'vectorizer.pkl'), 'wb') as f:
        pickle.dump(vectorizer, f)
        
    with open(os.path.join(model_dir, 'category_model.pkl'), 'wb') as f:
        pickle.dump(cat_model, f)
        
    with open(os.path.join(model_dir, 'urgency_model.pkl'), 'wb') as f:
        pickle.dump(urg_model, f)
        
    print("Models and vectorizer saved successfully!")

if __name__ == "__main__":
    train_model()
