import { CategoryDTO } from "../domain/dto/category";
import NotFoundError from "../domain/errors/not-found-error";
import ValidationError from "../domain/errors/validation-error";
import Category from "../infrastructure/schemas/Category";
import { Request, Response, NextFunction } from "express";
import * as z from "zod"; 

// Schema for validating categories
const categorySchema = z.object({
  name: z.string(),
});



// GET all categories
export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await Category.find();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// CREATE a new category
export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = categorySchema.safeParse(req.body);
    if (!result.success) {
      throw new ValidationError(result.error.errors.map(e => e.message).join(", "));
    }

    const categoryData = result.data;
    await Category.create(categoryData);
    res.status(201).json({ message: "Category created successfully" });
  } catch (error) {
    next(error);
  }
};

// GET a single category by ID
export const getCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const category = await Category.findById(id);
    if (!category) {
      throw new NotFoundError("Category not found");
    }

    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

// DELETE a category by ID
export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      throw new NotFoundError("Category not found");
    }
    res.status(204).send(); // No content response
  } catch (error) {
    next(error);
  }
};

// UPDATE a category by ID
export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const result = categorySchema.safeParse(req.body);

    if (!result.success) {
      throw new ValidationError(result.error.errors.map(e => e.message).join(", "));
    }

    const category = await Category.findByIdAndUpdate(id, result.data, {
      new: true, // Return the updated document
      runValidators: true, // Apply schema validation
    });

    if (!category) {
      throw new NotFoundError("Category not found");
    }

    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};
