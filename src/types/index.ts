// 用户类型
export interface User {
  id: string
  username: string
  email: string
  role: string
  createdAt: Date
  updatedAt: Date
}

// 文件类型
export interface File {
  id: string
  name: string
  path: string
  size: number
  type: string
  userId: string
  folderId: string | null
  createdAt: Date
  updatedAt: Date
}

// 文件夹类型
export interface Folder {
  id: string
  name: string
  parentId: string | null
  userId: string
  createdAt: Date
  updatedAt: Date
}

// 分类类型
export interface Category {
  id: string
  name: string
  parentId: string | null
  level: number
  createdAt: Date
  updatedAt: Date
}

// 内容类型
export interface Content {
  id: string
  title: string
  content: string
  categoryId: string
  userId: string
  type: string
  createdAt: Date
  updatedAt: Date
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// 上传进度类型
export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

// 导航项类型
export interface NavItem {
  id: string
  label: string
  path: string
  children?: NavItem[]
}

// 分页参数类型
export interface PaginationParams {
  page: number
  pageSize: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// 分页响应类型
export interface PaginationResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}