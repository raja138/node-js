const multer = require('multer');

const storage = multer.memoryStorage(); // Store image in memory for Base64 or cloud uploads
const upload = multer({ storage });

module.exports = upload;
