import { useRef, useEffect, useState } from 'react';
import './ImageUpload.css';

const ImageUpload = ({ onImageSelect, isUploading, selectedImage, onClearImage, fileInputRef }) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (selectedImage) {
      const url = URL.createObjectURL(selectedImage);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [selectedImage]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  return (
    <div className="image-upload">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden-input"
      />
      {selectedImage ? (
        <div className="image-preview-container">
          <img 
            src={previewUrl}
            alt="Preview" 
            className="image-preview"
          />
          <button
            type="button"
            onClick={onClearImage}
            className="clear-image-button"
          >
            ✖
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          className={`upload-button ${isUploading ? 'uploading' : ''}`}
          disabled={isUploading}
        >
          {isUploading ? '📤 Uploading...' : '📷 Add Image'}
        </button>
      )}
    </div>
  );
};

export default ImageUpload; 