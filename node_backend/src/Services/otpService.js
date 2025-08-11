
const axios = require("axios");

const MSG91_BASE_URL = "https://control.msg91.com/api/v5/otp";

async function sendOTP(mobile) {
  const url = `${MSG91_BASE_URL}?template_id=${process.env.MSG91_TEMPLATE_ID}&mobile=${mobile}&authkey=${process.env.MSG91_AUTH_KEY}`;
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (err) {
    throw new Error("Failed to send OTP: " + err.message);
  }
}

async function verifyOTP(mobile, otp) {
  const url = `${MSG91_BASE_URL}/verify?mobile=${mobile}&otp=${otp}&authkey=${process.env.MSG91_AUTH_KEY}`;
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (err) {
    throw new Error("Failed to verify OTP: " + err.message);
  }
}

module.exports = { sendOTP, verifyOTP };