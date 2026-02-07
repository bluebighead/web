import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar: React.FC = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center">
              <span className="text-xl font-bold text-primary">OwerWeb</span>
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'text-primary bg-blue-50' : 'text-gray-700 hover:text-primary hover:bg-gray-50'}`
              }
            >
              首页
            </NavLink>
            
            <div className="relative group">
              <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 flex items-center space-x-1">
                <span>分类</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                <NavLink to="/categories" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  分类管理
                </NavLink>
                <NavLink to="/categories/create" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  创建分类
                </NavLink>
              </div>
            </div>
            
            <NavLink 
              to="/files" 
              className={({ isActive }) => 
                `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'text-primary bg-blue-50' : 'text-gray-700 hover:text-primary hover:bg-gray-50'}`
              }
            >
              文件管理
            </NavLink>
            
            <NavLink 
              to="/about" 
              className={({ isActive }) => 
                `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'text-primary bg-blue-50' : 'text-gray-700 hover:text-primary hover:bg-gray-50'}`
              }
            >
              关于
            </NavLink>
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden">
            <button className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Navbar