require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db");
const cors = require("cors");

const app = express();

app.use(cors()); // <-- Use the CORS middleware
app.use(bodyParser.json());

const fetch = require('node-fetch'); 

const startServer = () => {
  app.listen(3001, () => {
    console.log("Server is running on port 3001");

    fetch("http://localhost:3001/init-schedule", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ teacher: "Teacher1" }),
    })
      .then((response) => response.json())
      .then((data) => {
        return fetch("http://localhost:3001/init-schedule", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ teacher: "Teacher2" }),
        });
      })
      .then((response) => response.json())
      .catch((error) => {
        console.error("There was an error:", error);
      });
  });
};


// Function to initialize database
const initializeDatabase = async () => {
  try {
    await db.none(`
      CREATE TABLE IF NOT EXISTS teacher_schedule (
        id SERIAL PRIMARY KEY,
        teacher_name TEXT NOT NULL,
        day TEXT NOT NULL,
        time INTEGER NOT NULL,
        student_name TEXT
      );
    `);
    console.log("Table initialized successfully.");
  } catch (error) {
    console.log("Table initialization failed:", error);
  }
};

// Call the function to ensure the table exists
initializeDatabase()
  .then(startServer)
  .catch((error) => {
    console.error("Failed to initialize the database:", error);
  });

// Inside Express server file
app.post("/init-schedule", async (req, res) => {
  console.log("Received init request for:", req.body.teacher);
  try {
    const { teacher } = req.body;
    const availability = {
      Teacher1: {
        Monday: [10, 11],
        Tuesday: [14, 15],
        Wednesday: [],
        Thursday: [],
        Friday: [15, 16],
      },
      Teacher2: {
        Monday: [],
        Tuesday: [],
        Wednesday: [13, 14, 15, 16],
        Thursday: [10, 11, 12, 13, 14, 15],
        Friday: [],
      },
    };

    const teacherSlots = availability[teacher];
    for (const day in teacherSlots) {
      for (const time of teacherSlots[day]) {
        // Check if the slot already exists
        const existingSlot = await db.oneOrNone(
          "SELECT * FROM teacher_schedule WHERE teacher_name = $1 AND day = $2 AND time = $3",
          [teacher, day, time]
        );

        if (!existingSlot) {
          // Insert the slot if it doesn't exist
          await db.none(
            "INSERT INTO teacher_schedule(teacher_name, day, time) VALUES($1, $2, $3)",
            [teacher, day, time]
          );
          console.log(`Inserted ${teacher}, ${day}, ${time}`);
        }
      }
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to book a slot
app.post("/book-slot", async (req, res) => {
  try {
    const { teacher, day, time, student } = req.body;

    // Check for an existing slot
    const existingSlot = await db.oneOrNone(
      "SELECT * FROM teacher_schedule WHERE teacher_name = $1 AND day = $2 AND time = $3",
      [teacher, day, time]
    );

    // If an existing slot is found and student_name is null, delete it
    if (existingSlot && existingSlot.student_name === null) {
      await db.none("DELETE FROM teacher_schedule WHERE id = $1", [
        existingSlot.id,
      ]);
    }

    // Now insert the new slot
    await db.none(
      "INSERT INTO teacher_schedule(teacher_name, day, time, student_name) VALUES($1, $2, $3, $4)",
      [teacher, day, time, student]
    );

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get("/current-schedule", async (req, res) => {
  try {
    const results = await db.any("SELECT * FROM teacher_schedule");
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
