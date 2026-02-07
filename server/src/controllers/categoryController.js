const Category = require('../models/Category');

const categoryController = {
  getAllCategories: (req, res) => {
    try {
      const categories = Category.getAll();
      res.json({ categories });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching categories', error: err.message });
    }
  },

  getCategoryById: (req, res) => {
    const { id } = req.params;
    try {
      const category = Category.getById(id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.json({ category });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching category', error: err.message });
    }
  },

  createCategory: (req, res) => {
    const { name, parentId, level } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    if (level > 2) {
      return res.status(400).json({ message: 'Category level cannot exceed 3' });
    }

    try {
      const categoryData = {
        name,
        parent_id: parentId || null,
        level: level || 0
      };
      const category = Category.create(categoryData);
      res.status(201).json({ message: 'Category created successfully', category });
    } catch (err) {
      res.status(500).json({ message: 'Error creating category', error: err.message });
    }
  },

  updateCategory: (req, res) => {
    const { id } = req.params;
    const { name, parentId, level } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    if (level > 2) {
      return res.status(400).json({ message: 'Category level cannot exceed 3' });
    }

    try {
      const categoryData = {
        name,
        parent_id: parentId || null,
        level: level || 0
      };
      Category.update(id, categoryData);
      res.json({ message: 'Category updated successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error updating category', error: err.message });
    }
  },

  deleteCategory: (req, res) => {
    const { id } = req.params;

    try {
      const hasChildren = Category.hasChildren(id);
      if (hasChildren) {
        return res.status(400).json({ 
          message: 'Category has subcategories. Please delete them first.' 
        });
      }

      Category.delete(id);
      res.json({ message: 'Category deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting category', error: err.message });
    }
  },

  getSubCategories: (req, res) => {
    const { parentId } = req.params;
    try {
      const categories = Category.getByParentId(parentId);
      res.json({ categories });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching subcategories', error: err.message });
    }
  }
};

module.exports = categoryController;
