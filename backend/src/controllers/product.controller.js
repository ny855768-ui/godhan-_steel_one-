const productModel = require("../models/product.model");

const createProduct = async (req, res) => {
  try {
    const { name, price, stock, unit } = req.body;

    if (!name || price === undefined || stock === undefined || !unit) {
      return res.status(400).json({
        message: "Name, price, stock and unit are required",
      });
    }

    const product = await productModel.create({
      seller: req.user.userId,
      name,
      price,
      stock,
      unit,
    });

    return res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error.message);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createProduct,
};