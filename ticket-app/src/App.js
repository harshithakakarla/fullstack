import "./styles.css";
import React, { useState } from "react";
import BookingForm from "./BookingForm";
import EventDetails from "./EventDetails";

function App() {
  const event = {
    name: "Tech Fest 2026",
    department: "CSE",
    date: "20 April 2026",
    time: "10:00 AM",
    venue: "Auditorium",
    price: 100
  };

  const [availableTickets, setAvailableTickets] = useState(50);

  const updateTickets = (remaining) => {
    setAvailableTickets(remaining);
  };

  return (
    <div className="container">
      <h1>🎟 Event Ticket Booking System</h1>

      <EventDetails event={event} availableTickets={availableTickets} />

      <BookingForm
        availableTickets={availableTickets}
        updateTickets={updateTickets}
      />
    </div>
  );
}

export default App;