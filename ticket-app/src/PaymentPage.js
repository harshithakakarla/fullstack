import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import axios from "axios";

function PaymentPage({ updateTickets }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const form = location.state?.form;
  const selectedEvent = location.state?.selectedEvent;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!form || !selectedEvent) {
    return (
      <div className="form-container" style={{ textAlign: "center" }}>
        <p>No booking details found. Please start over.</p>
        <button className="btn-primary" onClick={() => navigate("/")}>Go Home</button>
      </div>
    );
  }

  const totalAmount = Number(form.tickets) * selectedEvent.price;
  const upiString = `upi://pay?pa=techfest@upi&pn=${selectedEvent.name.replace(/\s+/g, '')}&am=${totalAmount}&cu=INR`;

  const handlePaymentSuccess = async () => {
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...form,
        eventName: selectedEvent.name
      };
      
      const res = await axios.post("http://127.0.0.1:5000/book", payload);
      updateTickets(selectedEvent.name, res.data.remaining);
      navigate("/success", { state: { message: res.data.message, email: form.email, selectedEvent } });
    } catch (err) {
      console.log("ERROR:", err);
      setError("Error booking tickets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container" style={{ textAlign: "center" }}>
      <h2 style={{ color: "#00f2fe", marginBottom: "10px" }}>Payment Gateway</h2>
      
      <div style={{ background: "rgba(0,0,0,0.2)", padding: "15px", borderRadius: "10px", textAlign: "left", marginBottom: "20px" }}>
        <p style={{ margin: "5px 0", color: "#ccc" }}><b>Name:</b> <span style={{ color: "white" }}>{form.name}</span></p>
        <p style={{ margin: "5px 0", color: "#ccc" }}><b>Email:</b> <span style={{ color: "white" }}>{form.email}</span></p>
        <p style={{ margin: "5px 0", color: "#ccc" }}><b>Event:</b> <span style={{ color: "white" }}>{selectedEvent.name}</span></p>
        <p style={{ margin: "5px 0", color: "#ccc" }}><b>Tickets:</b> <span style={{ color: "white" }}>{form.tickets}</span></p>
        <p style={{ margin: "15px 0 5px", color: "#4facfe", fontSize: "1.2rem", fontWeight: "600" }}>Total Amount: ₹{totalAmount}</p>
      </div>

      <div className="qr-container">
        <QRCode value={upiString} size={200} />
      </div>
      
      <p style={{ color: "#ccc", fontSize: "0.9rem", marginBottom: "30px" }}>Scan the QR code with any UPI app to pay</p>

      <button 
        className="btn-primary"
        onClick={handlePaymentSuccess} 
        disabled={loading}
      >
        {loading ? "Processing..." : "I Have Completed The Payment"}
      </button>
      
      <button 
        className="btn-primary btn-secondary"
        onClick={() => navigate(-1)} 
        disabled={loading}
        style={{ marginTop: "15px" }}
      >
        Cancel Payment
      </button>

      {error && <p style={{ color: "#ff0844", marginTop: "20px", fontWeight: "600" }}>{error}</p>}
    </div>
  );
}

export default PaymentPage;
