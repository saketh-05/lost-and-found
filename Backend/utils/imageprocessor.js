const cv = require("opencv4nodejs");

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

module.exports = { extractImageFeatures };
