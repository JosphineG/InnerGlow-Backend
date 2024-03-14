const storyRouter = require("express").Router();

const {
  getAllStories,
  getStoryById,
  createStory,
  updateStory,
  deleteStory,
} = require("../controllers/story");
const { verifyAccessToken } = require("../helpers/getJwt");

// Story routes
storyRouter.get("/stories", getAllStories);
storyRouter.get("/stories/:id", getStoryById);

storyRouter.post("/stories", verifyAccessToken, createStory);
storyRouter.put("/stories/:id", verifyAccessToken, updateStory);
storyRouter.delete("/stories/:id", verifyAccessToken, deleteStory);

module.exports = { storyRouter };
