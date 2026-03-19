const http = require('http');
const fs = require('fs');
const FormData = require('form-data');

console.log('🎯 测试真实图片 API');
console.log('================');

const imagePath = './public/test-image.png';

// 读取图片文件
if (!fs.existsSync(imagePath)) {
    console.error('❌ 图片文件不存在');
    process.exit(1);
}

console.log(`✅ 使用图片: ${imagePath}`);
console.log(`   大小: ${fs.statSync(imagePath).size} 字节`);
console.log();

// 创建表单数据
const formData = new FormData();
formData.append('image', fs.createReadStream(imagePath));

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
        const body = Buffer.concat(data);
        
        console.log('\n响应内容:');
        
        try {
            const jsonBody = JSON.parse(body.toString());
            console.log('⚠️  JSON 响应:');
            console.log(JSON.stringify(jsonBody, null, 2));
        } catch (err) {
            if (response.headers['content-type']?.includes('image')) {
                console.log('✅ 成功接收图片响应');
                console.log(`   大小: ${body.length} 字节`);
                fs.writeFileSync('processed-test-image.png', body);
                console.log('✅ 处理后的图片已保存: processed-test-image.png');
            } else {
                console.log('📄 文本响应:');
                console.log(body.toString());
            }
        }
    });
});

formData.pipe(request);

request.on('error', (error) => {
    console.error('❌ 请求错误:');
    console.error(error);
});