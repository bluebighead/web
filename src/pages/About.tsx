import React from 'react'

const About: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6">关于 OwerWeb</h2>
      
      <div className="space-y-6">
        <section>
          <h3 className="text-xl font-medium mb-4">项目介绍</h3>
          <p className="text-gray-700 leading-relaxed">
            OwerWeb 是一个功能完整的个人博客系统，旨在提供简单易用的内容管理和文件管理功能。
            系统支持文件上传、文件管理、分类管理等核心功能，采用现代化的前端技术栈构建，
            确保良好的用户体验和系统性能。
          </p>
        </section>

        <section>
          <h3 className="text-xl font-medium mb-4">核心功能</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>文件上传系统：支持多种格式文件上传，实现进度显示和文件验证</li>
            <li>文件管理系统：实现文件夹创建、重命名、移动和删除功能，支持文件批量操作</li>
            <li>内容分类系统：创建多级分类结构，支持文章和媒体内容的分类管理</li>
            <li>响应式设计：确保在桌面端、平板和手机等不同设备上均有良好显示效果</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-medium mb-4">技术栈</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">前端技术</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>React 18</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
                <li>React Router</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">后端技术</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Node.js</li>
                <li>Express</li>
                <li>MongoDB</li>
                <li>RESTful API</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-medium mb-4">联系我们</h3>
          <p className="text-gray-700 leading-relaxed">
            如果您对系统有任何问题或建议，欢迎联系我们。
          </p>
        </section>
      </div>
    </div>
  )
}

export default About