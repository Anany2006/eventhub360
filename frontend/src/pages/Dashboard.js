import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // 1. Grab the token saved during login
        const token = localStorage.getItem("token"); 

        // 2. Send an authenticated request to the backend profile API
        const res = await axios.get("http://localhost:5000/api/auth/profile", { 
          headers: {
            Authorization: token // Pass token in headers [cite: 487]
          }
        });

        // 3. Set the user state with the returned database values
        setUser(res.data);
      } catch (err) {
        setError("Failed to load profile data.");
      }
    };

    fetchProfile();
  }, []);

  if (error) return <div style={{ padding: "20px", color: "red" }}>{error}</div>;
  if (!user) return <div style={{ padding: "20px" }}>Loading profile...</div>;

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2>Welcome, {user.name}! 👋</h2> [cite: 478]
      <hr />
      <p><strong>Email:</strong> {user.email}</p> [cite: 480]
      <p><strong>Role Account Type:</strong> {user.role}</p> [cite: 480]
    </div>
  );
}

export default Dashboard;