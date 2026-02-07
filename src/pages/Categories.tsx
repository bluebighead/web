import React, { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { apiClient, Category as ApiCategory, CategoryFile as ApiCategoryFile } from '../utils/apiClient'

interface Category {
  id: number
  name: string
  parentId: number | null
  level: number
  createdAt: Date
}

interface CategoryFile {
  id: number
  name: string
  type: string
  size: number
  categoryId: number
  createdAt: Date
  path?: string
  content?: string
}

const Categories: React.FC = () => {
  const location = useLocation()
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryFiles, setCategoryFiles] = useState<CategoryFile[]>([])

  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newCategory, setNewCategory] = useState({
    name: '',
    parentId: null as number | null
  })
  const [showSubCategoryModal, setShowSubCategoryModal] = useState(false)
  const [subCategoryParent, setSubCategoryParent] = useState<Category | null>(null)
  const [subCategoryName, setSubCategoryName] = useState('')
  const [showFileUploadModal, setShowFileUploadModal] = useState(false)
  const [fileUploadCategory, setFileUploadCategory] = useState<Category | null>(null)
  const [uploadingFiles, setUploadingFiles] = useState<{name: string, progress: number, status: 'uploading' | 'success' | 'error'}[]>([])
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [previewFile, setPreviewFile] = useState<CategoryFile | null>(null)
  const [showRenameModal, setShowRenameModal] = useState(false)
  const [renameFile, setRenameFile] = useState<CategoryFile | null>(null)
  const [newFileName, setNewFileName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set([1, 5]))

  const toggleCategoryExpand = (categoryId: number) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId)
      } else {
        newSet.add(categoryId)
      }
      return newSet
    })
  }

  const loadCategories = async () => {
    try {
      const apiCategories = await apiClient.getCategories()
      const categoriesWithDate = apiCategories.map(cat => ({
        ...cat,
        parentId: cat.parent_id,
        createdAt: new Date(cat.created_at)
      }))
      setCategories(categoriesWithDate)
    } catch (error) {
      console.error('Failed to load categories:', error)
      setDefaultCategories()
    }
  }

  const loadFiles = async () => {
    try {
      const apiFiles = await apiClient.getFiles()
      const filesWithDate = apiFiles.map(file => ({
        ...file,
        categoryId: file.category_id || 0,
        createdAt: new Date(file.created_at),
        path: file.path
      }))
      setCategoryFiles(filesWithDate)
    } catch (error) {
      console.error('Failed to load files:', error)
    }
  }

  useEffect(() => {
    loadCategories()
    loadFiles()
  }, [])

  useEffect(() => {
    if (location.pathname === '/categories/create') {
      setShowCreateForm(true)
    }
  }, [location.pathname])

  const setDefaultCategories = () => {
    const defaultCategories: Category[] = [
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
    ]
    setCategories(defaultCategories)
  }

  const handleCreateCategory = async () => {
    if (newCategory.name.trim()) {
      const parentCategory = categories.find(cat => cat.id === newCategory.parentId)
      const level = parentCategory ? parentCategory.level + 1 : 0

      if (level > 2) {
        alert('分类层级不能超过3级')
        return
      }

      try {
        await apiClient.createCategory(newCategory.name.trim(), newCategory.parentId, level)
        await loadCategories()
        setNewCategory({ name: '', parentId: null })
        setShowCreateForm(false)
      } catch (error) {
        console.error('Failed to create category:', error)
        alert('创建分类失败')
      }
    }
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
  }

  const handleUpdateCategory = async () => {
    if (editingCategory && editingCategory.name.trim()) {
      try {
        await apiClient.updateCategory(editingCategory.id, editingCategory.name.trim(), editingCategory.parentId, editingCategory.level)
        await loadCategories()
        setEditingCategory(null)
      } catch (error) {
        console.error('Failed to update category:', error)
        alert('更新分类失败')
      }
    }
  }

  const handleDeleteCategory = async (categoryId: number) => {
    const hasChildren = categories.some(cat => cat.parentId === categoryId)
    if (hasChildren) {
      alert('该分类下有子分类，无法删除')
      return
    }

    if (window.confirm('确定要删除该分类吗？')) {
      try {
        await apiClient.deleteCategory(categoryId)
        await loadCategories()
      } catch (error) {
        console.error('Failed to delete category:', error)
        alert('删除分类失败')
      }
    }
  }

  const openSubCategoryModal = (parent: Category) => {
    setSubCategoryParent(parent)
    setSubCategoryName('')
    setShowSubCategoryModal(true)
  }

  const closeSubCategoryModal = () => {
    setShowSubCategoryModal(false)
    setSubCategoryParent(null)
    setSubCategoryName('')
  }

  const handleCreateSubCategory = async () => {
    if (subCategoryParent && subCategoryName.trim()) {
      const level = subCategoryParent.level + 1

      if (level > 2) {
        alert('分类层级不能超过3级')
        return
      }

      try {
        await apiClient.createCategory(subCategoryName.trim(), subCategoryParent.id, level)
        await loadCategories()
        setShowSubCategoryModal(false)
        setSubCategoryParent(null)
        setSubCategoryName('')
        setExpandedCategories(prev => new Set([...prev, subCategoryParent.id]))
      } catch (error) {
        console.error('Failed to create subcategory:', error)
        alert('创建子分类失败')
      }
    }
  }

  const handleDeleteFile = async (fileId: number) => {
    if (window.confirm('确定要删除该文件吗？')) {
      try {
        await apiClient.deleteFile(fileId)
        await loadFiles()
      } catch (error) {
        console.error('Failed to delete file:', error)
        alert('删除文件失败')
      }
    }
  }

  const handlePreviewFile = (file: CategoryFile) => {
    setPreviewFile(file)
    setShowPreviewModal(true)
  }

  const handleRenameFile = (file: CategoryFile) => {
    setRenameFile(file)
    setNewFileName(file.name)
    setShowRenameModal(true)
  }

  const handleRenameSubmit = async () => {
    if (!renameFile || !newFileName.trim()) return

    try {
      await apiClient.renameFile(renameFile.id, newFileName)
      await loadFiles()
      setShowRenameModal(false)
      setRenameFile(null)
      setNewFileName('')
    } catch (error) {
      console.error('Failed to rename file:', error)
    }
  }

  const closeRenameModal = () => {
    setShowRenameModal(false)
    setRenameFile(null)
    setNewFileName('')
  }

  const closePreviewModal = () => {
    setShowPreviewModal(false)
    setPreviewFile(null)
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    } else if (fileType.startsWith('video/')) {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    } else if (fileType.startsWith('audio/')) {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 3 .895 3 2-3-.895-3-2zm0-14V2m0 2h12" />
        </svg>
      )
    } else if (fileType.includes('pdf')) {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    } else {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
  }

  const openFileUploadModal = (category: Category) => {
    setFileUploadCategory(category)
    setUploadingFiles([])
    setShowFileUploadModal(true)
  }

  const closeFileUploadModal = () => {
    setShowFileUploadModal(false)
    setFileUploadCategory(null)
    setUploadingFiles([])
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const fileArray = Array.from(files)
    const newUploadingFiles = fileArray.map(file => ({
      name: file.name,
      progress: 0,
      status: 'uploading' as const
    }))

    setUploadingFiles(newUploadingFiles)

    fileArray.forEach((file, index) => {
      uploadFile(index, file)
    })

    if (e.target) {
      e.target.value = ''
    }
  }

  const uploadFile = async (index: number, file: File) => {
    try {
      if (fileUploadCategory) {
        const apiFile = await apiClient.uploadFile(file, fileUploadCategory.id)
        await loadFiles()
        setExpandedCategories(prev => new Set([...prev, fileUploadCategory.id]))
        setUploadingFiles(prev => prev.map((uploadingFile, i) => 
          i === index ? { ...uploadingFile, progress: 100, status: 'success' } : uploadingFile
        ))
      }
    } catch (error) {
      console.error('Failed to upload file:', error)
      setUploadingFiles(prev => prev.map((uploadingFile, i) => 
        i === index ? { ...uploadingFile, progress: 0, status: 'error' } : uploadingFile
      ))
    }
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const renderCategoryTree = (parentId: number | null = null, level: number = 0) => {
    const levelCategories = categories.filter(cat => cat.parentId === parentId)
    if (levelCategories.length === 0) return null

    return (
      <div className={`space-y-4 ${level > 0 ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''}`}>
        {levelCategories.map((category) => {
          const hasChildren = categories.some(cat => cat.parentId === category.id)
          const isExpanded = expandedCategories.has(category.id)
          const categoryFilesList = categoryFiles.filter(file => file.categoryId === category.id)
          
          return (
            <div key={category.id} className="space-y-4">
              <div 
                className={`bg-white rounded-xl shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-md ${
                  level === 0 ? 'border-l-4 border-blue-600' : 
                  level === 1 ? 'border-l-4 border-green-600' : 
                  'border-l-4 border-purple-600'
                }`}
              >
                <div className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                    <div className="flex items-center space-x-4 mb-3 md:mb-0 flex-1">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-lg shadow-sm ${
                        level === 0 ? 'bg-blue-100 text-blue-600' : 
                        level === 1 ? 'bg-green-100 text-green-600' : 
                        'bg-purple-100 text-purple-600'
                      }`}>
                        {level === 0 && (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        )}
                        {level === 1 && (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                          </svg>
                        )}
                        {level === 2 && (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          {editingCategory?.id === category.id ? (
                            <input
                              type="text"
                              value={editingCategory.name}
                              onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                              className={`w-full md:w-64 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                                level === 0 ? 'border-blue-300 focus:ring-blue-500' : 
                                level === 1 ? 'border-green-300 focus:ring-green-500' : 
                                'border-purple-300 focus:ring-purple-500'
                              }`}
                            />
                          ) : (
                            <h3 className={`text-lg font-semibold ${
                              level === 0 ? 'text-blue-700' : 
                              level === 1 ? 'text-green-700' : 
                              'text-purple-700'
                            }`}>
                              {category.name}
                            </h3>
                          )}
                          
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            level === 0 ? 'bg-blue-600 text-white' : 
                            level === 1 ? 'bg-green-600 text-white' : 
                            'bg-purple-600 text-white'
                          }`}>
                            第 {level + 1} 级
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                          <span>
                            <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(category.createdAt).toLocaleDateString()}
                          </span>
                          
                          {category.parentId && (
                            <span>
                              <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                              父分类: {categories.find(c => c.id === category.parentId)?.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {(hasChildren || categoryFilesList.length > 0) && (
                        <button
                          onClick={() => toggleCategoryExpand(category.id)}
                          className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${
                            level === 0 
                              ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                              : level === 1 
                                ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                                : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                          }`}
                          title={isExpanded ? '收起' : '展开'}
                        >
                          {isExpanded ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          )}
                        </button>
                      )}
                      
                      {level < 2 && (
                        <button
                          onClick={() => openSubCategoryModal(category)}
                          className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200"
                          title="添加子分类"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      )}
                      
                      <button
                        onClick={() => openFileUploadModal(category)}
                        className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200"
                        title="上传文件"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                      </button>
                      
                      {editingCategory?.id === category.id ? (
                        <>
                          <button
                            onClick={handleUpdateCategory}
                            className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-all duration-200"
                            title="保存"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setEditingCategory(null)}
                            className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-200"
                            title="取消"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditCategory(category)}
                            className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all duration-200"
                            title="编辑"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-200"
                            title="删除"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {isExpanded && categoryFilesList.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">文件 ({categoryFilesList.length})</h4>
                      <div className="space-y-2">
                        {categoryFilesList.map(file => (
                          <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex items-center space-x-3 flex-1">
                              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white shadow-sm text-gray-600">
                                {getFileIcon(file.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                <p className="text-xs text-gray-500">
                                  {(file.size / 1024).toFixed(2)} KB · {new Date(file.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleRenameFile(file)}
                                className="flex items-center justify-center w-8 h-8 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-all duration-200"
                                title="重命名文件"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handlePreviewFile(file)}
                                className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all duration-200"
                                title="预览文件"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteFile(file.id)}
                                className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-200"
                                title="删除文件"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {hasChildren && isExpanded && renderCategoryTree(category.id, level + 1)}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">分类管理</h1>
            <p className="mt-2 text-sm text-gray-600">管理您的文件分类和内容</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            创建分类
          </button>
        </div>

        {showCreateForm && (
          <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">创建新分类</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="分类名称"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={newCategory.parentId || ''}
                onChange={(e) => setNewCategory({ ...newCategory, parentId: e.target.value ? parseInt(e.target.value) : null })}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">无父分类</option>
                {categories.filter(cat => cat.level < 2).map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <button
                onClick={handleCreateCategory}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                创建
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        )}

        {renderCategoryTree()}
      </div>

      {showSubCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">创建子分类</h2>
            <p className="text-sm text-gray-600 mb-4">父分类: {subCategoryParent?.name}</p>
            <input
              type="text"
              placeholder="子分类名称"
              value={subCategoryName}
              onChange={(e) => setSubCategoryName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeSubCategoryModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleCreateSubCategory}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                创建
              </button>
            </div>
          </div>
        </div>
      )}

      {showFileUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">上传文件</h2>
            <p className="text-sm text-gray-600 mb-4">分类: {fileUploadCategory?.name}</p>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              className="hidden"
            />
            
            <button
              onClick={triggerFileInput}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors"
            >
              <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm text-gray-600">点击选择文件或拖拽文件到此处</p>
            </button>
            
            {uploadingFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {uploadingFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${
                            file.status === 'success' ? 'bg-green-500' : 
                            file.status === 'error' ? 'bg-red-500' : 
                            'bg-blue-500'
                          }`}
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="ml-3">
                      {file.status === 'uploading' && (
                        <span className="text-xs text-gray-500">{file.progress}%</span>
                      )}
                      {file.status === 'success' && (
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {file.status === 'error' && (
                        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={closeFileUploadModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {showPreviewModal && previewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{previewFile.name}</h3>
              <button
                onClick={closePreviewModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 bg-gray-50">
              {previewFile.type.startsWith('image/') && (
                <img 
                  src={`http://localhost:3001/uploads/${previewFile.path}`} 
                  alt={previewFile.name}
                  className="max-w-full h-auto mx-auto"
                />
              )}
              {previewFile.type.startsWith('video/') && (
                <video 
                  controls 
                  className="max-w-full h-auto mx-auto"
                  src={`http://localhost:3001/uploads/${previewFile.path}`}
                />
              )}
              {previewFile.type.startsWith('audio/') && (
                <audio 
                  controls 
                  className="w-full"
                  src={`http://localhost:3001/uploads/${previewFile.path}`}
                />
              )}
              {previewFile.type.startsWith('text/') && (
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600">文本文件预览功能需要后端支持</p>
                </div>
              )}
              {!previewFile.type.startsWith('image/') && 
               !previewFile.type.startsWith('video/') && 
               !previewFile.type.startsWith('audio/') && 
               !previewFile.type.startsWith('text/') && (
                <div className="bg-white rounded-lg p-4 text-center">
                  <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-600">此文件类型不支持预览</p>
                  <p className="text-sm text-gray-500 mt-2">文件大小: {(previewFile.size / 1024).toFixed(2)} KB</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showRenameModal && renameFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">重命名文件</h3>
            <p className="text-sm text-gray-600 mb-4">当前文件: {renameFile.name}</p>
            <input
              type="text"
              placeholder="新文件名"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeRenameModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleRenameSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Categories
