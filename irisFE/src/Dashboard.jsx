import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import "./Dashboard.css";
//import { useAuth } from "./authContext";

const csvData = [
  {
    sepalLength: 5.1,
    sepalWidth: 3.5,
    petalLength: 1.4,
    petalWidth: 0.2,
    variety: "Iris-setosa",
  },
  {
    sepalLength: 4.9,
    sepalWidth: 3,
    petalLength: 1.4,
    petalWidth: 0.2,
    variety: "Iris-setosa",
  },
  {
    sepalLength: 4.7,
    sepalWidth: 3.2,
    petalLength: 1.3,
    petalWidth: 0.2,
    variety: "Iris-setosa",
  },
  {
    sepalLength: 4.6,
    sepalWidth: 3.1,
    petalLength: 1.5,
    petalWidth: 0.2,
    variety: "Iris-setosa",
  },
  {
    sepalLength: 5,
    sepalWidth: 3.6,
    petalLength: 1.4,
    petalWidth: 0.2,
    variety: "Iris-setosa",
  },
  {
    sepalLength: 5.4,
    sepalWidth: 3.9,
    petalLength: 1.7,
    petalWidth: 0.4,
    variety: "Iris-setosa",
  },
  {
    sepalLength: 4.6,
    sepalWidth: 3.4,
    petalLength: 1.4,
    petalWidth: 0.3,
    variety: "Iris-setosa",
  },
];

function Dashboard() {
  //const { authData, logout } = useAuth();
  const [selectedSeries, setSelectedSeries] = useState({
    sepalWidth: true,
    petalLength: true,
    petalWidth: true,
  });
  const [yBounds, setYBounds] = useState([0, 5]); // Default Y-axis bounds
  const navigate = useNavigate();

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setSelectedSeries((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSliderChange = (e) => {
    const value = Array.from(e.target.value.split(",")).map(Number);
    setYBounds(value);
  };

  return (
    <div className="dashboard-container">
      <header className="header">
        <span className="welcome-message">Welcome guests!</span>
        <button className="logout-button" onClick={() => navigate("/")}>
          Logout
        </button>
      </header>

      <div className="content">
        <h1>Data Visualization Dashboard</h1>

        <div className="charts-container">
          {/* Plot 1 */}
          <div className="chart-container">
            <h2>Plot 1: Sepal Length (X-axis)</h2>
            <div className="controls">
              <label>
                <input
                  type="checkbox"
                  name="sepalWidth"
                  checked={selectedSeries.sepalWidth}
                  onChange={handleCheckboxChange}
                />
                Sepal Width
              </label>
              <label>
                <input
                  type="checkbox"
                  name="petalLength"
                  checked={selectedSeries.petalLength}
                  onChange={handleCheckboxChange}
                />
                Petal Length
              </label>
              <label>
                <input
                  type="checkbox"
                  name="petalWidth"
                  checked={selectedSeries.petalWidth}
                  onChange={handleCheckboxChange}
                />
                Petal Width
              </label>
              <input
                type="range"
                min="0"
                max="5"
                value={yBounds}
                onChange={handleSliderChange}
                multiple
                className="slider"
              />
              <div>
                Y-Axis Bounds: {yBounds[0]} - {yBounds[1]}
              </div>
            </div>
            <LineChart width={600} height={300} data={csvData}>
              <CartesianGrid stroke="#ccc" />
              <XAxis
                dataKey="sepalLength"
                label={{ value: "Sepal Length", position: "insideBottom" }}
              />
              <YAxis
                domain={yBounds}
                label={{ value: "Size", angle: -90, position: "insideLeft" }}
              />
              <Tooltip />
              <Legend />
              {selectedSeries.sepalWidth && (
                <Line type="monotone" dataKey="sepalWidth" stroke="#8884d8" />
              )}
              {selectedSeries.petalLength && (
                <Line type="monotone" dataKey="petalLength" stroke="#82ca9d" />
              )}
              {selectedSeries.petalWidth && (
                <Line type="monotone" dataKey="petalWidth" stroke="#ffc658" />
              )}
            </LineChart>
          </div>

          {/* Plot 2 */}
          <div className="chart-container">
            <h2>Plot 2: Petal Length (X-axis)</h2>
            <LineChart width={600} height={300} data={csvData}>
              <CartesianGrid stroke="#ccc" />
              <XAxis
                dataKey="petalLength"
                label={{ value: "Petal Length", position: "insideBottom" }}
              />
              <YAxis
                domain={yBounds}
                label={{ value: "Size", angle: -90, position: "insideLeft" }}
              />
              <Tooltip />
              <Legend />
              {selectedSeries.sepalWidth && (
                <Line type="monotone" dataKey="sepalWidth" stroke="#8884d8" />
              )}
              {selectedSeries.petalLength && (
                <Line type="monotone" dataKey="petalLength" stroke="#82ca9d" />
              )}
              {selectedSeries.petalWidth && (
                <Line type="monotone" dataKey="petalWidth" stroke="#ffc658" />
              )}
            </LineChart>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
