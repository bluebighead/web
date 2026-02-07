const express = require('express');
const { uploadFile, getFiles, createFolder, deleteFile, updateFile, getFolders } = require('../controllers/fileController');
const { protect } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const router = express.Router();

router.post('/upload', protect, upload.single('file'), uploadFile);
router.get('/list', protect, getFiles);
router.get('/folders', protect, getFolders);
router.post('/folder', protect, createFolder);
router.delete('/:id', protect, deleteFile);
router.put('/:id', protect, updateFile);

module.exports = router;