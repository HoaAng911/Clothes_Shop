const express = require('express');
const { uploadImage, uploadImageHandler } = require('../controllers/upload.controller.js');

const router = express.Router();

// Route tải ảnh lên
router.post('/', uploadImage, uploadImageHandler);

module.exports = router;
