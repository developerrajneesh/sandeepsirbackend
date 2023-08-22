const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://dental:dental@cluster0.usepymf.mongodb.net/?retryWrites=true&w=majority');
const db = mongoose.connection;
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define Schema and Model
const appointmentSchema = new mongoose.Schema({
  name: String,
  phone: String,
  time: String,
  selectedProblem: String,
  selectedGender: String,
  selectedDate: String
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

// API route to save an appointment
app.post('/api/appointments', async (req, res) => {
  try {
    const { name, phone, selectedDate, selectedProblem, selectedGender, time } = req.body;
    const newAppointment = new Appointment({
      name,
      phone,
      selectedDate,
      selectedProblem,
      selectedGender,
      time
    });
    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/appointments', async (req, res) => {
    try {
      const appointments = await Appointment.find();
      res.status(200).json(appointments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
