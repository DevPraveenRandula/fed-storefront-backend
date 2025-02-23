import express from "express";
import {
  getProducts,
  createProduct,
  getProduct,
  deleteProduct,
  updateProduct,
} from "../application/product";

export const productRouter = express.Router();

productRouter.get("/", getProducts); // Handles GET /api/products
productRouter.post("/", createProduct);
productRouter.get("/:id", getProduct);
productRouter.delete("/:id", deleteProduct);
productRouter.put("/:id", updateProduct);