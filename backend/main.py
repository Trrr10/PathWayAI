from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware  # ← add this
import numpy as np
import cv2
import mediapipe as mp

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=True,
    max_num_hands=1,
    min_detection_confidence=0.7
)

@app.post("/detect-sign")
async def detect_sign(file: UploadFile = File(...)):
    contents = await file.read()
    npimg = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    img = cv2.resize(img, (640, 480))
    rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    result = hands.process(rgb)

    if result.multi_hand_landmarks:
        hand_landmarks = result.multi_hand_landmarks[0]
        fingers_up = 0
        tips = [8, 12, 16, 20]  # index, middle, ring, pinky

        for tip in tips:
            if hand_landmarks.landmark[tip].y < hand_landmarks.landmark[tip - 2].y:
                fingers_up += 1

        # Optional thumb check (right hand)
        if hand_landmarks.landmark[4].x > hand_landmarks.landmark[3].x:
            fingers_up += 1

        # Map fingers to words
        if fingers_up == 0:
            word = "HELLO"
        elif fingers_up == 1:
            word = "HI"
        elif fingers_up == 2:
            word = "I HAVE A DOUBT"
        elif fingers_up == 3:
            word = "PLEASE HELP"
        elif fingers_up >= 4:
            word = "THANK YOU"
        else:
            word = "UNKNOWN"

        # Print for debugging
        print(f"Fingers Up: {fingers_up} → Word: {word}")

        # Return as JSON
        return {"fingers_up": fingers_up, "letter": word}

    else:
        print("No hand detected!")
        return {"fingers_up": 0, "letter": ""}