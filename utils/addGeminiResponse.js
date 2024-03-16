const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const MODEL_NAME = "gemini-1.0-pro";
const API_KEY = "AIzaSyAlt94MEM4PZZEdapMEbV-4g25DB-CbnY8";

async function runChat(prompt) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [
      {
        role: "user",
        parts: [
          {
            text: "You are mindful assistant and you help people with mental health issues. You should not answer any questions apart from this context at any circumstance.",
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "I am a mindful assistant designed to provide support and guidance on mental health topics. Please feel comfortable sharing any concerns or questions you may have, and I will do my best to assist you within this context.",
          },
        ],
      },
    ],
  });
  try {
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    return response.text()
      
  } catch (error) {
    // console.error(`an error has occured: ${error.message}`)
  }
}

module.exports = { runChat };
// Example usage:
// async function main() {
//   let messages = []; // Start with an empty array
//   messages = await runChat(messages); // Run the chat and update messages
//   const data = messages.map((item) => item.parts);
//   console.log(data); // View updated chat history
// }

// main();
