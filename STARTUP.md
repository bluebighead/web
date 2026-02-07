# 网站启动指南

本指南详细说明如何启动和运行 OwerWeb 网站。

## 系统要求

- Node.js 18.0.0 或更高版本
- npm 9.0.0 或更高版本

## 快速启动

### 步骤 1: 安装依赖

```bash
# 在项目根目录执行
npm install
```

### 步骤 2: 启动开发服务器

```bash
# 启动开发服务器
npm run dev
```

开发服务器启动后，您可以通过以下地址访问网站：
- 本地: http://localhost:5173
- 网络: http://您的IP地址:5173

### 步骤 3: 构建生产版本（可选）

```bash
# 构建生产版本
npm run build
```

构建完成后，生产文件将生成在 `dist` 目录中。

## 脚本说明

| 脚本命令 | 功能描述 |
|---------|----------|
| `npm run dev` | 启动开发服务器，支持热更新 |
| `npm run build` | 构建生产版本，优化代码大小和性能 |
| `npm run lint` | 运行代码检查，确保代码质量 |
| `npm run preview` | 预览生产构建结果 |

## 常见问题

### 1. 依赖安装失败

**解决方案：**
- 确保网络连接正常
- 尝试使用 `npm install --force` 强制安装
- 清除 npm 缓存后重试：`npm cache clean --force && npm install`

### 2. 开发服务器启动失败

**解决方案：**
- 检查端口 5173 是否被占用
- 尝试使用其他端口：`npm run dev -- --port 3000`
- 检查 Node.js 版本是否符合要求

### 3. 构建失败

**解决方案：**
- 运行 `npm run lint` 检查代码质量问题
- 确保所有 TypeScript 类型定义正确
- 检查是否有未解决的依赖问题

## 项目结构

```
OwerWeb/
├── src/             # 源代码目录
├── public/          # 静态资源目录
├── dist/            # 构建输出目录
├── package.json     # 项目配置和依赖
├── vite.config.ts   # Vite 配置文件
└── tsconfig.json    # TypeScript 配置文件
```

## 技术栈

- **前端框架**: React 18
- **TypeScript**: 5.x
- **构建工具**: Vite
- **样式方案**: Tailwind CSS
- **路由管理**: React Router

## 注意事项

- 开发环境下，代码会实时更新，无需手动刷新浏览器
- 生产构建会自动优化代码，提高网站性能
- 确保在部署前运行 `npm run build` 构建生产版本

如需更多帮助，请查看项目的 README.md 文件或联系开发团队。