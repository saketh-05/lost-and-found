const nodemailer = require('nodemailer');
require('dotenv').config();


const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.USER_EMAIL,  
    pass: process.env.USER_PASS, 
  }
});

function sendEmail(to, subject, text, html) {
  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: to,
    subject: subject,
    text: text,
    html: html
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email: ', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

// New function to send email for found items
function sendFoundItemEmail(lostItem, foundItem) {
  const subject = 'Found Item Reported';
  const text = `Hi, a found item matching your report has been found! Here are the details:
  Item Name: ${lostItem.itemName}
  Description: ${lostItem.description}
  Location: ${lostItem.city}
  Contact: ${foundItem.email}`;
  
  const html = `<h3>Found Item Reported</h3>
  <p>Hi, a found item matching your report has been found!</p>
  <p><strong>Item Name:</strong> ${lostItem.itemName}</p>
  <p><strong>Description:</strong> ${lostItem.description}</p>
  <p><strong>Location:</strong> ${lostItem.city}</p>
  <p><strong>Contact:</strong> ${foundItem.email}</p>`;
  
  sendEmail(lostItem.email, subject, text, html); // Use sendEmail from email.js
}

module.exports = {
  sendEmail,
  sendFoundItemEmail,
};
