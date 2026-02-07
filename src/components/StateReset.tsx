import React, { useState, useEffect, useRef } from 'react'
import { resetState, resetModuleState } from '../utils/stateManager'

const StateReset: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [resetMessage, setResetMessage] = useState('')
  const [countdown, setCountdown] = useState(5)
  const [countingDown, setCountingDown] = useState(false)
  const [selectedResetType, setSelectedResetType] = useState<string | null>(null)
  const [showResetModal, setShowResetModal] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countingDown && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
    } else if (countingDown && countdown === 0) {
      setCountingDown(false)
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [countingDown, countdown])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleResetClick = (resetType: string) => {
    setSelectedResetType(resetType)
    setCountdown(5)
    setCountingDown(true)
    setShowResetModal(true)
    setShowDropdown(false)
  }

  const handleResetAll = () => {
    setResetting(true)
    setResetMessage('正在重置所有状态...')

    // 延迟执行，让用户看到重置过程
    setTimeout(() => {
      resetState()
      setResetMessage('所有状态已重置，请刷新页面')
      
      // 3秒后关闭模态框
      setTimeout(() => {
        setShowResetModal(false)
        setResetting(false)
        setResetMessage('')
        setSelectedResetType(null)
      }, 3000)
    }, 1000)
  }

  const handleResetModule = (moduleName: string) => {
    setResetting(true)
    setResetMessage(`正在重置${getModuleDisplayName(moduleName)}状态...`)

    // 延迟执行，让用户看到重置过程
    setTimeout(() => {
      resetModuleState(moduleName)
      setResetMessage(`${getModuleDisplayName(moduleName)}状态已重置，请刷新页面`)
      
      // 3秒后关闭模态框
      setTimeout(() => {
        setShowResetModal(false)
        setResetting(false)
        setResetMessage('')
        setSelectedResetType(null)
      }, 3000)
    }, 1000)
  }

  const getModuleDisplayName = (moduleName: string): string => {
    const moduleNames: Record<string, string> = {
      navbar: '导航栏',
      fileManager: '文件管理',
      categories: '分类管理'
    }
    return moduleNames[moduleName] || moduleName
  }

  const handleConfirmReset = () => {
    if (selectedResetType === 'all') {
      handleResetAll()
    } else if (selectedResetType) {
      handleResetModule(selectedResetType)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 重置状态按钮 */}
      <button
        className="w-full px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 flex items-center justify-between"
        onClick={() => setShowDropdown(!showDropdown)}
        aria-haspopup="true"
        aria-expanded={showDropdown}
      >
        <span>重置状态</span>
        <svg className={`w-4 h-4 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 下拉菜单 */}
      {showDropdown && (
        <div className="absolute right-0 mt-1 w-64 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
          <button
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => handleResetClick('all')}
            disabled={resetting}
          >
            重置所有状态
          </button>
          <button
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => handleResetClick('navbar')}
            disabled={resetting}
          >
            重置导航栏状态
          </button>
          <button
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => handleResetClick('fileManager')}
            disabled={resetting}
          >
            重置文件管理状态
          </button>
          <button
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => handleResetClick('categories')}
            disabled={resetting}
          >
            重置分类管理状态
          </button>
        </div>
      )}

      {/* 重置模态框 */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">重置状态</h3>
            
            {resetMessage ? (
              <div className="mb-4 p-4 bg-gray-100 rounded-md">
                <p>{resetMessage}</p>
              </div>
            ) : (
              <>
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <h4 className="font-medium text-yellow-800 mb-2">确认重置操作</h4>
                  <p className="text-yellow-700 mb-4">
                    {selectedResetType === 'all' 
                      ? '确定要重置所有状态吗？此操作将清除所有保存的状态数据，且无法恢复。' 
                      : selectedResetType 
                      ? `确定要重置${getModuleDisplayName(selectedResetType)}状态吗？此操作将清除该模块的所有保存状态数据，且无法恢复。`
                      : '确定要重置状态吗？此操作将清除所有保存的状态数据，且无法恢复。'}
                  </p>
                  {countingDown && (
                    <div className="flex items-center justify-between bg-yellow-100 p-2 rounded-md">
                      <p className="text-sm text-yellow-800">请仔细阅读以上信息，确认操作无误</p>
                      <span className="text-sm font-medium text-yellow-800">{countdown}秒后可点击确认</span>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition duration-200"
                    onClick={() => {
                      setShowResetModal(false)
                      setSelectedResetType(null)
                      setCountingDown(false)
                      setCountdown(5)
                    }}
                    disabled={resetting}
                  >
                    取消
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200 disabled:bg-red-300 disabled:cursor-not-allowed"
                    onClick={handleConfirmReset}
                    disabled={resetting || countingDown}
                  >
                    确定重置
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default StateReset
