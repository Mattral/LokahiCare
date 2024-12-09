import AiChatbot from "components/aiChat";
import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DiabetesPrediction: React.FC = () => {
  const [age, setAge] = useState<number | "">("");
  const [weight, setWeight] = useState<number | "">(""); 
  const [height, setHeight] = useState<number | "">(""); 
  const [bmi, setBmi] = useState<number | "">(""); 
  const [familyHistory, setFamilyHistory] = useState<boolean>(false);
  const [physicalActivity, setPhysicalActivity] = useState<boolean>(false);
  const [bloodPressure, setBloodPressure] = useState<boolean>(false);
  const [highBloodSugar, setHighBloodSugar] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [result, setResult] = useState<string>("");
  const [recommendation, setRecommendation] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<number | "">>) => {
    const value = e.target.value;
    setter(value === "" ? "" : parseFloat(value));  // Parse the input to number or leave as empty string
  };

  const calculateBMI = () => {
    if (typeof weight === 'number' && typeof height === 'number' && height > 0) {
      const calculatedBMI = weight / (height * height);
      setBmi(calculatedBMI);
    }
  };

  const calculateRiskScore = () => {
    let score = 0;

    if (typeof age === 'number') {
      if (age >= 45) score += 2;
      if (age >= 35 && age < 45) score += 1;
    }

    if (typeof bmi === 'number') {
      if (bmi >= 30) score += 5;
      if (bmi >= 25 && bmi < 30) score += 3;
    }

    if (familyHistory) score += 5;
    if (!physicalActivity) score += 3;
    if (bloodPressure) score += 2;
    if (highBloodSugar) score += 4;

    return score;
  };

  const predict = () => {
    const score = calculateRiskScore();
    setPrediction(score);

    let resultMessage = "";
    if (score >= 16) {
      resultMessage = "High risk of developing Type 2 diabetes. It is recommended to visit a healthcare provider.";
      setRecommendation("Consult with a healthcare professional about your lifestyle, diet, and possible medication.");
    } else if (score >= 8) {
      resultMessage = "Moderate risk. Consider lifestyle changes to lower the risk.";
      setRecommendation("Consider adopting a healthier diet, increasing physical activity, and monitoring your blood sugar levels.");
    } else {
      resultMessage = "Low risk of developing Type 2 diabetes.";
      setRecommendation("Maintain a healthy lifestyle with regular exercise and balanced nutrition.");
    }
    setResult(resultMessage);
  };

  const chartData = [
    {
      name: "Diabetes Risk",
      risk: prediction ?? 0,
    },
  ];

  return (
    <div className="container">
      <h1>Diabetes Risk Prediction</h1>
      <div className="input-group">
        <label htmlFor="age">Age:</label>
        <input
          type="number"
          id="age"
          value={age}
          onChange={(e) => handleInputChange(e, setAge)}
          placeholder="Enter your age"
        />
      </div>
      <div className="input-group">
        <label htmlFor="weight">Weight (kg): 110lbs=50kg</label>
        <input
          type="number"
          id="weight"
          value={weight}
          onChange={(e) => {
            handleInputChange(e, setWeight);
            calculateBMI();
          }}
          placeholder="Enter your weight"
        />
      </div>
      <div className="input-group">
        <label htmlFor="height">Height (m): 6'=1.288m</label>
        <input
          type="number"
          step="0.01"
          id="height"
          value={height}
          onChange={(e) => {
            handleInputChange(e, setHeight);
            calculateBMI();
          }}
          placeholder="Enter your height"
        />
      </div>
      <div className="input-group">
        <label htmlFor="familyHistory">Family History of Diabetes:</label>
        <input
          type="checkbox"
          id="familyHistory"
          checked={familyHistory}
          onChange={() => setFamilyHistory(!familyHistory)}
        />
      </div>
      <div className="input-group">
        <label htmlFor="physicalActivity">Physical Activity:</label>
        <input
          type="checkbox"
          id="physicalActivity"
          checked={physicalActivity}
          onChange={() => setPhysicalActivity(!physicalActivity)}
        />
      </div>
      <div className="input-group">
        <label htmlFor="bloodPressure">High Blood Pressure:</label>
        <input
          type="checkbox"
          id="bloodPressure"
          checked={bloodPressure}
          onChange={() => setBloodPressure(!bloodPressure)}
        />
      </div>
      <div className="input-group">
        <label htmlFor="highBloodSugar">High Blood Sugar or Prediabetes:</label>
        <input
          type="checkbox"
          id="highBloodSugar"
          checked={highBloodSugar}
          onChange={() => setHighBloodSugar(!highBloodSugar)}
        />
      </div>
      <button onClick={predict}>Predict Risk</button>
      <div id="result">{result}</div>
      <div id="recommendation">{recommendation}</div>

      {prediction !== null && (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="risk" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      )}

      <div className="bg-gray-100 p-6 rounded-lg shadow-md max-w-3xl mx-auto">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">How the Risk Score is Calculated:</h2>
        <p className="text-gray-600 text-lg mb-4">
          The risk score is based on the American Diabetes Association (ADA) Risk Test, which uses factors such as age, BMI, family history, physical activity, blood pressure, and history of high blood sugar to assess the likelihood of developing Type 2 diabetes. Below is a breakdown of the criteria used to calculate the risk score:
        </p>
        <ul className="list-inside list-disc space-y-2 text-gray-700 text-lg">
          <li><strong className="font-semibold">Age:</strong> 2 points if you are 45 or older, 1 point if you are between 35-44. The risk of diabetes increases with age, particularly after 45.</li>
          <li><strong className="font-semibold">BMI (Body Mass Index):</strong> 5 points for obesity (BMI ≥ 30), 3 points for overweight (BMI 25-29.9). Higher BMI is a strong indicator of the risk of developing diabetes, especially if it’s in the obese range.</li>
          <li><strong className="font-semibold">Family History:</strong> 5 points if a close family member (parent, sibling) has diabetes. Genetics play a significant role in increasing the risk of Type 2 diabetes, so a family history of the disease is a major risk factor.</li>
          <li><strong className="font-semibold">Physical Activity:</strong> 3 points if you are not physically active. Lack of physical activity is a major contributor to the risk of diabetes, as regular exercise helps improve insulin sensitivity and maintain a healthy weight.</li>
          <li><strong className="font-semibold">Blood Pressure:</strong> 2 points for high blood pressure. High blood pressure often accompanies Type 2 diabetes and can lead to complications, making it a risk factor for the disease.</li>
          <li><strong className="font-semibold">High Blood Sugar (Prediabetes):</strong> 4 points if you have a history of high blood sugar or have been diagnosed with prediabetes. Elevated blood sugar levels, even before a diabetes diagnosis, indicate a higher risk of developing Type 2 diabetes in the future.</li>
        </ul>
        <p className="text-gray-600 text-lg mt-4">
          The total score, based on these factors, will determine your overall risk level for developing Type 2 diabetes. A higher score indicates a higher likelihood of developing the condition, and it may be an indication that lifestyle changes or medical consultation are necessary.
        </p>
      </div>
      <AiChatbot/>

      <style>
                {`
                    body {
                        font-family: 'Arial', sans-serif;
                        background-color: #f4f6f9;
                        color: #333;
                        margin: 0;
                        padding: 0;
                    }

                    .container {
                        max-width: 600px;
                        margin: 50px auto;
                        padding: 20px;
                        background-color: white;
                        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
                        border-radius: 10px;
                    }

                    h1 {
                        text-align: center;
                        color: #444;
                        font-size: 2.5rem;
                        margin-bottom: 20px;
                    }

                    .input-group {
                        margin-bottom: 15px;
                    }

                    label {
                        font-size: 1.2rem;
                        color: #555;
                    }

                    input {
                        width: 100%;
                        padding: 10px;
                        margin-top: 5px;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                        font-size: 1rem;
                    }

                    button {
                        width: 100%;
                        padding: 15px;
                        background-color: #7E57C2;
                        color: white;
                        font-size: 1.2rem;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                    }

                    button:hover {
                        background-color: #218838;
                    }

                    #result {
                        text-align: center;
                        font-size: 1.3rem;
                        margin-top: 20px;
                    }

                    canvas {
                        width: 100%;
                        margin-top: 30px;
                    }

                    h2 {
                        margin-top: 30px;
                        color: #444;
                    }

                    ul {
                        padding-left: 20px;
                    }

                    li {
                        font-size: 1.1rem;
                        color: #555;
                    }
                `}
            </style>
    </div>
  );
};

export default DiabetesPrediction;



