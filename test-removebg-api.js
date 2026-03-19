const axios = require('axios');
const fs = require('fs');
const path = require('path');

// 从环境变量获取 API Key
const API_KEY = fs.readFileSync('.env.local', 'utf8').split('=')[1].trim();
console.log('🔑 使用 API Key:', API_KEY);

// 简单的测试
const testAPIStatus = async () => {
    try {
        console.log('🔍 检查 Remove.bg API 连接...');
        
        // 测试域名解析
        const dns = require('dns');
        dns.resolve4('api.remove.bg', (err, addresses) => {
            if (err) {
                console.error('❌ DNS 解析失败:', err.message);
            } else {
                console.log('✅ DNS 解析成功:', addresses);
            }
        });

        // 使用一个简单的测试图片
        const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
        
        const formData = new URLSearchParams();
        formData.append('image_file_b64', testImage.split(',')[1]);
        formData.append('size', 'auto');

        console.log('🚀 发送 API 请求...');
        const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
            headers: {
                'X-Api-Key': API_KEY,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            timeout: 30000
        });

        console.log(`✅ API 响应成功: ${response.status}`);
        console.log('响应头:', response.headers['content-type']);
        
        if (response.data && response.headers['content-type']?.includes('image')) {
            fs.writeFileSync('removebg-test-output.png', response.data);
            console.log('✅ 测试成功！输出已保存: removebg-test-output.png');
        } else {
            console.warn('⚠️  响应不包含图片数据');
            console.log('响应内容:', response.data);
        }

    } catch (error) {
        console.error('❌ API 请求失败:');
        if (error.response) {
            console.error('状态码:', error.response.status);
            console.error('响应内容:', error.response.data);
            if (error.response.status === 401) {
                console.error('⚠️  API Key 无效');
            } else if (error.response.status === 403) {
                console.error('⚠️  API 访问被拒绝');
            } else if (error.response.status === 429) {
                console.error('⚠️  请求频率过高');
            }
        } else if (error.request) {
            console.error('❌ 无响应 - 可能是网络或服务器问题');
            console.error('请求信息:', error.request);
        } else {
            console.error('❌ 请求配置错误:', error.message);
        }
    }
};

testAPIStatus().then(() => {
    console.log('\n🎯 测试完成');
}).catch((error) => {
    console.error('\n❌ 测试异常:', error);
});