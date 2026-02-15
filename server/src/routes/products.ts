import { Router } from "express";
import { Role } from "@appliences/shared";
import { authenticate } from "../middleware/auth.js";
import { requireRole } from "../middleware/roleGuard.js";
import { upload } from "../middleware/upload.js";
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImages,
  deleteImage,
} from "../controllers/productController.js";

const router = Router();

// Public
router.get("/", getProducts);
router.get("/:slug", getProductBySlug);

// Admin+
router.post("/", authenticate, requireRole(Role.ADMIN, Role.SUPER_ADMIN), createProduct);
router.put("/:id", authenticate, requireRole(Role.ADMIN, Role.SUPER_ADMIN), updateProduct);
router.delete("/:id", authenticate, requireRole(Role.ADMIN, Role.SUPER_ADMIN), deleteProduct);
router.post("/:id/images", authenticate, requireRole(Role.ADMIN, Role.SUPER_ADMIN), upload.array("images", 5), uploadImages);
router.delete("/:id/images/:imageId", authenticate, requireRole(Role.ADMIN, Role.SUPER_ADMIN), deleteImage);

export default router;
