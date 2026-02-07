const express = require('express');
const fileController = require('../controllers/fileController');
const upload = require('../middlewares/upload');

const router = express.Router();

router.post('/upload', upload.single('file'), fileController.uploadFile);
router.get('/', fileController.getFiles);
router.get('/:id', fileController.getFileById);
router.delete('/:id', fileController.deleteFile);
router.put('/:id/rename', fileController.renameFile);
router.post('/folder', fileController.createFolder);
router.get('/folders', fileController.getFolders);
router.delete('/folder/:id', fileController.deleteFolder);

module.exports = router;
