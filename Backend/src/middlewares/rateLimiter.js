const rateLimit = require('express-rate-limit');

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each IP to 30 auth requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP. Please try again in 15 minutes.'
  }
});

const licenseRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 60, // limit license verification / download requests
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many license requests. Please throttle your client instances.'
  }
});

const generalApiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please slow down.'
  }
});

module.exports = {
  authRateLimiter,
  licenseRateLimiter,
  generalApiLimiter
};
