import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // 获取表单数据
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return NextResponse.json(
        { error: '请选择要处理的图片' },
        { status: 400 }
      );
    }

    // 验证文件大小 (最大 5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (imageFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: '文件大小不能超过 5MB' },
        { status: 400 }
      );
    }

    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(imageFile.type)) {
      return NextResponse.json(
        { error: '不支持的文件格式，请使用 JPG、PNG 或 WebP 格式' },
        { status: 400 }
      );
    }

    // 调用 Remove.bg API
    const apiKey = process.env.REMOVE_BG_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API 配置错误，请联系管理员' },
        { status: 500 }
      );
    }

    // 准备请求数据
    const formDataToSend = new FormData();
    formDataToSend.append('image_file', imageFile);
    formDataToSend.append('size', 'auto');

    // 发送请求到 Remove.bg
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
      },
      body: formDataToSend,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        errors: [{ title: '处理失败', detail: '服务器错误' }],
      }));

      const errorMessage = errorData.errors?.[0]?.title || errorData.errors?.[0]?.detail || '图像处理失败';
      
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    // 获取二进制数据
    const imageBuffer = await response.arrayBuffer();
    
    // 返回处理后的图像
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="processed-${imageFile.name.replace(/\.[^/.]+$/, '')}.png"`,
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    
    return NextResponse.json(
      { error: '请求处理失败，请检查网络连接后重试' },
      { status: 500 }
    );
  }
}