import React, { useState } from "react";
import axios from "axios";

function BookingForm({ availableTickets, updateTickets }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    dept: "",
    tickets: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Sending:", form);

    try {
      const res = await axios.post("http://127.0.0.1:5000/book", form);

      setMessage(res.data.message);
      updateTickets(res.data.remaining);

      setForm({
        name: "",
        email: "",
        dept: "",
        tickets: ""
      });

    } catch (err) {
      console.log("ERROR:", err);
      setMessage("Error booking tickets ❌");
    }
  };

  return (
    <div>
      <h2>Book Tickets</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />
        <br /><br />

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <br /><br />

        <select name="dept" value={form.dept} onChange={handleChange}>
          <option value="">Select Department</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
          <option value="IT">IT</option>
        </select>
        <br /><br />

        <input
          type="number"
          name="tickets"
          placeholder="Tickets"
          value={form.tickets}
          onChange={handleChange}
        />
        <br /><br />

        <button type="submit" disabled={availableTickets === 0}>
          {availableTickets === 0 ? "Sold Out" : "Book Now"}
        </button>
      </form>

      <p style={{ color: message.includes("successful") ? "green" : "red" }}>
        {message}
      </p>
    </div>
  );
}

export default BookingForm;