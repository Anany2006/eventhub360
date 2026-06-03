require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

// Redirect all auth requests to the routes file
app.use("/api/auth", authRoutes);

// Dynamic port binding for production environments
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running securely on port ${PORT}`);
});