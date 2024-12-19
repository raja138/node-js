const express = require('express');
const { getPosts, createPost } = require('../controllers/postController');
const upload = require('../utils/multerConfig');

const router = express.Router();

router.get('/', getPosts); // GET /posts
router.post('/', upload.single('image'), createPost); // POST /posts

module.exports = router;
