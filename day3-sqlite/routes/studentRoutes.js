module.exports = (db) => {
  const express = require("express");
  const router = express.Router();

  router.post("/students", (req, res) => {
    const { name, age, course, email } = req.body;

    db.run(
      "INSERT INTO students (name, age, course, email) VALUES (?, ?, ?, ?)",
      [name, age, course, email],
      function (err) {
        if (err) {
          return res.status(400).json({ error: err.message });
        }
        res.json({ id: this.lastID });
      }
    );
  });

 
  router.get("/students", (req, res) => {
    db.all(
      "SELECT * FROM students ORDER BY age DESC",
      [],
      (err, rows) => {
        res.json(rows);
      }
    );
  });


  router.get("/students/course/:course", (req, res) => {
    db.all(
      "SELECT * FROM students WHERE course = ?",
      [req.params.course],
      (err, rows) => {
        res.json(rows);
      }
    );
  });

  /*
   WHY THIS IS ADVANCED:
   - Uses INDEX on course column
   - Faster search
  */

  /* ==============================
     DELETE STUDENT (TRIGGER FIRES)
  ============================== */
  router.delete("/students/:id", (req, res) => {
    db.run(
      "DELETE FROM students WHERE id = ?",
      [req.params.id],
      () => {
        res.json({ message: "Deleted" });
      }
    );
  });

  /* ==============================
     VIEW TRIGGER LOGS
  ============================== */
  router.get("/logs", (req, res) => {
    db.all(
      "SELECT * FROM student_log",
      [],
      (err, rows) => {
        res.json(rows);
      }
    );
  });

  return router;
};
