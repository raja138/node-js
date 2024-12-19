const express = require('express');
const { getTags, createTag } = require('../controllers/tagController');

const router = express.Router();

router.get('/', getTags); // GET /tags
router.post('/', createTag); // POST /tags

module.exports = router;
