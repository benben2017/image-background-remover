#!/bin/bash

# 项目启动脚本
# 用于部署在 IPv4 地址上

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT=3000
HOST="0.0.0.0"

echo "🎯 开始部署 image-background-remover 项目"
echo "=================================="
echo "项目路径: $PROJECT_DIR"
echo "端口: $PORT"
echo "主机: $HOST"
echo "时间: $(date)"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装"
    exit 1
fi

echo "✅ Node.js 版本: $(node -v)"

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装"
    exit 1
fi

# 检查项目依赖
if [ ! -d "node_modules" ]; then
    echo "⚠️  未安装项目依赖，正在安装..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败"
        exit 1
    fi
    echo "✅ 依赖安装完成"
else
    echo "✅ 项目依赖已存在"
fi

# 检查是否需要构建
if [ ! -d ".next" ]; then
    echo "⚠️  项目未构建，正在构建..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ 项目构建失败"
        exit 1
    fi
    echo "✅ 项目构建完成"
else
    echo "✅ 项目已构建"
fi

echo ""
echo "🚀 启动服务器..."

# 启动生产服务器
npm run start -- -p $PORT -H $HOST &

PID=$!

if [ $? -ne 0 ]; then
    echo "❌ 服务器启动失败"
    exit 1
fi

# 等待服务器启动
echo "⏳ 等待服务器启动..."
sleep 3

# 检查服务器是否运行
if ps -p $PID > /dev/null; then
    echo "✅ 服务器启动成功"
    echo "🚀 访问地址:"
    echo "   - 本地访问: http://localhost:$PORT"
    echo "   - 外部访问: http://$(hostname -I | awk '{print $1}'):$PORT"
    echo "   - 外部访问: http://43.159.133.224:$PORT"
    echo ""
    echo "📊 服务器信息:"
    echo "   - PID: $PID"
    echo "   - 状态: 运行中"
    echo "   - 内存: $(ps -o %mem= -p $PID)%"
    echo "   - CPU: $(ps -o %cpu= -p $PID)%"
    echo ""
    echo "📝 管理命令:"
    echo "   - 停止服务器: pkill -f 'next start' 或 kill $PID"
    echo "   - 查看日志: tail -f /dev/null"
    echo ""
    
    # 保存 PID 到文件
    echo $PID > server.pid
    echo "✅ PID 文件已保存: server.pid"
else
    echo "❌ 服务器启动失败"
    exit 1
fi