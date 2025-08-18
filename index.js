const express = require("express");
const mongoose = require("mongoose");

const dotenv = require("dotenv");

dotenv.config();
const transcriptRoutes = require("./routers/transcriptRoutes");
const summaryRoutes = require("./routers/summaryRoutes");

const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();
app.use(express.json());

// 🔹 Swagger setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Meeting Notes Summarizer API",
      version: "1.0.0",
      description: "API documentation for the AI-powered meeting notes summarizer",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}/api`,
      },
    ],
  },
  apis: ["./routers/*.js"], // 👈 Swagger will read JSDoc comments from route files
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/transcripts", transcriptRoutes);
app.use("/api/summaries", summaryRoutes);

// DB + Server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () =>
      console.log(`Server running on http://localhost:${process.env.PORT}`)
    );
  })
  .catch((err) => console.error(err));
