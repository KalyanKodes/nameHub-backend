// Import required dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // To load the environment variables from the .env file

// Create an Express app
const app = express();

// Middleware to handle JSON requests and enable CORS
app.use(express.json()); // To parse JSON bodies
app.use(cors()); // To allow cross-origin requests (from frontend)

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Define the Visitor schema
const visitorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
}, { timestamps: true });

// Create a Visitor model based on the schema
const Visitor = mongoose.model('Visitor', visitorSchema);

// Routes

// Route to add a new visitor
app.post('/addVisitor', async (req, res) => {
  const { name } = req.body; // Get name from the request body

  try {
    const newVisitor = new Visitor({ name });
    await newVisitor.save(); // Save the visitor in MongoDB
    res.status(201).json({ message: 'Visitor added successfully!' });
  } catch (err) {
    res.status(400).json({ error: 'Error adding visitor' });
  }
});

// Route to get all visitors
app.get('/visitors', async (req, res) => {
  try {
    const visitors = await Visitor.find(); // Fetch all visitors from the database
    res.json(visitors); // Send visitors as a JSON response
  } catch (err) {
    res.status(400).json({ error: 'Error fetching visitors' });
  }
});

// Start the Express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
