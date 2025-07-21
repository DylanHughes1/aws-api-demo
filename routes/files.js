const express = require('express');
const router = express.Router();
const imagesController = require('../controllers/images-controller');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const verifyToken = require('../middlewares/authMiddleware');

router.post('/upload', verifyToken, upload.single('photo'), imagesController.uploadFile);
router.get('/files', verifyToken, imagesController.getFiles);
router.post('/delete', verifyToken, imagesController.deleteFile);


module.exports = router;
