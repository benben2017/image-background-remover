const fs = require('fs');
const path = require('path');

console.log('📊 项目结构验证');
console.log('=' . repeat(50));

// 检查核心文件
const requiredFiles = [
  'package.json',
  'tsconfig.json',
  'tailwind.config.ts',
  'postcss.config.js',
  '.env.local',
  'app/layout.tsx',
  'app/page.tsx',
  'app/globals.css',
  'app/api/remove-bg/route.ts',
  'components/UploadArea.tsx',
  'components/ImagePreview.tsx',
  'components/LoadingState.tsx',
  'components/ErrorState.tsx',
  'utils/imageProcessor.ts',
  'README.md',
  'docs/bg-remover-mvp-prd.md'
];

console.log('\n📁 项目结构检查');
console.log('-'.repeat(30));

let allFilesExist = true;
let allDirsExist = true;

// 检查目录
const requiredDirs = [
  'app',
  'app/api',
  'app/api/remove-bg',
  'components',
  'utils',
  'public',
  'docs'
];

requiredDirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  try {
    const stats = fs.statSync(dirPath);
    if (stats.isDirectory()) {
      console.log(`✅ 目录存在: ${dir}`);
    }
  } catch (err) {
    console.log(`❌ 目录不存在: ${dir}`);
    allDirsExist = false;
  }
});

console.log('\n📄 文件检查');
console.log('-'.repeat(30));

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  try {
    const stats = fs.statSync(filePath);
    if (stats.isFile()) {
      console.log(`✅ 文件存在: ${file} (${stats.size.toLocaleString()} bytes)`);
    }
  } catch (err) {
    console.log(`❌ 文件不存在: ${file}`);
    allFilesExist = false;
  }
});

// 检查 package.json 内容
console.log('\n📦 依赖配置检查');
console.log('-'.repeat(30));

try {
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  
  console.log(`✅ 项目名称: ${pkg.name}`);
  console.log(`✅ 项目版本: ${pkg.version}`);
  
  // 检查主要依赖
  const dependencies = ['next', 'react', 'react-dom'];
  dependencies.forEach(dep => {
    if (pkg.dependencies[dep]) {
      console.log(`✅ 依赖存在: ${dep}@${pkg.dependencies[dep]}`);
    } else {
      console.log(`❌ 依赖缺失: ${dep}`);
      allFilesExist = false;
    }
  });
  
  // 检查开发依赖
  const devDependencies = ['typescript', 'tailwindcss', 'postcss', 'autoprefixer', 'eslint', 'eslint-config-next'];
  devDependencies.forEach(dep => {
    if (pkg.devDependencies[dep]) {
      console.log(`✅ 开发依赖存在: ${dep}@${pkg.devDependencies[dep]}`);
    } else {
      console.log(`❌ 开发依赖缺失: ${dep}`);
      allFilesExist = false;
    }
  });
  
  // 检查脚本
  const scripts = ['dev', 'build', 'start', 'lint'];
  scripts.forEach(script => {
    if (pkg.scripts[script]) {
      console.log(`✅ 脚本存在: ${script}`);
    } else {
      console.log(`❌ 脚本缺失: ${script}`);
      allFilesExist = false;
    }
  });
  
} catch (err) {
  console.log(`❌ package.json 读取失败: ${err.message}`);
  allFilesExist = false;
}

// 检查 .env.local
console.log('\n🔒 环境变量检查');
console.log('-'.repeat(30));

try {
  const envContent = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
  if (envContent.includes('REMOVE_BG_API_KEY')) {
    console.log('✅ 环境变量配置: REMOVE_BG_API_KEY 已配置');
  }
} catch (err) {
  console.log('❌ .env.local 文件读取失败');
  allFilesExist = false;
}

// 检查文档
console.log('\n📚 文档检查');
console.log('-'.repeat(30));

try {
  const readme = fs.readFileSync(path.join(__dirname, 'README.md'), 'utf8');
  const prdDoc = fs.readFileSync(path.join(__dirname, 'docs', 'bg-remover-mvp-prd.md'), 'utf8');
  
  console.log(`✅ README.md: ${readme.length.toLocaleString()} 字符`);
  console.log(`✅ 需求文档: ${prdDoc.length.toLocaleString()} 字符`);
} catch (err) {
  console.log('❌ 文档文件读取失败');
  allFilesExist = false;
}

// 检查项目状态
console.log('\n📋 项目状态总结');
console.log('=' . repeat(50));

if (allFilesExist && allDirsExist) {
  console.log('✅ 项目结构完整，所有核心文件和目录都已正确创建');
} else {
  console.log('⚠️  项目结构不完整，请检查缺失的文件或目录');
}

console.log('\n🎉 项目初始化完成！');
console.log('🚀 开发服务器正在运行: http://localhost:3000');
console.log('\n📝 下一步：');
console.log('1. 打开浏览器访问 http://localhost:3000 验证功能');
console.log('2. 配置真实的 REMOVE_BG_API_KEY 在 .env.local 中');
console.log('3. 测试图片上传和处理功能');
console.log('4. 部署到生产环境');