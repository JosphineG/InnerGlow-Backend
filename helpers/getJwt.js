const jwt = require("jsonwebtoken");
const createError = require("http-errors")
require("dotenv").config();

const generateAccessToken = async (data) => {
  return new Promise((resolve, reject) => {
    const payload = {
      email: data.email,
    };
    const secretKey = process.env.AccessTokenSecretKey;
    const expire_time = process.env.AccessTokenExpires;
    const options = {
      expiresIn: expire_time,
      audience: data.userID,
      issuer: "application",
    };
    jwt.sign(payload, secretKey, options, (error, token) =>{
      if(error){
         console.log(error.message)
         const err = createError.InternalServerError("error when generating token ");
        return reject(err);
      }
      resolve(token)
    })
  });
};

const verifyAccessToken = (req, res, next) => {
  const headers = req.headers.authorization;
  if (!headers) {
    const error = createError.Unauthorized();
    next(error);
  }
  try {
    const token = headers.split(" ")[1];
    if (!token) {
      throw createError.Unauthorized();
    }
    jwt.verify(token, process.env.AccessTokenSecretKey, (error, payload) => {
      if (error) {
        if (error.name === "JsonWebToken") {
          throw createError.Unauthorized();
        } else {
          throw createError.Unauthorized(error.message);
        }
      }
      req.payload = payload;
      next();
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { generateAccessToken, verifyAccessToken }