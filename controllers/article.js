const cloudinary = require("cloudinary").v2;
const articleSchema = require("../models/articleSchema");
const Article = require("../models/articleSchema");
const { userModel } = require("../models/userModel");
const { ObjectId } = require("mongodb");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Controller for getting all articles
exports.getAllArticles = async (req, res) => {
  try {
    let articles = await Article.find();
    let articleArray = [];

    // Loop through each article to populate createdBy with user's name
    for (let article of articles) {
      let articleData = {
        image: "",
        _id: "",
        title: "",
        description: "",
        createdBy: "",
        category: "",
        time: "",
      };
      // Find the user who created the article
      const user = await userModel.findById(article.createdBy);

      if (!user) {
        console.log("User not found");
        return res.status(500).json({ error: "User not found" });
      }

      articleData.image = article.image?.url;
      articleData._id = article._id;
      articleData.title = article.title;
      articleData.description = article.description;
      articleData.createdBy = user.username;
      articleData.category = article.category;
      articleData.time = article.time;
      articleArray.push(articleData);
    }
    console.log(articleArray);
    // Send the modified articles array as response
    res.status(200).json(articleArray);
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
    // Find the user who created the article
    const user = await userModel.findById(article.createdBy);

    if (!user) {
      console.log("User not found");
      return res.status(500).json({ error: "User not found" });
    }

    const articleData = {
      image: article?.image?.url,
      _id: article?._id,
      title: article?.title,
      description: article?.description,
      createdBy: user.username,
      category: article?.category,
      time: article?.time,
    };
    res.status(200).json(articleData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error", err });
  }
};

// Controller for creating an article
exports.createArticle = async (req, res) => {
  try {
    console.log("image",req?.files[0]);
    // Assuming only one file is uploaded
    if (req?.files) {
      const imageFile = req?.files[0];
      const user = await userModel.findById(req.payload.aud);
      // console.log(user);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      // Access other form fields from req.body
      const { title, description } = req.body;

      // Convert image buffer to Base64 string
      const imageBuffer = imageFile?.buffer?.toString("base64");

      // Upload the image to Cloudinary as Base64 string
      const result = await cloudinary.uploader.upload(
        `data:${imageFile?.mimetype};base64,${imageBuffer}`,
        {
          folder: "innerglow",
        }
      );
      console.log("result", result);
      // Create the post with the uploaded image URL
      const article = await Article.create({
        title,
        description,
        image: {
          publicId: result.public_id,
          url: result.secure_url,
        },
        createdBy: user._id,
      });

      res.status(201).json({
        message: "article created successfully",
        article,
      });
    }
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
