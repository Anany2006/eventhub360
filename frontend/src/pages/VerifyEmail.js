import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function VerifyEmail() {
  const { token } = useParams(); // Grabs token string out of the browser URL bar
  const [status, setStatus] = useState("Verifying your account... please wait.");

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/auth/verify-email/${token}`);
        setStatus(res.data.message);
      } catch (error) {
        setStatus(error.response?.data?.message || "Verification failed. Token may be expired.");
      }
    };
    confirmEmail();
  }, [token]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px", fontFamily: "Arial, sans-serif" }}>
      <h2>Account Verification</h2>
      <div style={{ padding: "20px", margin: "20px auto", maxWidth: "400px", border: "1px solid #ddd", borderRadius: "8px" }}>
        <p>{status}</p>
        <hr />
        <Link to="/" style={{ color: "#007bff", textDecoration: "none" }}>Go to Login Page</Link>
      </div>
    </div>
  );
}

export default VerifyEmail;