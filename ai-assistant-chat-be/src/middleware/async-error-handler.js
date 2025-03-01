const asyncErrorHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((error) => {
    // Handle OpenAI API specific errors
    if (error.name === "OpenAIError") {
      switch (error.code) {
        case "rate_limit_exceeded":
          return res.status(429).json({
            error: "Rate Limit Exceeded",
            message: "Too many requests. Please try again later.",
            details: error.message,
          });
        case "invalid_request_error":
          return res.status(400).json({
            error: "Invalid Request",
            message: "The request was invalid",
            details: error.message,
          });
        case "authentication_error":
          return res.status(401).json({
            error: "Authentication Error",
            message: "Failed to authenticate with AI service",
            details:
              process.env.NODE_ENV === "development"
                ? error.message
                : undefined,
          });
        case "context_length_exceeded":
          return res.status(413).json({
            error: "Context Length Exceeded",
            message: "The input was too long for the AI model to process",
            details: error.message,
          });
        default:
          return res.status(500).json({
            error: "AI Service Error",
            message: "Failed to process request with AI service",
            details:
              process.env.NODE_ENV === "development"
                ? error.message
                : undefined,
          });
      }
    }

    // Handle network errors
    if (error.code === "ECONNREFUSED" || error.code === "ETIMEDOUT") {
      return res.status(503).json({
        error: "Service Unavailable",
        message: "Network connection issue, please try again later",
        details: error.message,
      });
    }

    // Handle database errors
    if (error.code === "23505") {
      // Postgres unique violation
      return res.status(409).json({
        error: "Conflict",
        message: "Resource already exists",
        details: error.detail,
      });
    }

    // Default error handler
    console.error("Unhandled Error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message ? error.message : "An unexpected error occurred",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  });
};

export default asyncErrorHandler;
