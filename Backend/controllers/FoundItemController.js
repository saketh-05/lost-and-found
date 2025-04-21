const FoundItem = require('../models/FoundItem');
const LostItem = require('../models/LostItem');
const UserContact = require('../models/UserContact');
const { calculateTextSimilarity } = require('../utils/textSimilarity');
const { compareImageVectors } = require('../utils/imageSimilarity');
const sendEmail = require('../utils/sendEmail');

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
