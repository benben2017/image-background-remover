import { useState, useRef } from 'react';

interface UploadAreaProps {
  onImageUpload: (file: File) => void;
  onError: (error: string) => void;
}

const UploadArea: React.FC<UploadAreaProps> = ({ onImageUpload, onError }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    if (files.length === 0) return;

    const file = files[0];
    
    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      onError('不支持的文件格式，请使用 JPG、PNG 或 WebP 格式');
      return;
    }

    // 验证文件大小 (最大 5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      onError('文件大小不能超过 5MB');
      return;
    }

    onImageUpload(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`
        relative bg-white rounded-xl shadow-sm border-2 
        transition-all duration-200 ease-in-out cursor-pointer
        ${isDragging ? 'border-primary-500 bg-primary-50' : 'border-dashed border-gray-300 hover:border-primary-400'}
      `}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileInput}
        className="hidden"
      />
      
      <div className="p-12 text-center">
        <div className={`
          mx-auto w-16 h-16 rounded-full mb-4 flex items-center justify-center
          transition-colors duration-200
          ${isDragging ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-400'}
        `}>
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>
        
        <h3 className={`text-lg font-semibold mb-2 ${isDragging ? 'text-primary-600' : 'text-gray-900'}`}>
          选择图片或拖拽到此处
        </h3>
        
        <p className="text-gray-500 mb-4">
          支持 JPG、PNG、WebP 格式，单张图片最大 5MB
        </p>
        
        <div className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          选择图片文件
        </div>
      </div>
    </div>
  );
};

export default UploadArea;