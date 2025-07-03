const cv = require("opencv4nodejs");
const natural = require("natural");
const TfIdf = natural.TfIdf;

/**
 * Extracts ORB descriptors from an image for feature matching.
 * @param {string} imagePath - Path to the image file.
 * @returns {Array} - Feature descriptors.
 */
const extractImageFeatures = (imagePath) => {
  try {
    const img = cv.imread(imagePath).bgrToGray();
    const orb = new cv.ORBDetector();
    const keypoints = orb.detect(img);
    const descriptors = orb.compute(img, keypoints);
    return descriptors ? Array.from(descriptors.getDataAsArray()) : [];
  } catch (error) {
    console.error("Error processing image:", error);
    return [];
  }
};

/**
 * Computes cosine-based text similarity using TF-IDF.
 * @param {string} text1 - First text string.
 * @param {string} text2 - Second text string.
 * @returns {number} - Similarity score (0 to 1).
 */
const computeTextSimilarity = (text1, text2) => {
  const tfidf = new TfIdf();
  tfidf.addDocument(text1);
  tfidf.addDocument(text2);
  let score = 0;
  tfidf.tfidfs(text2, (i, measure) => {
    score = measure;
  });
  return score;
};

module.exports = {
  extractImageFeatures,
  computeTextSimilarity,
};
