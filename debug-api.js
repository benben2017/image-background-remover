// 简单的 Node.js 脚本用于调试 API

const http = require('http');
const FormData = require('form-data');
const fs = require('fs');

// 创建一个简单的测试图片
const testImageData = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
fs.writeFileSync('test.png', testImageData);

console.log('🎯 开始 API 调试');
console.log('================');

// 创建表单数据
const formData = new FormData();
formData.append('image', fs.createReadStream('test.png'));

// API 请求
const request = http.request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/remove-bg',
    method: 'POST',
    headers: formData.getHeaders()
}, (response) => {
    console.log(`✅ 响应状态: ${response.statusCode}`);
    console.log('响应头:');
    console.log(response.headers);
    
    let data = [];
    
    response.on('data', (chunk) => {
        data.push(chunk);
    });
    
    response.on('end', () => {
        const body = Buffer.concat(data).toString();
        console.log('\n响应内容:');
        
        try {
            const jsonBody = JSON.parse(body);
            console.log(JSON.stringify(jsonBody, null, 2));
        } catch (err) {
            if (response.headers['content-type']?.includes('image')) {
                console.log(`✅ 成功接收图片响应 (${body.length} bytes)`);
                fs.writeFileSync('processed-output.png', data);
                console.log('✅ 处理后的图片已保存: processed-output.png');
            } else {
                console.log(body);
            }
        }
    });
});

formData.pipe(request);

request.on('error', (error) => {
    console.error('❌ 请求错误:');
    console.error(error);
});

console.log('🚀 请求已发送...');