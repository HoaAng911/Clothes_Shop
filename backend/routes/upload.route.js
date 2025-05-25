const express = require('express');
const { uploadImage, uploadImageHandler } = require('../controllers/upload.controller.js');

const router = express.Router();


router.post('/', uploadImage, uploadImageHandler);

module.exports = router;
