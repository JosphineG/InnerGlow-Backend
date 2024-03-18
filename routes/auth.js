authRouter = require("express").Router();
const { Register, login, forgotPassword, VerifyResetToken, resetPassword } = require("../controllers/auth");

authRouter.post("/auth/register", Register);
authRouter.post("/auth/login", login);
authRouter.post("/auth/forget-password", forgotPassword);
authRouter.get("/auth/reset-password", VerifyResetToken);
authRouter.post("/auth/reset-password", resetPassword);

module.exports = { authRouter };
