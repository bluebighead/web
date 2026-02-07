import React, { useState, useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { loadState, saveState, debounce } from '../utils/stateManager'
import StateReset from './StateReset'

const Navbar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const settingsDropdownRef = useRef<HTMLDivElement>(null)

  // 从localStorage加载状态
  useEffect(() => {
    const savedState = loadState()
    if (savedState && savedState.navbar) {
      if (savedState.navbar.isDropdownOpen !== undefined) {
        setIsDropdownOpen(savedState.navbar.isDropdownOpen)
      }
      if (savedState.navbar.isMobileMenuOpen !== undefined) {
        setIsMobileMenuOpen(savedState.navbar.isMobileMenuOpen)
      }
      if (savedState.navbar.isSettingsDropdownOpen !== undefined) {
        setIsSettingsDropdownOpen(savedState.navbar.isSettingsDropdownOpen)
      }
    }
  }, [])

  // 保存状态到localStorage（防抖）
  const saveNavbarState = debounce(() => {
    const currentState = loadState() || {}
    const newState = {
      ...currentState,
      navbar: {
        isDropdownOpen,
        isMobileMenuOpen,
        isSettingsDropdownOpen
      }
    }
    saveState(newState)
  }, 200)

  // 当状态变更时保存
  useEffect(() => {
    saveNavbarState()
  }, [isDropdownOpen, isMobileMenuOpen, isSettingsDropdownOpen])

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const closeDropdown = () => {
    setIsDropdownOpen(false)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const toggleSettingsDropdown = () => {
    setIsSettingsDropdownOpen(!isSettingsDropdownOpen)
  }

  const closeSettingsDropdown = () => {
    setIsSettingsDropdownOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown()
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        closeMobileMenu()
      }
      if (settingsDropdownRef.current && !settingsDropdownRef.current.contains(event.target as Node)) {
        closeSettingsDropdown()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center">
              <span className="text-xl font-bold text-primary">OwerWeb</span>
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'text-primary bg-blue-50' : 'text-gray-700 hover:text-primary hover:bg-gray-50'}`
              }
            >
              首页
            </NavLink>
            
            <div className="relative" ref={dropdownRef}>
              <button 
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 flex items-center space-x-1"
                onClick={toggleDropdown}
              >
                <span>分类</span>
                <svg className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div className={`absolute left-0 w-48 mt-2 origin-top-left bg-white rounded-md shadow-lg py-1 z-50 transition-all duration-200 ${isDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                <NavLink 
                  to="/categories" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={closeDropdown}
                >
                  分类管理
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
            
            {/* 设置下拉菜单 */}
            <div className="relative" ref={settingsDropdownRef}>
              <button 
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 flex items-center space-x-1"
                onClick={toggleSettingsDropdown}
              >
                <span>设置</span>
                <svg className={`w-4 h-4 transition-transform duration-200 ${isSettingsDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div className={`absolute right-0 w-64 mt-2 origin-top-right bg-white rounded-md shadow-lg py-1 z-50 transition-all duration-200 ${isSettingsDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                <StateReset />
              </div>
            </div>
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden">
            <button 
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100"
              onClick={toggleMobileMenu}
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden" ref={mobileMenuRef}>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg rounded-b-lg border-t border-gray-200">
              <NavLink 
              to="/" 
              className={({ isActive }) => 
                `block px-3 py-3 rounded-md text-base font-medium ${isActive ? 'text-primary bg-blue-50' : 'text-gray-700 hover:text-primary hover:bg-gray-50'}`
              }
              onClick={closeMobileMenu}
            >
              首页
            </NavLink>
            
            <div className="space-y-1">
              <button 
                className="block w-full text-left px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 flex items-center justify-between"
                onClick={toggleDropdown}
              >
                <span>分类</span>
                <svg className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="pl-4 space-y-1 border-l-2 border-gray-200">
                  <NavLink 
                    to="/categories" 
                    className="block px-3 py-3 rounded-md text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                    onClick={() => {
                      closeDropdown()
                      closeMobileMenu()
                    }}
                  >
                    分类管理
                  </NavLink>
                </div>
              )}
            </div>
            
            <NavLink 
              to="/files" 
              className={({ isActive }) => 
                `block px-3 py-3 rounded-md text-base font-medium ${isActive ? 'text-primary bg-blue-50' : 'text-gray-700 hover:text-primary hover:bg-gray-50'}`
              }
              onClick={closeMobileMenu}
            >
              文件管理
            </NavLink>
            
            <NavLink 
              to="/about" 
              className={({ isActive }) => 
                `block px-3 py-3 rounded-md text-base font-medium ${isActive ? 'text-primary bg-blue-50' : 'text-gray-700 hover:text-primary hover:bg-gray-50'}`
              }
              onClick={closeMobileMenu}
            >
              关于
            </NavLink>
            
            {/* 设置选项 */}
            <div className="space-y-1">
              <button 
                className="block w-full text-left px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 flex items-center justify-between"
                onClick={toggleSettingsDropdown}
              >
                <span>设置</span>
                <svg className={`w-4 h-4 transition-transform duration-200 ${isSettingsDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isSettingsDropdownOpen && (
                <div className="pl-4 space-y-1 border-l-2 border-gray-200">
                  <StateReset />
                </div>
              )}
            </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar