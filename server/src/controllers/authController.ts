import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/User.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import { AppError } from "../utils/errors.js";
import { Role } from "@appliences/shared";

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password } = req.body;

    const existing = await UserModel.findOne({ email });
    if (existing) {
      throw new AppError(409, "Email already registered");
    }

    const user = await UserModel.create({ name, email, password, role: Role.USER });

    const payload = { userId: user._id.toString(), email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: { user: user.toJSON(), accessToken, refreshToken },
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError(401, "Invalid email or password");
    }

    if (!user.isApproved) {
      throw new AppError(403, "Your account is pending approval");
    }

    const payload = { userId: user._id.toString(), email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      success: true,
      message: "Login successful",
      data: { user: user.toJSON(), accessToken, refreshToken },
    });
  } catch (error) {
    next(error);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new AppError(400, "Refresh token required");
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await UserModel.findById(decoded.userId);

    if (!user || user.refreshToken !== refreshToken) {
      throw new AppError(401, "Invalid refresh token");
    }

    const payload = { userId: user._id.toString(), email: user.email, role: user.role };
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({
      success: true,
      message: "Token refreshed",
      data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    await UserModel.findByIdAndUpdate(req.user!.userId, { refreshToken: null });
    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await UserModel.findById(req.user!.userId);
    if (!user) {
      throw new AppError(404, "User not found");
    }
    res.json({ success: true, message: "User profile", data: user.toJSON() });
  } catch (error) {
    next(error);
  }
}
