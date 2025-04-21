const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

// Import your models
const LostItem = require('./models/LostItem');
const FoundItem = require('./models/FoundItem');
const UserContact = require('./models/UserContact');

const app = express();
const port = 5000;

// Body parser middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/lost_and_found', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(err => {
    console.error("Error connecting to MongoDB:", err);
  });

// Helper function to send emails
const sendEmailNotification = (toEmail, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Replace with your email provider
    auth: {
      user: 'your-email@example.com', // Replace with your email
      pass: 'your-email-password'     // Replace with your email password
    }
  });

  const mailOptions = {
    from: 'your-email@example.com', // Replace with your email
    to: toEmail,
    subject: subject,
    text: text
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

// Route to add a lost item
app.post('/lost-item', async (req, res) => {
  const { email, itemName, description, image, city, location, featureVector } = req.body;

  try {
    const lostItem = new LostItem({
      email,
      itemName,
      description,
      image,
      city,
      location,
      featureVector
    });

    await lostItem.save();
    res.status(201).json({ message: "Lost item added successfully", lostItem });
  } catch (error) {
    console.error("Error adding lost item:", error);
    res.status(500).json({ error: "Failed to add lost item" });
  }
});

// Route to add a found item
app.post('/found-item', async (req, res) => {
  const { email, itemName, description, image, city, location, featureVector } = req.body;

  try {
    const foundItem = new FoundItem({
      email,
      itemName,
      description,
      image,
      city,
      location,
      featureVector
    });

    await foundItem.save();
    res.status(201).json({ message: "Found item added successfully", foundItem });
  } catch (error) {
    console.error("Error adding found item:", error);
    res.status(500).json({ error: "Failed to add found item" });
  }
});

// Route to search for lost items
app.get('/lost-item/search', async (req, res) => {
  const { city, location, featureVector } = req.query;

  try {
    const lostItems = await LostItem.find({
      city,
      'location.coordinates': { $near: { $geometry: { type: 'Point', coordinates: location }, $maxDistance: 10000 } },
      featureVector: { $eq: featureVector } // Use a feature vector comparison
    });

    if (lostItems.length > 0) {
      res.status(200).json({ message: "Matching lost items found", lostItems });
    } else {
      res.status(404).json({ message: "No matching lost items found" });
    }
  } catch (error) {
    console.error("Error searching for lost items:", error);
    res.status(500).json({ error: "Failed to search for lost items" });
  }
});

// Route to search for found items
app.get('/found-item/search', async (req, res) => {
    try {
      console.log("Received query:", req.query);
  
      const { email, itemName, description, city, longitude, latitude } = req.query;
  
      if (!longitude || !latitude || !city) {
        return res.status(400).json({ success: false, message: "Missing required query parameters" });
      }
  
      const location = {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      };
  
      const nearbyItems = await FoundItem.find({
        city,
        location: {
          $near: {
            $geometry: location,
            $maxDistance: 1000 // in meters
          }
        }
      });
  
      console.log("Nearby items found:", nearbyItems.length);
  
      res.json({ success: true, matches: nearbyItems });
    } catch (err) {
      console.error("Search Error:", err.message);
      res.status(500).json({ success: false, message: "Search failed", error: err.message });
    }
  });
  
// Route to remove an item after exchange
app.delete('/remove-item/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Remove found item
    const foundItem = await FoundItem.findByIdAndDelete(id);
    if (foundItem) {
      res.status(200).json({ message: "Found item removed successfully", foundItem });
    } else {
      // If found item not found, check for lost item
      const lostItem = await LostItem.findByIdAndDelete(id);
      if (lostItem) {
        res.status(200).json({ message: "Lost item removed successfully", lostItem });
      } else {
        res.status(404).json({ message: "Item not found" });
      }
    }
  } catch (error) {
    console.error("Error removing item:", error);
    res.status(500).json({ error: "Failed to remove item" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
