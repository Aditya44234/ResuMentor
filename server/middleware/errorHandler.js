/**
 * Global error handling middleware
 * Catches all errors in the app and sends standardized error responses
 * This MUST be the last middleware added in index.js
 *
 * @param {Error} err - Error object thrown anywhere in app
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Next middleware function (not used here since this is last)
 */
const errorHandler = (err, req, res, next) => {
  // Log the error to console for debugging (in production, use proper logging service)
  console.error("🔥 Error:", err.message);
  console.error("Stack:", err.stack);

  // Determine status code
  // If error already has statusCode (like from throw new Error with status), use it
  // Otherwise default to 500 (Internal Server Error)
  const statusCode = err.statusCode || 500;

  // Send error response to client
  res.status(statusCode).json({
    success: false, // Always false for errors
    message: err.message || "Server Error", // Error message (user-friendly)

    // Only send stack trace in development mode for debugging
    // NEVER send stack traces in production (security risk - reveals code structure)
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorHandler;
