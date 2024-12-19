const Tag = require('../models/Tag');

// Get all tags
exports.getTags = async (req, res) => {
  try {
    const tags = await Tag.find();
    res.status(200).json(tags);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new tag
exports.createTag = async (req, res) => {
  try {
    const { name } = req.body;
    const tag = await Tag.create({ name });
    res.status(201).json(tag);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
