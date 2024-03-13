const Story = require("../models/storyModel");

// Controller for getting all Storys
exports.getAllStorys = async (req, res) => {
  try {
    const Storys = await Story.find();
    res.status(200).json(Storys);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error", err });
  }
};

// Controller for getting a Story by ID
exports.getStoryById = async (req, res) => {
  try {
    const Story = await Story.findById(req?.params?.id);
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
    const newStory = new Story(req.body);
    await newStory.save();
    res.status(201).json(newStory);
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
