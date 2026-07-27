# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


# PlacementIQ – AI Placement Prediction Platform

PlacementIQ is an AI-powered placement prediction platform that analyzes a student's skills, academic performance, projects, internships, and profile strength to estimate their placement eligibility and provide personalized recommendations.

## 🚀 Features

- 🤖 AI-powered placement prediction
- 📊 Skill assessment and performance analysis
- 📄 Resume/profile evaluation
- 🎯 Placement readiness analysis
- 💡 Personalized recommendations
- 📈 Interactive prediction results and charts
- 🧠 Machine Learning-based prediction model
- ⚡ React + Vite frontend
- 🔗 FastAPI backend

## 🛠️ Technologies Used

### Frontend
- React.js
- Vite
- JavaScript
- Tailwind CSS
- Recharts

### Backend
- Python
- FastAPI
- Pydantic
- NumPy

### Machine Learning
- Scikit-learn
- Pickle (.pkl) model

## 📂 Project Structure

```text
PlacementIQ/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   ├── package.json
│   └── package-lock.json
│
├── main.py
├── model.pkl
├── requirements.txt
├── test_prediction.py
├── test_dynamic_salary.py
├── verify_backend.py
├── README.md
└── .gitignore




Installation & Setup
1. Clone the Repository
git clone https://github.com/YOUR-USERNAME/PlacementIQ.git
cd PlacementIQ
2. Set Up the Python Backend
Create a virtual environment:
python -m venv venv
Activate the virtual environment on Windows:
venv\Scripts\activate
Install the required Python packages:
pip install -r requirements.txt
3. Start the Backend
Run:
uvicorn main:app --reload
The backend will run at:
http://127.0.0.1:8000
4. Set Up the Frontend
Open a new terminal and go to the frontend folder:
cd frontend
Install the Node.js dependencies:
npm install
Start the frontend:
npm run dev
The frontend will be available at the local URL shown in the terminal, usually:
http://localhost:5173
🧪 Testing
The project contains Python scripts for testing and verification:
python test_prediction.py
python test_dynamic_salary.py
python verify_backend.py
📌 How It Works
The user enters their academic and professional details.
The system collects information about skills, projects, internships, and other profile factors.
The backend processes the input data.
The trained Machine Learning model predicts placement chances.
The platform displays the prediction and placement readiness results.
The system provides recommendations to improve the user's placement preparation.
🎯 Future Enhancements
Add more Machine Learning algorithms
Improve prediction accuracy with a larger dataset
Add user authentication
Add resume upload and automated resume analysis
Add personalized learning roadmaps
Deploy the application online
Add a database for storing user profiles and results
👩‍💻 Author
Developed by Likitha
📄 License
This project is created for educational and internship purposes.

### One important suggestion for your GitHub upload

Since your project has a **React frontend + Python backend**, your repository should ideally contain:

✅ `frontend/`  
✅ `main.py`  
✅ `model.pkl` *(if it's necessary for the application to run)*  
✅ `requirements.txt`  
✅ `test_prediction.py`  
✅ `test_dynamic_salary.py`  
✅ `verify_backend.py`  
✅ `README.md`  
✅ `.gitignore`

You **don't need to upload**:

❌ `node_modules/`  
❌ `__pycache__/`  
❌ `.pyc` files  
❌ `.env` files containing passwords/API keys  
❌ Temporary/debug files that aren't useful to someone running the project

For your project, I would **keep the testing files** because they demonstrate that you tested your backend and ML prediction system. You can leave out files like `inspect_model.py`, `inspect_pickle.py`, and `print_coef.py` if they were only used during development/debugging.
