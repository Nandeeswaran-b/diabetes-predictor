from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import psycopg2
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Load model and scaler
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model/model.pkl')
SCALER_PATH = os.path.join(os.path.dirname(__file__), 'model/scaler.pkl')

model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

DATABASE_URL = os.environ.get("DATABASE_URL")

def get_db_connection():
    if not DATABASE_URL:
        return None
    try:
        conn = psycopg2.connect(DATABASE_URL)
        return conn
    except Exception as e:
        print(f"Error connecting to database: {e}")
        return None

@app.route('/', methods=['GET'])
def home():
    return jsonify({"status": "running", "message": "Diabetes Predictor API is active"})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        
        # Extract features in order
        features = [
            float(data['pregnancies']),
            float(data['glucose']),
            float(data['blood_pressure']),
            float(data['skin_thickness']),
            float(data['insulin']),
            float(data['bmi']),
            float(data['diabetes_pedigree']),
            float(data['age'])
        ]
        
        # Scale and predict
        features_scaled = scaler.transform([features])
        prediction = model.predict(features_scaled)[0]
        confidence = np.max(model.predict_proba(features_scaled)) * 100
        
        result_text = "High Risk of Diabetes" if prediction == 1 else "Low Risk of Diabetes"
        
        # Save to Supabase
        conn = get_db_connection()
        user_id = data.get('user_id') # Get user_id if provided

        if conn:
            cur = conn.cursor()
            query = """
                INSERT INTO predictions (pregnancies, glucose, blood_pressure, skin_thickness, insulin, bmi, diabetes_pedigree, age, result, confidence, user_id)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cur.execute(query, (
                data['pregnancies'], data['glucose'], data['blood_pressure'],
                data['skin_thickness'], data['insulin'], data['bmi'],
                data['diabetes_pedigree'], data['age'], result_text, confidence, user_id
            ))
            conn.commit()
            cur.close()
            conn.close()
        
        return jsonify({
            "result": result_text,
            "confidence": round(float(confidence), 2)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/history', methods=['GET'])
def history():
    user_id = request.args.get('user_id') # Get user_id from query params

    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection not configured. Set DATABASE_URL env var."}), 500
    
    try:
        cur = conn.cursor()
        if user_id:
            cur.execute("SELECT id, glucose, bmi, age, result, confidence, created_at FROM predictions WHERE user_id = %s ORDER BY created_at DESC", (user_id,))
        else:
            cur.execute("SELECT id, glucose, bmi, age, result, confidence, created_at FROM predictions ORDER BY created_at DESC")
        
        rows = cur.fetchall()
        
        history_data = []
        for row in rows:
            history_data.append({
                "id": row[0],
                "glucose": row[1],
                "bmi": row[2],
                "age": row[3],
                "result": row[4],
                "confidence": row[5],
                "timestamp": row[6].strftime("%Y-%m-%d %H:%M:%S")
            })
        
        cur.close()
        conn.close()
        return jsonify(history_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
