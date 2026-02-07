import React, { useState } from 'react'

interface File {
  id: number
  name: string
  type: string
  size: number
  createdAt: Date
  path: string
}

interface FileListProps {
  files: File[]
  onDelete: (fileId: number) => void
  onFolderNavigate: (folderPath: string) => void
  onCreateSubFolder?: (parentFolderId: number, subFolderName: string) => void
}

const FileList: React.FC<FileListProps> = ({ files, onDelete, onFolderNavigate, onCreateSubFolder }) => {
  const [selectedFiles, setSelectedFiles] = useState<number[]>([])
  const [showSubFolderModal, setShowSubFolderModal] = useState<boolean>(false)
  const [parentFolder, setParentFolder] = useState<File | null>(null)
  const [subFolderName, setSubFolderName] = useState<string>('')
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false)
  const [previewFile, setPreviewFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [isLoadingPreview, setIsLoadingPreview] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const handleFileSelect = (fileId: number) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId) 
        : [...prev, fileId]
    )
  }

  const handleSelectAll = () => {
    if (selectedFiles.length === files.length) {
      setSelectedFiles([])
    } else {
      setSelectedFiles(files.map(file => file.id))
    }
  }

  const handleBatchDelete = () => {
    if (selectedFiles.length > 0 && window.confirm('确定要删除选中的文件吗？')) {
      selectedFiles.forEach(fileId => onDelete(fileId))
      setSelectedFiles([])
    }
  }

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleString()
  }

  const getFileIcon = (file: File) => {
    if (file.type === 'folder') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      )
    }

    if (file.type.startsWith('image/')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    }

    if (file.type.includes('pdf')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    }

    if (file.type.includes('word')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }

    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  }

  const validateFolderName = (name: string): { valid: boolean, error: string } => {
    if (!name.trim()) {
      return { valid: false, error: '文件夹名称不能为空' }
    }
    
    if (name.length > 50) {
      return { valid: false, error: '文件夹名称不能超过50个字符' }
    }
    
    const invalidChars = /[<>:"|?*\/\\]/
    if (invalidChars.test(name)) {
      return { valid: false, error: '文件夹名称包含非法字符' }
    }
    
    if (name.startsWith('.') || name.endsWith('.')) {
      return { valid: false, error: '文件夹名称不能以点开头或结尾' }
    }
    
    return { valid: true, error: '' }
  }

  const checkDuplicateName = (name: string, parentPath: string): boolean => {
    return files.some(file => 
      file.type === 'folder' && 
      file.name === name && 
      file.path.startsWith(parentPath) &&
      file.path.slice(parentPath.length).split('/').filter(Boolean).length === 1
    )
  }

  const handleCreateSubFolder = () => {
    const validation = validateFolderName(subFolderName)
    if (!validation.valid) {
      setError(validation.error)
      return
    }
    
    if (parentFolder && checkDuplicateName(subFolderName, parentFolder.path)) {
      setError('该文件夹名称已存在')
      return
    }
    
    if (parentFolder && onCreateSubFolder) {
      onCreateSubFolder(parentFolder.id, subFolderName)
      setShowSubFolderModal(false)
      setSubFolderName('')
      setError('')
    }
  }

  const openSubFolderModal = (folder: File) => {
    setParentFolder(folder)
    setSubFolderName('')
    setError('')
    setShowSubFolderModal(true)
  }

  const closeSubFolderModal = () => {
    setShowSubFolderModal(false)
    setSubFolderName('')
    setError('')
    setParentFolder(null)
  }

  const validateFileType = (file: File): boolean => {
    const allowedTypes = [
      'image/',
      'video/',
      'audio/',
      'application/pdf',
      'text/',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ]
    return allowedTypes.some(type => file.type.startsWith(type))
  }

  const openPreviewModal = (file: File) => {
    if (!validateFileType(file)) {
      alert('该文件类型不支持预览')
      return
    }

    setPreviewFile(file)
    setIsLoadingPreview(true)
    setShowPreviewModal(true)

    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(new Blob([''], { type: file.type }))
      setPreviewUrl(url)
      setIsLoadingPreview(false)
    } else {
      setPreviewUrl('')
      setIsLoadingPreview(false)
    }
  }

  const closePreviewModal = () => {
    setShowPreviewModal(false)
    setPreviewFile(null)
    setPreviewUrl('')
    setIsLoadingPreview(false)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
  }

  const renderPreviewContent = () => {
    if (!previewFile) return null

    if (isLoadingPreview) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )
    }

    if (previewFile.type.startsWith('image/')) {
      return (
        <div className="flex items-center justify-center">
          <div className="relative inline-block">
            <img
              src={previewUrl}
              alt={previewFile.name}
              className="max-w-full max-h-96 object-contain rounded-lg"
              style={{ maxWidth: '100%', maxHeight: '500px' }}
            />
          </div>
        </div>
      )
    }

    if (previewFile.type.startsWith('video/')) {
      return (
        <div className="flex items-center justify-center">
          <video
            controls
            className="max-w-full max-h-96 rounded-lg"
            style={{ maxWidth: '100%', maxHeight: '500px' }}
          >
            <source src={previewUrl} type={previewFile.type} />
            您的浏览器不支持视频预览
          </video>
        </div>
      )
    }

    if (previewFile.type.startsWith('audio/')) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          <audio controls className="w-full max-w-md">
            <source src={previewUrl} type={previewFile.type} />
            您的浏览器不支持音频预览
          </audio>
        </div>
      )
    }

    if (previewFile.type.includes('pdf')) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <p className="text-gray-600 text-center">
            PDF 文件预览
          </p>
          <p className="text-sm text-gray-500">
            文件名: {previewFile.name}
          </p>
          <p className="text-sm text-gray-500">
            文件大小: {formatSize(previewFile.size)}
          </p>
        </div>
      )
    }

    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-gray-600 text-center">
          文件预览
        </p>
        <p className="text-sm text-gray-500">
          文件名: {previewFile.name}
        </p>
        <p className="text-sm text-gray-500">
          文件类型: {previewFile.type}
        </p>
        <p className="text-sm text-gray-500">
          文件大小: {formatSize(previewFile.size)}
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Batch Actions */}
      {selectedFiles.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg mb-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">已选择 {selectedFiles.length} 个文件</p>
          <button 
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
            onClick={handleBatchDelete}
          >
            批量删除
          </button>
        </div>
      )}

      {/* File Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                  checked={selectedFiles.length === files.length && files.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">
                名称
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6 sm:hidden">
                类型
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6 sm:hidden">
                大小
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6 hidden md:table-cell">
                创建时间
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {files.map((file) => (
              <tr key={file.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap sm:px-6">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                    checked={selectedFiles.includes(file.id)}
                    onChange={() => handleFileSelect(file.id)}
                  />
                </td>
                <td className="px-4 py-3 whitespace-nowrap sm:px-6">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    {getFileIcon(file)}
                    <span className={`font-medium ${file.type === 'folder' ? 'text-yellow-600' : 'text-gray-900'}`}>
                      {file.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap sm:px-6 sm:hidden">
                  <span className="text-sm text-gray-500">
                    {file.type === 'folder' ? '文件夹' : file.type.split('/')[1] || '文件'}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap sm:px-6 sm:hidden">
                  <span className="text-sm text-gray-500">
                    {formatSize(file.size)}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap sm:px-6 hidden md:table-cell">
                  <span className="text-sm text-gray-500">
                    {formatDate(file.createdAt)}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium sm:px-6">
                  <div className="flex flex-wrap items-center gap-2">
                    {file.type === 'folder' && (
                      <button 
                        className="flex items-center space-x-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-lg hover:bg-blue-200 transition duration-200 sm:px-3 sm:py-1.5"
                        onClick={() => openSubFolderModal(file)}
                        title="创建子文件夹"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    )}
                    {file.type === 'folder' ? (
                      <button 
                        className="text-primary hover:text-blue-600 px-2 py-1 rounded"
                        onClick={() => onFolderNavigate(file.path)}
                      >
                        打开
                      </button>
                    ) : (
                      <>
                        <button 
                          className="text-primary hover:text-blue-600 px-2 py-1 rounded mr-1"
                          onClick={() => openPreviewModal(file)}
                        >
                          预览
                        </button>
                        <button className="text-primary hover:text-blue-600 px-2 py-1 rounded">
                          下载
                        </button>
                      </>
                    )}
                    <button 
                      className="text-red-500 hover:text-red-600 px-2 py-1 rounded"
                      onClick={() => onDelete(file.id)}
                    >
                      删除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {files.length === 0 && (
        <div className="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500">当前目录为空</p>
        </div>
      )}

      {/* Create Subfolder Modal */}
      {showSubFolderModal && parentFolder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              在 "{parentFolder.name}" 中创建子文件夹
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                子文件夹名称
              </label>
              <input
                type="text"
                value={subFolderName}
                onChange={(e) => {
                  setSubFolderName(e.target.value)
                  setError('')
                }}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
                  error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="请输入子文件夹名称"
                autoFocus
              />
              {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
              )}
            </div>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition duration-200"
                onClick={closeSubFolderModal}
              >
                取消
              </button>
              <button
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 transition duration-200"
                onClick={handleCreateSubFolder}
              >
                创建
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File Preview Modal */}
      {showPreviewModal && previewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-semibold text-gray-800">文件预览</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {previewFile.type}
                </span>
              </div>
              <button
                className="text-gray-400 hover:text-gray-600 transition-colors"
                onClick={closePreviewModal}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Preview Content */}
            <div className="mb-4">
              {renderPreviewContent()}
            </div>

            {/* File Info */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">文件名:</span>
                <span className="text-gray-800 font-medium">{previewFile.name}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">文件大小:</span>
                <span className="text-gray-800 font-medium">{formatSize(previewFile.size)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">创建时间:</span>
                <span className="text-gray-800 font-medium">{formatDate(previewFile.createdAt)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={closePreviewModal}
              >
                关闭
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                下载
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FileList