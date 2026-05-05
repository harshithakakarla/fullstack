import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function SuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const message = location.state?.message || "Booking confirmed!";
  const email = location.state?.email;
  const selectedEvent = location.state?.selectedEvent;

  return (
    <div className="form-container" style={{ textAlign: "center", padding: "50px 30px" }}>
      <div style={{ fontSize: "5rem", marginBottom: "20px", filter: "drop-shadow(0px 0px 20px rgba(0, 242, 254, 0.6))" }}>
        🎉
      </div>
      <h2 style={{ color: "#00f2fe", fontSize: "2rem", marginBottom: "10px" }}>{message}</h2>
      
      {selectedEvent && (
        <p style={{ fontSize: "1.2rem", color: "white", margin: "10px 0" }}>
          See you at <b>{selectedEvent.name}</b>!
        </p>
      )}

      {email && (
        <p style={{ fontSize: "1rem", color: "#ccc", marginTop: "20px", background: "rgba(0,0,0,0.2)", padding: "15px", borderRadius: "10px" }}>
          We have sent a confirmation email with your ticket details to <br/><b style={{color: "white"}}>{email}</b>
        </p>
      )}

      <button 
        className="btn-primary"
        onClick={() => navigate("/")} 
        style={{ marginTop: "40px" }}
      >
        Book Another Ticket
      </button>
    </div>
  );
}

export default SuccessPage;
