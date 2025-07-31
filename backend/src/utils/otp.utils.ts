/**
 * Generate a random OTP and its expiry time
 * @returns Object containing OTP and expiry time
 */
export const generateOTP = () => {
  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Set expiry time to 10 minutes from now
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  return { otp, expiresAt };
};

/**
 * Verify if an OTP is valid and not expired
 * @param inputOTP - The OTP to verify
 * @param storedOTP - The stored OTP to compare against
 * @param expiryTime - The expiry time of the OTP
 * @returns boolean indicating if OTP is valid
 */
export const verifyOTP = (
  inputOTP: string,
  storedOTP: string,
  expiryTime: Date
): boolean => {
  // Check if OTP matches
  if (inputOTP !== storedOTP) {
    return false;
  }

  // Check if OTP is expired
  if (new Date() > expiryTime) {
    return false;
  }

  return true;
};