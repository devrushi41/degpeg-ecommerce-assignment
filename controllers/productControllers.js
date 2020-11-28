import asyncHandler from "express-async-handler";
import fs from "fs";
import Category from "../models/categoryModel";
import Product from "../models/productModel";
import upload from "../config/multerUpload";
import mongoose from "mongoose";

export const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(404);
    throw "Unable to fetch Products";
  }
});

export const getProductBySku = asyncHandler(async (req, res) => {
  try {
    const { sku } = req.params;
    // get all products with matching sku
    const products = await Product.find({ sku: sku });

    res.status(200).json(products);
  } catch (error) {
    res.status(404);
    throw "No products with the given SKU are found";
  }
});

export const createProduct = async (req, res, next) => {
  upload(req, res, async function (err) {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        res.status(400).json({
          err: "File size is too large. Max limit is 256kb",
        });
      } else if (err.code === "INVALID_FILE_TYPE") {
        res.status(400).json({
          err: "File type is invalid.",
        });
      } else {
        res.status(404).json({ error: err.toString() });
      }
    } else {
      try {
        const { name, sku, description, price, categoryName } = req.body;
        if (!sku) {
          res.status(404).json({ error: "SKU is required" });
        }
        const category = await Category.findOne({ name: categoryName });

        const product = new Product({
          name: name,
          description: description && description,
          avatar: req.file && req.file.destination + "/" + req.file.filename,
          sku: sku,
          price: price,
          category: category,
        });

        await product.save();
        res.status(200).json({ msg: "New Product created" });
      } catch (error) {
        fs.unlink(
          req.file.destination + "/" + req.file.filename,
          (err) => err && console.log(err)
        );
        if (error.code === 11000) {
          res.status(404).json({ error: "SKU Field is already used" });
        }
        if (error instanceof TypeError) {
          res.status(404).json({ error: "Invalid Category Name" });
        }
      }
    }
  });
};

export const updateProductBySku = asyncHandler(async (req, res) => {
  try {
    const { sku } = req.params;

    await Product.findOneAndUpdate({ sku: sku }, req.body);
    res.status(200).json({ msg: "Product updated successfully" });
  } catch (error) {
    res.status(404);
    throw "Unable to update the product";
  }
});

export const deleteProductBySku = asyncHandler(async (req, res) => {
  try {
    const { sku } = req.params;
    await Product.deleteOne({ sku: sku });
    res.status(200).json({ msg: "Product deleted" });
  } catch (error) {
    res.status(404);
    throw "Unable to delete the Product";
  }
});

export const queryProducts = async (req, res) => {
  try {
    const { slug, search, filter, sort, pg } = req.query;
    let searchMap = [];
    let slugMap = [];
    let filterMap = [];
    let queryObj = {};
    let sortObj = {};
    let offset, limit;
    offset = pg && JSON.parse(pg).offset;
    limit = pg && JSON.parse(pg).limit;
    if (slug || search || filter)
      queryObj = {
        $and: [],
      };

    // get the slugs to be matched
    if (slug) {
      const parsedSlug = JSON.parse(slug);
      for (let key in parsedSlug) {
        let temp = {};
        if (Object.prototype.hasOwnProperty.call(parsedSlug, key)) {
          temp[key] = parsedSlug[key];
        }
        slugMap.push({
          ...temp,
        });
      }
      queryObj.$and.push({ $or: slugMap });
    }

    // get the match string from search
    if (search) {
      const parsedSearch = JSON.parse(search);
      for (let key in parsedSearch) {
        let temp = {};
        if (Object.prototype.hasOwnProperty.call(parsedSearch, key)) {
          temp[key] = {
            $regex: parsedSearch[key],
            $options: "i",
          };
        }
        searchMap.push({
          ...temp,
        });
      }
      queryObj.$and.push({ $or: searchMap });
    }

    // get the filter contents
    if (filter) {
      const parsedFilter = JSON.parse(filter);

      for (let key in parsedFilter) {
        let temp = {};
        if (Object.prototype.hasOwnProperty.call(parsedFilter, key)) {
          temp[key] = {
            $in: parsedFilter[key]
              .split(",")
              .map((id) => mongoose.Types.ObjectId(id)),
          };
        }
        filterMap.push({
          ...temp,
        });
      }

      queryObj.$and.push({ $or: filterMap });
    }

    if (sort) {
      const parsedSort = JSON.parse(sort);
      sortObj[parsedSort.sortby] = parsedSort.sortval === "asc" ? 1 : -1;
    }

    const product = await Product.find(queryObj)
      .sort(sortObj)
      .skip(offset ? parseInt(offset) : 0)
      .limit(limit ? parseInt(limit) : 10);

    res.status(200).json({ product });
  } catch (error) {
    res.status(404).json({ err: error.toString() });
  }
};
