const request = require('supertest');
const express = require('express');
const v1Routes = require('../routes');
const errorHandler = require('../middleware/errorHandler');
const v1Routes = require('../routes/index');

// Set up a mock express shell specifically for running automated tests
const testApp = express();
testApp.use(express.json());
testApp.use('/api/v1', v1Routes);
testApp.use(errorHandler);

describe('✅ Enterprise Suite API Testing Matrix', () => {
    
    // Test 1: Verify the Health Check is active
    it('Should verify that the core system health check returns an UP status indicator', async () => {
        const response = await request(testApp).get('/api/v1/health');
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('UP');
    });

    // Test 2: Verify validation blocks bad input data shapes
    it('Should block invalid payloads with a 422 error when malformed emails are supplied', async () => {
        const response = await request(testApp)
            .post('/api/v1/employees')
            .send({
                email: "malformed-address",
                phone: "123",
                salary: -200,
                hireDate: "invalid"
            });
        expect(response.statusCode).toBe(422);
        expect(response.body.success).toBe(false);
    });
});