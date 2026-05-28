export const calculateBMI = (weightKg, heightCm) => {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return Math.round(bmi * 10) / 10;
};

export const getBMICategory = (bmi) => {
  if (bmi < 18.5) return { label: "Underweight", color: "#2196F3" };
  if (bmi < 25.0) return { label: "Normal", color: "#4CAF50" };
  if (bmi < 30.0) return { label: "Overweight", color: "#FF9800" };
  return { label: "Obese", color: "#F44336" };
};
