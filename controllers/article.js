const Article = require("../models/articleSchema");

// Controller for getting all articles
exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find();
    res.status(200).json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error", err });
  }
};

// Controller for getting an article by ID
exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req?.params?.id);
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    resstatus(200).json(article);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error", err });
  }
};

// Controller for creating an article
exports.createArticle = async (req, res) => {
  try {
    const newArticle = new Article(req.body);
    await newArticle.save();
    res.status(201).json(newArticle);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error", err });
  }
};

// Controller for updating an article
exports.updateArticle = async (req, res) => {
  try {
    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedArticle) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.json(updatedArticle);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller for deleting an article
exports.deleteArticle = async (req, res) => {
  try {
    const deletedArticle = await Article.findByIdAndDelete(req.params.id);
    if (!deletedArticle) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.json({ message: "Article deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error", err });
  }
};
