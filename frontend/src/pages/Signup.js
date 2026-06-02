import { useState } from "react";
import axios from "axios";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  // Updates our state when a user types in the input fields
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Sends the form data to our Node.js API when the user clicks Register
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/signup",
        form
      );
      alert(res.data.message); // Displays "User Registered"
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div style={{ maxWidth: "300px", margin: "20px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <input
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            name="name"
            placeholder="Name"
            onChange={handleChange}
            required
          />
        </div>
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
        <button type="submit" style={{ width: "100%", padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Register
        </button>
      </form>
    </div>
  );
}

export default Signup;