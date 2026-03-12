exports.errorHandler = (err, req, res, next) => {
  // Determine suitable status code
  // If the error occurred and status is still 200, output 500 by default.
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Handle Mongoose Duplicate Key Error
  if (err.name === 'MongoServerError' && err.code === 11000) {
    statusCode = 400; // Bad Request
    err.message = 'Duplicate field value entered (e.g., productCode must be unique)';
  }
  
  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400; // Bad Request
    const messages = Object.values(err.errors).map(val => val.message);
    err.message = messages.join(', ');
  }

  // Handle Invalid Mongoose ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404; // Not Found
    err.message = 'Resource not found / Invalid ID';
  }

  res.status(statusCode);

  res.json({
    message: err.message,
    // Only show stack trace in development
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
