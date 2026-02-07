import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'

interface FileUploadProps {
  onUpload: (files: any[]) => void
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload }) => {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': [],
      'application/pdf': [],
      'application/msword': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
      'application/vnd.ms-excel': [],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
      'application/vnd.ms-powerpoint': [],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': [],
      'video/*': [],
      'audio/*': []
    },
    maxFiles: 10,
    maxSize: 100 * 1024 * 1024, // 100MB
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        setError('部分文件不符合要求，已被拒绝')
        setTimeout(() => setError(null), 3000)
      }

      if (acceptedFiles.length > 0) {
        setUploading(true)
        setProgress(0)

        // 模拟文件上传
        let uploaded = 0
        const interval = setInterval(() => {
          uploaded += 10
          setProgress(uploaded)
          if (uploaded >= 100) {
            clearInterval(interval)
            setTimeout(() => {
              setUploading(false)
              setProgress(0)
              
              // 转换文件对象为我们需要的格式
              const newFiles = acceptedFiles.map((file, index) => ({
                id: Date.now() + index,
                name: file.name,
                type: file.type || 'application/octet-stream',
                size: file.size,
                createdAt: new Date(),
                path: `/${file.name}`
              }))
              
              onUpload(newFiles)
            }, 500)
          }
        }, 200)
      }
    }
  })

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-4">上传文件</h3>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition duration-200 ${isDragActive ? 'border-primary bg-blue-50' : 'border-gray-300 hover:border-primary hover:bg-blue-50'}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-primary">拖放文件到此处</p>
        ) : (
          <div>
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="mt-2 text-sm text-gray-600">点击或拖放文件到此处上传</p>
            <p className="mt-1 text-xs text-gray-500">支持图片、文档、视频等多种格式，单个文件最大100MB</p>
          </div>
        )}
      </div>

      {uploading && (
        <div className="mt-4">
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-600">{progress}%</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default FileUpload