import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import Otp from '../models/Otp.js';
import { sendMail } from '../config/nodemailer.js';

const OTP_EXPIRY_MINUTES = 10;
const OTP_LENGTH = 6;

function generateOtp() {
  const otp =  Math.floor(100000 + Math.random() * 900000).toString();
  console.log(otp);
  return otp;
}

// Student: send OTP to rollno@nitt.edu
// Faculty/Staff: send OTP to provided @nitt.edu webmail
export const sendOtp = async (req, res) => {
  try {
    const { rollNo, email, userType } = req.body;

    let targetEmail = null;
    let rollNoLock = null;

    if (userType === 'student') {
      if (!rollNo || typeof rollNo !== 'string') {
        return res.status(400).json({ message: 'Roll number is required' });
      }
      const cleanRoll = rollNo.trim().toLowerCase();
      if (!cleanRoll) {
        return res.status(400).json({ message: 'Valid roll number is required' });
      }
      if (cleanRoll.length < 9) {
        return res.status(400).json({ message: 'Roll number must be at least 9 digits' });
      }
      targetEmail = `${cleanRoll}@nitt.edu`;
      rollNoLock = cleanRoll;
    } else if (userType === 'faculty' || userType === 'staff') {
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ message: 'Institute webmail is required' });
      }
      const e = email.trim().toLowerCase();
      if (!e.endsWith('@nitt.edu')) {
        return res.status(400).json({ message: 'Only @nitt.edu webmail is allowed' });
      }
      targetEmail = e;
    } else {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await Otp.deleteMany({ email: targetEmail });
    await Otp.create({ email: targetEmail, otp, expiresAt });

    try {
      await sendMail(
        targetEmail,
        'NITT ID Card Re-issue – OTP Verification',
        `Your OTP is: ${otp}. It is valid for ${OTP_EXPIRY_MINUTES} minutes. Do not share this with anyone.`,
        `<p>Your OTP is: <strong>${otp}</strong>.</p><p>Valid for ${OTP_EXPIRY_MINUTES} minutes. Do not share with anyone.</p>`
      );
    } catch (mailError) {
      console.error('Nodemailer error:', mailError);
      return res.status(400).json({ message: 'Email does not exist or delivery failed' });
    }

    res.json({
      success: true,
      message: 'OTP sent to your institute webmail',
      email: targetEmail,
      ...(rollNoLock != null ? { rollNo: rollNoLock } : {})
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
  }
};

// Verify OTP and issue JWT (email and rollNo locked in token)
export const verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp, userType } = req.body;

    if (!email || !otp || !userType) {
      return res.status(400).json({ message: 'Email, OTP and user type are required' });
    }

    const e = email.trim().toLowerCase();
    const otpDoc = await Otp.findOne({ email: e });

    if (!otpDoc) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    if (otpDoc.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: otpDoc._id });
      return res.status(400).json({ message: 'OTP has expired' });
    }
    if (otpDoc.otp !== String(otp).trim()) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    await Otp.deleteOne({ _id: otpDoc._id });

    const payload = {
      email: e,
      userType,
      verified: true,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 2 // 2 hours
    };
    if (userType === 'student') {
      const rollNo = e.replace(/@nitt\.edu$/, '');
      payload.rollNo = rollNo;
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 2 * 60 * 60 * 1000 // 2 hours
    });

    res.json({
      success: true,
      token,
      email: e,
      userType,
      ...(payload.rollNo ? { rollNo: payload.rollNo } : {})
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Verification failed' });
  }
};

// Admin Login (no registration – admins are added by existing admins)
export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.json({
      success: true,
      token,
      admin: { id: admin._id, username: admin.username, role: admin.role }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin forgot password: send OTP to admin email
export const adminForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ message: 'Email is required' });
    }
    const e = email.trim().toLowerCase();
    const admin = await Admin.findOne({ email: e });
    if (!admin) {
      return res.status(404).json({ message: 'No admin account found with this email' });
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
    await Otp.deleteMany({ email: e });
    await Otp.create({ email: e, otp, expiresAt });

    await sendMail(
      e,
      'NITT Admin – Password Reset OTP',
      `Your OTP is: ${otp}. Valid for ${OTP_EXPIRY_MINUTES} minutes. Do not share.`,
      `<p>Your OTP is: <strong>${otp}</strong>. Valid for ${OTP_EXPIRY_MINUTES} minutes. Do not share.</p>`
    );

    res.json({ success: true, message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

// Admin reset password: verify OTP and set new password
export const adminResetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, OTP and new password are required' });
    }
    const e = email.trim().toLowerCase();
    const otpDoc = await Otp.findOne({ email: e });
    if (!otpDoc || otpDoc.otp !== String(otp).trim() || otpDoc.expiresAt < new Date()) {
      await Otp.deleteOne({ email: e }).catch(() => {});
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    const admin = await Admin.findOne({ email: e });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    admin.password = newPassword;
    await admin.save();
    await Otp.deleteOne({ _id: otpDoc._id });
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Failed to update password' });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  });
  res.json({ success: true, message: 'Logged out successfully' });
};