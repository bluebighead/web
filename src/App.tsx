
import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold">OwerWeb</h2>
              <p className="text-gray-400">个人博客系统</p>
            </div>
            <div className="flex space-x-4">
              <a href="/" className="text-gray-400 hover:text-white">首页</a>
              <a href="/files" className="text-gray-400 hover:text-white">文件管理</a>
              <a href="/categories" className="text-gray-400 hover:text-white">分类</a>
              <a href="/about" className="text-gray-400 hover:text-white">关于</a>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-400">
            <p>© 2026 OwerWeb. 保留所有权利。</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
