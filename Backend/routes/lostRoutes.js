const express = require("express");
const router = express.Router();
const multer = require("multer");
const nodemailer = require("nodemailer");
const LostItem = require("../models/LostItem");
const FoundItem = require("../models/FoundItem");
const { extractImageFeatures } = require("../utils/imageprocessor");
const { computeTextSimilarity } = require("../utils/textprocessor");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// Setup Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// API: Report Lost Item
router.post("/report", upload.single("image"), async (req, res) => {
  try {
    const { email, itemName, description, city } = req.body;
    const image = req.file.path;

    // Extract Image Features
    const featureVector = extractImageFeatures(image);

    // Save Lost Item
    const newLostItem = new LostItem({ email, itemName, description, image, city, featureVector });
    await newLostItem.save();

    // Check for Matches with Found Items
    const foundItems = await FoundItem.find({ city });
    let bestMatch = null;
    let highestScore = 0;

    for (let found of foundItems) {
      // Compute Image Similarity
      const imgSimilarity = featureVector.length > 0 ? cv.matchBruteForceHamming(new cv.Mat(found.featureVector), new cv.Mat(featureVector)).valueOf() : 0;
      
      // Compute Text Similarity
      const textSimilarity = computeTextSimilarity(description, found.description);

      // Weighted Score
      const score = (0.7 * imgSimilarity) + (0.3 * textSimilarity);

      if (score > highestScore) {
        highestScore = score;
        bestMatch = found;
      }
    }

    if (bestMatch && highestScore > 0.5) { // Threshold
      // Send Email Notifications
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: [email, bestMatch.email],
        subject: "Lost & Found Match Found!",
        text: `Your lost item "${itemName}" has a potential match: "${bestMatch.itemName}". Contact ${bestMatch.email}.`
      };
      await transporter.sendMail(mailOptions);
    }

    res.status(201).json({ message: "Lost item reported successfully!" });

  } catch (error) {
    res.status(500).json({ error: "Failed to report lost item" });
  }
});

module.exports = router;
