require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./routes/productRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Middleware
app.use(express.json()); // Enable JSON body parser

// Routes
app.use('/products', productRoutes);

// Error Handling Middleware (must be after routes)
app.use(errorHandler);

// Database Connection & Server Start
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB via Mongoose');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err.message);
  });
