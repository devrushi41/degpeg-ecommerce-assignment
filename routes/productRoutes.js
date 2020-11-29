import { Router } from "express";
import {
  getAllProducts,
  getProductBySku,
  createProduct,
  updateProductBySku,
  deleteProductBySku,
  queryProducts,
  updateProductAvatarBySku,
} from "../controllers/productControllers";

const router = Router();

router.get("/", getAllProducts);
router.post("/", createProduct);
router.get("/sku/:sku", getProductBySku);
router.put("/sku/:sku", updateProductBySku);
router.put("/avatar/sku/:sku", updateProductAvatarBySku);
router.delete("/sku/:sku", deleteProductBySku);
router.get("/select", queryProducts);

export default router;
