'use client';

import React, { useState, useRef } from 'react';
import UploadArea from '@/components/UploadArea';
import ImagePreview from '@/components/ImagePreview';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import { processImage } from '@/utils/imageProcessor';

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (file: File) => {
    setImage(file);
    setProcessedImage(null);
    setError(null);
    
    // 创建预览
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveBackground = async () => {
    if (!image) return;
    
    setIsProcessing(true);
    setError(null);

    try {
      const result = await processImage(image);
      setProcessedImage(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '处理失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;
    
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `processed-${image?.name.replace(/\.[^/.]+$/, '')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setImage(null);
    setPreview(null);
    setProcessedImage(null);
    setError(null);
  };

  return React.createElement('div', { 
    className: 'min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4' 
  },
    React.createElement('div', { className: 'max-w-6xl mx-auto' },
      React.createElement('header', { className: 'text-center mb-12' },
        React.createElement('h1', { 
          className: 'text-4xl font-bold text-gray-900 mb-4' 
        }, '智能图像背景去除工具'),
        React.createElement('p', { 
          className: 'text-lg text-gray-600 max-w-2xl mx-auto' 
        }, '一键去除图片背景，支持拖拽上传，无需注册，快速获得透明背景图片')
      ),

      React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-2 gap-8' },
        // 左侧：上传和原始图像
        React.createElement('div', { className: 'space-y-6' },
          !image ? (
            React.createElement(UploadArea, {
              onImageUpload: handleImageUpload,
              onError: setError
            })
          ) : (
            React.createElement('div', { className: 'space-y-4' },
              React.createElement(ImagePreview, {
                imageUrl: preview,
                title: '原始图像',
                fileName: image.name,
                fileSize: (image.size / 1024 / 1024).toFixed(2) + ' MB'
              }),
              
              React.createElement('div', { className: 'flex gap-3' },
                React.createElement('button', {
                  onClick: handleReset,
                  className: 'flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium'
                }, '重新上传'),
                
                React.createElement('button', {
                  onClick: handleRemoveBackground,
                  disabled: isProcessing,
                  className: 'flex-1 px-6 py-3 btn-primary rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium'
                }, '去除背景')
              )
            )
          ),

          // 错误状态
          error && React.createElement(ErrorState, {
            message: error,
            onClose: () => setError(null)
          }),

          // 加载状态
          isProcessing && React.createElement(LoadingState, null)
        ),

        // 右侧：处理后图像
        React.createElement('div', { className: 'space-y-6' },
          React.createElement('div', { className: 'bg-white rounded-lg shadow-md p-6' },
            processedImage ? (
              React.createElement('div', null,
                React.createElement(ImagePreview, {
                  imageUrl: processedImage,
                  title: '处理后的图像',
                  showTransparencyGrid: true
                }),
                
                React.createElement('div', { className: 'mt-6' },
                  React.createElement('button', {
                    onClick: handleDownload,
                    className: 'w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium'
                  }, '下载透明背景图像')
                )
              )
            ) : (
              React.createElement('div', { className: 'text-center py-20 text-gray-400' },
                React.createElement('div', { className: 'bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4' },
                  React.createElement('svg', { 
                    className: 'w-8 h-8', 
                    fill: 'none', 
                    stroke: 'currentColor', 
                    viewBox: '0 0 24 24' 
                  },
                    React.createElement('path', { 
                      strokeLinecap: 'round', 
                      strokeLinejoin: 'round', 
                      strokeWidth: 2, 
                      d: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' 
                    })
                  )
                ),
                React.createElement('p', { className: 'text-lg' }, '等待图像处理'),
                React.createElement('p', { className: 'text-sm mt-2' }, '上传图像后，点击"去除背景"按钮即可看到结果')
              )
            )
          )
        )
      ),

      // 底部信息
      React.createElement('footer', { className: 'mt-16 text-center text-gray-500 text-sm' },
        React.createElement('div', { className: 'flex flex-wrap justify-center gap-6 mb-4' },
          React.createElement('div', { className: 'flex items-center gap-2' },
            React.createElement('svg', { 
              className: 'w-4 h-4', 
              fill: 'none', 
              stroke: 'currentColor', 
              viewBox: '0 0 24 24' 
            },
              React.createElement('path', { 
                strokeLinecap: 'round', 
                strokeLinejoin: 'round', 
                strokeWidth: 2, 
                d: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' 
              })
            ),
            React.createElement('span', null, '处理时间 < 5秒')
          ),
          
          React.createElement('div', { className: 'flex items-center gap-2' },
            React.createElement('svg', { 
              className: 'w-4 h-4', 
              fill: 'none', 
              stroke: 'currentColor', 
              viewBox: '0 0 24 24' 
            },
              React.createElement('path', { 
                strokeLinecap: 'round', 
                strokeLinejoin: 'round', 
                strokeWidth: 2, 
                d: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' 
              })
            ),
            React.createElement('span', null, '安全加密传输')
          ),
          
          React.createElement('div', { className: 'flex items-center gap-2' },
            React.createElement('svg', { 
              className: 'w-4 h-4', 
              fill: 'none', 
              stroke: 'currentColor', 
              viewBox: '0 0 24 24' 
            },
              React.createElement('path', { 
                strokeLinecap: 'round', 
                strokeLinejoin: 'round', 
                strokeWidth: 2, 
                d: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' 
              })
            ),
            React.createElement('span', null, '最大文件 5MB')
          )
        ),
        
        React.createElement('p', { className: 'opacity-60' },
          '© 2024 图像背景去除工具. 使用 Remove.bg API 提供技术支持.'
        )
      )
    )
  );
}