const express = require("express");
const app = express();  

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to backend Day-1!");
});

app.post("/students",(req,res)=>{
     const student = req.body;
     res.json({
          message : "Student data recieved",
          data : student
     });
     
     res.send(data);
});

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
