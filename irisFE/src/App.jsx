import { useState } from "react";
import "./App.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./authContext";

function App() {
  const { login } = useAuth(); // Use the login function from AuthContext
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isValidEmail = (email) => {
    // Basic email regex for validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.password.trim()) {
      setError("Both fields are required.");
      return;
    }

    if (!isValidEmail(formData.username.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/login", {
        email: formData.username,
        password: formData.password,
      });

      // Assuming the response contains token and role
      if (response.data.token) {
        // Use the login function from AuthContext to store auth data
        login(
          response.data.email,
          response.data.token,
          response.data.name,
          response.data.role
        );
        // Navigate to the dashboard
        alert("Login successful!");
        navigate("/dashboard");
      } else {
        setError("Invalid username or password.");
      }
    } catch (error) {
      setError("Invalid username or password. Please try again." + error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(""); // Clear error on typing
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="username">Email</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default App;
