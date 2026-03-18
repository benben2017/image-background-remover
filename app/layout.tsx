import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '图像背景去除工具 - 在线智能抠图',
  description: '快速去除图片背景，支持拖拽上传，无需注册，免费使用',
  keywords: '图像背景去除, 在线抠图, 智能去除背景, 图片处理',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>{children}</body>
    </html>
  );
}