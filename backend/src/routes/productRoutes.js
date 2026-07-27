const express = require("express");
const router = express.Router();
const {
  generateProductContent,
  getHistory,
  getProductContentById,
  deleteProductContent,
} = require("../controllers/productController");
const { protect } = require("../middlewares/auth");

router.post("/generate", protect, generateProductContent);
router.get("/history", protect, getHistory);
router.get("/:id", protect, getProductContentById);
router.delete("/:id", protect, deleteProductContent);

module.exports = router;
