/**
 * Compresses an image file client-side using HTML5 Canvas.
 * Keeps visual quality high while reducing file size from ~5MB to ~150-250KB,
 * preventing storage quota errors and enabling fast persistence.
 *
 * @param {File} file - The image file to compress
 * @param {Object} options - Compression options
 * @param {number} [options.maxWidth=1600] - Maximum width
 * @param {number} [options.maxHeight=1600] - Maximum height
 * @param {number} [options.quality=0.82] - Compression quality (0 to 1)
 * @returns {Promise<string>} Base64 Data URL of the compressed image
 */
export async function compressImage(file, options = {}) {
  const { maxWidth = 1600, maxHeight = 1600, quality = 0.82 } = options;

  // If SVG, no need to compress with canvas
  if (file.type === 'image/svg+xml') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const img = new Image();

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio preserved dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(readerEvent.target.result);
          return;
        }

        // Smooth rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP if supported, fallback to JPEG
        let dataUrl;
        try {
          dataUrl = canvas.toDataURL('image/webp', quality);
          if (!dataUrl.startsWith('data:image/webp')) {
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }
        } catch (e) {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(dataUrl);
      };

      img.onerror = (err) => {
        console.warn('Failed to load image for compression, falling back to original dataURL', err);
        resolve(readerEvent.target.result);
      };

      img.src = readerEvent.target.result;
    };

    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
