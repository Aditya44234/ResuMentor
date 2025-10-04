import rateLimit from "express-rate-limit";

/**
 * Rate limiter for upload endpoint
 * Prevents abuse by limiting number of requests per IP address
 * 
 * Why rate limiting?
 * - Prevents spam/abuse (uploading 1000 resumes)
 * - Protects Gemini API quota (costs money!)
 * - Prevents server overload
 */

const uploadLimiter = rateLimit({
  
  // windowMs: Time window in milliseconds
  // 60 * 60 * 1000 = 60 minutes * 60 seconds * 1000ms = 1 hour
  windowMs: 60 * 60 * 1000,  // 1 hour window
  
  // max: Maximum number of requests per IP in the time window
  // Each IP can make 10 upload requests per hour
  max: 10,
  
  // message: Error message sent when limit exceeded
  message: {
    success: false,
    message: "Too many resume uploads from this IP. Please try again after an hour.",
  },
  
  // standardHeaders: Add rate limit info to response headers
  // Client can see: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
  standardHeaders: true,
  
  // legacyHeaders: Disable old X-RateLimit-* headers (use new standard)
  legacyHeaders: false,
  
  // statusCode: HTTP status code to send when limit exceeded
  // 429 = Too Many Requests (standard for rate limiting)
  statusCode: 429,
  
  // handler: Custom function to handle rate limit exceeded
  // Allows us to log or do custom actions
  handler: (req, res) => {
    console.warn(`⚠️ Rate limit exceeded for IP: ${req.ip}`);
    
    res.status(429).json({
      success: false,
      message: "Too many resume uploads. Please try again later.",
      retryAfter: "1 hour",  // Tell user when they can try again
    });
  },
});

/**
 * Rate limiter for quiz submission
 * More lenient than upload limiter (taking quiz is less resource-intensive)
 */
const submitLimiter = rateLimit({
  
  windowMs: 15 * 60 * 1000,  // 15 minutes window
  
  max: 20,  // 20 submissions per 15 minutes (in case user retakes quiz)
  
  message: {
    success: false,
    message: "Too many quiz submissions. Please wait before trying again.",
  },
  
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: 429,
});

// Export both rate limiters
export { uploadLimiter, submitLimiter }; 
