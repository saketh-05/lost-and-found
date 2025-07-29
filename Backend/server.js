import { MongoClient } from "mongodb";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

// const multer = require("multer");
// const nodemailer = require("nodemailer");
// const LostItem = require("./models/LostItem");
// const FoundItem = require("./models/FoundItem");
// const UserContact = require("./models/UserContact");
// const { sendLostItemEmail, sendFoundItemEmail } = require("./utils/email");

const app = express();

// Set up file storage for image uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./uploads"); // Directory for uploaded files
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname); // Ensure unique filenames
//   },
// });

// const upload = multer({ storage: storage });

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads")); // Serve static files
app.use(bodyParser.urlencoded({ extended: true }));

const port = 5000;

// MongoDB connection setup
// const connectDB = async () => {
//   try {
//     await mongoose.connect("mongodb+srv://dsakethsurya:<db_password>@merncluster.c3k9g.mongodb.net/?retryWrites=true&w=majority&appName=MernCluster");
//     console.log("Connected to MongoDB");
//   } catch (err) {
//     console.error("MongoDB connection failed:", err);
//     process.exit(1); // Exit the application in case of a connection failure
//   }
// };

const connectDB = async () => {
  const uri =
    "mongodb+srv://dsakethsurya:saketh1234@merncluster.c3k9g.mongodb.net/?retryWrites=true&w=majority&appName=MernCluster";
  
    const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1); // Exit the application in case of a connection failure
  }
};

connectDB();

// Nodemailer configuration for email sending
// const transporter = nodemailer.createTransport({
//   service: "gmail", // Use your email service (e.g., Gmail, Outlook, etc.)
//   auth: {
//     user: "your-email@gmail.com", // Replace with your email
//     pass: "your-email-password", // Replace with your email password or app password
//   },
// });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
