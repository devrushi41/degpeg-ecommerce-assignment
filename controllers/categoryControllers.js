import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Category from "../models/categoryModel";
import Product from "../models/productModel";

export const getAllCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    res.status(404);
    throw new Error("Unable to fetch Categories");
  }
});

export const getCategoryBySku = asyncHandler(async (req, res) => {
  try {
    const { sku } = req.params;
    // get all products with matching sku
    const product = await Product.findOne({ sku: sku });
    const category = await Category.findById(product.category);
    res.status(200).json(category);
  } catch (error) {
    res.status(404);
    throw new Error("No categories with the given SKU are found");
  }
});

export const createCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    const category = new Category({ name: name });
    await category.save();
    res.status(200).json({ msg: "New Category Created" });
  } catch (error) {
    res.status(404);
    throw new Error(error.toString());
  }
});

export const updateCategoryBySku = asyncHandler(async (req, res) => {
  try {
    const { sku } = req.params;
    const { name } = req.body;
    // get all products with matching sku
    const product = await Product.findOne({ sku: sku });
    await Category.updateOne({ _id: product.category }, { name: name });
    res.status(200).json({ msg: "Category updated successfully" });
  } catch (error) {
    res.status(404);
    throw new Error("Unable to update the category");
  }
});

export const deleteCategoryBySku = asyncHandler(async (req, res) => {
  try {
    const { sku } = req.params;
    // get all products with matching sku
    const product = await Product.findOne({ sku: sku });

    await Product.deleteMany({
      category: mongoose.Types.ObjectId(product.category),
    });
    await Category.deleteOne({ _id: product.category });
    res.status(200).json("Category deleted");
  } catch (error) {
    res.status(404);
    throw new Error("Unable to delete the category");
  }
});
