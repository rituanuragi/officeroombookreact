import React from "react";
import axios from "axios";
import "../styles/indexPage.css";

const IndexPage = () => {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const data = {
      nameofperson: formData.get("nameofperson"),
      department: formData.get("department"),
      date: formData.get("date"),
      checkin: formData.get("checkin"),
      checkout: formData.get("checkout"),
      purpose: formData.get("purpose"),
      message: formData.get("message"),
      room: formData.get("room"),
    };

    try {
      const response = await axios.post("http://localhost:5500/", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        console.log("Form submitted successfully");
        window.location.href = "/thankyou";
      } else {
        console.error("Failed to submit form");
        alert("There was an issue with your submission. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(
        "An error occurred while submitting the form. Please try again later."
      );
    }
  };

  return (
    <div className="container">
      <h2>Office Room Booking</h2>
      <div style={{ textAlign: "left" }}>
        <button
          onClick={() => (window.location.href = "/data")}
          style={{ backgroundColor: "#47b94d" }}
        >
          Check Availability
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-contact">
          <label htmlFor="nameofperson">Full Name (Manager):</label>
          <input
            type="text"
            id="nameofperson"
            className="input-box"
            name="nameofperson"
            required
            placeholder="Enter your full name"
          />
          <label htmlFor="department">Department:</label>
          <select
            id="department"
            className="department"
            name="department"
            required
          >
            <option value="">Select Department</option>
            <option value="CREDIT">CREDIT</option>
            <option value="HR">HR</option>
            <option value="IT">IT</option>
            <option value="MARKETING">MARKETING</option>
            <option value="OPERATIONS">OPERATIONS</option>
            <option value="PRODUCT">PRODUCT</option>
            <option value="SALES">SALES</option>
          </select>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            className="timeslot"
            name="date"
            required
          />
          {/* <div className="time-slot-container"> */}
          <div>
            <label htmlFor="check-in">Check-in Time:</label>
            <input
              type="time"
              id="check-in"
              className="timeslot"
              name="checkin"
              required
            />
          </div>
          <div className="checkout">
            <label htmlFor="check-out">Check-out Time:</label>
            <input
              type="time"
              id="check-out"
              className="timeslot"
              name="checkout"
              required
            />
          </div>
          {/* </div> */}
          <label htmlFor="purpose">Purpose:</label>
          <select id="purpose" className="purpose" name="purpose" required>
            <option value="">Select Purpose</option>
            <option value="Meeting">Meeting</option>
            <option value="Interview">Interview</option>
            <option value="Training">Training</option>
            <option value="Shooting">Shooting</option>
            <option value="Others">if others, write message</option>
          </select>
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            className="message"
            rows="4"
            name="message"
            placeholder="Enter your message"
          ></textarea>
          <label htmlFor="room">Room Type:</label>
          <br />
          <select id="room" className="room" name="room" required>
            <option value="">Select Room</option>
            <option value="Conference Room">Conference Room</option>
            <option value="HR Room">HR Room</option>
            <option value="Director's Room">Director's Room</option>
          </select>
        </div>
        <button type="submit" className="send">
          Send
        </button>
      </form>
    </div>
  );
};

export default IndexPage;
