const mongoose = require("mongoose");

const ProductContentSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, "Product Name is required"],
      trim: true,
    },
    productCategory: {
      type: String,
      required: [true, "Product Category is required"],
      trim: true,
    },
    productDetails: {
      brandName: {
        type: String,
        required: [true, "Brand Name is required"],
        trim: true,
      },
      keyFeatures: {
        type: String,
        required: [true, "Key Features are required"],
        trim: true,
      },
      targetAudience: {
        type: String,
        required: [true, "Target Audience is required"],
        trim: true,
      },
    },
    aiGeneratedContent: {
      description: {
        type: String,
        required: true,
      },
      shortDescription: {
        type: String,
        required: true,
      },
      keySellingPoints: {
        type: [String],
        required: true,
      },
      seoKeywords: {
        type: [String],
        required: true,
      },
      tagline: {
        type: String,
        required: true,
      },
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProductContent", ProductContentSchema);
