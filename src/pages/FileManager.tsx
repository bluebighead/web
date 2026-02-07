import React, { useState, useEffect } from 'react'
import FileUpload from '../components/FileUpload'
import FileList from '../components/FileList'
import { loadState, saveState, debounce } from '../utils/stateManager'

const FileManager: React.FC = () => {
  const [currentFolder, setCurrentFolder] = useState<string>('/')
  const [files, setFiles] = useState<any[]>([])
  const [showFolderModal, setShowFolderModal] = useState<boolean>(false)
  const [newFolderName, setNewFolderName] = useState<string>('')
  const [showBreadcrumbModal, setShowBreadcrumbModal] = useState<boolean>(false)
  const [breadcrumbFolderPath, setBreadcrumbFolderPath] = useState<string>('')
  const [breadcrumbFolderName, setBreadcrumbFolderName] = useState<string>('')
  const [showDeleteWarning, setShowDeleteWarning] = useState<boolean>(false)
  const [folderToDelete, setFolderToDelete] = useState<number | null>(null)

  // 从localStorage加载状态
  useEffect(() => {
    const savedState = loadState()
    if (savedState && savedState.fileManager) {
      if (savedState.fileManager.currentFolder) {
        setCurrentFolder(savedState.fileManager.currentFolder)
      }
      if (savedState.fileManager.showFolderModal !== undefined) {
        setShowFolderModal(savedState.fileManager.showFolderModal)
      }
      if (savedState.fileManager.newFolderName) {
        setNewFolderName(savedState.fileManager.newFolderName)
      }
      if (savedState.fileManager.showBreadcrumbModal !== undefined) {
        setShowBreadcrumbModal(savedState.fileManager.showBreadcrumbModal)
      }
      if (savedState.fileManager.breadcrumbFolderPath) {
        setBreadcrumbFolderPath(savedState.fileManager.breadcrumbFolderPath)
      }
      if (savedState.fileManager.breadcrumbFolderName) {
        setBreadcrumbFolderName(savedState.fileManager.breadcrumbFolderName)
      }
    }
  }, [])

  // 保存状态到localStorage（防抖）
  const saveFileManagerState = debounce(() => {
    const currentState = loadState() || {}
    const newState = {
      ...currentState,
      fileManager: {
        currentFolder,
        showFolderModal,
        newFolderName,
        showBreadcrumbModal,
        breadcrumbFolderPath,
        breadcrumbFolderName
      }
    }
    saveState(newState)
  }, 200)

  // 当状态变更时保存
  useEffect(() => {
    saveFileManagerState()
  }, [currentFolder, showFolderModal, newFolderName, showBreadcrumbModal, breadcrumbFolderPath, breadcrumbFolderName])

  // 从localStorage加载文件数据
  useEffect(() => {
    const savedFiles = localStorage.getItem('owerweb_files')
    if (savedFiles) {
      try {
        const parsedFiles = JSON.parse(savedFiles)
        // 将字符串日期转换回Date对象
        const filesWithDate = parsedFiles.map((file: any) => ({
          ...file,
          createdAt: new Date(file.createdAt)
        }))
        setFiles(filesWithDate)
      } catch (error) {
        console.error('Failed to parse saved files:', error)
        // 如果解析失败，使用默认数据
        setFiles([
          {
            id: 1,
            name: 'document.pdf',
            type: 'application/pdf',
            size: 2048,
            createdAt: new Date('2026-02-01'),
            path: '/document.pdf'
          },
          {
            id: 2,
            name: 'image.jpg',
            type: 'image/jpeg',
            size: 1024,
            createdAt: new Date('2026-02-02'),
            path: '/image.jpg'
          },
          {
            id: 3,
            name: 'folder1',
            type: 'folder',
            size: 0,
            createdAt: new Date('2026-02-03'),
            path: '/folder1'
          }
        ])
      }
    } else {
      // 如果没有保存的数据，使用默认数据
      const defaultFiles = [
        {
          id: 1,
          name: 'document.pdf',
          type: 'application/pdf',
          size: 2048,
          createdAt: new Date('2026-02-01'),
          path: '/document.pdf'
        },
        {
          id: 2,
          name: 'image.jpg',
          type: 'image/jpeg',
          size: 1024,
          createdAt: new Date('2026-02-02'),
          path: '/image.jpg'
        },
        {
          id: 3,
          name: 'folder1',
          type: 'folder',
          size: 0,
          createdAt: new Date('2026-02-03'),
          path: '/folder1'
        }
      ]
      setFiles(defaultFiles)
      localStorage.setItem('owerweb_files', JSON.stringify(defaultFiles))
    }
  }, [])

  // 当文件数据变更时，保存到localStorage
  useEffect(() => {
    localStorage.setItem('owerweb_files', JSON.stringify(files))
  }, [files])

  const handleFileUpload = (newFiles: any[]) => {
    setFiles([...files, ...newFiles])
  }

  const handleFolderCreate = (folderName: string) => {
    const newFolder = {
      id: files.length + 1,
      name: folderName,
      type: 'folder',
      size: 0,
      createdAt: new Date(),
      path: `${currentFolder}${currentFolder === '/' ? '' : '/'}${folderName}`
    }
    setFiles([...files, newFolder])
    setShowFolderModal(false)
    setNewFolderName('')
  }

  const handleSubFolderCreate = (parentFolderId: number, subFolderName: string) => {
    const parentFolder = files.find(file => file.id === parentFolderId)
    if (!parentFolder) return

    const newSubFolder = {
      id: files.length + 1,
      name: subFolderName,
      type: 'folder',
      size: 0,
      createdAt: new Date(),
      path: `${parentFolder.path}/${subFolderName}`
    }
    setFiles([...files, newSubFolder])
  }

  const handleFileDelete = (fileId: number) => {
    const fileToDelete = files.find(file => file.id === fileId)
    if (!fileToDelete) return

    // 如果是文件夹，检查是否包含文件或子文件夹
    if (fileToDelete.type === 'folder') {
      const hasChildren = files.some(file => 
        file.path.startsWith(`${fileToDelete.path}/`) && 
        file.path !== fileToDelete.path &&
        !file.path.slice(`${fileToDelete.path}/`.length).includes('/')
      )
      
      if (hasChildren) {
        // 显示删除警告
        setFolderToDelete(fileId)
        setShowDeleteWarning(true)
        return
      }
    }

    // 如果是文件或空文件夹，直接删除
    setFiles(files.filter(file => file.id !== fileId))
  }

  const handleConfirmDelete = () => {
    if (folderToDelete !== null) {
      const fileToDelete = files.find(file => file.id === folderToDelete)
      if (fileToDelete && fileToDelete.type === 'folder') {
        // 删除文件夹及其所有子文件和子文件夹
        const folderPath = fileToDelete.path
        setFiles(files.filter(file => !file.path.startsWith(folderPath)))
      }
      setFolderToDelete(null)
      setShowDeleteWarning(false)
    }
  }

  const handleCancelDelete = () => {
    setFolderToDelete(null)
    setShowDeleteWarning(false)
  }

  const handleFolderNavigate = (folderPath: string) => {
    setCurrentFolder(folderPath)
  }

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      handleFolderCreate(newFolderName.trim())
    }
  }

  const handleBreadcrumbFolderCreate = () => {
    if (breadcrumbFolderName.trim()) {
      const newFolder = {
        id: files.length + 1,
        name: breadcrumbFolderName.trim(),
        type: 'folder',
        size: 0,
        createdAt: new Date(),
        path: `${breadcrumbFolderPath}${breadcrumbFolderPath === '/' ? '' : '/'}${breadcrumbFolderName.trim()}`
      }
      setFiles([...files, newFolder])
      setShowBreadcrumbModal(false)
      setBreadcrumbFolderName('')
      setBreadcrumbFolderPath('')
    }
  }

  const openBreadcrumbFolderModal = (path: string) => {
    setBreadcrumbFolderPath(path)
    setBreadcrumbFolderName('')
    setShowBreadcrumbModal(true)
  }

  const closeBreadcrumbFolderModal = () => {
    setShowBreadcrumbModal(false)
    setBreadcrumbFolderName('')
    setBreadcrumbFolderPath('')
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-xl sm:text-2xl font-semibold">文件管理</h2>
          <div className="flex space-x-4">
            <button 
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
              onClick={() => setShowFolderModal(true)}
            >
              创建文件夹
            </button>
          </div>
        </div>

        {/* File Upload */}
        <FileUpload onUpload={handleFileUpload} />

        {/* Current Path */}
        <div className="mb-4 py-2">
          <div className="flex items-center flex-wrap gap-2 text-sm text-gray-600">
            <button 
              className="hover:text-primary px-2 py-1 rounded"
              onClick={() => setCurrentFolder('/')}
            >
              根目录
            </button>
            <button 
              className="flex items-center space-x-1 bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition duration-200"
              onClick={() => openBreadcrumbFolderModal('/')}
              title="在根目录创建文件夹"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            {currentFolder !== '/' && currentFolder.split('/').filter(Boolean).map((folder, index, array) => {
              const path = '/' + array.slice(0, index + 1).join('/')
              return (
                <React.Fragment key={path}>
                  <span className="text-gray-400">/</span>
                  <button 
                    className="hover:text-primary px-2 py-1 rounded"
                    onClick={() => setCurrentFolder(path)}
                  >
                    {folder}
                  </button>
                  <button 
                    className="flex items-center space-x-1 bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition duration-200"
                    onClick={() => openBreadcrumbFolderModal(path)}
                    title={`在 ${folder} 中创建文件夹`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </React.Fragment>
              )
            })}
          </div>
        </div>

        {/* File List */}
        <FileList 
          files={files.filter(file => {
            // 确保路径匹配且不包含更深层的子文件夹，同时排除当前文件夹本身
            const relativePath = file.path.slice(currentFolder.length).replace(/^\/+/, '')
            return file.path.startsWith(currentFolder) && relativePath !== '' && !relativePath.includes('/')
          })}
          onDelete={handleFileDelete}
          onFolderNavigate={handleFolderNavigate}
          onCreateSubFolder={handleSubFolderCreate}
        />
      </div>

      {/* Create Folder Modal */}
      {showFolderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">创建文件夹</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                文件夹名称
              </label>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入文件夹名称"
                autoFocus
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition duration-200"
                onClick={() => {
                  setShowFolderModal(false)
                  setNewFolderName('')
                }}
              >
                取消
              </button>
              <button
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 transition duration-200"
                onClick={handleCreateFolder}
              >
                创建
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb Create Folder Modal */}
      {showBreadcrumbModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">
              {breadcrumbFolderPath === '/' ? '在根目录创建文件夹' : `在 "${breadcrumbFolderPath.split('/').pop()}" 中创建文件夹`}
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                文件夹名称
              </label>
              <input
                type="text"
                value={breadcrumbFolderName}
                onChange={(e) => setBreadcrumbFolderName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入文件夹名称"
                autoFocus
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition duration-200"
                onClick={closeBreadcrumbFolderModal}
              >
                取消
              </button>
              <button
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 transition duration-200"
                onClick={handleBreadcrumbFolderCreate}
              >
                创建
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Warning Modal */}
      {showDeleteWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0">
                <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-.77-1.964-.77-2.732 0L5.268 16.01c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-lg font-medium text-red-800 mb-2">
                  确认删除
                </h3>
                <p className="text-gray-600">
                  此文件夹包含文件或子文件夹，删除操作将彻底移除所有内容且无法恢复
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition duration-200"
                onClick={handleCancelDelete}
              >
                取消
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
                onClick={handleConfirmDelete}
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FileManager