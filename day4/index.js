require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

// const swaggerUI = require("swagger-ui-express");
// const swaggerSpec = require("./docs/swaggerJsdoc");

const app = express();

app.use(express.json());

connectDB();

app.use("/api/auth",authRoutes);

// app.use("/api-docs",swaggerUI.serve, swaggerSpec.setup(swaggerSpec));

app.get("/",(req,res)=>{
    res.send("DAy 5 swagger running");
});

app.listen(process.env.PORT,()=>{
    console.log("Server running on port 3000");
});