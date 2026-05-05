import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function BookingPage({ availableTickets }) {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedEvent = location.state?.selectedEvent;
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    dept: "",
    tickets: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const ticketsForEvent = selectedEvent ? (availableTickets[selectedEvent.name] !== undefined ? availableTickets[selectedEvent.name] : 100) : 0;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedEvent) {
      setError("Please select an event from the home page first.");
      return;
    }

    if (!form.name || !form.email || !form.dept || !form.tickets) {
      setError("Please fill all fields.");
      return;
    }

    if (Number(form.tickets) > ticketsForEvent) {
      setError("Not enough tickets available.");
      return;
    }

    if (Number(form.tickets) <= 0) {
      setError("Please enter a valid number of tickets.");
      return;
    }

    navigate("/payment", { state: { form, selectedEvent } });
  };

  return (
    <div className="form-container">
      <h2 style={{ textAlign: "center", marginBottom: "30px", color: "#00f2fe" }}>
        Booking: {selectedEvent ? selectedEvent.name : "Unknown Event"}
      </h2>

      <form onSubmit={handleSubmit}>
        <label style={{ color: "#ccc", fontSize: "0.9rem", marginLeft: "5px" }}>Full Name</label>
        <input
          name="name"
          placeholder="Enter your name"
          value={form.name}
          onChange={handleChange}
        />

        <label style={{ color: "#ccc", fontSize: "0.9rem", marginLeft: "5px" }}>Email Address</label>
        <input
          name="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
        />

        <label style={{ color: "#ccc", fontSize: "0.9rem", marginLeft: "5px" }}>Department</label>
        <select name="dept" value={form.dept} onChange={handleChange}>
          <option value="">Select Department</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
          <option value="IT">IT</option>
          <option value="MECH">MECH</option>
        </select>

        <label style={{ color: "#ccc", fontSize: "0.9rem", marginLeft: "5px" }}>Number of Tickets</label>
        <input
          type="number"
          name="tickets"
          placeholder="e.g. 2"
          value={form.tickets}
          onChange={handleChange}
        />

        <button type="submit" className="btn-primary" disabled={ticketsForEvent === 0}>
          {ticketsForEvent === 0 ? "Sold Out" : "Proceed to Payment"}
        </button>
        <button 
          type="button" 
          className="btn-primary btn-secondary" 
          style={{ marginTop: "15px" }}
          onClick={() => navigate("/")}
        >
          Cancel
        </button>
      </form>

      {error && <p style={{ color: "#ff0844", textAlign: "center", marginTop: "20px", fontWeight: "600" }}>{error}</p>}
    </div>
  );
}

export default BookingPage;
