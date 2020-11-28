import { Router } from "express";
import {
  getAllCategories,
  getCategoryBySku,
  createCategory,
  updateCategoryBySku,
  deleteCategoryBySku,
} from "../controllers/categoryControllers.js";
const router = Router();

router.get("/", getAllCategories);
router.post("/", createCategory);
router.get("/sku/:sku", getCategoryBySku);
router.put("/sku/:sku", updateCategoryBySku);
router.delete("/sku/:sku", deleteCategoryBySku);

export default router;
