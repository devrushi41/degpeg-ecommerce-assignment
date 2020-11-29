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
import {
  hasValidProductDetails,
  hasValidSku,
} from "../middlewares/validationMiddleware";

const router = Router();

router.get("/", getAllProducts);
router.post("/", hasValidProductDetails, createProduct);
router.get("/sku/:sku", hasValidSku, getProductBySku);
router.put("/sku/:sku", hasValidSku, updateProductBySku);
router.put(
  "/avatar/sku/:sku",
  hasValidSku,
  hasValidProductDetails,
  updateProductAvatarBySku
);
router.delete("/sku/:sku", hasValidSku, deleteProductBySku);
router.get("/select", queryProducts);

export default router;
