import swaggerJSDoc from "swagger-jsdoc";
import dotenv from "dotenv";
dotenv.config();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "EVM Backend API",
      version: "1.0.0",
      description: "API documentation for the EVM backend system",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
      },
    ],
  },
  apis: ["./src/controllers/*.js"], // Path to the API docs
};

export const swaggerSpec = swaggerJSDoc(options);
