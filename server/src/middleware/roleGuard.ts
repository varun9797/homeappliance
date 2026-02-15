import { Request, Response, NextFunction } from "express";
import { Role } from "@appliences/shared";
import { AppError } from "../utils/errors.js";

export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, "Authentication required"));
    }
    if (!roles.includes(req.user.role as Role)) {
      return next(new AppError(403, "Insufficient permissions"));
    }
    next();
  };
}
