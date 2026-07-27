import sys
from unittest.mock import MagicMock
sys.modules['sklearn.svm._libsvm'] = MagicMock()

import joblib
import numpy as np

model = joblib.load("model.pkl")
feature_names = list(model.feature_names_in_)
print("Number of features:", len(feature_names))

def predict_placement(student_data):
    # Construct input vector in correct order
    x = []
    for f in feature_names:
        if f in student_data:
            x.append(student_data[f])
        elif f.startswith("branch_"):
            branch_name = f.split("branch_")[1]
            x.append(1.0 if student_data.get("branch") == branch_name else 0.0)
        elif f.startswith("company_type_"):
            # If student is not placed, they don't have a company.
            # Let's see what happens if we set these to 0, or mock them.
            comp_name = f.split("company_type_")[1]
            x.append(1.0 if student_data.get("company_type") == comp_name else 0.0)
        elif f.startswith("job_role_"):
            role_name = f.split("job_role_")[1]
            x.append(1.0 if student_data.get("job_role") == role_name else 0.0)
        elif f == 'salary_lpa':
            x.append(student_data.get("salary_lpa", 0.0))
        else:
            x.append(0.0)
    
    x = np.array([x])
    pred = model.predict(x)[0]
    prob = model.predict_proba(x)[0]
    return pred, prob

# Test cases
test_student_1 = {
    "cgpa": 8.5,
    "college_tier": 2,
    "python_skill": 8,
    "dsa_skill": 8,
    "ml_skill": 7,
    "web_dev_skill": 8,
    "coding_score": 85,
    "communication_score": 80,
    "aptitude_score": 75,
    "internships": 1,
    "projects": 2,
    "backlogs": 0,
    "resume_score": 80,
    "skill_score": 85,
    "branch": "CSE"
}

print("\n--- Test 1 (salary_lpa = 0) ---")
pred, prob = predict_placement(test_student_1)
print(f"Prediction: {pred} (Placed: {'Yes' if pred == 1 else 'No'}) | Probabilities: {prob}")

print("\n--- Test 2 (salary_lpa = 5) ---")
test_student_1["salary_lpa"] = 5.0
pred, prob = predict_placement(test_student_1)
print(f"Prediction: {pred} | Probabilities: {prob}")

print("\n--- Test 3 (salary_lpa = 10) ---")
test_student_1["salary_lpa"] = 10.0
pred, prob = predict_placement(test_student_1)
print(f"Prediction: {pred} | Probabilities: {prob}")

print("\n--- Test 4 (salary_lpa = 15) ---")
test_student_1["salary_lpa"] = 15.0
pred, prob = predict_placement(test_student_1)
print(f"Prediction: {pred} | Probabilities: {prob}")

print("\n--- Test 5 (salary_lpa = 20) ---")
test_student_1["salary_lpa"] = 20.0
pred, prob = predict_placement(test_student_1)
print(f"Prediction: {pred} | Probabilities: {prob}")

# Let's scan what values of features make it placed
print("\n--- Scanning for Placement Boundary (salary_lpa = 0) ---")
# Let's try high scores but salary_lpa = 0
test_student_high = {
    "cgpa": 10.0,
    "college_tier": 1,
    "python_skill": 10,
    "dsa_skill": 10,
    "ml_skill": 10,
    "web_dev_skill": 10,
    "coding_score": 100,
    "communication_score": 100,
    "aptitude_score": 100,
    "internships": 5,
    "projects": 5,
    "backlogs": 0,
    "resume_score": 100,
    "skill_score": 100,
    "branch": "CSE",
    "salary_lpa": 0.0
}
pred, prob = predict_placement(test_student_high)
print(f"High profile, salary_lpa = 0 | Prediction: {pred} | Prob: {prob}")

# What if we set salary_lpa to 5.0?
test_student_high["salary_lpa"] = 5.0
pred, prob = predict_placement(test_student_high)
print(f"High profile, salary_lpa = 5 | Prediction: {pred} | Prob: {prob}")

# What if we set salary_lpa to 15.0?
test_student_high["salary_lpa"] = 15.0
pred, prob = predict_placement(test_student_high)
print(f"High profile, salary_lpa = 15 | Prediction: {pred} | Prob: {prob}")
