import { Request, Response, NextFunction } from "express";
import { CategoryModel } from "../models/Category.js";
import { AppError } from "../utils/errors.js";

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function getCategories(_req: Request, res: Response, next: NextFunction) {
  try {
    const categories = await CategoryModel.find({ isActive: true }).sort({ name: 1 });
    res.json({ success: true, message: "Categories fetched", data: categories });
  } catch (error) {
    next(error);
  }
}

export async function getCategoryBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const category = await CategoryModel.findOne({ slug: req.params.slug, isActive: true });
    if (!category) {
      throw new AppError(404, "Category not found");
    }
    res.json({ success: true, message: "Category fetched", data: category });
  } catch (error) {
    next(error);
  }
}

export async function createCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, description, image } = req.body;
    const slug = slugify(name);

    const existing = await CategoryModel.findOne({ slug });
    if (existing) {
      throw new AppError(409, "Category with this name already exists");
    }

    const category = await CategoryModel.create({ name, slug, description, image });
    res.status(201).json({ success: true, message: "Category created", data: category });
  } catch (error) {
    next(error);
  }
}

export async function updateCategory(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.body.name) {
      req.body.slug = slugify(req.body.name);
    }
    const category = await CategoryModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      throw new AppError(404, "Category not found");
    }
    res.json({ success: true, message: "Category updated", data: category });
  } catch (error) {
    next(error);
  }
}

export async function deleteCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const category = await CategoryModel.findByIdAndDelete(req.params.id);
    if (!category) {
      throw new AppError(404, "Category not found");
    }
    res.json({ success: true, message: "Category deleted" });
  } catch (error) {
    next(error);
  }
}
