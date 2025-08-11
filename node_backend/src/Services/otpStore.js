const otpMap = new Map(); // email -> { otp, timestamp }

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const saveOtp = (email, otp) => {
  otpMap.set(email, { otp, timestamp: Date.now() });
};

const verifyOtp = (email, inputOtp) => {
  const record = otpMap.get(email);
  if (!record) return { success: false, message: 'No OTP found.' };

  const now = Date.now();
  if (now - record.timestamp > 5 * 60 * 1000) {
    otpMap.delete(email);
    return { success: false, message: 'OTP expired.' };
  }

  if (record.otp !== inputOtp) return { success: false, message: 'Invalid OTP.' };

  otpMap.delete(email); // Remove after successful verification
  return { success: true };
};

module.exports = { generateOtp, saveOtp, verifyOtp };