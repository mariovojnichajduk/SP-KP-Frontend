import { useState, useRef } from 'react';
import { imagesApi } from '../api/imagesApi';
import type { Image } from '../types/image';
import { toast } from 'react-toastify';
import '../styles/ImageUpload.css';

interface ImageUploadProps {
  listingId: string;
  existingImages?: Image[];
  onImagesChange?: (images: Image[]) => void;
  maxImages?: number;
}

const ImageUpload = ({ listingId, existingImages = [], onImagesChange, maxImages = 10 }: ImageUploadProps) => {
  const [images, setImages] = useState<Image[]>(existingImages);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      toast.error(`You can only upload up to ${maxImages} images`);
      return;
    }

    setUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file, index) => {
        // Convert file to base64
        const base64 = await fileToBase64(file);

        // Upload to API
        const uploadedImage = await imagesApi.upload({
          source: base64,
          listingId,
          displayOrder: images.length + index,
        });

        return uploadedImage;
      });

      const uploadedImages = await Promise.all(uploadPromises);
      const newImages = [...images, ...uploadedImages];
      setImages(newImages);

      if (onImagesChange) {
        onImagesChange(newImages);
      }

      toast.success(`${uploadedImages.length} image(s) uploaded successfully!`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to upload images';
      toast.error(errorMessage);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      await imagesApi.delete(imageId);
      const newImages = images.filter((img) => img.id !== imageId);
      setImages(newImages);

      if (onImagesChange) {
        onImagesChange(newImages);
      }

      toast.success('Image deleted successfully');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete image';
      toast.error(errorMessage);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="image-upload">
      <div className="image-upload-header">
        <label>Images ({images.length}/{maxImages})</label>
        <button
          type="button"
          className="upload-button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || images.length >= maxImages}
        >
          {uploading ? 'Uploading...' : 'Add Images'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </div>

      <div className="images-grid">
        {images.map((image) => (
          <div key={image.id} className="image-preview">
            <img src={image.thumbUrl || image.url} alt={image.originalFilename || 'Listing image'} />
            <button
              type="button"
              className="delete-image-button"
              onClick={() => handleDelete(image.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <p className="no-images-text">No images uploaded yet. Click "Add Images" to upload.</p>
      )}
    </div>
  );
};

export default ImageUpload;
