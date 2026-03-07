from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import joblib

app = Flask(__name__)
CORS(app)

# load trained model
model = joblib.load(r"C:\Users\Mustafa\Desktop\Fraudproject\Backend\fraud_model.pkl")


@app.route("/predict", methods=["POST"])
def predict():

    data = request.json
    print("Received:", data)

    # encodings (must match training encoding)

    device_map = {
        "Mobile": 0,
        "Desktop": 1,
        "Tablet": 2
    }

    location_map = {
        "USA": 0,
        "UK": 1,
        "Canada": 2,
        "India": 3,
        "Germany": 4
    }

    payment_map = {
        "Credit Card": 0,
        "Debit Card": 1,
        "PayPal": 2,
        "Crypto": 3
    }

    type_map = {
        "Purchase": 0,
        "Transfer": 1,
        "Withdrawal": 2
    }

    # build feature array
    features = np.array([[

        float(data.get("Transaction_Amount", 0)),
        float(data.get("Previous_Fraudulent_Transactions", 0)),
        float(data.get("Number_of_Transactions_Last_24H", 0)),
        device_map.get(data.get("Device_Used"), 0),
        location_map.get(data.get("Location"), 0),
        payment_map.get(data.get("Payment_Method"), 0),
        type_map.get(data.get("Transaction_Type"), 0)

    ]])

    # prediction
    prediction = model.predict(features)[0]
    probability = model.predict_proba(features)[0][1]

    return jsonify({
        "prediction": int(prediction),
        "probability": float(probability)
    })


if __name__ == "__main__":
    app.run(debug=True)