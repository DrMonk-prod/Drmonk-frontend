// email/emailRoutes.js
const express = require('express');
const router = express.Router();
const {
  sendOtpEmail,
  sendBookingConfirmation,
  sendCancellationNotice,
} = require('../Services/emailService');
const { generateOtp, saveOtp } = require('../Services/otpStore');

// POST /email/send-otp
router.post('/send-otp', async (req, res) => {
    console.log(req.body.email);
  const { email } = req.body;
  const otp=generateOtp();
  saveOtp(email,otp);
  try {
    await sendOtpEmail(email, otp);
    res.status(200).json({ message: 'OTP sent' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// POST /email/confirm-booking
router.post('/confirm-booking', async (req, res) => {
  const { email, doctorName, date, time } = req.body;
  try {
    await sendBookingConfirmation(email, doctorName, date, time);
    res.status(200).json({ message: 'Booking email sent' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send booking email' });
  }
});

// POST /email/cancel-booking
router.post('/cancel-booking', async (req, res) => {
  const { email, doctorName, date, time } = req.body;
  try {
    await sendCancellationNotice(email, doctorName, date, time);
    res.status(200).json({ message: 'Cancellation email sent' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send cancellation email' });
  }
});

// POST /verify-otp
router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore[email];

  if (!record) {
    return res.status(400).json({ error: 'OTP not found' });
  }

  if (Date.now() > record.expiresAt) {
    delete otpStore[email];
    return res.status(400).json({ error: 'OTP expired' });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ error: 'Invalid OTP' });
  }

  // OTP verified
  delete otpStore[email]; // Remove OTP after successful verification

  res.json({ message: 'OTP verified' });
});


module.exports = router;