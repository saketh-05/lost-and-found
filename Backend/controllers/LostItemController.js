const LostItem = require('../models/LostItem');
const FoundItem = require('../models/FoundItem');
const UserContact = require('../models/UserContact');
const { calculateTextSimilarity } = require('../utils/textSimilarity');
const { compareImageVectors } = require('../utils/imageSimilarity');
const sendEmail = require('../utils/sendEmail'); // you'll define this

exports.reportLostItem = async (req, res) => {
  try {
    const { email, itemName, description, image, city, location, featureVector } = req.body;

    // Search for match in FoundItem collection
    const foundItems = await FoundItem.find({ city });

    let bestMatch = null;
    let bestScore = 0;

    for (const item of foundItems) {
      const textScore = calculateTextSimilarity(item.description, description);
      const imageScore = compareImageVectors(item.featureVector, featureVector);
      const locationMatch = getDistance(item.location.coordinates, location.coordinates) < 2; // in km

      const combinedScore = textScore * 0.4 + imageScore * 0.5 + (locationMatch ? 0.1 : 0);

      if (combinedScore > bestScore && combinedScore > 0.7) {
        bestMatch = item;
        bestScore = combinedScore;
      }
    }

    if (bestMatch) {
      // send email to victim with helper's email
      await sendEmail(email, `Item Match Found`, `Helper Email: ${bestMatch.email}`);
      return res.status(200).json({ message: "Match found", item: bestMatch });
    }

    // No match found: save lost item
    const newLostItem = new LostItem({
      email, itemName, description, image, city, location, featureVector
    });
    await newLostItem.save();

    // Notify nearby users
    const contacts = await UserContact.find({ city });
    for (const user of contacts) {
      await sendEmail(user.email, `New Lost Item Reported`, `Check if it matches what you found.`);
    }

    res.status(200).json({ message: "Lost item reported & saved" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};
