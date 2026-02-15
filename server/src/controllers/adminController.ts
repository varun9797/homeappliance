import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/User.js";
import { AppError } from "../utils/errors.js";
import { Role } from "@appliences/shared";

export async function getUsers(_req: Request, res: Response, next: NextFunction) {
  try {
    const users = await UserModel.find().sort({ createdAt: -1 });
    res.json({ success: true, message: "Users fetched", data: users });
  } catch (error) {
    next(error);
  }
}

export async function getPendingAdmins(_req: Request, res: Response, next: NextFunction) {
  try {
    const pending = await UserModel.find({ role: Role.ADMIN, isApproved: false });
    res.json({ success: true, message: "Pending admins fetched", data: pending });
  } catch (error) {
    next(error);
  }
}

export async function promoteToAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await UserModel.findById(req.params.userId);
    if (!user) {
      throw new AppError(404, "User not found");
    }
    if (user.role === Role.SUPER_ADMIN) {
      throw new AppError(400, "Cannot modify super admin");
    }

    user.role = Role.ADMIN;
    user.isApproved = true;
    await user.save();

    res.json({ success: true, message: "User promoted to admin", data: user.toJSON() });
  } catch (error) {
    next(error);
  }
}

export async function approveAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await UserModel.findById(req.params.userId);
    if (!user) {
      throw new AppError(404, "User not found");
    }

    user.isApproved = true;
    await user.save();

    res.json({ success: true, message: "Admin approved", data: user.toJSON() });
  } catch (error) {
    next(error);
  }
}

export async function demoteAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await UserModel.findById(req.params.userId);
    if (!user) {
      throw new AppError(404, "User not found");
    }
    if (user.role === Role.SUPER_ADMIN) {
      throw new AppError(400, "Cannot demote super admin");
    }

    user.role = Role.USER;
    await user.save();

    res.json({ success: true, message: "Admin demoted to user", data: user.toJSON() });
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await UserModel.findById(req.params.userId);
    if (!user) {
      throw new AppError(404, "User not found");
    }
    if (user.role === Role.SUPER_ADMIN) {
      throw new AppError(400, "Cannot delete super admin");
    }

    await user.deleteOne();
    res.json({ success: true, message: "User deleted" });
  } catch (error) {
    next(error);
  }
}
