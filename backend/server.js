const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

// ✅ Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// ✅ MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Harshitha2610", // 👉 your MySQL password
  database: "ticketDB"
});

// ✅ Connect DB
db.connect((err) => {
  if (err) {
    console.log("❌ DB CONNECTION ERROR:", err);
  } else {
    console.log("✅ MySQL Connected");
  }
});

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("Backend working ✅");
});
// ✅ Tickets Count
let availableTickets = 50;

// ✅ BOOK API
app.post("/book", (req, res) => {
  console.log("📥 Received:", req.body);

  const { name, email, dept, tickets } = req.body;

  // ✅ Validation
  if (!name || !email || !dept || tickets === "") {
    return res.status(400).json({ message: "All fields required ❌" });
  }

  // ✅ Ticket check
  if (Number(tickets) > availableTickets) {
    return res.status(400).json({ message: "Not enough tickets ❌" });
  }

  // ✅ Insert Query
  const query =
    "INSERT INTO bookings (name, email, dept, tickets) VALUES (?, ?, ?, ?)";

  db.query(query, [name, email, dept, Number(tickets)], (err, result) => {
    if (err) {
      console.log("❌ INSERT ERROR:", err);
      return res.status(500).json({ message: "Database error ❌" });
    }

    console.log("✅ Inserted into DB:", result);

    // ✅ Update tickets
    availableTickets -= Number(tickets);

    res.json({
      message: "Booking successful ✅",
      remaining: availableTickets
    });
  });
});

// ✅ GET ALL BOOKINGS (optional)
app.get("/bookings", (req, res) => {
  db.query("SELECT * FROM bookings", (err, result) => {
    if (err) {
      console.log("❌ FETCH ERROR:", err);
      return res.status(500).send("Error");
    }
    res.json(result);
  });
});

// ✅ START SERVER
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});