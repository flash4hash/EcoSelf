const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const isDev = process.env.NODE_ENV !== 'production';
  
  console.error(
    `[${new Date().toISOString()}] ERROR ${req.method} ${req.path}:`,
    isDev ? err.stack : err.message
  );
  
  res.status(statusCode).json({
    error: err.message || 'Internal server error',
    ...(isDev && { stack: err.stack })
  });
};

module.exports = errorHandler;
