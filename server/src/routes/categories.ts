import { Router } from "express";
import { Role } from "@appliences/shared";
import { authenticate } from "../middleware/auth.js";
import { requireRole } from "../middleware/roleGuard.js";
import {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = Router();

// Public
router.get("/", getCategories);
router.get("/:slug", getCategoryBySlug);

// Admin+
router.post("/", authenticate, requireRole(Role.ADMIN, Role.SUPER_ADMIN), createCategory);
router.put("/:id", authenticate, requireRole(Role.ADMIN, Role.SUPER_ADMIN), updateCategory);
router.delete("/:id", authenticate, requireRole(Role.ADMIN, Role.SUPER_ADMIN), deleteCategory);

export default router;
