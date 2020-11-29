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

export const hasValidProductDetails = async (req, res, next) => {
  // Santise the fields
  req.body.name = validator.trim(req.body.name);
  req.body.categoryName = validator.trim(req.body.categoryName);
  req.body.price = validator.trim(req.body.price);
  req.body.description = validator.trim(req.body.description);
  req.body.sku = validator.trim(req.body.sku);

  if (req.body.name && !validator.isAlphanumeric(req.body.name)) {
    res.status(404).json({ error: "Invalid Product Name" });
  } else if (
    req.body.categoryName &&
    !validator.isAlphanumeric(req.body.categoryName)
  ) {
    res.status(404).json({ error: "Invalid Category Name" });
  } else if (req.body.price && !validator.isNumeric(req.body.price)) {
    res.status(404).json({ error: "Invalid Price" });
  } else if (req.body.sku && !validator.isNumeric(req.body.sku)) {
    res.status(404).json({ error: "Invalid SKU" });
  } else if (
    req.body.description &&
    !validator.isAlphanumeric(req.body.description)
  ) {
    res.status(404).json({ error: "Invalid Description" });
  } else {
    next();
  }
};
