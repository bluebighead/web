const categoryService = require('../services/categoryService');

// 创建分类
const createCategory = async (req, res) => {
  try {
    const { name, parentId = null } = req.body;

    // 调用分类服务创建分类
    const category = await categoryService.createCategory(name, req.user._id, parentId);

    res.status(201).json({ success: true, category });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// 获取分类列表
const getCategories = async (req, res) => {
  try {
    // 调用分类服务获取分类列表
    const categories = await categoryService.getCategories(req.user._id);
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// 更新分类
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, parentId } = req.body;

    // 调用分类服务更新分类
    const category = await categoryService.updateCategory(id, { name, parentId }, req.user._id);

    res.status(200).json({ success: true, category });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// 删除分类
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // 调用分类服务删除分类
    const result = await categoryService.deleteCategory(id, req.user._id);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// 获取分类树
const getCategoryTree = async (req, res) => {
  try {
    // 调用分类服务获取分类树
    const tree = await categoryService.getCategoryTree(req.user._id);
    res.status(200).json({ success: true, tree });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

module.exports = { createCategory, getCategories, updateCategory, deleteCategory, getCategoryTree };