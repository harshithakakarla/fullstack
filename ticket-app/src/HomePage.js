import React from "react";
import { useNavigate } from "react-router-dom";
import EventDetails from "./EventDetails";

function HomePage({ events, availableTickets }) {
  const navigate = useNavigate();

  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "40px", fontSize: "2rem", color: "#ccc" }}>
        Discover Our Technical Events
      </h2>
      <div className="events-grid">
        {events.map((evt) => {
          const ticketsForEvent = availableTickets[evt.name] !== undefined ? availableTickets[evt.name] : 100;
          return (
            <div key={evt.id} className="event-card">
              <EventDetails event={evt} availableTickets={ticketsForEvent} />
              
              <div style={{ marginTop: "25px" }}>
                <button 
                  className="btn-primary"
                  onClick={() => navigate("/book", { state: { selectedEvent: evt } })} 
                  disabled={ticketsForEvent === 0}
                >
                  {ticketsForEvent === 0 ? "Sold Out" : "Book Tickets"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HomePage;
