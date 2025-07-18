const express = require('express');
const router = express.Router();
const imagesController = require('../controllers/images-controller');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('photo'), imagesController.uploadFile);
router.get('/files', imagesController.getFiles);

module.exports = router;
