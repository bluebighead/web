const API_BASE_URL = 'http://localhost:3001/api';

export interface Category {
  id: number;
  name: string;
  parent_id: number | null;
  level: number;
  created_at: string;
}

export interface CategoryFile {
  id: number;
  name: string;
  type: string;
  size: number;
  path: string;
  category_id: number | null;
  created_at: string;
}

export interface Folder {
  id: number;
  name: string;
  path: string;
  parent_id: number | null;
  created_at: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  async uploadFile(file: File, categoryId?: number): Promise<CategoryFile> {
    const formData = new FormData();
    formData.append('file', file);
    if (categoryId) {
      formData.append('categoryId', categoryId.toString());
    }

    const response = await fetch(`${this.baseUrl}/files/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message || 'Upload failed');
    }

    const result = await response.json();
    return result.file;
  }

  async getFiles(categoryId?: number): Promise<CategoryFile[]> {
    const params = categoryId ? `?categoryId=${categoryId}` : '';
    const result = await this.request<{ files: CategoryFile[] }>(`/files${params}`);
    return result.files;
  }

  async getFileById(id: number): Promise<CategoryFile> {
    const result = await this.request<{ file: CategoryFile }>(`/files/${id}`);
    return result.file;
  }

  async deleteFile(id: number): Promise<void> {
    await this.request(`/files/${id}`, { method: 'DELETE' });
  }

  async renameFile(id: number, name: string): Promise<CategoryFile> {
    const result = await this.request<{ file: CategoryFile }>(`/files/${id}/rename`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
    return result.file;
  }

  async createFolder(name: string, path: string, parentId?: number): Promise<Folder> {
    const result = await this.request<{ folder: Folder }>('/folders', {
      method: 'POST',
      body: JSON.stringify({ name, path, parentId }),
    });
    return result.folder;
  }

  async getFolders(parentId?: number): Promise<Folder[]> {
    const params = parentId ? `?parentId=${parentId}` : '';
    const result = await this.request<{ folders: Folder[] }>(`/folders${params}`);
    return result.folders;
  }

  async deleteFolder(id: number): Promise<void> {
    await this.request(`/folders/${id}`, { method: 'DELETE' });
  }

  async getCategories(): Promise<Category[]> {
    const result = await this.request<{ categories: Category[] }>('/categories');
    return result.categories;
  }

  async getCategoryById(id: number): Promise<Category> {
    const result = await this.request<{ category: Category }>(`/categories/${id}`);
    return result.category;
  }

  async createCategory(name: string, parentId?: number, level?: number): Promise<Category> {
    const result = await this.request<{ category: Category }>('/categories', {
      method: 'POST',
      body: JSON.stringify({ name, parentId, level }),
    });
    return result.category;
  }

  async updateCategory(id: number, name: string, parentId?: number, level?: number): Promise<void> {
    await this.request(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name, parentId, level }),
    });
  }

  async deleteCategory(id: number): Promise<void> {
    await this.request(`/categories/${id}`, { method: 'DELETE' });
  }

  async getSubCategories(parentId: number): Promise<Category[]> {
    const result = await this.request<{ categories: Category[] }>(`/categories/sub/${parentId}`);
    return result.categories;
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
