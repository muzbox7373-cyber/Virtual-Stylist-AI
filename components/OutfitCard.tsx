import React, { useState } from 'react';
import { Outfit } from '../types';
import { Spinner } from './Spinner';
import { EditIcon } from './Icon';

interface OutfitCardProps {
  outfit: Outfit;
  onEdit: (id: string, prompt: string) => void;
}

export const OutfitCard: React.FC<OutfitCardProps> = ({ outfit, onEdit }) => {
  const [editPrompt, setEditPrompt] = useState('');

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editPrompt.trim() && !outfit.isEditing) {
      onEdit(outfit.id, editPrompt);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 transform hover:scale-105 transition-transform duration-300">
      <div className="relative">
        <img 
          src={`data:image/png;base64,${outfit.imageBase64}`} 
          alt={`${outfit.type} outfit`} 
          className="w-full h-80 object-cover"
        />
        {outfit.isEditing && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Spinner />
          </div>
        )}
        <div className="absolute top-2 left-2 bg-indigo-600 text-white px-3 py-1 text-sm font-semibold rounded-full">
          {outfit.type}
        </div>
      </div>
      <div className="p-4">
        <form onSubmit={handleEditSubmit}>
          <label htmlFor={`edit-${outfit.id}`} className="block text-sm font-medium text-gray-700 mb-1">
            Edit this look
          </label>
          <div className="flex space-x-2">
            <input
              id={`edit-${outfit.id}`}
              type="text"
              value={editPrompt}
              onChange={(e) => setEditPrompt(e.target.value)}
              placeholder="e.g., 'Change shoes to sneakers'"
              className="flex-grow block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              disabled={outfit.isEditing}
            />
            <button
              type="submit"
              disabled={!editPrompt.trim() || outfit.isEditing}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
            >
              <EditIcon className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
