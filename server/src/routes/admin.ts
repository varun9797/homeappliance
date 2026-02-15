import { Router } from "express";
import { Role } from "@appliences/shared";
import { authenticate } from "../middleware/auth.js";
import { requireRole } from "../middleware/roleGuard.js";
import {
  getUsers,
  getPendingAdmins,
  promoteToAdmin,
  approveAdmin,
  demoteAdmin,
  deleteUser,
} from "../controllers/adminController.js";

const router = Router();

// All routes require Super Admin
router.use(authenticate, requireRole(Role.SUPER_ADMIN));

router.get("/users", getUsers);
router.get("/pending", getPendingAdmins);
router.post("/promote/:userId", promoteToAdmin);
router.post("/approve/:userId", approveAdmin);
router.post("/demote/:userId", demoteAdmin);
router.delete("/users/:userId", deleteUser);

export default router;
