const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const exceljs = require("exceljs");
const moment = require("moment");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json()); // Parse JSON bodies

mongoose.connect("mongodb://localhost:27017/conferoombooking", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const roomBookingSchema = new mongoose.Schema({
  name: String,
  department: String,
  date: String, // Change this to String to ensure we save formatted date only
  checkin: String,
  checkout: String,
  purpose: String,
  message: String,
  room: String,
});

const RoomBooking = mongoose.model("RoomBooking", roomBookingSchema);

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/");
});

app.get("/export-to-excel", async (req, res) => {
  const bookings = await RoomBooking.find({});

  const workbook = new exceljs.Workbook();
  const worksheet = workbook.addWorksheet("Room Bookings");

  worksheet.columns = [
    { header: "ID", key: "id", width: 10 },
    { header: "Name", key: "name", width: 20 },
    { header: "Department", key: "department", width: 20 },
    { header: "Date", key: "date", width: 15 },
    { header: "Check-in Time", key: "checkin", width: 15 },
    { header: "Check-out Time", key: "checkout", width: 15 },
    { header: "Purpose", key: "purpose", width: 30 },
    { header: "Message", key: "message", width: 30 },
    { header: "Room", key: "room", width: 15 },
  ];

  bookings.forEach((booking) => {
    worksheet.addRow({
      id: booking._id,
      name: booking.name,
      department: booking.department,
      date: booking.date, // Already formatted correctly
      checkin: booking.checkin,
      checkout: booking.checkout,
      purpose: booking.purpose,
      message: booking.message,
      room: booking.room,
    });
  });

  workbook.xlsx.writeBuffer().then((buffer) => {
    res.set({
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=room_bookings.xlsx",
    });
    res.send(buffer);
  });
});

function sendConfirmationEmail(
  name,
  message,
  department,
  checkin,
  checkout,
  purpose,
  room
) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "rituanuragi1@gmail.com",
      pass: "geon ylan rgeq mfld",
    },
  });

  const mailOptions = {
    from: "rituanuragi1@gmail.com",
    to: "rituf2fintech@gmail.com",
    subject: "Thanks For Informing, HR TEAM",
    text:
      `Name: ${name}\n` +
      `Message: ${message}\n` +
      `Department: ${department}\n` +
      `Check-in Time: ${checkin}\n` +
      `Check-out Time: ${checkout}\n` +
      `Purpose: ${purpose}\n` +
      `Room: ${room}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

app.post("/", async function (req, res) {
  const {
    nameofperson: name,
    department,
    date,
    checkin,
    checkout,
    purpose,
    message,
    room,
  } = req.body;

  const formattedDate = moment(date).format("YYYY-MM-DD");

  const newBooking = new RoomBooking({
    name,
    department,
    date: formattedDate,
    checkin,
    checkout,
    purpose,
    message,
    room,
  });

  try {
    await newBooking.save();
    sendConfirmationEmail(
      name,
      message,
      department,
      checkin,
      checkout,
      purpose,
      room
    );
    res.status(200).send("Booking successfully created and email sent.");
  } catch (err) {
    console.error("Error inserting into database:", err);
    res.status(500).send("An error occurred while processing the booking.");
  }
});

app.get("/bookings", async (req, res) => {
  try {
    const bookings = await RoomBooking.find();
    // Ensure date is formatted correctly when sending back to client
    const formattedBookings = bookings.map((booking) => ({
      ...booking._doc,
      date: moment(booking.date).format("YYYY-MM-DD"),
    }));
    res.json(formattedBookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to update checkout time
app.put("/bookings/:id", async (req, res) => {
  const bookingId = req.params.id;
  const { checkout } = req.body;

  try {
    const updatedBooking = await RoomBooking.findByIdAndUpdate(
      bookingId,
      { checkout }, // Update checkout time
      { new: true } // Return the updated document
    );

    if (!updatedBooking) {
      return res.status(404).send("Booking not found.");
    }

    res.status(200).json(updatedBooking); // Return the updated booking
  } catch (error) {
    console.error("Error updating checkout time in database:", error);
    res.status(500).send("An error occurred while updating checkout time.");
  }
});

app.listen(5500, function () {
  console.log("Server started on port 5500");
});
