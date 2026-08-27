const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Server Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method
  });

  // Handle Prisma specific errors
  if (err.code === 'P2002') {
    return res.status(409).json({
      success: false,
      message: `Unique constraint failed on field: ${err.meta?.target || 'unknown'}`,
      field: err.meta?.target
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: 'The requested record was not found in the database.'
    });
  }

  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: err.errors
    });
  }

  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected internal server error occurred',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
