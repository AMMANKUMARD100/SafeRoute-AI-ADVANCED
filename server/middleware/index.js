module.exports = {
  protect: require('./authMiddleware'),
  errorHandler: require('./errorHandler'),
  logger: require('./logger'),
};