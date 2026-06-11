const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Ensure the path here matches your folders exactly
const assetRoutes = require('./routes/assetRoutes.js');
const errorHandler = require('./middleware/errorHandler.js');
const employeeRoutes = require('./routes/employeeRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/assets', assetRoutes);
app.use('/api/employees', employeeRoutes);

app.get('/', (req, res) => {
  res.send('Enterprise ERP Cloud Backend Platform Engine Online!');
});

// Error handling middleware must be loaded LAST
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Architecture Core running cleanly on port ${PORT}`);
});