# 图像背景去除工具

一个基于 Next.js + Tailwind CSS 的在线图像背景去除工具，使用 Remove.bg API 提供智能抠图功能。

## ✨ 功能特点

### 核心功能 (P0)
- 📤 **拖拽上传**: 支持拖拽上传和点击选择
- 🤖 **智能处理**: 使用 Remove.bg API 自动去除背景
- 👁️ **实时预览**: 处理后显示透明 PNG 预览
- 💾 **一键下载**: 直接下载透明背景图片
- 📁 **格式支持**: 输入 JPG/PNG/WEBP，输出 PNG

### 增强功能 (P1)
- ⚡ **高性能**: 边缘计算，快速响应
- 📱 **响应式设计**: 完美适配各种设备
- 🔒 **安全加密**: HTTPS 全链路加密传输
- 📊 **友好提示**: 实时进度、错误信息、文件限制

## 🚀 快速开始

### 1. 安装依赖
```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 2. 配置 API Key

在 `.env.local` 文件中添加 Remove.bg API Key：

```env
REMOVE_BG_API_KEY=your-api-key-here
```

**获取 API Key**:
1. 访问 [Remove.bg API](https://www.remove.bg/api)
2. 注册账号
3. 生成 API Key

### 3. 开发模式
```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

应用将在 http://localhost:3000 启动

### 4. 构建生产版本
```bash
npm run build
# 或
yarn build
# 或
pnpm build
```

### 5. 启动生产服务器
```bash
npm run start
# 或
yarn start
# 或
pnpm start
```

## 📁 项目结构

```
.
├── app/
│   ├── api/
│   │   └── remove-bg/
│   │       └── route.ts         # 后端 API 路由
│   ├── globals.css             # 全局样式
│   ├── layout.tsx              # 根布局
│   └── page.tsx                # 主页面
├── components/
│   ├── UploadArea.tsx          # 上传区域组件
│   ├── ImagePreview.tsx        # 图片预览组件
│   ├── LoadingState.tsx        # 加载状态组件
│   └── ErrorState.tsx          # 错误状态组件
├── utils/
│   └── imageProcessor.ts       # 图像处理工具函数
├── docs/
│   └── bg-remover-mvp-prd.md   # 需求文档
├── public/                     # 静态资源
├── .env.local                  # 环境变量
├── package.json                # 依赖配置
├── tsconfig.json               # TypeScript 配置
└── tailwind.config.ts          # Tailwind CSS 配置
```

## 🎨 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS 3
- **UI 组件**: 自定义组件（纯 CSS）
- **API**: Remove.bg v1.0
- **部署**: Vercel 或 Cloudflare Pages

## 📱 响应式设计

- 🔍 **移动端**: 单列布局，触控优化
- 📱 **平板**: 两列布局，自适应间距
- 🖥️ **桌面**: 全屏布局，优化交互

## 🔒 安全特性

- ✅ **API Key 保护**: 存储在环境变量中，不暴露到前端
- ✅ **文件验证**: 类型和大小验证
- ✅ **错误处理**: 友好的错误提示
- ✅ **数据安全**: 图片处理后立即清除

## 📈 性能优化

- 🏎️ **边缘部署**: 使用 Vercel/Cloudflare 边缘网络
- 📦 **代码分割**: Next.js 自动优化
- 🖼️ **图像优化**: 自动压缩和格式转换
- 🚀 **缓存策略**: 静态资源 CDN 加速

## 🐳 Docker 部署

```bash
# 构建镜像
docker build -t image-background-remover .

# 运行容器
docker run -p 3000:3000 --env-file .env.local image-background-remover
```

## 🔄 CI/CD 部署

### GitHub Actions
配置 `.github/workflows/deploy.yml` 进行自动化部署。

### Vercel 部署
1. 连接 GitHub 仓库
2. 设置环境变量
3. 自动构建和部署

## 📚 文档

### API 文档
- **端点**: `/api/remove-bg`
- **方法**: POST
- **接受**: form-data
- **返回**: image/png

### 使用说明
1. 打开应用
2. 上传图片（拖拽或选择）
3. 等待处理完成
4. 下载透明背景图片

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License - 详见 LICENSE 文件

## 💰 成本估算

- **Remove.bg API**: 新用户免费 50 张/月
- **部署成本**: Vercel 免费额度足够
- **存储成本**: Cloudflare R2 低成本存储

## 📞 联系方式

如有问题或建议，欢迎反馈！