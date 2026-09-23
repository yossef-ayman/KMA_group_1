import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Link2, Check, RefreshCw, Loader2 } from 'lucide-react';
import { compressImage } from '../utils/imageCompressor';

export const AdminMediaUpload = ({
  label = 'Upload Image / Media',
  helper = 'Supports PNG, JPG, WebP, SVG (Auto-compressed for fast loading)',
  currentUrl = '',
  onUrlChange,
  aspectRatio = 'video', // 'video', 'square', 'document'
  presetImages = []
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUrlMode, setIsUrlMode] = useState(false);
  const [tempUrl, setTempUrl] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WebP, SVG).');
      return;
    }

    try {
      setIsCompressing(true);
      const compressedDataUrl = await compressImage(file, {
        maxWidth: 1600,
        maxHeight: 1600,
        quality: 0.82
      });
      onUrlChange(compressedDataUrl);
    } catch (err) {
      console.error('Error compressing image:', err);
      // Fallback to FileReader
      const reader = new FileReader();
      reader.onload = (event) => onUrlChange(event.target.result);
      reader.readAsDataURL(file);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleApplyUrl = (e) => {
    e.preventDefault();
    if (tempUrl.trim()) {
      onUrlChange(tempUrl.trim());
      setTempUrl('');
      setIsUrlMode(false);
    }
  };

  const aspectClass =
    aspectRatio === 'square'
      ? 'aspect-square max-w-[160px]'
      : aspectRatio === 'document'
      ? 'aspect-[4/3] max-w-[220px]'
      : 'aspect-video w-full';

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
            {label}
          </label>
          {helper && <p className="text-[11px] text-stone-500">{helper}</p>}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsUrlMode(!isUrlMode)}
            className="text-[11px] font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-amber-50 transition-colors"
          >
            <Link2 className="w-3 h-3" />
            <span>{isUrlMode ? 'File Upload' : 'Paste Direct URL'}</span>
          </button>
        </div>
      </div>

      {isUrlMode ? (
        <div className="p-3.5 rounded-2xl bg-[#fbf9f6] border border-[#ded0bf] space-y-2.5">
          <div className="flex gap-2">
            <input
              type="url"
              value={tempUrl}
              onChange={(e) => setTempUrl(e.target.value)}
              placeholder="https://images.unsplash.com/... or https://..."
              className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#ded0bf] text-xs text-stone-900 focus:outline-none focus:border-amber-700 font-mono"
            />
            <button
              type="button"
              onClick={handleApplyUrl}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 transition-colors shrink-0"
            >
              Apply URL
            </button>
          </div>
          {currentUrl && (
            <p className="text-[10px] text-stone-500 truncate font-mono">
              Active: {currentUrl}
            </p>
          )}
        </div>
      ) : (
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInput}
            accept="image/*"
            className="hidden"
          />

          {isCompressing ? (
            <div className="p-8 rounded-2xl border-2 border-amber-600 bg-amber-50/50 text-center flex flex-col items-center justify-center space-y-2">
              <Loader2 className="w-7 h-7 text-amber-800 animate-spin" />
              <p className="text-xs font-bold text-stone-800">
                Optimizing & Compressing Image...
              </p>
              <p className="text-[11px] text-stone-500">
                Preserving crystal cinema quality while securing persistent storage
              </p>
            </div>
          ) : currentUrl ? (
            <div className="relative p-3 rounded-2xl bg-[#fbf9f6] border border-[#ded0bf] flex flex-col sm:flex-row items-center gap-4">
              <div
                className={`relative rounded-xl overflow-hidden bg-stone-100 border border-[#e4d8c7] shadow-sm shrink-0 ${aspectClass}`}
              >
                <img
                  src={currentUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800';
                  }}
                />
              </div>

              <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-emerald-700">
                  <Check className="w-4 h-4" />
                  <span>Media Attached & Active</span>
                </div>
                <p className="text-[11px] text-stone-500 truncate max-w-full font-mono">
                  {currentUrl.startsWith('data:') ? 'Base64 Local Image' : currentUrl}
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#f4ede3] text-stone-800 text-xs font-bold border border-[#ded0bf] shadow-sm transition-colors"
                  >
                    <RefreshCw className="w-3 h-3 text-amber-800" />
                    <span>Replace Image</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onUrlChange('')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 transition-colors"
                  >
                    <X className="w-3 h-3" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-amber-700 bg-amber-50/80 ring-4 ring-amber-700/20'
                  : 'border-[#cbb497] bg-[#fbf9f6] hover:bg-[#f6eee4] hover:border-amber-700'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 mx-auto mb-3 flex items-center justify-center shadow-sm">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-stone-800">
                Click to browse or drag & drop media here
              </p>
              <p className="text-[11px] text-stone-500 mt-1">
                PNG, JPG, WebP, or SVG up to 5MB
              </p>
            </div>
          )}
        </div>
      )}

      {/* Preset suggestions if provided */}
      {presetImages && presetImages.length > 0 && (
        <div className="pt-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
            Quick Cinema Presets:
          </span>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {presetImages.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onUrlChange(img.url)}
                className="w-12 h-9 rounded-lg overflow-hidden border border-[#ded0bf] hover:border-amber-700 shrink-0 opacity-80 hover:opacity-100 transition-all"
                title={img.label}
              >
                <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
