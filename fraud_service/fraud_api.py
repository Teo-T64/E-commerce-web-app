import torch
from flask import Flask, request, jsonify
import pandas as pd
import joblib
import ipaddress
from model_definition import Model

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

INPUT_SIZE = 14

model = Model(INPUT_SIZE)
state_dict = torch.load("fraud_model.pth", map_location=device)
model.load_state_dict(state_dict)
model.eval()
model.to(device)

categorical_cols = ['TransactionType', 'Location', 'Channel', 'CustomerOccupation']

encoders = {
    col: joblib.load(f"{col}_ordinal_encoder.pkl")
    for col in categorical_cols
}

scaler = joblib.load("scaler.pkl")

X_columns = [
    "TransactionAmount", "TransactionType", "Location", "Channel",
    "CustomerAge", "CustomerOccupation", "TransactionDuration",
    "LoginAttempts", "AccountBalance",
    "transaction_hour", "transaction_dayofweek",
    "prev_transaction_hour", "prev_transaction_dayofweek",
    "ip_address"
]

app = Flask(__name__)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    df = pd.DataFrame([data])

    df["TransactionDate"] = pd.to_datetime(df["TransactionDate"])
    df["PreviousTransactionDate"] = pd.to_datetime(df["PreviousTransactionDate"])

    df["transaction_hour"] = df["TransactionDate"].dt.hour
    df["transaction_dayofweek"] = df["TransactionDate"].dt.dayofweek
    df["prev_transaction_hour"] = df["PreviousTransactionDate"].dt.hour
    df["prev_transaction_dayofweek"] = df["PreviousTransactionDate"].dt.dayofweek

    df["ip_address"] = df["ip_address"].apply(lambda x: int(ipaddress.ip_address(x)))

    df.drop(columns=["TransactionDate", "PreviousTransactionDate"], inplace=True)

    for col in categorical_cols:
        df[col] = encoders[col].transform(df[[col]])

    df = df[X_columns]

    scaled = scaler.transform(df)
    tensor = torch.tensor(scaled, dtype=torch.float32).to(device)

    with torch.no_grad():
        pred = model(tensor).item()

    return jsonify({
        "fraudulent": bool(pred >= 0.5),
        "riskScore": float(pred)
    })

if __name__ == "__main__":
    app.run(port=4000)
