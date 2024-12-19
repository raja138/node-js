const Post = require('../models/Post');
const Tag = require('../models/Tag');

// Get all posts
exports.getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, keyword, tag, sort = 'createdAt' } = req.query;

    // Ensure no extra params
    const allowedParams = ['page', 'limit', 'keyword', 'tag', 'sort'];
    const extraParams = Object.keys(req.query).filter(param => !allowedParams.includes(param));
    if (extraParams.length > 0) {
      return res.status(400).json({ message: `Invalid parameters: ${extraParams.join(', ')}` });
    }

    // Query building
    const query = {};
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { desc: { $regex: keyword, $options: 'i' } }
      ];
    }
    if (tag) {
      query.tags = tag;
    }

    const posts = await Post.find(query)
      .populate('tags')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Post.countDocuments(query);

    res.status(200).json({
      total,
      page,
      limit,
      data: posts
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { title, desc, tags } = req.body;
    let image;

    if (req.file) {
      // Save image as Base64
      image = req.file.buffer.toString('base64');
    }

    // Validate tags and fetch IDs
    const tagIds = await Promise.all(
      tags.split(',').map(async tag => {
        const existingTag = await Tag.findOne({ name: tag.trim() });
        return existingTag ? existingTag._id : (await Tag.create({ name: tag.trim() }))._id;
      })
    );

    const post = await Post.create({ title, desc, image, tags: tagIds });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
