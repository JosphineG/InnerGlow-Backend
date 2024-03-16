const chatRouter = require("express").Router();
const { verifyAccessToken } = require("../helpers/getJwt");

const {
  createChat,
  chatWithGemini,
  getChatMessages,
} = require("../controllers/chat.js");

chatRouter.post("/chat/create", createChat);
chatRouter.post("/chat/:id/geminichat", chatWithGemini);
// chat messages
chatRouter.get("/chat/:id/messages", getChatMessages);

module.exports = { chatRouter };
