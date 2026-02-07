const File = require('../models/File');
const fs = require('fs');
const path = require('path');

const fileService = {
  // 上传文件
  uploadFile: async (file, userId) => {
    try {
      // 确保上传目录存在
      const uploadDir = path.join(__dirname, '..', '..', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // 创建文件记录
      const newFile = await File.create({
        name: file.originalname,
        path: file.path,
        size: file.size,
        type: file.mimetype,
        userId,
      });

      return newFile;
    } catch (error) {
      throw error;
    }
  },

  // 获取文件列表
  getFiles: async (userId, folderId = null) => {
    try {
      const files = await File.find({ userId, folderId });
      return files;
    } catch (error) {
      throw error;
    }
  },

  // 获取文件详情
  getFileById: async (id, userId) => {
    try {
      const file = await File.findOne({ _id: id, userId });
      if (!file) {
        throw new Error('File not found');
      }
      return file;
    } catch (error) {
      throw error;
    }
  },

  // 删除文件
  deleteFile: async (id, userId) => {
    try {
      // 查找文件
      const file = await File.findOne({ _id: id, userId });
      if (!file) {
        throw new Error('File not found');
      }

      // 删除物理文件
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      // 删除数据库记录
      await File.deleteOne({ _id: id });

      return { success: true };
    } catch (error) {
      throw error;
    }
  },

  // 更新文件信息
  updateFile: async (id, updates, userId) => {
    try {
      const file = await File.findOneAndUpdate(
        { _id: id, userId },
        updates,
        { new: true }
      );
      if (!file) {
        throw new Error('File not found');
      }
      return file;
    } catch (error) {
      throw error;
    }
  },

  // 创建文件夹
  createFolder: async (name, userId, parentId = null) => {
    try {
      const folder = await File.create({
        name,
        path: '',
        size: 0,
        type: 'folder',
        userId,
        folderId: parentId,
      });
      return folder;
    } catch (error) {
      throw error;
    }
  },

  // 获取文件夹列表
  getFolders: async (userId, parentId = null) => {
    try {
      const folders = await File.find({ userId, folderId: parentId, type: 'folder' });
      return folders;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = fileService;