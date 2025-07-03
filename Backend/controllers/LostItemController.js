const LostItem = require('../models/LostItem');
const FoundItem = require('../models/FoundItem');
const UserContact = require('../models/UserContact');
const { calculateTextSimilarity } = require('../utils/textSimilarity');
const { compareImageVectors } = require('../utils/imageSimilarity');
const sendEmail = require('../utils/sendEmail');
const getDistance = require('../utils/distance'); // you must define this helper

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
