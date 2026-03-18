interface ImagePreviewProps {
  imageUrl: string | null;
  title: string;
  fileName?: string;
  fileSize?: string;
  showTransparencyGrid?: boolean;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageUrl,
  title,
  fileName,
  fileSize,
  showTransparencyGrid = false,
}) => {
  if (!imageUrl) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {fileName && (
          <div className="mt-1 text-sm text-gray-500">
            {fileName}
            {fileSize && <span className="ml-2 text-gray-400">({fileSize})</span>}
          </div>
        )}
      </div>
      
      <div className={`p-4 flex justify-center items-center min-h-[300px] ${showTransparencyGrid ? 'bg-[repeating-linear-gradient(45deg,#e2e8f0_25%,transparent_25%,transparent_75%,#e2e8f0_75%,#e2e8f0),repeating-linear-gradient(45deg,#e2e8f0_25%,#ffffff_25%,#ffffff_75%,#e2e8f0_75%,#e2e8f0)] bg-[length:20px_20px] bg-[position:0_0,10px_10px]' : 'bg-gray-50'}`}>
        <img
          src={imageUrl}
          alt={title}
          className="max-w-full max-h-[300px] object-contain rounded-lg shadow-sm"
        />
      </div>
    </div>
  );
};

export default ImagePreview;