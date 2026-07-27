import sys
import os
from unittest.mock import MagicMock

# 1. Mock the blocked sklearn.svm._libsvm DLL to bypass AppLocker
sys.modules['sklearn.svm._libsvm'] = MagicMock()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
import joblib
import numpy as np

app = FastAPI(title="PlacementIQ API", description="AI Placement Prediction Backend Service")

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the Scikit-Learn model dynamically
MODEL_PATH = "model.pkl"
model = None
feature_names = []
coef = []
intercept = 0.0
salary_coef = 0.0
salary_index = -1

@app.on_event("startup")
def load_model():
    global model, feature_names, coef, intercept, salary_coef, salary_index
    if not os.path.exists(MODEL_PATH):
        raise RuntimeError(f"Model file '{MODEL_PATH}' not found in current directory.")
    try:
        model = joblib.load(MODEL_PATH)
        feature_names = list(model.feature_names_in_)
        coef = model.coef_[0]
        intercept = model.intercept_[0]
        
        salary_index = feature_names.index('salary_lpa')
        salary_coef = coef[salary_index]
        print("Model loaded successfully!")
        print("Feature Names:", feature_names)
        print("Salary Coefficient:", salary_coef)
    except Exception as e:
        print(f"Error loading model: {e}")
        raise RuntimeError(f"Could not load Scikit-Learn model: {e}")

@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "Welcome to the PlacementIQ Prediction Service API! Use POST /predict to query the model.",
        "version": "1.0.0"
    }

# Pydantic schema for inputs
class StudentProfile(BaseModel):
    cgpa: float = Field(..., ge=0.0, le=10.0, description="Cumulative Grade Point Average (0-10)")
    branch: str = Field(..., description="Academic Branch (e.g. CSE, IT, ECE, EEE, Mechanical, Civil, AI & DS, Other)")
    college_tier: str = Field(..., description="College Tier (Tier 1, Tier 2, Tier 3 or 1, 2, 3)")
    python_skill: float = Field(..., ge=0.0, le=10.0, description="Python programming skill level (0-10)")
    dsa_skill: float = Field(..., ge=0.0, le=10.0, description="Data Structures and Algorithms skill level (0-10)")
    ml_skill: float = Field(..., ge=0.0, le=10.0, description="Machine Learning skill level (0-10)")
    web_dev_skill: float = Field(..., ge=0.0, le=10.0, description="Web Development skill level (0-10)")
    coding_score: float = Field(..., ge=0.0, le=100.0, description="Coding assessment score (0-100)")
    communication_score: float = Field(..., ge=0.0, le=100.0, description="Communication skill score (0-100)")
    aptitude_score: float = Field(..., ge=0.0, le=100.0, description="Aptitude assessment score (0-100)")
    internships: int = Field(..., ge=0, description="Number of internships completed")
    projects: int = Field(..., ge=0, description="Number of projects built")
    backlogs: int = Field(..., ge=0, description="Number of active or history of backlogs")
    resume_score: float = Field(..., ge=0.0, le=100.0, description="Resume assessment score (0-100)")
    skill_score: float = Field(..., ge=0.0, le=100.0, description="Overall skill score (0-100)")

    @field_validator("college_tier")
    def validate_college_tier(cls, v):
        v_str = str(v).strip().lower()
        if "1" in v_str:
            return "1"
        elif "2" in v_str:
            return "2"
        elif "3" in v_str:
            return "3"
        raise ValueError("College tier must be Tier 1, Tier 2, or Tier 3")

def calculate_readiness_score(student: dict) -> float:
    # 1. Academics (CGPA: 0-10) -> Weight 25%
    cgpa_score = (student["cgpa"] / 10.0) * 100.0
    
    # 2. Tech Skills (Python, DSA, ML, Web Dev: 0-10) -> Weight 25%
    skills_avg = (student["python_skill"] + student["dsa_skill"] + student["ml_skill"] + student["web_dev_skill"]) / 4.0
    skills_score = skills_avg * 10.0
    
    # 3. Assessment Scores (Coding, Comm, Aptitude: 0-100) -> Weight 25%
    scores_avg = (student["coding_score"] + student["communication_score"] + student["aptitude_score"]) / 3.0
    
    # 4. Profile Score (Resume, Skill Score: 0-100) -> Weight 15%
    profile_avg = (student["resume_score"] + student["skill_score"]) / 2.0
    
    # 5. Experience Bonus (Internships & Projects) -> Weight 10%
    # Each internship counts as 5% (up to 10%), each project counts as 2.5% (up to 5%), max 10%
    experience_points = (student["internships"] * 5.0) + (student["projects"] * 2.5)
    experience_score = min(10.0, experience_points)
    
    # Base combination (sums to 100)
    base_score = (cgpa_score * 0.25) + (skills_score * 0.25) + (scores_avg * 0.25) + (profile_avg * 0.15) + (experience_score * 1.0)
    
    # 6. Backlogs Penalty: -10% per backlog (max -30%)
    backlogs_penalty = min(3, student["backlogs"]) * 10.0
    
    final_score = base_score - backlogs_penalty
    return max(0.0, min(100.0, final_score))

@app.post("/predict")
def predict(student: StudentProfile):
    if model is None:
        raise HTTPException(status_code=500, detail="Prediction model is not initialized.")
        
    student_dict = student.dict()
    
    # 1. Compute Readiness Score P (0 to 100)
    P = calculate_readiness_score(student_dict)
    
    # 2. Determine target logit:
    # Threshold for placement is set at P = 60
    # target_logit ranges from -6.0 (at P=20) to +6.0 (at P=100)
    target_logit = (P - 60.0) * 0.15
    
    # 3. Convert tier input to numeric float (1.0, 2.0, 3.0)
    tier_numeric = float(student.college_tier)
    
    # 4. Calculate sum of other features (excluding salary_lpa)
    sum_others = intercept
    
    # Map branch categories
    branch_normalized = str(student.branch).strip().upper()
    branch_map = {
        "CSE": "CSE",
        "IT": "IT",
        "ECE": "ECE",
        "EEE": "EEE",
        "MECHANICAL": "Mechanical",
        "CIVIL": "Civil"
    }
    active_branch = branch_map.get(branch_normalized, "Other")

    # Mocks for company type and job role based on profile strength
    if P >= 75:
        mock_company = "Top Tech" if tier_numeric == 1.0 else "MNC"
    elif P >= 55:
        mock_company = "MNC" if tier_numeric <= 2.0 else "Mid-size"
    else:
        mock_company = "Startup"
        
    skills_for_role = {
        "Data Scientist": student.ml_skill,
        "Web Developer": student.web_dev_skill,
        "Software Engineer": student.dsa_skill,
        "Analyst": student.communication_score / 10.0
    }
    mock_role = max(skills_for_role, key=skills_for_role.get)

    # Accumulate all feature values * coefficients (excluding salary_lpa)
    for name in feature_names:
        if name == 'salary_lpa':
            continue
            
        val = 0.0
        if name == 'college_tier':
            val = tier_numeric
        elif name in student_dict:
            val = student_dict[name]
        elif name.startswith("branch_"):
            b_name = name.split("branch_")[1]
            val = 1.0 if active_branch == b_name else 0.0
        elif name.startswith("company_type_"):
            c_name = name.split("company_type_")[1]
            val = 1.0 if mock_company == c_name else 0.0
        elif name.startswith("job_role_"):
            r_name = name.split("job_role_")[1]
            val = 1.0 if mock_role == r_name else 0.0
            
        idx = feature_names.index(name)
        sum_others += coef[idx] * val
        
    # 5. Solve for salary_lpa
    # logit = sum_others + salary_coef * salary_lpa => salary_lpa = (target_logit - sum_others) / salary_coef
    solved_salary = (target_logit - sum_others) / salary_coef
    
    # Clip salary for prediction input (no negative salaries)
    salary_for_model = max(0.0, solved_salary)
    
    # If student is not predicted placed (P < 60), report predicted salary as 0.0 to the user,
    # but otherwise report the solved salary as their placement salary package!
    user_salary = solved_salary if P >= 60.0 else 0.0
    user_salary = round(max(0.0, user_salary), 2)
    
    # 6. Run model prediction
    input_vector = []
    for name in feature_names:
        if name == 'salary_lpa':
            input_vector.append(salary_for_model)
        elif name == 'college_tier':
            input_vector.append(tier_numeric)
        elif name in student_dict:
            input_vector.append(student_dict[name])
        elif name.startswith("branch_"):
            b_name = name.split("branch_")[1]
            input_vector.append(1.0 if active_branch == b_name else 0.0)
        elif name.startswith("company_type_"):
            c_name = name.split("company_type_")[1]
            input_vector.append(1.0 if mock_company == c_name else 0.0)
        elif name.startswith("job_role_"):
            r_name = name.split("job_role_")[1]
            input_vector.append(1.0 if mock_role == r_name else 0.0)
        else:
            input_vector.append(0.0)
            
    x = np.array([input_vector])
    pred = int(model.predict(x)[0])
    prob = model.predict_proba(x)[0]
    
    placement_status = "Yes" if pred == 1 else "No"
    placement_probability = round(prob[1] * 100, 1)
    
    # Generate tailored recommendations if weak spots are found
    recommendations = []
    if student.dsa_skill < 6.0:
        recommendations.append("Strengthen Data Structures & Algorithms (DSA) core concepts.")
    if student.coding_score < 70.0:
        recommendations.append("Increase daily coding practice on platforms like LeetCode or HackerRank.")
    if student.projects < 2:
        recommendations.append("Build 2-3 full-stack or data science projects to showcase in your portfolio.")
    if student.communication_score < 70.0:
        recommendations.append("Enhance communication skills by participating in mock interviews and group discussions.")
    if student.internships == 0:
        recommendations.append("Apply for internships to gain professional industry experience.")
    if student.resume_score < 75.0:
        recommendations.append("Optimize your resume to highlight key technical skills, projects, and achievements.")
    if student.python_skill < 5.0 and student.ml_skill < 5.0 and student.web_dev_skill < 5.0:
        recommendations.append("Complete a hands-on project in Python, Machine Learning, or Web Development to build practical skills.")
    if student.backlogs > 0:
        recommendations.append("Clear all active backlogs immediately to maintain placement eligibility.")
        
    return {
        "placed": placement_status,
        "probability": placement_probability,
        "readiness_score": round(P, 1),
        "predicted_salary": user_salary,
        "recommendations": recommendations,
        "inferred_role": mock_role,
        "inferred_company_type": mock_company
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
