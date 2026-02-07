#!/bin/bash

# 启动前端服务
echo "Starting frontend server..."
cd "$(dirname "$0")"
npm run dev &

# 启动后端服务
echo "Starting backend server..."
cd server
npm run dev &

echo "Both servers are starting..."
echo "Frontend: http://localhost:5173"
echo "Backend: http://localhost:3001"

# 等待用户输入来停止服务
read -p "Press any key to stop servers..."

# 停止所有服务
echo "Stopping servers..."
pkill -f "npm run dev"
echo "Servers stopped."