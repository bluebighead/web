import React from 'react'

const Home: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow-lg p-6 sm:p-8 mb-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">欢迎来到 OwerWeb</h1>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8">个人博客系统，支持文件管理、分类管理和内容发布</p>
          <div className="flex justify-center">
            <a 
              href="/files" 
              className="bg-white text-blue-700 font-medium py-3 px-6 rounded-lg hover:bg-blue-50 transition duration-200"
            >
              管理文件
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-5 sm:p-6 hover:shadow-lg transition duration-200">
          <div className="text-primary text-2xl sm:text-3xl mb-3 sm:mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 sm:h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold mb-2">文件上传系统</h3>
          <p className="text-gray-600">支持多种格式文件上传，实现进度显示、文件类型验证和大小限制功能</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5 sm:p-6 hover:shadow-lg transition duration-200">
          <div className="text-primary text-2xl sm:text-3xl mb-3 sm:mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 sm:h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold mb-2">内容分类系统</h3>
          <p className="text-gray-600">创建多级分类结构，支持文章和媒体内容的分类管理</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5 sm:p-6 hover:shadow-lg transition duration-200">
          <div className="text-primary text-2xl sm:text-3xl mb-3 sm:mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 sm:h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold mb-2">文件管理系统</h3>
          <p className="text-gray-600">实现文件夹创建、重命名、移动和删除功能，支持文件批量操作</p>
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className="bg-white rounded-lg shadow-md p-5 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">最近活动</h2>
        <div className="space-y-3 sm:space-y-4">
          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <p className="text-gray-700">上传了新文件 <span className="font-medium">document.pdf</span></p>
            <p className="text-sm text-gray-500">2小时前</p>
          </div>
          <div className="border-l-4 border-green-500 pl-4 py-2">
            <p className="text-gray-700">创建了新分类 <span className="font-medium">技术文档</span></p>
            <p className="text-sm text-gray-500">昨天</p>
          </div>
          <div className="border-l-4 border-yellow-500 pl-4 py-2">
            <p className="text-gray-700">更新了文件 <span className="font-medium">presentation.pptx</span></p>
            <p className="text-sm text-gray-500">2天前</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home