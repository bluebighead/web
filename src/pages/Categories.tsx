import React, { useState } from 'react'

interface Category {
  id: number
  name: string
  parentId: number | null
  level: number
  createdAt: Date
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: 1,
      name: '技术文档',
      parentId: null,
      level: 0,
      createdAt: new Date('2026-02-01')
    },
    {
      id: 2,
      name: '前端开发',
      parentId: 1,
      level: 1,
      createdAt: new Date('2026-02-02')
    },
    {
      id: 3,
      name: 'React',
      parentId: 2,
      level: 2,
      createdAt: new Date('2026-02-03')
    },
    {
      id: 4,
      name: '后端开发',
      parentId: 1,
      level: 1,
      createdAt: new Date('2026-02-04')
    },
    {
      id: 5,
      name: '生活记录',
      parentId: null,
      level: 0,
      createdAt: new Date('2026-02-05')
    }
  ])

  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newCategory, setNewCategory] = useState({
    name: '',
    parentId: null as number | null
  })

  const handleCreateCategory = () => {
    if (newCategory.name.trim()) {
      const parentCategory = categories.find(cat => cat.id === newCategory.parentId)
      const level = parentCategory ? parentCategory.level + 1 : 0

      if (level > 2) {
        alert('分类层级不能超过3级')
        return
      }

      const category: Category = {
        id: categories.length + 1,
        name: newCategory.name.trim(),
        parentId: newCategory.parentId,
        level,
        createdAt: new Date()
      }

      setCategories([...categories, category])
      setNewCategory({ name: '', parentId: null })
      setShowCreateForm(false)
    }
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
  }

  const handleUpdateCategory = () => {
    if (editingCategory && editingCategory.name.trim()) {
      setCategories(categories.map(cat => 
        cat.id === editingCategory.id ? editingCategory : cat
      ))
      setEditingCategory(null)
    }
  }

  const handleDeleteCategory = (categoryId: number) => {
    // 检查是否有子分类
    const hasChildren = categories.some(cat => cat.parentId === categoryId)
    if (hasChildren) {
      alert('该分类下有子分类，无法删除')
      return
    }

    if (window.confirm('确定要删除该分类吗？')) {
      setCategories(categories.filter(cat => cat.id !== categoryId))
    }
  }

  const renderCategoryTree = (parentId: number | null = null, level: number = 0) => {
    const levelCategories = categories.filter(cat => cat.parentId === parentId)
    if (levelCategories.length === 0) return null

    return (
      <ul className="ml-4">
        {levelCategories.map(category => (
          <li key={category.id} className="mb-2">
            <div className={`flex items-center space-x-3 ${level > 0 ? 'ml-' + (level * 4) : ''}`}>
              {level > 0 && (
                <div className="w-4 h-0.5 bg-gray-300 mr-2"></div>
              )}
              {editingCategory?.id === category.id ? (
                <div className="flex items-center space-x-2 flex-1">
                  <input
                    type="text"
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    className="border border-gray-300 rounded px-3 py-1 text-sm flex-1"
                  />
                  <button 
                    className="bg-primary text-white px-3 py-1 rounded text-sm"
                    onClick={handleUpdateCategory}
                  >
                    保存
                  </button>
                  <button 
                    className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm"
                    onClick={() => setEditingCategory(null)}
                  >
                    取消
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3 flex-1">
                  <span className="font-medium">{category.name}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(category.createdAt).toLocaleString()}
                  </span>
                  <div className="flex space-x-2 ml-auto">
                    <button 
                      className="text-primary hover:text-blue-600"
                      onClick={() => handleEditCategory(category)}
                    >
                      编辑
                    </button>
                    <button 
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      删除
                    </button>
                  </div>
                </div>
              )}
            </div>
            {renderCategoryTree(category.id, level + 1)}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">分类管理</h2>
          <button 
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? '取消' : '创建分类'}
          </button>
        </div>

        {/* Create Category Form */}
        {showCreateForm && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-medium mb-4">创建分类</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">分类名称</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="请输入分类名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">父分类</label>
                <select
                  value={newCategory.parentId || ''}
                  onChange={(e) => setNewCategory({ ...newCategory, parentId: e.target.value ? parseInt(e.target.value) : null })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">无（顶级分类）</option>
                  {categories
                    .filter(cat => cat.level < 2) // 只显示层级小于2的分类作为父分类
                    .map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {' '.repeat(cat.level * 2)} {cat.name}
                      </option>
                    ))
                  }
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button 
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-200"
                  onClick={() => {
                    setShowCreateForm(false)
                    setNewCategory({ name: '', parentId: null })
                  }}
                >
                  取消
                </button>
                <button 
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                  onClick={handleCreateCategory}
                >
                  创建
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Category Tree */}
        <div>
          <h3 className="text-lg font-medium mb-4">分类列表</h3>
          {renderCategoryTree()}
          {categories.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">暂无分类</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Categories