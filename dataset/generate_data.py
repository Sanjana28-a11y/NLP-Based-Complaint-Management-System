import pandas as pd
import random
from datetime import datetime, timedelta

categories = {
    'IT': [
        "The internet in the {location} is too slow for studying.",
        "Wi-Fi keeps disconnecting in {location}.",
        "Projector in {location} is not turning on.",
        "Unable to access the student portal from {location}.",
        "Computers in the {location} lab are not working.",
        "LAN cable missing in the {location}.",
        "Software licenses expired on lab machines in {location}.",
        "Printers not working in the {location}."
    ],
    'Maintenance': [
        "Water cooler on the {location} is broken.",
        "Hostel AC is not cooling in {location}. Please fix ASAP.",
        "Elevator in {location} is stuck frequently.",
        "Washrooms lack basic hygiene supplies in {location}.",
        "Fan is making weird noises in {location}.",
        "There is a water leak in the {location}.",
        "Window pane is broken in {location}.",
        "Lights are constantly flickering in {location}."
    ],
    'Health': [
        "Medical room is closed during night hours near {location}.",
        "Need better first aid kits in the {location}.",
        "Doctor was not available at the clinic near {location}.",
        "Hygiene issues at the clinic close to {location}.",
        "Ambulance took too long to arrive at {location}.",
        "No basic medicines available in the dispensary.",
    ],
    'Library': [
        "Need more books on Machine Learning in the library.",
        "Library closes too early during exam week.",
        "Not enough quiet study spaces.",
        "Online journal access is revoked.",
        "Librarian was unhelpful today.",
        "Chairs are uncomfortable in the reading room."
    ],
    'Academic': [
        "Professor missed the scheduled lecture without notice.",
        "Exam schedule is clashing with placement drives.",
        "Course curriculum needs updating for industry standards.",
        "Assignments are graded unfairly.",
        "Not enough elective courses offered this semester.",
        "Timetable is poorly managed with no breaks."
    ],
    'Mess': [
        "No vegetarian options available in the mess today.",
        "Cafeteria food gave several students food poisoning.",
        "Food is served cold during dinner time.",
        "Cutlery is frequently dirty.",
        "Menu is repetitive and lacks nutrition.",
        "Water supply in mess area was disrupted."
    ],
    'Security': [
        "Parking lot lights are out.",
        "Campus security personnel are rude to students.",
        "Outsiders entering the campus without checking.",
        "No security guard present at the back gate.",
        "CCTV cameras are not functional in {location}.",
        "Bicycles are being stolen from the parking lot."
    ],
    'Sports': [
        "Gym equipment requires maintenance.",
        "Sports ground is too muddy to play.",
        "Not enough basketballs available.",
        "Indoor stadium is kept locked on weekends.",
        "Floodlights at the football ground are not working.",
        "Cricket pitch needs to be rolled and cleaned."
    ]
}

locations = ["Main Block", "Hostel A", "Hostel B", "Building C", "3rd floor", "Library Section", "Room 402", "Lab 3"]

def generate_sentence(category):
    template = random.choice(categories[category])
    if "{location}" in template:
        return template.format(location=random.choice(locations))
    return template

def assign_urgency(category):
    if category in ['Health', 'Security']:
        return random.choices(['High', 'Medium'], weights=[0.8, 0.2])[0]
    elif category in ['Maintenance', 'IT']:
        return random.choices(['High', 'Medium', 'Low'], weights=[0.4, 0.4, 0.2])[0]
    elif category in ['Academic', 'Mess']:
        return random.choices(['High', 'Medium', 'Low'], weights=[0.3, 0.5, 0.2])[0]
    else:
        return random.choices(['Medium', 'Low'], weights=[0.6, 0.4])[0]

def random_date(start_date, end_date):
    time_between_dates = end_date - start_date
    days_between_dates = time_between_dates.days
    random_number_of_days = random.randrange(days_between_dates)
    return start_date + timedelta(days=random_number_of_days)

data = []
start_date = datetime.strptime('2026-01-01', '%Y-%m-%d')
end_date = datetime.strptime('2026-04-20', '%Y-%m-%d')

# Generate 1500 records to create a "big" dataset for training well
for _ in range(1500):
    cat = random.choice(list(categories.keys()))
    text = generate_sentence(cat)
    # Add some random noise to text to make it more unique for training
    adjectives = ["terrible", "very annoying", "frustrating", "bad", "urgent", "needs fixing", ""]
    prefix = random.choices(["It is ", "This is ", "I am facing an issue where ", ""], weights=[0.1, 0.1, 0.2, 0.6])[0]
    suffix = " " + random.choice(adjectives) if random.random() > 0.6 else ""
    
    final_text = prefix + text + suffix
    
    urgency = assign_urgency(cat)
    date_sub = random_date(start_date, end_date).strftime('%Y-%m-%d')
    
    data.append([final_text.strip(), cat, urgency, date_sub])

df = pd.DataFrame(data, columns=['Complaint_Text', 'Category', 'Urgency', 'Date_Submitted'])

df.to_csv("c:/Users/jetty/Downloads/SmartComplaintAnalyser/dataset/complaints.csv", index=False)
print(f"Generated {len(df)} records in dataset/complaints.csv")
