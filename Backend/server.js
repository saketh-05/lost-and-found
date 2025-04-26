const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const LostItem = require('./models/LostItem');
const FoundItem = require('./models/FoundItem');
const UserContact = require('./models/UserContact');
const { sendLostItemEmail, sendFoundItemEmail } = require('./utils/email');
const app = express();
app.use(express.json());
const port = 5000;
app.use(cors());
app.use(bodyParser.json());
function cosineSimilarity(vecA, vecB) {
  if (vecA.length !== vecB.length) {
    return 0;
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] ** 2;
    normB += vecB[i] ** 2;
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) return 0;

  return dotProduct / (normA * normB);
}

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
app.post('/report-lost-item', async (req, res) => {
  const { email, itemName, description, image, city, location, featureVector } = req.body;

  try {
    // Step 1: Search for matching found items using cosine similarity
    const foundItems = await FoundItem.find({ city: { $regex: new RegExp(city, 'i') } });

    let bestMatch = null;
    let highestSimilarity = 0;

    for (const foundItem of foundItems) {
      if (!foundItem.featureVector || foundItem.featureVector.length !== featureVector.length) continue;

      const dotProduct = featureVector.reduce((acc, val, i) => acc + val * foundItem.featureVector[i], 0);
      const normA = Math.sqrt(featureVector.reduce((acc, val) => acc + val * val, 0));
      const normB = Math.sqrt(foundItem.featureVector.reduce((acc, val) => acc + val * val, 0));
      const similarity = dotProduct / (normA * normB);

      if (similarity > highestSimilarity) {
        highestSimilarity = similarity;
        bestMatch = foundItem;
      }
    }

    if (bestMatch && highestSimilarity >= 0.9) {
      // Send email to the helper if a match is found
      // Optional: sendFoundItemEmail(newLostItem, bestMatch);

      return res.status(200).json({
        success: true,
        message: "A matching found item has been identified.",
        matchedItem: bestMatch,
        similarity: highestSimilarity
      });
    }

    // Step 2: No match found, add the lost item to DB
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

    // Step 3: Send email to nearby users (skipped for now)
    // await sendLostItemEmail(newLostItem);

    res.status(200).json({
      success: true,
      message: "Lost item added successfully (no match found).",
      lostItem: newLostItem
    });

  } catch (err) {
    console.error('Error reporting lost item:', err);
    res.status(500).json({ success: false, message: 'Error reporting lost item' });
  }
});
app.post('/lost-item', async (req, res) => {
  const { email, itemName, description, image, city, location, featureVector } = req.body;

  try {
    // Check if the user provided all the necessary information-randomcommit
    if (!email || !itemName || !city) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Proceed with adding the lost item to the database
    const newLostItem = new LostItem({
      email, itemName, description, image, city, location, featureVector
    });
    await newLostItem.save();
    
    res.status(201).json({ success: true, message: 'Lost item added successfully', lostItem: newLostItem });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error adding lost item', error: err });
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

    const possibleLostItems = await LostItem.find({ city });

    let matchedItem = null;
    let highestSimilarity = 0;

    for (const lostItem of possibleLostItems) {
      const similarity = cosineSimilarity(featureVector, lostItem.featureVector);

      if (similarity > 0.8 && similarity > highestSimilarity) {
        matchedItem = lostItem;
        highestSimilarity = similarity;
      }
    }

    if (matchedItem) {
      sendFoundItemEmail(matchedItem, newFoundItem);
    }

    res.status(201).json({
      success: true,
      message: 'Found item reported successfully',
      matched: !!matchedItem,
      similarity: highestSimilarity
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error reporting found item',
      error: err.message
    });
  }
});

// Route to search for found items
app.get('/found-item/search', async (req, res) => {
  const { itemName, city } = req.query;

  try {
    const query = {};
    
    if (itemName) query.itemName = { $regex: new RegExp(itemName, 'i') };  // Case-insensitive search
    if (city) query.city = { $regex: new RegExp(city, 'i') };  // Case-insensitive search

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
