const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProductsByName,
  filterProductsByCategory
} = require('../controllers/productController');

// Important: Specific routes (like /search and /category) must come BEFORE 
// dynamic parameterized routes (like /:id) to avoid Express mistaking 
// "search" or "category" for an ID.

router.get('/search', searchProductsByName);
router.get('/category', filterProductsByCategory);

router.route('/')
  .get(getAllProducts)
  .post(createProduct);

router.route('/:id')
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;
