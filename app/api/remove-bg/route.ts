import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // 获取表单数据
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return NextResponse.json(
        { error: 'Please select an image to process' },
        { status: 400 }
      );
    }

    console.log('🔍 收到的文件信息:', {
      name: imageFile.name,
      type: imageFile.type,
      size: imageFile.size
    });

    // 验证文件大小 (最大 5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (imageFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size must not exceed 5MB' },
        { status: 400 }
      );
    }

    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(imageFile.type)) {
      console.error('❌ 无效的文件类型:', imageFile.type);
      return NextResponse.json(
        { 
          error: `Invalid file type. Only ${allowedTypes.join(', ')} formats are supported. Received: ${imageFile.type}` 
        },
        { status: 400 }
      );
    }

    // 调用 Remove.bg API
    const apiKey = process.env.REMOVE_BG_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API configuration error, please contact support' },
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
        errors: [{ title: 'Processing failed', detail: 'Server error' }],
      }));

      const errorMessage = errorData.errors?.[0]?.title || errorData.errors?.[0]?.detail || 'Image processing failed';
      
      console.error('❌ Remove.bg API 错误:', response.status, errorMessage);
      
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    // 获取二进制数据
    const imageBuffer = await response.arrayBuffer();
    console.log('✅ 成功获取处理后的图片:', imageBuffer.byteLength, 'bytes');
    
    // 返回处理后的图像
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="processed.png"`,
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    
    return NextResponse.json(
      { error: 'Request failed, please check your network connection and try again' },
      { status: 500 }
    );
  }
}