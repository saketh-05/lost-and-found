const LostItem = require('../models/LostItem');
const FoundItem = require('../models/FoundItem');
const UserContact = require('../models/UserContact');
const { calculateTextSimilarity } = require('../utils/textSimilarity');
const { compareImageVectors } = require('../utils/imageSimilarity');
const sendEmail = require('../utils/sendEmail');
const getDistance = require('../utils/distance'); // you must define this helper


// Lost item api from server.js 
// app.post('/report-lost-item', upload.single('image'), async (req, res) => {
//   const { email, itemName, description, city, location, featureVector } = req.body
//   const image = req.file; // Image file will be available as req.file

//   try {
//     // Step 1: Search for matching found items using cosine similarity
//     const foundItems = await FoundItem.find({ city: { $regex: new RegExp(city, 'i') } });

//     let bestMatch = null;
//     let highestSimilarity = 0;

//     for (const foundItem of foundItems) {
//       if (!foundItem.featureVector || foundItem.featureVector.length !== featureVector.length) continue;

//       const dotProduct = featureVector.reduce((acc, val, i) => acc + val * foundItem.featureVector[i], 0);
//       const normA = Math.sqrt(featureVector.reduce((acc, val) => acc + val * val, 0));
//       const normB = Math.sqrt(foundItem.featureVector.reduce((acc, val) => acc + val * val, 0));
//       const similarity = dotProduct / (normA * normB);

//       if (similarity > highestSimilarity) {
//         highestSimilarity = similarity;
//         bestMatch = foundItem;
//       }
//     }

//     if (bestMatch && highestSimilarity >= 0.9) {
//       return res.status(200).json({
//         success: true,
//         message: "A matching found item has been identified.",
//         matchedItem: bestMatch,
//         similarity: highestSimilarity,
//       });
//     }

//     // Step 2: No match found, add the lost item to DB
//     const newLostItem = new LostItem({
//       email,
//       itemName,
//       description,
//       image: image.path, // Store image path
//       city,
//       location,
//       featureVector,
//     });

//     await newLostItem.save();

//     res.status(200).json({
//       success: true,
//       message: "Lost item added successfully (no match found).",
//       lostItem: newLostItem,
//     });

//   } catch (err) {
//     console.error('Error reporting lost item:', err);
//     res.status(500).json({ success: false, message: 'Error reporting lost item' });
//   }
// });


// app.post('/lost-item', async (req, res) => {
//   const { email, itemName, description, image, city, location, featureVector } = req.body;

//   try {
//     // Check if the user provided all the necessary information-randomcommit
//     if (!email || !itemName || !city) {
//       return res.status(400).json({ success: false, message: 'Missing required fields' });
//     }

//     // Proceed with adding the lost item to the database
//     const newLostItem = new LostItem({
//       email, itemName, description, image, city, location, featureVector
//     });
//     await newLostItem.save();
    
//     res.status(201).json({ success: true, message: 'Lost item added successfully', lostItem: newLostItem });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Error adding lost item', error: err });
//   }
// });


// Route to search for lost items
// app.get('/lost-item/search', async (req, res) => {
//   const { itemName, city } = req.query;

//   try {
//     const query = {
//       return_done: false // <- optional but likely used
//     };

//     if (itemName) query.itemName = { $regex: new RegExp(itemName, 'i') };
//     if (city) query.city = { $regex: new RegExp(city, 'i') };

//     console.log("Search query:", query); // debugging output

//     const lostItems = await LostItem.find(query);
//     res.status(200).json({ success: true, lostItems });
//   } catch (err) {
//     console.error("Error in lost item search:", err);
//     res.status(500).json({ success: false, message: 'Error searching lost items', error: err });
//   }
// });




exports.reportLostItem = async (req, res) => {
  try {
    const { email, itemName, description, city, latitude, longitude, date } = req.body;

    // Get image path from multer
    const imagePath = req.file?.path;

    // Generate feature vector from uploaded image (optional: implement in utils)
    const featureVector = await generateFeatureVector(imagePath); // You need to define this if using image similarity

    const location = {
      type: 'Point',
      coordinates: [parseFloat(longitude), parseFloat(latitude)],
    };

    // 1. Search for potential match in FoundItem
    const foundItems = await FoundItem.find({ city });

    let bestMatch = null;
    let bestScore = 0;

    for (const item of foundItems) {
      const textScore = calculateTextSimilarity(item.description, description);
      const imageScore = compareImageVectors(item.featureVector, featureVector);
      const locationMatch = getDistance(item.location.coordinates, location.coordinates) < 2; // km

      const combinedScore = textScore * 0.4 + imageScore * 0.5 + (locationMatch ? 0.1 : 0);

      if (combinedScore > bestScore && combinedScore > 0.7) {
        bestMatch = item;
        bestScore = combinedScore;
      }
    }

    if (bestMatch) {
      // Notify the reporter with the helper’s contact
      await sendEmail(email, `Item Match Found`, `Helper Email: ${bestMatch.email}`);
      return res.status(200).json({ message: "Match found", item: bestMatch });
    }

    // 2. No match found → Save lost item
    const newLostItem = new LostItem({
      email,
      itemName,
      description,
      image: imagePath,
      city,
      date,
      location,
      featureVector,
    });

    await newLostItem.save();

    // 3. Notify users in the same city
    const contacts = await UserContact.find({ city });
    for (const user of contacts) {
      await sendEmail(user.email, `New Lost Item Reported`, `A new item was reported lost in ${city}. Check if it matches what you found.`);
    }

    res.status(200).json({ message: "Lost item reported & saved" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
