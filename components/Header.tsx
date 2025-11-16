import React from 'react';
import { PaletteIcon } from './Icon';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-center md:justify-start">
        <div className="flex items-center space-x-3">
          <PaletteIcon className="w-8 h-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            Virtual Stylist AI
          </h1>
        </div>
      </div>
    </header>
  );
};
