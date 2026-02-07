const Category = require('../models/Category');

const categoryService = {
  // 创建分类
  createCategory: async (name, userId, parentId = null) => {
    try {
      // 计算分类层级
      let level = 0;
      if (parentId) {
        const parentCategory = await Category.findById(parentId);
        if (!parentCategory) {
          throw new Error('Parent category not found');
        }
        level = parentCategory.level + 1;
      }

      // 检查层级限制
      if (level > 2) {
        throw new Error('Category level cannot exceed 3');
      }

      // 创建分类
      const category = await Category.create({
        name,
        parentId,
        level,
        userId,
      });

      return category;
    } catch (error) {
      throw error;
    }
  },

  // 获取分类列表
  getCategories: async (userId) => {
    try {
      const categories = await Category.find({ userId });
      return categories;
    } catch (error) {
      throw error;
    }
  },

  // 获取分类详情
  getCategoryById: async (id, userId) => {
    try {
      const category = await Category.findOne({ _id: id, userId });
      if (!category) {
        throw new Error('Category not found');
      }
      return category;
    } catch (error) {
      throw error;
    }
  },

  // 更新分类
  updateCategory: async (id, updates, userId) => {
    try {
      // 计算新的分类层级
      if (updates.parentId) {
        const parentCategory = await Category.findById(updates.parentId);
        if (!parentCategory) {
          throw new Error('Parent category not found');
        }
        updates.level = parentCategory.level + 1;

        // 检查层级限制
        if (updates.level > 2) {
          throw new Error('Category level cannot exceed 3');
        }
      } else {
        updates.level = 0;
      }

      // 更新分类
      const category = await Category.findOneAndUpdate(
        { _id: id, userId },
        updates,
        { new: true }
      );
      if (!category) {
        throw new Error('Category not found');
      }

      return category;
    } catch (error) {
      throw error;
    }
  },

  // 删除分类
  deleteCategory: async (id, userId) => {
    try {
      // 检查是否有子分类
      const hasChildren = await Category.exists({ parentId: id, userId });
      if (hasChildren) {
        throw new Error('Category has children, cannot delete');
      }

      // 删除分类
      const result = await Category.deleteOne({ _id: id, userId });
      if (result.deletedCount === 0) {
        throw new Error('Category not found');
      }

      return { success: true };
    } catch (error) {
      throw error;
    }
  },

  // 获取分类树
  getCategoryTree: async (userId) => {
    try {
      const categories = await Category.find({ userId });
      
      // 构建分类树
      const buildTree = (parentId = null) => {
        return categories
          .filter(cat => cat.parentId === parentId)
          .map(cat => ({
            ...cat.toObject(),
            children: buildTree(cat._id)
          }));
      };

      return buildTree();
    } catch (error) {
      throw error;
    }
  },
};

module.exports = categoryService;