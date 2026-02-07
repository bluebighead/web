const fileService = require('../services/fileService');

// 上传文件
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    // 调用文件服务上传文件
    const file = await fileService.uploadFile(req.file, req.user._id);

    res.status(201).json({ success: true, file });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// 获取文件列表
const getFiles = async (req, res) => {
  try {
    const { folderId = null } = req.query;
    
    // 调用文件服务获取文件列表
    const files = await fileService.getFiles(req.user._id, folderId);
    
    res.status(200).json({ success: true, files });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// 创建文件夹
const createFolder = async (req, res) => {
  try {
    const { name, parentId = null } = req.body;

    // 调用文件服务创建文件夹
    const folder = await fileService.createFolder(name, req.user._id, parentId);

    res.status(201).json({ success: true, folder });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// 删除文件
const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;

    // 调用文件服务删除文件
    const result = await fileService.deleteFile(id, req.user._id);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// 更新文件信息
const updateFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // 调用文件服务更新文件信息
    const file = await fileService.updateFile(id, { name }, req.user._id);

    res.status(200).json({ success: true, file });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// 获取文件夹列表
const getFolders = async (req, res) => {
  try {
    const { parentId = null } = req.query;
    
    // 调用文件服务获取文件夹列表
    const folders = await fileService.getFolders(req.user._id, parentId);
    
    res.status(200).json({ success: true, folders });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

module.exports = { uploadFile, getFiles, createFolder, deleteFile, updateFile, getFolders };