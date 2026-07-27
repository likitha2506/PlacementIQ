import urllib.request
import json

url = "http://127.0.0.1:8080/predict"

payloads = {
    "Good Profile": {
        "cgpa": 9.2,
        "branch": "CSE",
        "college_tier": "Tier 1",
        "python_skill": 9.0,
        "dsa_skill": 9.0,
        "ml_skill": 8.0,
        "web_dev_skill": 9.0,
        "coding_score": 90.0,
        "communication_score": 85.0,
        "aptitude_score": 88.0,
        "internships": 2,
        "projects": 3,
        "backlogs": 0,
        "resume_score": 90.0,
        "skill_score": 92.0
    },
    "Poor Profile": {
        "cgpa": 5.8,
        "branch": "Mechanical",
        "college_tier": "Tier 3",
        "python_skill": 3.0,
        "dsa_skill": 2.0,
        "ml_skill": 2.0,
        "web_dev_skill": 4.0,
        "coding_score": 35.0,
        "communication_score": 55.0,
        "aptitude_score": 48.0,
        "internships": 0,
        "projects": 1,
        "backlogs": 2,
        "resume_score": 50.0,
        "skill_score": 45.0
    }
}

for name, payload in payloads.items():
    print(f"\n--- Testing {name} ---")
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url, 
        data=data, 
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    try:
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode("utf-8")
            res_json = json.loads(res_body)
            print("Response:", json.dumps(res_json, indent=2))
    except Exception as e:
        print("Error during request:", e)
        if hasattr(e, 'read'):
            print("Error details:", e.read().decode('utf-8'))
