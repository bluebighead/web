const authService = require('../services/authService');

// 注册
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 调用认证服务注册用户
    const result = await authService.register(username, email, password);

    res.status(201).json({
      success: true,
      user: {
        id: result.user._id,
        username: result.user.username,
        email: result.user.email,
        role: result.user.role,
      },
      token: result.token,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// 登录
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 调用认证服务登录用户
    const result = await authService.login(email, password);

    res.status(200).json({
      success: true,
      user: {
        id: result.user._id,
        username: result.user.username,
        email: result.user.email,
        role: result.user.role,
      },
      token: result.token,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// 获取用户信息
const getProfile = async (req, res) => {
  try {
    // 调用认证服务获取用户信息
    const user = await authService.getUserById(req.user._id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// 获取当前用户信息
const getCurrentUser = async (req, res) => {
  try {
    // 调用认证服务获取用户信息
    const user = await authService.getUserById(req.user._id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

module.exports = { register, login, getProfile, getCurrentUser };