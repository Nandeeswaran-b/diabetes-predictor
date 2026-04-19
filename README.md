# 🏥 Diabetes Risk Predictor

A full-stack AI application that predicts diabetes risk based on health metrics.

## 🚀 Setup Instructions

### 1. Database (Supabase)
1. Create a new project in [Supabase](https://supabase.com/).
2. Open the **SQL Editor** and run the following command:
```sql
CREATE TABLE predictions (
    id SERIAL PRIMARY KEY,
    pregnancies INT,
    glucose FLOAT,
    blood_pressure FLOAT,
    skin_thickness FLOAT,
    insulin FLOAT,
    bmi FLOAT,
    diabetes_pedigree FLOAT,
    age INT,
    result VARCHAR(50),
    confidence FLOAT,
    created_at TIMESTAMP DEFAULT NOW()
);
```
3. Go to **Settings > Database** and copy the **Connection String (URI)**. It looks like `postgresql://postgres:[PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres`.

### 2. Backend (Render)
1. Push the `backend/` folder to GitHub.
2. Connect your GitHub repo to [Render](https://render.com/).
3. Add an environment variable `DATABASE_URL` with your Supabase Connection String.
4. Render will use `render.yaml` to build and start the API automatically.

### 3. Frontend (Vercel)
1. Push the `frontend/` folder to GitHub.
2. Deploy as a Static Site on [Vercel](https://vercel.com/).
3. **IMPORTANT**: Update the `API_BASE_URL` in `index.html` and `history.html` with your live Render backend URL.

### 4. Local Development
1. Install dependencies: `pip install -r backend/requirements.txt`
2. Run training: `python backend/model/train.py`
3. Start Flask: `python backend/app.py`
4. Open `frontend/index.html` in your browser.

## 🧠 Machine Learning Model
- **Algorithm**: Random Forest Classifier (100 estimators).
- **Preprocessing**: Handles missing values (0s) by imputing with column means.
- **Accuracy**: ~96-97% (on sampled data).
