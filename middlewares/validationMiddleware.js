//   getAllCategories,
//   getCategoryBySku,
//   createCategory,
//   updateCategoryBySku,
//   deleteCategoryBySku,

// getAllProducts,
// getProductBySku,
// createProduct,
// updateProductBySku,
// deleteProductBySku,
// queryProducts,
// updateProductAvatarBySku,

import validator from "validator";

export const hasValidSku = async (req, res, next) => {
  req.params.sku = validator.trim(req.params.sku);
  if (validator.isAlphanumeric(req.params.sku)) {
    next();
  } else {
    res.status(404).json({ error: "Invalid SKU" });
  }
};

export const hasValidCategoryName = async (req, res, next) => {
  req.body.name = validator.trim(req.body.name);
  if (validator.isAlphanumeric(req.body.name)) {
    next();
  } else {
    res.status(404).json({ error: "Invalid Category Name" });
  }
};
