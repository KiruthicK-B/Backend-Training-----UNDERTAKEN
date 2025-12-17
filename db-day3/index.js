
const express = require("express");
const connectDB = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");

const app = express();
app.use(express.json());

connectDB();

app.use("/students", studentRoutes);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
