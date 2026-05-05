import "./styles.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import BookingPage from "./BookingPage";
import PaymentPage from "./PaymentPage";
import SuccessPage from "./SuccessPage";

function App() {
  const events = [
    {
      id: 1,
      name: "Debugging Mania",
      department: "CSE",
      date: "10 May 2026",
      time: "10:00 AM",
      venue: "Lab 1",
      price: 50
    },
    {
      id: 2,
      name: "Coding Contest",
      department: "CSE",
      date: "10 May 2026",
      time: "12:00 PM",
      venue: "Lab 2",
      price: 150
    },
    {
      id: 3,
      name: "Prompt Mania",
      department: "IT",
      date: "10 May 2026",
      time: "10:00 AM",
      venue: "Auditorium",
      price: 100
    },
    {
      id: 4,
      name: "Web Design Challenge",
      department: "IT",
      date: "10 May 2026",
      time: "02:00 PM",
      venue: "Lab 3",
      price: 120
    }
  ];

  const [availableTickets, setAvailableTickets] = useState({
    "Debugging Mania": 100,
    "Coding Contest": 100,
    "Prompt Mania": 100,
    "Web Design Challenge": 100
  });

  const updateTickets = (eventName, remaining) => {
    setAvailableTickets(prev => ({ ...prev, [eventName]: remaining }));
  };

  useEffect(() => {
    fetch("http://127.0.0.1:5000/tickets")
      .then((res) => res.json())
      .then((data) => {
        setAvailableTickets(data);
      })
      .catch((err) => console.log("Error fetching tickets:", err));
  }, []);

  return (
    <Router>
      <div className="app-container">
        <h1 className="main-header">Tech Fest 2026</h1>
        <Routes>
          <Route
            path="/"
            element={<HomePage events={events} availableTickets={availableTickets} />}
          />
          <Route
            path="/book"
            element={<BookingPage availableTickets={availableTickets} />}
          />
          <Route
            path="/payment"
            element={<PaymentPage updateTickets={updateTickets} />}
          />
          <Route
            path="/success"
            element={<SuccessPage />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;