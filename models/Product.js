const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, 'Product Name is required']
  },
  productCode: {
    type: String,
    required: [true, 'Product Code is required'],
    unique: true // Ensure Product Code is unique
  },
  category: {
    type: String,
    required: [true, 'Category is required']
  },
  supplierName: {
    type: String,
    required: [true, 'Supplier Name is required']
  },
  quantityInStock: {
    type: Number,
    required: [true, 'Quantity in Stock is required'],
    min: [0, 'Quantity in Stock must be a non-negative number']
  },
  reorderLevel: {
    type: Number,
    required: [true, 'Reorder Level is required'],
    min: [1, 'Reorder Level must be greater than 0']
  },
  unitPrice: {
    type: Number,
    required: [true, 'Unit Price is required'],
    validate: {
      validator: function(v) {
        return v > 0;
      },
      message: 'Unit Price must be a positive value'
    }
  },
  manufactureDate: {
    type: Date
  },
  productType: {
    type: String,
    enum: ['Perishable', 'Non-Perishable']
  },
  status: {
    type: String,
    enum: ['Available', 'Out of Stock'],
    default: 'Available'
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatic fields
});

module.exports = mongoose.model('Product', productSchema);
