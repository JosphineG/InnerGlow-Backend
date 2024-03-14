const articleRouter = require("express").Router();
const { verifyAccessToken } = require("../helpers/getJwt");
const {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} = require("../controllers/article");

// Article routes
articleRouter.get("/articles", getAllArticles);
articleRouter.get("/articles/:id", getArticleById);

articleRouter.post("/articles", verifyAccessToken, createArticle);
articleRouter.put("/articles/:id", verifyAccessToken, updateArticle);
articleRouter.delete("/articles/:id", verifyAccessToken, deleteArticle);

module.exports = { articleRouter };
