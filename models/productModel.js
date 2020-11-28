import { Schema, model } from "mongoose";

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: null,
  },
  sku: {
    type: String,
    required: true,
    unique: true,
  },
  avatar: {
    type: String,
    default: null,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
});

const Product = model("Product", productSchema);

export default Product;
