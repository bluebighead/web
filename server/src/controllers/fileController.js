const File = require('../models/File');
const Folder = require('../models/Folder');
const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

const fileController = {
  uploadFile: (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { categoryId, folderId } = req.body;
    // 修复文件名编码问题
    const originalName = Buffer.from(req.file.originalname, 'latin1').toString('utf8');
    const fileData = {
      name: originalName,
      type: req.file.mimetype,
      size: req.file.size,
      path: req.file.filename,
      category_id: categoryId ? parseInt(categoryId) : null
    };

    try {
      const file = File.create(fileData);
      res.status(201).json({ message: 'File uploaded successfully', file });
    } catch (err) {
      res.status(500).json({ message: 'Error saving file to database', error: err.message });
    }
  },

  getFiles: (req, res) => {
    const { categoryId, folderPath } = req.query;

    try {
      let files;
      if (categoryId) {
        files = File.getByCategoryId(categoryId);
      } else if (folderPath) {
        files = File.getByPath(folderPath);
      } else {
        files = File.getAll();
      }
      res.json({ files });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching files', error: err.message });
    }
  },

  getFileById: (req, res) => {
    const { id } = req.params;

    try {
      const file = File.getById(id);
      if (!file) {
        return res.status(404).json({ message: 'File not found' });
      }
      res.json({ file });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching file', error: err.message });
    }
  },

  deleteFile: (req, res) => {
    const { id } = req.params;

    try {
      const file = File.getById(id);
      if (!file) {
        return res.status(404).json({ message: 'File not found' });
      }

      // 删除物理文件
      const filePath = path.join(uploadsDir, file.path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // 从数据库中删除
      File.delete(id);
      res.json({ message: 'File deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting file', error: err.message });
    }
  },

  renameFile: (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'New filename is required' });
    }

    try {
      const file = File.getById(id);
      if (!file) {
        return res.status(404).json({ message: 'File not found' });
      }

      // 更新数据库中的文件名
      File.update(id, { name });
      
      const updatedFile = File.getById(id);
      res.json({ message: 'File renamed successfully', file: updatedFile });
    } catch (err) {
      res.status(500).json({ message: 'Error renaming file', error: err.message });
    }
  },

  createFolder: (req, res) => {
    const { name, path: folderPath, parentId } = req.body;

    if (!name || !folderPath) {
      return res.status(400).json({ message: 'Name and path are required' });
    }

    try {
      const folderData = { name, path: folderPath, parent_id: parentId || null };
      const folder = Folder.create(folderData);
      res.status(201).json({ message: 'Folder created successfully', folder });
    } catch (err) {
      res.status(500).json({ message: 'Error creating folder', error: err.message });
    }
  },

  getFolders: (req, res) => {
    const { parentId, folderPath } = req.query;

    try {
      let folders;
      if (parentId) {
        folders = Folder.getByParentId(parentId);
      } else if (folderPath) {
        folders = Folder.getByPath(folderPath);
      } else {
        folders = Folder.getAll();
      }
      res.json({ folders });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching folders', error: err.message });
    }
  },

  deleteFolder: (req, res) => {
    const { id } = req.params;

    try {
      const folder = Folder.getById(id);
      if (!folder) {
        return res.status(404).json({ message: 'Folder not found' });
      }

      const hasChildren = Folder.hasChildren(id);
      if (hasChildren) {
        return res.status(400).json({ 
          message: 'Folder contains files or subfolders. Please delete them first.' 
        });
      }

      Folder.delete(id);
      res.json({ message: 'Folder deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting folder', error: err.message });
    }
  }
};

module.exports = fileController;
