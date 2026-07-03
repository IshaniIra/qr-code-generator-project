import User from "../models/User.js";
import {
  createEmailVerificationToken,
  createLoginToken,
  hashToken
} from "../utils/tokens.js";
import { sendVerificationEmail } from "../services/emailService.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email"
      });
    }

    const { rawToken, hashedToken } = createEmailVerificationToken();

    const user = await User.create({
      name,
      email,
      password,
      emailVerificationToken: hashedToken,
      emailVerificationExpires: Date.now() + 60 * 60 * 1000
    });

    const verificationLink = `http://localhost:5000/api/auth/verify-email?token=${rawToken}`;

    await sendVerificationEmail({
      email: user.email,
      name: user.name,
      verificationLink
    });

    res.status(201).json({
      message: "User registered successfully. Please verify your email.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
      error: error.message
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        message: "Verification token is missing"
      });
    }

    const hashedToken = hashToken(token);

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired verification token"
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await user.save();

    res.json({
      message: "Email verified successfully. You can now log in."
    });
  } catch (error) {
    res.status(500).json({
      message: "Email verification failed",
      error: error.message
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const passwordMatches = await user.matchPassword(password);

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in"
      });
    }

    const token = createLoginToken(user._id);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message
    });
  }
};