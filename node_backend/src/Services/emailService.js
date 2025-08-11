// email/emailService.js
const {sendEmail} = require('./mailer');

const sendOtpEmail = (email, otp) => {
  const subject = 'Your OTP Code';
  const text = `Your OTP is: ${otp}. Valid for 5 minutes.`;
  return sendEmail(email, subject, text);
};

const sendBookingConfirmation = (email, doctorName, date, time) => {
  const subject = 'Appointment Confirmed';
  const text = `Your appointment with Dr. ${doctorName} is booked on ${date} at ${time}.`;
  return sendEmail(email, subject, text);
};

const sendCancellationNotice = (email, doctorName, date, time) => {
  const subject = 'Appointment Cancelled';
  const text = `Your appointment with Dr. ${doctorName} on ${date} at ${time} is cancelled.`;
  return sendEmail(email, subject, text);
};

module.exports = {
  sendOtpEmail,
  sendBookingConfirmation,
  sendCancellationNotice,
};