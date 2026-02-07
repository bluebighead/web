const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// 加载环境变量
dotenv.config();

// 创建Express应用
const app = express();

// 配置中间件
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 配置静态文件服务
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// 路由配置
const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/file');
const categoryRoutes = require('./routes/category');

app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/categories', categoryRoutes);

// 404处理
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// 启动服务器
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;