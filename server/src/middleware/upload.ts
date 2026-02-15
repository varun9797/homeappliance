import multer from "multer";
import path from "path";
import { AppError } from "../utils/errors.js";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename(_req, file, cb) {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter(_req, file, cb) {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) {
      cb(null, true);
    } else {
      cb(new AppError(400, "Only JPEG, PNG, and WebP images are allowed") as unknown as Error);
    }
  },
});
