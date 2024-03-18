const createError = require("http-errors");
const bcrypt = require("bcrypt");
const { registerSchema } = require("../helpers/shemaValidation");
const { userModel } = require("../models/userModel");
const { generateAccessToken, verifyAccessToken } = require("../helpers/getJwt");
const { sendMail } = require("../utils/sendMail");

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
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "an email is required " });
    }
    const emailRegex =
      /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "invalid email address" });
    }
    //   verify if the email exist in the database
    const exist_user = await userModel.findOne({ email: email });
    if (!exist_user) {
      res
        .status(400)
        .json({ failed: `user with email ${email} does not exists` });
    }
    const token = await generateAccessToken({
      email: email,
      userID: exist_user.id,
    });
    let link = `${process.env.frontendUrl}/reset-password/${token}`;
    const resetLink = `
    <h1>Hello ${exist_user.username}</h1>
    <h3>Click this link to reset password  for your inner glow account</h3>
    <a href="${link}">Reset Password</a>
    <hr/>
    <h4>The link will expire in 1 day.</h4>
    `;
    await sendMail({
      html: resetLink,
      subject: "Forgot Password",
      email: email,
    });
    return res.status(200).json({ success: "email sent to the user" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
exports.VerifyResetToken = async (req, res, next) => {
  try {
    const { token } = req.query;
    await verifyAccessToken(token);
    return res.status(200).json({ email: req.payload.email });
  } catch (error) {
    console.log(error);
    const err = createError.BadRequest(
      "Invalid link. please use the link sent to your email"
    );
    next(err);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email: email });
    if (!user) {
      throw createError.NotFound(`user with email ${email} was not found`);
    } else if (password.length < 3) {
      throw createError("pasword is too short");
    }
    user.password = password; // since the password is modified, the middleware before saving will hash the password
    user.save();
    return res.status(202).json({ success: "password set successfully" });
  } catch (error) {
    next(error);
  }
};
