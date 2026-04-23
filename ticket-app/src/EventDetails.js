import React from "react";

function EventDetails({ event, availableTickets }) {
  return (
    <div>
      <h2>{event.name}</h2>
      <p>Department: {event.department}</p>
      <p>Date: {event.date}</p>
      <p>Time: {event.time}</p>
      <p>Venue: {event.venue}</p>
      <p>Price: ₹{event.price}</p>
      <p><b>Available Tickets: {availableTickets}</b></p>
    </div>
  );
}

export default EventDetails;