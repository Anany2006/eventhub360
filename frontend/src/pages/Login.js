import { useState } from "react";
import axios from "axios";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Sends credentials to our API, receives a secure token, and stores it
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        form
      );
      // Save secure login token to browser's storage
      localStorage.setItem("token", res.data.token);
      alert("Login Success!");
    } catch (error) {
      alert(error.response?.data?.message || "Invalid Email or Password");
    }
  };

  return (
    <div style={{ maxWidth: "300px", margin: "20px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <input
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <input
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" style={{ width: "100%", padding: "10px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;