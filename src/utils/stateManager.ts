// 状态管理工具

// 状态版本
const STATE_VERSION = '1.0.0'

// 状态键名
const STATE_KEY = 'owerweb_state'

// 存储的数据键名列表
const STORAGE_KEYS = {
  STATE: STATE_KEY,
  FILES: 'owerweb_files',
  CATEGORIES: 'owerweb_categories',
  CATEGORY_EXPAND: 'categoryExpandState'
}

/**
 * 保存状态到localStorage
 * @param state 状态对象
 */
export const saveState = (state: any): void => {
  try {
    const stateWithVersion = {
      ...state,
      version: STATE_VERSION
    }
    localStorage.setItem(STATE_KEY, JSON.stringify(stateWithVersion))
  } catch (error) {
    console.error('Failed to save state:', error)
  }
}

/**
 * 从localStorage加载状态
 * @returns 状态对象或null
 */
export const loadState = (): any => {
  try {
    const savedState = localStorage.getItem(STATE_KEY)
    if (!savedState) {
      return null
    }

    const parsedState = JSON.parse(savedState)
    
    // 版本兼容性处理
    if (parsedState.version) {
      // 处理不同版本的兼容性
      return handleVersionCompatibility(parsedState)
    } else {
      // 旧版本数据，使用默认状态
      return null
    }
  } catch (error) {
    console.error('Failed to load state:', error)
    return null
  }
}

/**
 * 版本兼容性处理
 * @param state 状态对象
 * @returns 处理后的状态对象
 */
const handleVersionCompatibility = (state: any): any => {
  // 当前版本处理
  if (state.version === STATE_VERSION) {
    return state
  }
  
  // 旧版本处理
  console.log(`State version ${state.version} detected, migrating to ${STATE_VERSION}`)
  
  // 这里可以添加版本迁移逻辑
  // 例如：从v0.1.0迁移到v1.0.0
  
  return {
    ...state,
    version: STATE_VERSION
  }
}

/**
 * 重置所有状态数据
 */
export const resetState = (): void => {
  try {
    // 清除所有相关的localStorage数据
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
    
    console.log('State reset successfully')
  } catch (error) {
    console.error('Failed to reset state:', error)
  }
}

/**
 * 重置指定模块的状态数据
 * @param moduleName 模块名称
 */
export const resetModuleState = (moduleName: string): void => {
  try {
    const currentState = loadState()
    if (currentState) {
      delete currentState[moduleName]
      saveState(currentState)
    }
    
    console.log(`Module ${moduleName} state reset successfully`)
  } catch (error) {
    console.error(`Failed to reset ${moduleName} state:`, error)
  }
}

/**
 * 获取状态版本
 * @returns 状态版本字符串
 */
export const getStateVersion = (): string => {
  return STATE_VERSION
}

/**
 * 检查状态是否存在
 * @returns boolean
 */
export const hasState = (): boolean => {
  return localStorage.getItem(STATE_KEY) !== null
}

/**
 * 防抖函数
 * @param func 要执行的函数
 * @param delay 延迟时间（毫秒）
 * @returns 防抖处理后的函数
 */
export const debounce = (func: Function, delay: number): Function => {
  let timeoutId: NodeJS.Timeout
  return (...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(null, args), delay)
  }
}
