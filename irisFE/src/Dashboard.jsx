import { useEffect, useState } from "react";
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
import axios from "axios";

function Dashboard() {
  const [selectedSeries, setSelectedSeries] = useState({
    sepalWidth: true,
    petalLength: true,
    petalWidth: true,
  });
  const [yBounds, setYBounds] = useState([0, 5]);
  const [name, setName] = useState("Guest");
  const [variety, setVariety] = useState("");
  const [chartData, setChartData] = useState([]);

  const navigate = useNavigate();

  // Handle token decryption and data fetch
  useEffect(() => {
    // Simulating token retrieval from localStorage
    const token = localStorage.getItem("authData");

    if (token) {
      try {
        const user = JSON.parse(token); // Assuming the token is a plain JSON string
        setName(user.name); // Using `name` from the token
        setVariety(user.role); // Using `role` as `variety` in your case
      } catch (error) {
        console.error("Error parsing token:", error);
        navigate("/"); // Redirect to login if token is invalid
      }
    } else {
      navigate("/"); // Redirect to login if no token
    }
  }, [navigate]);

  useEffect(() => {
    if (variety) {
      axios
        .get(`http://localhost:3000/getData?variety=${variety}`)
        .then((response) => {
          // Normalize the keys to remove the periods (e.g., "sepal.length" -> "sepalLength")
          const normalizedData = response.data.map((item) => ({
            sepalLength: parseFloat(item["sepal.length"]),
            sepalWidth: parseFloat(item["sepal.width"]),
            petalLength: parseFloat(item["petal.length"]),
            petalWidth: parseFloat(item["petal.width"]),
            variety: item.variety,
          }));

          setChartData(normalizedData);
        })
        .catch((err) => console.error("Error fetching data:", err));
    }
  }, [variety]);

  console.log("DCDCDCDC", chartData);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setSelectedSeries((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSliderChange = (e) => {
    const value = Array.from(e.target.value.split(",")).map(Number);
    setYBounds(value);
  };

  //console.log("VARRRUUUU", variety);
  return (
    <div className="dashboard-container">
      <header className="header">
        <span className="welcome-message">
          Welcome <span className="user-name">{name}!</span>{" "}
          <span className="user-role">{variety}</span>
        </span>
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
            <LineChart width={600} height={300} data={chartData}>
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
            <LineChart width={600} height={300} data={chartData}>
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
