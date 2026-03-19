const LoadingState: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
      <div className="mb-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin-slow"></div>
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">正在处理图片</h3>
      <p className="text-gray-600 mb-4">
        我们正在使用 AI 智能去除背景，请稍候...
      </p>
      
      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-sm text-blue-700">
          💡 提示：第一次使用时需要下载 AI 模型（约 30MB），后续处理会更快！
        </p>
      </div>
      
      <div className="flex justify-center space-x-1">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse-slow"></div>
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse-slow" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse-slow" style={{ animationDelay: '0.4s' }}></div>
      </div>
      
      <p className="text-sm text-gray-500 mt-4">
        平均处理时间: 3-5 秒
      </p>
    </div>
  );
};

export default LoadingState;
