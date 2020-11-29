import { Router } from "express";
import {
  getAllCategories,
  getCategoryBySku,
  createCategory,
  updateCategoryBySku,
  deleteCategoryBySku,
} from "../controllers/categoryControllers.js";
import {
  hasValidCategoryName,
  hasValidSku,
} from "../middlewares/validationMiddleware.js";
const router = Router();

router.get("/", getAllCategories);
router.post("/", hasValidCategoryName, createCategory);
router.get("/sku/:sku", hasValidSku, getCategoryBySku);
router.put("/sku/:sku", hasValidSku, hasValidCategoryName, updateCategoryBySku);
router.delete("/sku/:sku", hasValidSku, deleteCategoryBySku);

export default router;
