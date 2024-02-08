export const errorHandler = async (error, req, res) => {
  if (!error.statusCode) {
    error.statusCode = 500;
  }

  res.status(error.statusCode).json(error.message);
};
