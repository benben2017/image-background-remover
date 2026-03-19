'use client';

export async function processImage(file: File): Promise<string> {
  const API_KEY = 'n5bj6dzHwoFgJe45GBQu8z91';
  
  const formData = new FormData();
  formData.append('image_file', file);
  formData.append('size', 'auto');

  const response = await fetch('https://api.remove.bg/v1.0/removebg', {
    method: 'POST',
    headers: {
      'X-Api-Key': API_KEY,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Remove.bg API error:', response.status, errorText);
    throw new Error(`API 错误 (${response.status}): 请检查 API Key 或网络连接`);
  }

  const blob = await response.blob();
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
