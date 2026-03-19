#!/bin/bash

# 测试 API 的简单脚本
# 注意：需要安装 curl 和 jq

echo "🎯 开始测试 Remove.bg API"
echo "========================="
echo ""

# 检查环境变量
API_KEY=$(cat .env.local | grep REMOVE_BG_API_KEY | cut -d'=' -f2)
if [ -z "$API_KEY" ]; then
    echo "❌ API Key 未配置"
    exit 1
fi

echo "✅ API Key: ${API_KEY:0:6}...${API_KEY: -6}"
echo ""

# 检查服务器连接
echo "🔍 检查服务器连接..."
curl -v http://localhost:3000 2>&1 >/dev/null
if [ $? -eq 0 ]; then
    echo "✅ 服务器响应正常"
else
    echo "❌ 服务器无响应"
    exit 1
fi
echo ""

# 创建测试数据
echo "📄 创建测试数据..."
cat > test-script.js << 'EOF'
// 简单的 HTML 页面用于测试
const fs = require('fs');

// 创建一个简单的 HTML 页面用于测试
const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API 测试页面</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 20px; }
        .form-group { margin: 10px 0; }
        button { padding: 10px 20px; background: #0070f3; color: white; border: none; border-radius: 4px; cursor: pointer; }
        button:hover { background: #0051cc; }
        #result { margin-top: 20px; }
        #preview { max-width: 100%; margin-top: 20px; }
    </style>
</head>
<body>
    <h1>API 测试页面</h1>
    
    <div class="form-group">
        <input type="file" id="imageInput" accept="image/*">
    </div>
    
    <div class="form-group">
        <button onclick="testAPI()">测试 API</button>
    </div>
    
    <div id="result">
        <div id="loading" style="display:none;">处理中...</div>
        <div id="error" style="display:none; color: red;"></div>
    </div>
    
    <img id="preview" style="display:none;">
    
    <script>
        async function testAPI() {
            const fileInput = document.getElementById('imageInput');
            const file = fileInput.files[0];
            
            if (!file) {
                alert('请选择一个图片文件');
                return;
            }
            
            const formData = new FormData();
            formData.append('image', file);
            
            const loading = document.getElementById('loading');
            const error = document.getElementById('error');
            const preview = document.getElementById('preview');
            
            loading.style.display = 'block';
            error.style.display = 'none';
            preview.style.display = 'none';
            
            try {
                const response = await fetch('/api/remove-bg', {
                    method: 'POST',
                    body: formData
                });
                
                if (!response.ok) {
                    const data = await response.json();
                    error.textContent = 'API Error: ' + (data.error || '未知错误');
                    error.style.display = 'block';
                } else {
                    const blob = await response.blob();
                    const url = URL.createObjectURL(blob);
                    preview.src = url;
                    preview.style.display = 'block';
                    
                    // 创建下载链接
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'processed.png';
                    a.textContent = '下载处理后的图片';
                    a.style.display = 'block';
                    a.style.marginTop = '10px';
                    document.getElementById('result').appendChild(a);
                }
            } catch (err) {
                error.textContent = '网络错误: ' + err.message;
                error.style.display = 'block';
            }
            
            loading.style.display = 'none';
        }
    </script>
</body>
</html>
`;

fs.writeFileSync('public/test-api.html', html);
console.log('✅ 测试页面已创建: public/test-api.html');
EOF

echo "✅ 测试脚本已创建"
echo ""

# 运行测试
echo "🚀 启动测试服务器..."
echo "建议访问: http://localhost:3000/test-api.html 手动测试"
echo ""
echo "或者使用 curl 测试（需要图片文件）:"
echo "curl -X POST -F \"image=@your-image.jpg\" http://localhost:3000/api/remove-bg -o processed.png"
echo ""
echo "📝 测试提示:"
echo "1. 访问 http://localhost:3000/test-api.html"
echo "2. 选择一张图片（建议使用小图片）"
echo "3. 点击测试 API"
echo "4. 检查结果"