const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const nodemailer = require("nodemailer");

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

// ✅ Nodemailer Setup (Ethereal Email)
let transporter;
nodemailer.createTestAccount((err, account) => {
  if (err) {
    console.error("Failed to create a testing account. " + err.message);
  } else {
    console.log("✅ Ethereal Email test account created");
    transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass
      }
    });
  }
});

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("Backend working ✅");
});
// ✅ Tickets Count
let eventTickets = {
  "Debugging Mania": 100,
  "Coding Contest": 100,
  "Prompt Mania": 100,
  "Web Design Challenge": 100
};

// ✅ BOOK API
app.post("/book", (req, res) => {
  console.log("📥 Received:", req.body);

  const { name, email, dept, tickets, eventName } = req.body;

  // ✅ Validation
  if (!name || !email || !dept || tickets === "") {
    return res.status(400).json({ message: "All fields required ❌" });
  }

  // ✅ Ticket check
  const eventDisplay = eventName || "General Event";
  if (eventTickets[eventDisplay] === undefined) {
    eventTickets[eventDisplay] = 100;
  }
  
  if (Number(tickets) > eventTickets[eventDisplay]) {
    return res.status(400).json({ message: "Not enough tickets ❌" });
  }

  // ✅ Insert Query
  const query =
    "INSERT INTO bookings (name, email, dept, tickets, event_name) VALUES (?, ?, ?, ?, ?)";

  db.query(query, [name, email, dept, Number(tickets), eventName || "General Event"], (err, result) => {
    if (err) {
      console.log("❌ INSERT ERROR:", err);
      return res.status(500).json({ message: "Database error ❌" });
    }

    console.log("✅ Inserted into DB:", result);

    // ✅ Update tickets
    eventTickets[eventDisplay] -= Number(tickets);

    // ✅ Send Confirmation Email
    if (transporter) {
      const eventDisplay = eventName || "General Event";
      let mailMessage = {
        from: '"Tech Fest Tickets" <noreply@techfest.com>',
        to: email,
        subject: `🎟 Your Ticket Booking Confirmation for ${eventDisplay}`,
        text: `Hello ${name},\n\nYour payment was successful and your booking for ${tickets} tickets to ${eventDisplay} is confirmed.\n\nThank you!`,
        html: `<h3>Booking Confirmed! ✅</h3><p>Hello <b>${name}</b>,</p><p>Your payment was successful and your booking for <b>${tickets} tickets</b> to <b>${eventDisplay}</b> is confirmed.</p><p>Thank you for booking with us!</p>`
      };

      transporter.sendMail(mailMessage, (err, info) => {
        if (err) {
          console.log("❌ Error occurred sending email: " + err.message);
        } else {
          console.log("✅ Confirmation Email sent to: " + email);
          console.log("👉 Preview URL: " + nodemailer.getTestMessageUrl(info));
        }
      });
    }

    res.json({
      message: "Booking successful ✅",
      remaining: eventTickets[eventDisplay],
      eventName: eventDisplay
    });
  });
});

// ✅ GET TICKETS COUNT
app.get("/tickets", (req, res) => {
  res.json(eventTickets);
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