const express = require('express');
const { createCategory, getCategories, updateCategory, deleteCategory, getCategoryTree } = require('../controllers/categoryController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/', protect, createCategory);
router.get('/', protect, getCategories);
router.get('/tree', protect, getCategoryTree);
router.put('/:id', protect, updateCategory);
router.delete('/:id', protect, deleteCategory);

module.exports = router;