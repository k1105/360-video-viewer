import { useState, useEffect } from "react";

const GyroDisplay = () => {
  const [gyroData, setGyroData] = useState({
    alpha: 0,
    beta: 0,
    gamma: 0,
  });

  useEffect(() => {
    const updateGravity = (event: DeviceOrientationEvent) => {
      setGyroData({
        alpha: event.alpha || 0, // Z軸の回転
        beta: event.beta || 0, // X軸の傾き
        gamma: event.gamma || 0, // Y軸の傾き
      });
    };

    window.addEventListener("deviceorientation", updateGravity, true);

    return () => {
      window.removeEventListener("deviceorientation", updateGravity);
    };
  }, []);

  return (
    <div>
      <h1>Gyroscope Data</h1>
      <p>Alpha (Z軸): {gyroData.alpha.toFixed(2)}</p>
      <p>Beta (X軸): {gyroData.beta.toFixed(2)}</p>
      <p>Gamma (Y軸): {gyroData.gamma.toFixed(2)}</p>
    </div>
  );
};

export default GyroDisplay;
