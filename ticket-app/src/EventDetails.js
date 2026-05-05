import React from "react";

function EventDetails({ event, availableTickets }) {
  return (
    <div>
      <h2 className="event-title">{event.name}</h2>
      <p className="event-detail">📍 {event.department} Department</p>
      <p className="event-detail">📅 {event.date} at {event.time}</p>
      <p className="event-detail">🏢 {event.venue}</p>
      <p className="event-detail">💸 ₹{event.price} / Ticket</p>
      <div style={{ marginTop: "15px", padding: "10px", background: "rgba(0, 242, 254, 0.1)", borderRadius: "8px", color: "#00f2fe", fontWeight: "600", textAlign: "center" }}>
        {availableTickets} Tickets Available
      </div>
    </div>
  );
}

export default EventDetails;