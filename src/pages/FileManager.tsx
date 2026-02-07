import React, { useState } from 'react'
import FileUpload from '../components/FileUpload'
import FileList from '../components/FileList'

const FileManager: React.FC = () => {
  const [currentFolder, setCurrentFolder] = useState<string>('/')
  const [files, setFiles] = useState<any[]>([
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
  const [showFolderModal, setShowFolderModal] = useState<boolean>(false)
  const [newFolderName, setNewFolderName] = useState<string>('')

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
      path: `${currentFolder}${folderName}`
    }
    setFiles([...files, newFolder])
    setShowFolderModal(false)
    setNewFolderName('')
  }

  const handleFileDelete = (fileId: number) => {
    setFiles(files.filter(file => file.id !== fileId))
  }

  const handleFolderNavigate = (folderPath: string) => {
    setCurrentFolder(folderPath)
  }

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      handleFolderCreate(newFolderName.trim())
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">文件管理</h2>
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
        <div className="mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <button 
              className="hover:text-primary" 
              onClick={() => setCurrentFolder('/')}
            >
              根目录
            </button>
            {currentFolder !== '/' && (
              <>
                <span>/</span>
                <span>{currentFolder.split('/').pop()}</span>
              </>
            )}
          </div>
        </div>

        {/* File List */}
        <FileList 
          files={files.filter(file => file.path.startsWith(currentFolder) && !file.path.slice(currentFolder.length).includes('/'))}
          onDelete={handleFileDelete}
          onFolderNavigate={handleFolderNavigate}
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
    </div>
  )
}

export default FileManager