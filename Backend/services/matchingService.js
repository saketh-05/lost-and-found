const path = require('path');
const { computeTextSimilarity, extractImageFeatures } = require('./utils/matchingUtils');
const FoundItem = require('../models/FoundItem');
const LostItem = require('../models/LostItem');

const matchLostItem = async (lostItem) => {
  const foundItems = await FoundItem.find();

  const matches = [];

  const lostText = `${lostItem.itemName} ${lostItem.description}`;
  const lostImageFeatures = extractImageFeatures(path.join(__dirname, '..', 'uploads', lostItem.image));

  for (const foundItem of foundItems) {
    const foundText = `${foundItem.itemName} ${foundItem.description}`;
    const textScore = computeTextSimilarity(lostText, foundText);

    const foundImageFeatures = extractImageFeatures(path.join(__dirname, '..', 'uploads', foundItem.image));

    // Simple vector comparison (number of common features as proxy)
    const commonFeatures = lostImageFeatures.filter(feature =>
      foundImageFeatures.some(f => JSON.stringify(f) === JSON.stringify(feature))
    );
    const imageScore = commonFeatures.length / (lostImageFeatures.length || 1); // avoid divide by 0

    const overallScore = (textScore * 0.6) + (imageScore * 0.4); // weighted score

    if (overallScore > 0.3) {
      matches.push({ foundItem, score: overallScore });
    }
  }

  return matches.sort((a, b) => b.score - a.score);
};
