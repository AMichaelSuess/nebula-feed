const jwt = require('jsonwebtoken');
const User = require('mongoose').model('User');
const config = require('../config');


/**
 * Finds the userId from the authorization-header of an HTTP-request
 * @param {string} authHeader An authorization header from an HTTP-request
 * @return {string} userId The userId encoded in that very header
 * @throws {TokenExpiredError|JsonWebTokenError} err Thrown if something is wrong with the jwt
 */
module.exports.getUserIdFromAuthHeader = function (authHeader) {

  // get the last part from a authorization header string like "bearer token-value"
  const token = authHeader.split(' ')[1];

  // decode the token using a secret key-phrase - this may throw an exception that the caller of
  // this function must handle!
  const decoded = jwt.verify(token, config.jwtSecret);
  return decoded.sub;
};

/**
 *  The Auth Checker middleware function. First extracts the JWT-token from the request,
 *  then makes sure it is valid.
 *  @param req The request
 *  @param res The result
 *  @param next the next middleware
 *  @return the next middleware (or end if we end the request here)
 */
module.exports.checkAuthFromAuthHeader = function (req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).end();
  }

  let userId;
  try {
    userId = module.exports.getUserIdFromAuthHeader(req.headers.authorization);
  } catch (err) {
    // the 401 code is for unauthorized status
    return res.status(401).end();
  }

  // check if a user exists
  return User.findById(userId, (userErr, user) => {
    if (userErr || !user) {
      return res.status(401).end();
    }

    return next();
  });
};
