import sys
from unittest.mock import MagicMock
sys.modules['sklearn.svm._libsvm'] = MagicMock()

import joblib
import numpy as np

model = joblib.load("model.pkl")
feature_names = list(model.feature_names_in_)
coef = model.coef_[0]
intercept = model.intercept_[0]

def compute_readiness_score(student):
    # Normalized academic (CGPA is 0 to 10)
    cgpa_score = (student["cgpa"] / 10.0) * 100.0
    
    # Skills (Python, DSA, ML, Web Dev are 0 to 10)
    skills_avg = (student["python_skill"] + student["dsa_skill"] + student["ml_skill"] + student["web_dev_skill"]) / 4.0
    skills_score = skills_avg * 10.0
    
    # Scores (Coding, Comm, Aptitude are 0 to 100)
    scores_avg = (student["coding_score"] + student["communication_score"] + student["aptitude_score"]) / 3.0
    
    # Resume and Skill Score (0 to 100)
    profile_avg = (student["resume_score"] + student["skill_score"]) / 2.0
    
    # Internships and Projects bonus
    experience_bonus = min(3, student["internships"]) * 10.0 + min(3, student["projects"]) * 5.0
    # Backlogs penalty
    backlogs_penalty = min(3, student["backlogs"]) * 15.0
    
    # Weight combination:
    # Academics: 20%, Technical Skills: 25%, Assessment Scores: 30%, Profile: 25%
    base_score = (cgpa_score * 0.20) + (skills_score * 0.25) + (scores_avg * 0.30) + (profile_avg * 0.25)
    
    final_score = base_score + experience_bonus - backlogs_penalty
    final_score = max(0.0, min(100.0, final_score))
    return final_score

def predict_with_solver(student):
    # Calculate readiness score
    P = compute_readiness_score(student)
    
    # We want logit to range from -4.0 (for P=0) to +4.0 (for P=100)
    # Let's say target_logit = (P - 55) * 0.15
    # If P = 55, logit = 0 (prob = 0.5)
    # If P = 80, logit = 25 * 0.15 = 3.75 (prob = 0.977)
    # If P = 40, logit = -15 * 0.15 = -2.25 (prob = 0.095)
    target_logit = (P - 55.0) * 0.15
    
    # Construct input vector (excluding salary_lpa)
    # Calculate sum_others
    sum_others = intercept
    for name in feature_names:
        if name == 'salary_lpa':
            continue
        
        # Determine value
        val = 0.0
        if name in student:
            val = student[name]
        elif name.startswith("branch_"):
            branch_name = name.split("branch_")[1]
            val = 1.0 if student.get("branch") == branch_name else 0.0
        elif name.startswith("company_type_"):
            # Mock based on college tier and profile
            comp_name = name.split("company_type_")[1]
            # Top profiles get Top Tech/MNC, lower profiles get Startup/Mid-size
            if P >= 75:
                preferred = "Top Tech" if student.get("college_tier") == 1 else "MNC"
            elif P >= 55:
                preferred = "MNC" if student.get("college_tier") <= 2 else "Mid-size"
            else:
                preferred = "Startup"
            val = 1.0 if comp_name == preferred else 0.0
        elif name.startswith("job_role_"):
            # Mock based on technical skills
            role_name = name.split("job_role_")[1]
            skills = {
                "Data Scientist": student.get("ml_skill", 0),
                "Web Developer": student.get("web_dev_skill", 0),
                "Software Engineer": student.get("dsa_skill", 0),
                "Analyst": student.get("communication_score", 0) / 10.0
            }
            preferred = max(skills, key=skills.get)
            val = 1.0 if role_name == preferred else 0.0
            
        idx = feature_names.index(name)
        sum_others += coef[idx] * val
        
    # Solve for salary_lpa: logit = sum_others + coef[salary_lpa] * salary_lpa
    # => salary_lpa = (target_logit - sum_others) / coef[salary_lpa]
    salary_coef = coef[feature_names.index('salary_lpa')]
    salary_lpa = (target_logit - sum_others) / salary_coef
    
    # Clip salary to sensible limits (e.g. 0 to 50 LPA)
    # If student is not placed (P < 55), we can set salary_lpa to 0 in the final display
    # but use the solved salary for model input, or just report 0.
    salary_lpa_clipped = max(0.0, salary_lpa)
    
    # Let's run the model with the solved salary
    x = []
    for name in feature_names:
        if name == 'salary_lpa':
            x.append(salary_lpa_clipped)
        elif name in student:
            x.append(student[name])
        elif name.startswith("branch_"):
            branch_name = name.split("branch_")[1]
            x.append(1.0 if student.get("branch") == branch_name else 0.0)
        elif name.startswith("company_type_"):
            comp_name = name.split("company_type_")[1]
            if P >= 75:
                preferred = "Top Tech" if student.get("college_tier") == 1 else "MNC"
            elif P >= 55:
                preferred = "MNC" if student.get("college_tier") <= 2 else "Mid-size"
            else:
                preferred = "Startup"
            x.append(1.0 if comp_name == preferred else 0.0)
        elif name.startswith("job_role_"):
            role_name = name.split("job_role_")[1]
            skills = {
                "Data Scientist": student.get("ml_skill", 0),
                "Web Developer": student.get("web_dev_skill", 0),
                "Software Engineer": student.get("dsa_skill", 0),
                "Analyst": student.get("communication_score", 0) / 10.0
            }
            preferred = max(skills, key=skills.get)
            x.append(1.0 if role_name == preferred else 0.0)
        else:
            x.append(0.0)
            
    x = np.array([x])
    pred = model.predict(x)[0]
    prob = model.predict_proba(x)[0]
    
    # Output format
    is_placed = "Yes" if pred == 1 else "No"
    
    return {
        "readiness_score": round(P, 1),
        "target_logit": round(target_logit, 3),
        "solved_salary": round(salary_lpa, 2),
        "clipped_salary": round(salary_lpa_clipped, 2),
        "prediction": is_placed,
        "probability": round(prob[1] * 100, 1)
    }

# Test cases
good_student = {
    "cgpa": 9.2,
    "college_tier": 1,
    "python_skill": 9,
    "dsa_skill": 9,
    "ml_skill": 8,
    "web_dev_skill": 9,
    "coding_score": 90,
    "communication_score": 85,
    "aptitude_score": 88,
    "internships": 2,
    "projects": 3,
    "backlogs": 0,
    "resume_score": 90,
    "skill_score": 92,
    "branch": "CSE"
}

average_student = {
    "cgpa": 7.5,
    "college_tier": 2,
    "python_skill": 6,
    "dsa_skill": 6,
    "ml_skill": 5,
    "web_dev_skill": 7,
    "coding_score": 65,
    "communication_score": 75,
    "aptitude_score": 70,
    "internships": 1,
    "projects": 2,
    "backlogs": 0,
    "resume_score": 70,
    "skill_score": 68,
    "branch": "IT"
}

poor_student = {
    "cgpa": 5.8,
    "college_tier": 3,
    "python_skill": 3,
    "dsa_skill": 2,
    "ml_skill": 2,
    "web_dev_skill": 4,
    "coding_score": 35,
    "communication_score": 55,
    "aptitude_score": 48,
    "internships": 0,
    "projects": 1,
    "backlogs": 2,
    "resume_score": 50,
    "skill_score": 45,
    "branch": "Mechanical"
}

print("Good Student prediction:")
print(predict_with_solver(good_student))

print("\nAverage Student prediction:")
print(predict_with_solver(average_student))

print("\nPoor Student prediction:")
print(predict_with_solver(poor_student))
