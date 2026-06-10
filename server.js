// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { helmetGuard, apiLimiter } = require('./middleware/securityEngine');
const leaveRouter = require('./routes/leaveRoutes');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swaggerSpec');

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// Base Request Parsers & CORS
app.use(express.json());
app.use(cors());

// Assignment Advanced Security Inclusions
app.use(helmetGuard);
app.use('/api', apiLimiter);

// Enterprise Routing Bindings
app.use('/api/leaves', leaveRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Basic server verification landing page route
app.get('/', (req, res) => {
    res.send('💼 Enterprise EMS Backend API Layer Online.');
});

app.listen(PORT, HOST, () => {
    console.log(`🚀 Server listening seamlessly on ${HOST}:${PORT}`);
});