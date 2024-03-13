const Story = require("../models/storyModel");
const { userModel } = require("../models/userModel");
// Controller for getting all Storys
exports.getAllStories = async (req, res) => {
  try {
    let stories = await Story.find();
    let StoryArray = [];

    // Loop through each Story to populate createdBy with user's name
    for (let story of stories) {
      let StoryData = {
        image: "",
        _id: "",
        title: "",
        description: "",
        createdBy: "",
        category: "",
        time: "",
      };
      // Find the user who created the Story
      const user = await userModel.findById(story.createdBy);

      if (!user) {
        console.log("User not found");
        return res.status(500).json({ error: "User not found" });
      }

      StoryData.image = story.image?.url;
      StoryData._id = story._id;
      StoryData.title = story.title;
      StoryData.description = story.description;
      StoryData.createdBy = user.username;
      StoryData.category = story.category;
      StoryData.time = story.time;
      StoryArray.push(StoryData);
    }
    console.log(StoryArray);
    // Send the modified stories array as response
    res.status(200).json(StoryArray);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error", err });
  }
};

// Controller for getting a Story by ID
exports.getStoryById = async (req, res) => {
  try {
    const Story = await Story.findById(req?.params.id);
    if (!Story) {
      return res.status(404).json({ error: "Story not found" });
    }
    resstatus(200).json(Story);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error", err });
  }
};

// Controller for creating a Story
exports.createStory = async (req, res) => {
  try {
    const user = await userModel.findById(req.payload.aud);
    // console.log(user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Access other form fields from req.body
    const { title, description, category } = req.body;
    // Create the Story with the uploaded image URL
    const story = await Story.create({
      title,
      description,
      image: {
        publicId: null,
        url: null,
      },
      category,
      createdBy: user._id,
    });

    let StoryData = {
      title,
      description,
      image: {
        publicId: null,
        url: null,
      },
      category,
      createdBy: user.username,
    };
    res.status(201).json({
      message: "Story created successfully",
      StoryData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error", err });
  }
};

// Controller for updating a Story
exports.updateStory = async (req, res) => {
  try {
    const updatedStory = await Story.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedStory) {
      return res.status(404).json({ error: "Story not found" });
    }
    res.json(updatedStory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller for deleting a Story
exports.deleteStory = async (req, res) => {
  try {
    const deletedStory = await Story.findByIdAndDelete(req.params.id);
    if (!deletedStory) {
      return res.status(404).json({ error: "Story not found" });
    }
    res.json({ message: "Story deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error", err });
  }
};
