import { Request, Response, NextFunction } from "express";
import { ProductModel } from "../models/Product.js";
import { AppError } from "../utils/errors.js";

export async function getProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      sort = "newest",
      search,
      brand,
      page = "1",
      limit = "12",
    } = req.query;

    const filter: Record<string, unknown> = { isActive: true };

    if (category) filter.category = category;
    if (brand) filter["specifications.brand"] = brand;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) (filter.price as Record<string, number>).$gte = Number(minPrice);
      if (maxPrice) (filter.price as Record<string, number>).$lte = Number(maxPrice);
    }
    if (search) {
      filter.$text = { $search: search as string };
    }

    const sortMap: Record<string, Record<string, 1 | -1>> = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      newest: { createdAt: -1 },
      name: { name: 1 },
    };

    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [data, total] = await Promise.all([
      ProductModel.find(filter)
        .sort(sortMap[sort as string] || sortMap.newest)
        .skip(skip)
        .limit(limitNum)
        .populate("category", "name slug"),
      ProductModel.countDocuments(filter),
    ]);

    res.json({
      success: true,
      message: "Products fetched",
      data: {
        data,
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getProductBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await ProductModel.findOne({ slug: req.params.slug, isActive: true })
      .populate("category", "name slug");
    if (!product) {
      throw new AppError(404, "Product not found");
    }
    res.json({ success: true, message: "Product fetched", data: product });
  } catch (error) {
    next(error);
  }
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function createProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, description, price, category, specifications } = req.body;
    const slug = slugify(name) + "-" + Date.now();

    const product = await ProductModel.create({
      name,
      slug,
      description,
      price,
      category,
      specifications: specifications || {},
      images: [],
      createdBy: req.user!.userId,
    });

    res.status(201).json({ success: true, message: "Product created", data: product });
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await ProductModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      throw new AppError(404, "Product not found");
    }
    res.json({ success: true, message: "Product updated", data: product });
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await ProductModel.findByIdAndDelete(req.params.id);
    if (!product) {
      throw new AppError(404, "Product not found");
    }
    res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    next(error);
  }
}

export async function uploadImages(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      throw new AppError(404, "Product not found");
    }

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      throw new AppError(400, "No images uploaded");
    }

    const imageUrls = files.map((f) => `/uploads/${f.filename}`);
    product.images.push(...imageUrls);
    await product.save();

    res.json({ success: true, message: "Images uploaded", data: product });
  } catch (error) {
    next(error);
  }
}

export async function deleteImage(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      throw new AppError(404, "Product not found");
    }

    const { imageId } = req.params;
    const index = parseInt(imageId, 10);
    if (isNaN(index) || index < 0 || index >= product.images.length) {
      throw new AppError(400, "Invalid image index");
    }

    product.images.splice(index, 1);
    await product.save();

    res.json({ success: true, message: "Image removed", data: product });
  } catch (error) {
    next(error);
  }
}
