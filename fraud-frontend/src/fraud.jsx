import React, { useState } from "react";
import { motion } from "framer-motion";

export default function FraudDetectionApp() {

  const [formData, setFormData] = useState({
    Transaction_Amount: "",
    Previous_Fraudulent_Transactions: "",
    Number_of_Transactions_Last_24H: "",
    Device_Used: "Mobile",
    Location: "USA",
    Payment_Method: "Credit Card",
    Transaction_Type: "Purchase"
  });

  const [result, setResult] = useState(null);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    setResult(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center p-6">

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="bg-white w-full max-w-2xl p-8 rounded-2xl shadow-2xl"
      >

        <h1 className="text-3xl font-bold text-center mb-6">
          Fraud Detection System
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

          <input
            className="border p-2 rounded"
            type="number"
            placeholder="Transaction Amount"
            onChange={(e) =>
              handleChange("Transaction_Amount", e.target.value)
            }
          />

          <input
            className="border p-2 rounded"
            type="number"
            placeholder="Previous Fraud Count"
            onChange={(e) =>
              handleChange(
                "Previous_Fraudulent_Transactions",
                e.target.value
              )
            }
          />

          <input
            className="border p-2 rounded"
            type="number"
            placeholder="Transactions Last 24H"
            onChange={(e) =>
              handleChange(
                "Number_of_Transactions_Last_24H",
                e.target.value
              )
            }
          />

          {/* Device */}
          <select
            className="border p-2 rounded"
            onChange={(e) =>
              handleChange("Device_Used", e.target.value)
            }
          >
            <option value="Mobile">Mobile</option>
            <option value="Desktop">Desktop</option>
            <option value="Tablet">Tablet</option>
          </select>

          {/* Location */}
          <select
            className="border p-2 rounded"
            onChange={(e) =>
              handleChange("Location", e.target.value)
            }
          >
            <option value="USA">USA</option>
            <option value="UK">UK</option>
            <option value="Canada">Canada</option>
            <option value="India">India</option>
            <option value="Germany">Germany</option>
          </select>

          {/* Payment */}
          <select
            className="border p-2 rounded"
            onChange={(e) =>
              handleChange("Payment_Method", e.target.value)
            }
          >
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="PayPal">PayPal</option>
            <option value="Crypto">Crypto</option>
          </select>

          {/* Transaction Type */}
          <select
            className="border p-2 rounded"
            onChange={(e) =>
              handleChange("Transaction_Type", e.target.value)
            }
          >
            <option value="Purchase">Purchase</option>
            <option value="Transfer">Transfer</option>
            <option value="Withdrawal">Withdrawal</option>
          </select>

          <button
            type="submit"
            className="col-span-2 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
          >
            Check Fraud
          </button>

        </form>

        {result && (
          <div className="text-center mt-6">
            <h2 className="text-xl font-semibold">
              Prediction Result
            </h2>

            <p className="mt-2">
              Fraud Probability:
              <span className="font-bold">
                {" "}
                {(result.probability * 100).toFixed(2)}%
              </span>
            </p>

            <p className="mt-1">
              Status:
              <span
                className={`font-bold ${
                  result.prediction === 1
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {" "}
                {result.prediction === 1 ? "Fraud" : "Legitimate"}
              </span>
            </p>
          </div>
        )}

      </motion.div>
    </div>
  );
}