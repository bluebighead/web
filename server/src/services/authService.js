const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  });
};

const authService = {
  // 注册用户
  register: async (username, email, password) => {
    try {
      // 检查用户是否已存在
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        throw new Error('User already exists');
      }

      // 创建新用户
      const user = await User.create({
        username,
        email,
        password,
      });

      // 生成token
      const token = generateToken(user._id);

      return { user, token };
    } catch (error) {
      throw error;
    }
  },

  // 用户登录
  login: async (email, password) => {
    try {
      // 检查用户是否存在
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // 验证密码
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        throw new Error('Invalid credentials');
      }

      // 生成token
      const token = generateToken(user._id);

      return { user, token };
    } catch (error) {
      throw error;
    }
  },

  // 获取用户信息
  getUserById: async (id) => {
    try {
      const user = await User.findById(id).select('-password');
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw error;
    }
  },

  // 更新用户信息
  updateUser: async (id, updates) => {
    try {
      const user = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = authService;