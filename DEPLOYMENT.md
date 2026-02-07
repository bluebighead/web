# OwerWeb 部署指南

## 项目概述
OwerWeb 是一个全栈个人博客网站，包含前端（React + TypeScript）和后端（Node.js + Express + MongoDB）。

## 部署方案

### 方案1：分离部署（推荐）

#### 1. 前端部署到 Vercel
- 前端是纯静态网站，可以部署到 Vercel
- 访问速度快，支持自动部署
- 免费额度充足

#### 2. 后端部署到 Render
- 后端是 Node.js 应用，可以部署到 Render
- 支持免费部署
- 自动 HTTPS

#### 3. 数据库使用 MongoDB Atlas
- 免费的云数据库服务
- 自动备份
- 高可用性

### 方案2：一体化部署

使用 Railway 或 Render 同时部署前后端，但配置较复杂。

## 详细部署步骤

### 前端部署（Vercel）

1. **准备前端项目**
   ```bash
   cd h:\d\kotlin\OwerWeb
   npm run build
   ```

2. **连接到 Vercel**
   - 访问 https://vercel.com
   - 使用 GitHub 账号登录
   - 点击 "New Project"
   - 选择你的 GitHub 仓库（bluebighead/web）
   - 配置项目设置：
     - Framework Preset: Vite
     - Root Directory: ./
     - Build Command: npm run build
     - Output Directory: dist
   - 点击 "Deploy"

3. **配置环境变量**
   - 在 Vercel 项目设置中添加：
     - `VITE_API_URL`: 你的后端 API 地址

### 后端部署（Render）

1. **准备后端项目**
   ```bash
   cd h:\d\kotlin\OwerWeb\server
   npm install
   ```

2. **连接到 Render**
   - 访问 https://render.com
   - 使用 GitHub 账号登录
   - 点击 "New +"
   - 选择 "Web Service"
   - 选择你的 GitHub 仓库（bluebighead/web）
   - 配置项目设置：
     - Name: owerweb-backend
     - Root Directory: server
     - Build Command: npm install
     - Start Command: npm start
   - 点击 "Deploy"

3. **配置环境变量**
   - 在 Render 项目设置中添加：
     - `PORT`: 3001
     - `NODE_ENV`: production
     - `MONGODB_URI`: 你的 MongoDB Atlas 连接字符串
     - `JWT_SECRET`: 你的 JWT 密钥
     - `JWT_EXPIRES_IN`: 24h
     - `CORS_ORIGIN`: 你的 Vercel 前端地址

### 数据库配置（MongoDB Atlas）

1. **创建 MongoDB Atlas 账户**
   - 访问 https://www.mongodb.com/cloud/atlas
   - 注册免费账户

2. **创建集群**
   - 点击 "Build a Database"
   - 选择 "Free" 计划
   - 选择云提供商和区域
   - 集群名称：owerweb-cluster

3. **配置网络访问**
   - 在 Network Access 中添加 IP 地址：0.0.0.0/0（允许所有IP）

4. **配置数据库访问**
   - 在 Database Access 中创建数据库用户
   - 用户名：owerweb
   - 密码：[设置强密码]
   - 权限：Read and write to any database

5. **获取连接字符串**
   - 点击 "Connect"
   - 选择 "Connect your application"
   - 复制连接字符串，格式如：
     `mongodb+srv://owerweb:password@cluster.mongodb.net/owerweb`

## 环境变量配置

### 前端环境变量（.env.local）
```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

### 后端环境变量（.env）
```env
PORT=3001
NODE_ENV=production
MONGODB_URI=mongodb+srv://owerweb:password@cluster.mongodb.net/owerweb
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=24h
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

## 部署后测试

1. **测试前端**
   - 访问你的 Vercel 前端 URL
   - 检查页面是否正常加载

2. **测试后端**
   - 访问你的 Render 后端 URL
   - 测试 API 端点是否正常工作

3. **测试数据库连接**
   - 确保后端能正常连接到 MongoDB Atlas

## 常见问题

### 1. 前端无法连接后端
- 检查 CORS 配置是否正确
- 确保 API URL 配置正确
- 检查环境变量是否设置

### 2. 数据库连接失败
- 检查 MongoDB Atlas IP 白名单
- 确认连接字符串格式正确
- 验证用户名和密码

### 3. 文件上传失败
- 检查文件大小限制
- 确认上传目录权限
- 验证文件类型配置

## 维护和更新

### 更新代码
```bash
git add .
git commit -m "Update description"
git push
```

### 自动部署
- Vercel 和 Render 都会在代码推送后自动部署
- 无需手动触发部署

### 监控和日志
- Vercel 和 Render 都提供详细的日志
- 可以在控制台查看应用状态

## 成本估算

### 免费方案
- Vercel: 免费（100GB 带宽/月）
- Render: 免费（750小时/月）
- MongoDB Atlas: 免费（512MB 存储）

### 付费方案（如需要）
- Vercel Pro: $20/月
- Render Pro: $7/月
- MongoDB Atlas: 从 $57/月起

## 联系支持

如有问题，请查看：
- Vercel 文档: https://vercel.com/docs
- Render 文档: https://render.com/docs
- MongoDB Atlas 文档: https://docs.atlas.mongodb.com