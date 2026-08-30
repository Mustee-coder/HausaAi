import type { Request, Response } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET is not defined");
}

const generateToken = (userId: mongoose.Types.ObjectId): string => {
  return jwt.sign(
    { id: userId },
    jwtSecret,
    {
      expiresIn: "7d",
    }
  );
};

const setAuthCookie = (
  res: Response,
  token: string
): void => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production"
        ? "none"
        : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

async function register(
  req: Request<{}, {}, RegisterBody>,
  res: Response
) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are all required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    const normalizedEmail = email
      .toLowerCase()
      .trim();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
    });

    const token = generateToken(user._id);

    setAuthCookie(res, token);

    return res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("register error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not create account. Please try again.",
    });
  }
}



interface LoginBody {
  email: string;
  password: string;
}

async function login(
  req: Request<{}, {}, LoginBody>,
  res: Response
) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = generateToken(user._id);

    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("login error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not log in. Please try again.",
    });
  }
}

async function logout(
  req: Request,
  res: Response
) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production"
          ? "none"
          : "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error("logout error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not log out. Please try again.",
    });
  }
}

async function getMe(
  req: Request,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated.",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferredLanguage: user.preferredLanguage,
      },
    });
  } catch (error) {
    console.error("getMe error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not fetch user.",
    });
  }
}




export {
  register,
  login,
  logout,
  getMe,
};