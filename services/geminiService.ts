import { GoogleGenAI, Modality } from "@google/genai";
import { Outfit, OutfitGenerationRequest, OutfitEditRequest } from '../types';

const OUTFIT_TYPES: Array<Outfit['type']> = ['Casual', 'Business', 'Night Out'];

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

async function generateSingleOutfit(request: OutfitGenerationRequest, outfitType: Outfit['type']): Promise<string> {
  const { imageBase64, mimeType } = request;
  const prompt = `Create a complete, stylish, and cohesive 'flat-lay' style outfit for a ${outfitType.toLowerCase()} occasion, featuring this clothing item. Ensure all items are clearly visible against a clean, neutral background.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: imageBase64, mimeType } },
          { text: prompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const firstPart = response.candidates?.[0]?.content?.parts?.[0];
    if (firstPart && firstPart.inlineData) {
      return firstPart.inlineData.data;
    }
    throw new Error('No image data returned from API for ' + outfitType);
  } catch (error) {
    console.error(`Error generating ${outfitType} outfit:`, error);
    throw new Error(`Failed to generate the ${outfitType} outfit.`);
  }
}

export async function generateOutfits(request: OutfitGenerationRequest): Promise<Outfit[]> {
  const promises = OUTFIT_TYPES.map(type => generateSingleOutfit(request, type));

  const results = await Promise.allSettled(promises);

  const successfulOutfits = results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return {
        id: `${Date.now()}-${OUTFIT_TYPES[index]}`,
        type: OUTFIT_TYPES[index],
        imageBase64: result.value,
        isEditing: false,
      };
    } else {
      console.error(`Failed to generate outfit for ${OUTFIT_TYPES[index]}:`, result.reason);
      return null;
    }
  }).filter((outfit): outfit is Outfit => outfit !== null);
  
  if (successfulOutfits.length === 0) {
    throw new Error('Could not generate any outfits.');
  }

  return successfulOutfits;
}

export async function editOutfitImage(request: OutfitEditRequest): Promise<string> {
  const { imageBase64, mimeType, prompt } = request;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: imageBase64, mimeType } },
          { text: prompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });
    
    const firstPart = response.candidates?.[0]?.content?.parts?.[0];
    if (firstPart && firstPart.inlineData) {
      return firstPart.inlineData.data;
    }
    throw new Error('No image data returned from API for edit request.');
  } catch (error) {
    console.error('Error editing image:', error);
    throw new Error('Failed to edit the image.');
  }
}
