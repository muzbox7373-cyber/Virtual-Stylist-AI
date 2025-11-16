export interface Outfit {
  id: string;
  type: 'Casual' | 'Business' | 'Night Out';
  imageBase64: string;
  // FIX: Made `isEditing` required to fix a type predicate error.
  isEditing: boolean;
}

export interface OutfitGenerationRequest {
  imageBase64: string;
  mimeType: string;
}

export interface OutfitEditRequest extends OutfitGenerationRequest {
  prompt: string;
}