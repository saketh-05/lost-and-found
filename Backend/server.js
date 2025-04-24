const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const LostItem = require('./models/LostItem');
const FoundItem = require('./models/FoundItem');
const UserContact = require('./models/UserContact');
const { sendLostItemEmail, sendFoundItemEmail } = require('./utils/email');
const app = express();
const port = 5000;

app.use(bodyParser.json());

// MongoDB connection setup
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/lostfound');
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1); // Exit the application in case of a connection failure
  }
};

connectDB();

// Nodemailer configuration for email sending
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service (e.g., Gmail, Outlook, etc.)
  auth: {
    user: 'your-email@gmail.com', // Replace with your email
    pass: 'your-email-password' // Replace with your email password or app password
  }
});

// Function to send emails
function sendEmail(to, subject, text, html) {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: to,
    subject: subject,
    text: text,
    html: html
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email: ', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

// Route for reporting lost items
app.post('/lost-item', async (req, res) => {
  const { email, itemName, description, image, city, location, featureVector } = req.body;

  try {
    const newLostItem = new LostItem({
      email, itemName, description, image, city, location, featureVector
    });
    await newLostItem.save();

    // Notify nearby users (optional, based on your implementation)

    res.status(201).json({ message: 'Lost item added successfully', lostItem: newLostItem });
  } catch (err) {
    res.status(500).json({ message: 'Error adding lost item', error: err });
  }
});

// Route for reporting found items
app.post('/found-item', async (req, res) => {
  const { email, itemName, description, image, city, location, featureVector } = req.body;

  try {
    const newFoundItem = new FoundItem({
      email, itemName, description, image, city, location, featureVector
    });
    await newFoundItem.save();

    // Search for matching lost items
    const matchingLostItems = await LostItem.find({
      itemName: itemName,
      city: city
    });

    if (matchingLostItems.length > 0) {
      // Send email to the user who lost the item using sendFoundItemEmail
      const lostItem = matchingLostItems[0]; // Taking the first match
      sendFoundItemEmail(lostItem, newFoundItem); // Use sendFoundItemEmail function

    }

    res.status(201).json({ success: true, message: 'Found item reported successfully' });
  } catch (err) {
    console.error("Error reporting found item:", err); // This will show the actual error
    res.status(500).json({ success: false, message: 'Error reporting found item', error: err.message || err });
  }
});

// Route to search for found items
app.get('/found-item/search', async (req, res) => {
  const { itemName, city } = req.query;

  try {
    const query = {
      return_done: false
    };

    if (itemName) query.itemName = { $regex: `${itemName}`, $options: 'i' };
    if (city) query.city = { $regex: `${city}`, $options: 'i' };

    console.log("Search query:", query);

    const foundItems = await FoundItem.find(query);
    res.status(200).json({ success: true, foundItems });
  } catch (err) {
    console.error("Error in found item search:", err);
    res.status(500).json({ success: false, message: 'Error searching found items', error: err });
  }
});
app.post('/report-lost-item', async (req, res) => {
  const { email, itemName, description, image, city, location, featureVector } = req.body;

  try {
      // Step 1: Check if item exists in the found collection (as before)
      const foundItem = await FoundItem.findOne({
          itemName: { $regex: new RegExp(itemName, 'i') },
          city: { $regex: new RegExp(city, 'i') }
      });

      if (foundItem) {
          // Item is found, handle the email to the victim and helper (as in your earlier code)
      } else {
          // Step 2: Item not found, add to the Lost Items collection
          const newLostItem = new LostItem({
              email,
              itemName,
              description,
              image,
              city,
              location,
              featureVector,
          });

          await newLostItem.save();

          // Step 3: Send email to nearby users about the lost item
          await sendLostItemEmail(newLostItem);

          res.status(200).json({
              success: true,
              message: "Lost item added successfully and nearby users notified.",
              lostItem: newLostItem
          });
      }
  } catch (err) {
      console.error('Error reporting lost item:', err);
      res.status(500).json({ success: false, message: 'Error reporting lost item' });
  }
});

// Route to remove an item
app.delete('/remove-item/:itemId', async (req, res) => {
  const { itemId } = req.params;

  try {
    const lostItem = await LostItem.findById(itemId);
    if (lostItem) {
      await LostItem.findByIdAndDelete(itemId);
      res.status(200).json({ message: 'Lost item removed successfully', lostItem });
    } else {
      const foundItem = await FoundItem.findById(itemId);
      if (foundItem) {
        await FoundItem.findByIdAndDelete(itemId);
        res.status(200).json({ message: 'Found item removed successfully', foundItem });
      } else {
        res.status(404).json({ message: 'Item not found' });
      }
    }
  } catch (err) {
    res.status(500).json({ message: 'Error removing item', error: err });
  }
});
// Route to search for lost items
app.get('/lost-item/search', async (req, res) => {
  const { itemName, city } = req.query;

  try {
    const query = {
      return_done: false // <- optional but likely used
    };

    if (itemName) query.itemName = { $regex: new RegExp(itemName, 'i') };
    if (city) query.city = { $regex: new RegExp(city, 'i') };

    console.log("Search query:", query); // debugging output

    const lostItems = await LostItem.find(query);
    res.status(200).json({ success: true, lostItems });
  } catch (err) {
    console.error("Error in lost item search:", err);
    res.status(500).json({ success: false, message: 'Error searching lost items', error: err });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
