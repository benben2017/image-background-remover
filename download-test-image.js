const axios = require('axios');
const fs = require('fs');

console.log('🎯 下载真实的测试图片');
console.log('================');

// 从 Unsplash 下载一个免费的测试图片
const imageUrl = 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=200&h=200&fit=crop&crop=center';

axios({
    url: imageUrl,
    method: 'GET',
    responseType: 'arraybuffer'
})
.then(response => {
    const contentType = response.headers['content-type'];
    const fileName = contentType.includes('jpeg') ? 'test-image.jpg' : 
                     contentType.includes('png') ? 'test-image.png' : 
                     'test-image.jpg';
    
    fs.writeFileSync(`public/${fileName}`, Buffer.from(response.data));
    
    console.log(`✅ 成功下载测试图片: public/${fileName}`);
    console.log(`   类型: ${contentType}`);
    console.log(`   大小: ${response.data.length} 字节`);
    
    // 测试 API
    testAPI(fileName).then(() => {
        console.log('\n🎯 测试完成');
    });
})
.catch(error => {
    console.error('❌ 图片下载失败:');
    console.error(error);
});

async function testAPI(fileName) {
    const { exec } = require('child_process');
    
    return new Promise((resolve, reject) => {
        exec(`node -e "
const http = require('http');
const fs = require('fs');
const FormData = require('form-data');

console.log('🔍 开始 API 测试');
console.log('图片: ${fileName}');

const formData = new FormData();
formData.append('image', fs.createReadStream('public/${fileName}'));

const request = http.request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/remove-bg',
    method: 'POST',
    headers: formData.getHeaders()
}, (response) => {
    console.log(\`✅ 响应状态: \${response.statusCode}\`);
    
    let data = [];
    
    response.on('data', (chunk) => {
        data.push(chunk);
    });
    
    response.on('end', () => {
        const body = Buffer.concat(data);
        
        try {
            const jsonBody = JSON.parse(body.toString());
            console.log('⚠️  错误响应:');
            console.log(JSON.stringify(jsonBody, null, 2));
        } catch (err) {
            if (response.headers['content-type']?.includes('image')) {
                console.log(\`✅ 成功接收图片响应 (\${body.length} bytes)\`);
                fs.writeFileSync('processed-result.png', body);
                console.log('✅ 处理后的图片已保存: processed-result.png');
            } else {
                console.log('📄 文本响应:');
                console.log(body.toString());
            }
        }
        resolve();
    });
});

formData.pipe(request);

request.on('error', (error) => {
    console.error('❌ 请求错误:', error);
    reject(error);
});
"`, (error, stdout, stderr) => {
            if (error) {
                console.error('❌ 执行失败:', error);
                reject(error);
            } else {
                if (stderr) console.error('🔴 错误:', stderr);
                if (stdout) console.log('🟢 输出:', stdout);
                resolve();
            }
        });
    });
}