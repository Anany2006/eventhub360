// docs/swaggerSpec.js
const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Employee Leave Management System (EMS) API Documentation",
    version: "1.0.0",
    description: "Enterprise Node.js/Express API layer interacting with cloud Neon PostgreSQL database.",
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local Development Server"
    }
  ],
  paths: {
    "/api/leaves/dashboard": {
      get: {
        summary: "Fetch centralized dashboard metrics view matrix",
        responses: {
          200: {
            description: "Successful response returning combined analytical tracking variables."
          }
        }
      }
    },
    "/api/leaves/approve-workflow": {
      post: {
        summary: "Process an atomic ACID workflow status change evaluation",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  leaveId: { type: "integer", example: 2 },
                  approvedBy: { type: "integer", example: 2 },
                  actionStatus: { type: "string", example: "Approved" },
                  remarks: { type: "string", example: "Verified medical documents." }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Workflow state modified and committed successfully." },
          400: { description: "Validation constraint failed or transaction rolled back." }
        }
      }
    }
  }
};

module.exports = swaggerDocument;