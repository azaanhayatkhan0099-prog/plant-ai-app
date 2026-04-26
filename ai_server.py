from fastapi import FastAPI, File, UploadFile
from PIL import Image
import io

app = FastAPI()

# 🌿 Clean plant names (NO scientific names anymore)
def predict_plant_and_disease(filename):
    name = filename.lower()

    # basic realistic rules (replace with model later)
    if "tomato" in name:
        plant = "Tomato"
        if "spot" in name:
            disease = "Leaf Spot"
        elif "blight" in name:
            disease = "Blight"
        else:
            disease = "Healthy"

    elif "mango" in name:
        plant = "Mango"
        if "spot" in name:
            disease = "Anthracnose"
        else:
            disease = "Healthy"

    else:
        plant = "Unknown Plant"
        disease = "Unknown"

    confidence = "90.00%"

    return plant, disease, confidence


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))

    plant, disease, confidence = predict_plant_and_disease(file.filename)

    return {
        "plant": plant,
        "disease": disease,
        "confidence": confidence
    }