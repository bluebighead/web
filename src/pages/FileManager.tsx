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
  }

  const handleFileDelete = (fileId: number) => {
    setFiles(files.filter(file => file.id !== fileId))
  }

  const handleFolderNavigate = (folderPath: string) => {
    setCurrentFolder(folderPath)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">文件管理</h2>
          <div className="flex space-x-4">
            <button 
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
              onClick={() => {
                const folderName = prompt('请输入文件夹名称')
                if (folderName) {
                  handleFolderCreate(folderName)
                }
              }}
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
    </div>
  )
}

export default FileManager