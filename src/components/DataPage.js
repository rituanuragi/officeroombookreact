import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import "../styles/dataPage.css";

const DataPage = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get("http://localhost:5500/bookings");
      const today = moment().format("YYYY-MM-DD");
      const filteredBookings = response.data.filter((booking) => {
        return moment(booking.date).format("YYYY-MM-DD") === today;
      });
      setBookings(filteredBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const handleUpdate = async (id) => {
    const newCheckoutTime = prompt("Update the new checkout time:");
    if (newCheckoutTime) {
      try {
        const response = await axios.put(
          `http://localhost:5500/bookings/${id}`,
          {
            checkout: newCheckoutTime,
          }
        );

        if (response.status === 200) {
          // Update the checkout time in the local state
          setBookings((prevBookings) =>
            prevBookings.map((booking) =>
              booking._id === id
                ? { ...booking, checkout: newCheckoutTime }
                : booking
            )
          );
          alert("Checkout time updated successfully.");
        } else {
          console.error("Failed to update checkout time");
          alert("Failed to update checkout time. Please try again later.");
        }
      } catch (error) {
        console.error("Error updating checkout time:", error);
        alert("An error occurred while updating checkout time.");
      }
    }
  };

  return (
    <div className="data-page">
      <table id="bookingTable">
        <thead>
          <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Date</th>
            <th>Check-in Time</th>
            <th>Check-out Time</th>
            <th>Purpose</th>
            <th>Message</th>
            <th>Room</th>
            <th>Action</th>
            <th>
              <a href="http://localhost:5500/export-to-excel">Download</a>
            </th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id}>
              <td>{booking.name}</td>
              <td>{booking.department}</td>
              <td>{booking.date}</td>
              <td>{booking.checkin}</td>
              <td>{booking.checkout}</td>
              <td>{booking.purpose}</td>
              <td>{booking.message}</td>
              <td>{booking.room}</td>
              <td>
                <button
                  className="update-button"
                  onClick={() => handleUpdate(booking._id)}
                >
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataPage;
