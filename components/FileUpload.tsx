import React, { useState, useRef, useCallback } from 'react';
import { UploadIcon, SparklesIcon } from './Icon';

interface FileUploadProps {
  onFileSelect: (file: File, base64: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  selectedFileName?: string;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]); // remove data:mime/type;base64, part
    };
    reader.onerror = (error) => reject(error);
  });
};

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, onGenerate, isGenerating, selectedFileName }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit for inline data
        alert("File is too large. Please select an image smaller than 4MB.");
        return;
      }
      setImagePreview(URL.createObjectURL(file));
      const base64 = await fileToBase64(file);
      onFileSelect(file, base64);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-200">
      <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
        <div 
          onClick={handleUploadClick}
          className="relative w-full md:w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 hover:border-indigo-500 hover:text-indigo-500 transition-colors cursor-pointer bg-gray-50 mb-4 md:mb-0"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange}
            className="hidden"
            accept="image/png, image/jpeg, image/webp"
          />
          {imagePreview ? (
            <img src={imagePreview} alt="Selected item" className="w-full h-full object-cover rounded-lg" />
          ) : (
            <div className="text-center">
              <UploadIcon className="w-10 h-10 mx-auto" />
              <p className="mt-2 text-sm font-medium">Click to upload</p>
              <p className="text-xs">PNG, JPG, WEBP</p>
            </div>
          )}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-lg font-semibold text-gray-800">Upload your clothing item</h3>
          <p className="text-gray-500 mt-1 mb-4 text-sm">
            {selectedFileName ? `Selected: ${selectedFileName}` : "Let's find the perfect match for your piece."}
          </p>
          <button
            onClick={onGenerate}
            disabled={!imagePreview || isGenerating}
            className="w-full md:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <SparklesIcon className="w-5 h-5 mr-2"/>
            {isGenerating ? 'Generating...' : 'Get Style Ideas'}
          </button>
        </div>
      </div>
    </div>
  );
};
