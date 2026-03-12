const Product = require('../models/Product');

// Add new product (POST /products)
exports.createProduct = async (req, res, next) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json({
      success: true,
      data: savedProduct
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400); // Bad Request
    }
    next(error);
  }
};

// Get all products (GET /products)
exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500); // Server Error
    next(error);
  }
};

// Search product by name (GET /products/search?name=xyz)
exports.searchProductsByName = async (req, res, next) => {
  try {
    const { name } = req.query;
    if (!name) {
      res.status(400);
      return next(new Error('Please provide a name query parameter'));
    }

    // Case-insensitive regex search
    const products = await Product.find({
      productName: { $regex: name, $options: 'i' }
    });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500);
    next(error);
  }
};

// Filter by category (GET /products/category?cat=xyz)
exports.filterProductsByCategory = async (req, res, next) => {
  try {
    const { cat } = req.query;
    if (!cat) {
      res.status(400);
      return next(new Error('Please provide a cat query parameter'));
    }

    // Exact or case-insensitive match for category
    const products = await Product.find({
      category: { $regex: new RegExp(`^${cat}$`, 'i') }
    });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500);
    next(error);
  }
};

// Get product by ID (GET /products/:id)
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      res.status(404); // Not Found
      return next(new Error(`Product not found with id of ${req.params.id}`));
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    // Usually invalid ObjectId
    if (error.kind === 'ObjectId') {
        res.status(404);
        return next(new Error(`Product not found with id of ${req.params.id}`));
    }
    res.status(500);
    next(error);
  }
};

// Update product details (PUT /products/:id)
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      return next(new Error(`Product not found with id of ${req.params.id}`));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true // Run schema validations on update
    });

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400);
    }
    next(error);
  }
};

// Delete a product (DELETE /products/:id)
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      return next(new Error(`Product not found with id of ${req.params.id}`));
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
      message: 'Product deleted successfully'
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
        res.status(404);
        return next(new Error(`Product not found with id of ${req.params.id}`));
    }
    res.status(500);
    next(error);
  }
};
