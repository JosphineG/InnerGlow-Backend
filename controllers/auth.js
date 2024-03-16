const createError = require("http-errors");
const bcrypt = require("bcrypt");
const { registerSchema } = require("../helpers/shemaValidation");
const { userModel } = require("../models/userModel");
const { generateAccessToken } = require("../helpers/getJwt");

exports.Register = async (req, res, next) => {
  try {
    const data = req.body;
    const regex = /^\+\d{1,3}\d{3,}$/;
    const result = registerSchema.validate(data);
    if (result.error) {
      const error = result.error.details[0].message;
      throw createError.BadRequest(error);
    }
    const existUser = await userModel.findOne({ email: data.email });
    if (existUser) {
      throw createError.Conflict(`${data.email} already taken`);
    }
    const user = new userModel(data);
    await user.save();

    return res.status(200).json({
      status: "success",
      message: "user registerd successfully",
      userId: user._id,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw createError.BadRequest("email and password are required ");
    }
    const exist_user = await userModel.findOne({ email: email });
    if (!exist_user) {
      throw createError.Unauthorized("you do not have an acccount");
    }
    const match = await bcrypt.compare(password, exist_user.password);
    if (!match) {
      throw createError.Unauthorized("invalid email or password ");
    }
    const token = await generateAccessToken({
      email: email,
      userID: exist_user.id,
    });
    return res.status(200).json({
      status: "success",
      access_token: token,
    });
  } catch (error) {
    next(error);
  }
};
