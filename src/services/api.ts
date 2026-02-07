import axios from 'axios'
import type { User, File, Folder, Category, Content, ApiResponse, UploadProgress } from '../types'

// 创建Axios实例
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器 - 添加认证令牌
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器 - 统一错误处理
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response) {
      // 服务器返回错误
      console.error('API Error:', error.response.data)
    } else if (error.request) {
      // 请求已发出但没有收到响应
      console.error('Network Error:', error.request)
    } else {
      // 请求配置出错
      console.error('Request Error:', error.message)
    }
    return Promise.reject(error)
  }
)

// 认证相关API
export const authApi = {
  // 注册
  register: async (username: string, email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> => {
    return api.post('/auth/register', { username, email, password })
  },

  // 登录
  login: async (email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> => {
    return api.post('/auth/login', { email, password })
  },

  // 获取当前用户信息
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    return api.get('/auth/me')
  },
}

// 文件相关API
export const fileApi = {
  // 上传文件
  upload: async (file: Blob, onProgress?: (progress: UploadProgress) => void): Promise<ApiResponse<File>> => {
    const formData = new FormData()
    formData.append('file', file)

    return api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress: UploadProgress = {
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percentage: Math.round((progressEvent.loaded / progressEvent.total) * 100),
          }
          onProgress(progress)
        }
      },
    })
  },

  // 获取文件列表
  getFiles: async (folderId?: string): Promise<ApiResponse<File[]>> => {
    return api.get('/files/list', { params: { folderId } })
  },

  // 获取文件夹列表
  getFolders: async (parentId?: string): Promise<ApiResponse<Folder[]>> => {
    return api.get('/files/folders', { params: { parentId } })
  },

  // 创建文件夹
  createFolder: async (name: string, parentId?: string): Promise<ApiResponse<Folder>> => {
    return api.post('/files/folders', { name, parentId })
  },

  // 删除文件
  deleteFile: async (fileId: string): Promise<ApiResponse<{ success: boolean }>> => {
    return api.delete(`/files/${fileId}`)
  },

  // 删除文件夹
  deleteFolder: async (folderId: string): Promise<ApiResponse<{ success: boolean }>> => {
    return api.delete(`/files/folders/${folderId}`)
  },
}

// 分类相关API
export const categoryApi = {
  // 获取分类列表
  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    return api.get('/categories')
  },

  // 创建分类
  createCategory: async (name: string, parentId?: string): Promise<ApiResponse<Category>> => {
    return api.post('/categories', { name, parentId })
  },

  // 更新分类
  updateCategory: async (id: string, name: string, parentId?: string): Promise<ApiResponse<Category>> => {
    return api.put(`/categories/${id}`, { name, parentId })
  },

  // 删除分类
  deleteCategory: async (id: string): Promise<ApiResponse<{ success: boolean }>> => {
    return api.delete(`/categories/${id}`)
  },
}

// 内容相关API
export const contentApi = {
  // 获取内容列表
  getContents: async (categoryId?: string): Promise<ApiResponse<Content[]>> => {
    return api.get('/content', { params: { categoryId } })
  },

  // 创建内容
  createContent: async (title: string, content: string, categoryId: string, type: string): Promise<ApiResponse<Content>> => {
    return api.post('/content', { title, content, categoryId, type })
  },

  // 更新内容
  updateContent: async (id: string, title: string, content: string, categoryId: string, type: string): Promise<ApiResponse<Content>> => {
    return api.put(`/content/${id}`, { title, content, categoryId, type })
  },

  // 删除内容
  deleteContent: async (id: string): Promise<ApiResponse<{ success: boolean }>> => {
    return api.delete(`/content/${id}`)
  },
}

export default api