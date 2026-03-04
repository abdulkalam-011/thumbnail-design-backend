const asyncHandler = (requestHandler) => {
  // return a middleware function that handles errors from async handlers
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };
