import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { OutfitCard } from './components/OutfitCard';
import { Spinner } from './components/Spinner';
import { generateOutfits, editOutfitImage } from './services/geminiService';
import { Outfit, OutfitGenerationRequest, OutfitEditRequest } from './types';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<{ file: File; base64: string } | null>(null);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File, base64: string) => {
    setOriginalImage({ file, base64 });
    setOutfits([]);
    setError(null);
  };
  
  const handleGenerateOutfits = useCallback(async () => {
    if (!originalImage) {
      setError("Please select an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setOutfits([]);

    const request: OutfitGenerationRequest = {
      imageBase64: originalImage.base64,
      mimeType: originalImage.file.type,
    };

    try {
      const generatedOutfits = await generateOutfits(request);
      setOutfits(generatedOutfits);
    } catch (err) {
      console.error(err);
      setError("Failed to generate outfits. The model may be overloaded. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [originalImage]);

  const handleEditOutfit = useCallback(async (id: string, prompt: string) => {
    const outfitToEdit = outfits.find(o => o.id === id);
    if (!outfitToEdit || !prompt) return;

    setOutfits(prev => prev.map(o => o.id === id ? { ...o, isEditing: true } : o));
    setError(null);

    const request: OutfitEditRequest = {
      imageBase64: outfitToEdit.imageBase64,
      mimeType: "image/png", // Generated images are PNGs
      prompt: prompt,
    };

    try {
      const editedImageBase64 = await editOutfitImage(request);
      setOutfits(prev => prev.map(o => o.id === id ? { ...o, imageBase64: editedImageBase64, isEditing: false } : o));
    } catch (err) {
      console.error(err);
      setError(`Failed to edit the ${outfitToEdit.type} outfit. Please try again.`);
      setOutfits(prev => prev.map(o => o.id === id ? { ...o, isEditing: false } : o));
    }
  }, [outfits]);

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Style It, Instantly.</h2>
          <p className="text-lg text-gray-600 mb-8">
            Stuck on what to wear with that one item? Upload a picture, and let our AI stylist create three perfect outfits for you.
          </p>
        </div>

        <FileUpload 
          onFileSelect={handleFileSelect} 
          onGenerate={handleGenerateOutfits}
          isGenerating={isLoading}
          selectedFileName={originalImage?.file.name}
        />

        {error && (
          <div className="my-8 max-w-2xl mx-auto p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg text-center">
            <p>{error}</p>
          </div>
        )}

        {isLoading && (
          <div className="mt-12 text-center flex flex-col items-center justify-center">
            <Spinner />
            <p className="mt-4 text-gray-600 font-medium animate-pulse">Styling your outfits... this can take a moment.</p>
          </div>
        )}

        {outfits.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-center mb-8">Your Styled Outfits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {outfits.map(outfit => (
                <OutfitCard key={outfit.id} outfit={outfit} onEdit={handleEditOutfit} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
