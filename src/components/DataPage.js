import React, { useEffect, useState } from "react";
import axios from "axios";

import "../styles/dataPage.css";

const DataPage = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get("http://localhost:5500/bookings");
      console.log("Data fetched from server:", response.data); // Debugging line
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const handleUpdate = async (id) => {
    const newCheckoutTime = prompt("Update the new checkout time:");
    if (newCheckoutTime) {
      try {
        const response = await fetch(`http://localhost:5500/bookings/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ checkout: newCheckoutTime }),
        });

        if (response.ok) {
          setBookings(
            bookings.map((booking) =>
              booking._id === id
                ? { ...booking, checkout: newCheckoutTime }
                : booking
            )
          );
        } else {
          console.error("Failed to update checkout time");
        }
      } catch (error) {
        console.error("Error updating checkout time:", error);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5500/bookings/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setBookings(bookings.filter((booking) => booking._id !== id));
      } else {
        console.error("Failed to delete booking");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
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
        <tbody id="bookingBody">
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
                <button
                  className="delete-button"
                  onClick={() => handleDelete(booking._id)}
                >
                  Delete
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
