const FoundItem = require('../models/FoundItem');
const LostItem = require('../models/LostItem');
const UserContact = require('../models/UserContact');
const { calculateTextSimilarity } = require('../utils/textSimilarity');
const { compareImageVectors } = require('../utils/imageSimilarity');
const sendEmail = require('../utils/sendEmail');


// Found item apis from server.js

// Route for reporting found items
// app.post('/found-item', async (req, res) => {
//   const { email, itemName, description, image, city, location, featureVector } = req.body;

//   try {
//     const newFoundItem = new FoundItem({
//       email, itemName, description, image, city, location, featureVector
//     });

//     await newFoundItem.save();

//     const possibleLostItems = await LostItem.find({ city });

//     let matchedItem = null;
//     let highestSimilarity = 0;

//     for (const lostItem of possibleLostItems) {
//       const similarity = cosineSimilarity(featureVector, lostItem.featureVector);

//       if (similarity > 0.8 && similarity > highestSimilarity) {
//         matchedItem = lostItem;
//         highestSimilarity = similarity;
//       }
//     }

//     if (matchedItem) {
//       sendFoundItemEmail(matchedItem, newFoundItem);
//     }

//     res.status(201).json({
//       success: true,
//       message: 'Found item reported successfully',
//       matched: !!matchedItem,
//       similarity: highestSimilarity
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: 'Error reporting found item',
//       error: err.message
//     });
//   }
// });

// // Route to search for found items
// app.get('/found-item/search', async (req, res) => {
//   const { itemName, city } = req.query;

//   try {
//     const query = {};
    
//     if (itemName) query.itemName = { $regex: new RegExp(itemName, 'i') };  // Case-insensitive search
//     if (city) query.city = { $regex: new RegExp(city, 'i') };  // Case-insensitive search

//     const foundItems = await FoundItem.find(query);
//     res.status(200).json({ success: true, foundItems });
//   } catch (err) {
//     console.error("Error in found item search:", err);
//     res.status(500).json({ success: false, message: 'Error searching found items', error: err });
//   }
// });

exports.reportFoundItem = async (req, res) => {
  try {
    const { email, itemName, description, image, city, location, featureVector } = req.body;

    const lostItems = await LostItem.find({ city });

    let bestMatch = null;
    let bestScore = 0;

    for (const item of lostItems) {
      const textScore = calculateTextSimilarity(item.description, description);
      const imageScore = compareImageVectors(item.featureVector, featureVector);
      const locationMatch = getDistance(item.location.coordinates, location.coordinates) < 2;

      const combinedScore = textScore * 0.4 + imageScore * 0.5 + (locationMatch ? 0.1 : 0);

      if (combinedScore > bestScore && combinedScore > 0.7) {
        bestMatch = item;
        bestScore = combinedScore;
      }
    }

    if (bestMatch) {
      await sendEmail(bestMatch.email, `Your Lost Item Might Be Found`, `Helper Email: ${email}`);
      return res.status(200).json({ message: "Lost item matched", item: bestMatch });
    }

    const newFoundItem = new FoundItem({
      email, itemName, description, image, city, location, featureVector
    });
    await newFoundItem.save();

    const contacts = await UserContact.find({ city });
    for (const user of contacts) {
      await sendEmail(user.email, `New Item Found`, `Check if it matches something you lost.`);
    }

    res.status(200).json({ message: "Found item saved" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};
