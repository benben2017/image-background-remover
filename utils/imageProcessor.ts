export async function processImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch('/api/remove-bg', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      error: '请求失败，请检查网络连接',
    }));
    throw new Error(errorData.error || `HTTP ${response.status}: 处理失败`);
  }

  // 获取二进制数据
  const blob = await response.blob();
  
  // 转换为 base64 字符串
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}