const globalException = (req, res, next) => {
  res.status(404).json({
    success: false,
    data: null,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
};

export default globalException;
