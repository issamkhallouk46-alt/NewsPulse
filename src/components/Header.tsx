'use client';

import React from 'react';

interface HeaderProps {
  title?: string;
  description?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'NewsPulse',
  description = 'AI-Powered News Summaries',
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-dark-700 bg-dark-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">📰</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{title}</h1>
              <p className="text-dark-400 text-xs">{description}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-dark-300 hover:text-white transition-colors text-sm font-medium">
              Latest
            </a>
            <a href="#" className="text-dark-300 hover:text-white transition-colors text-sm font-medium">
              Trending
            </a>
            <a href="#" className="text-dark-300 hover:text-white transition-colors text-sm font-medium">
              Categories
            </a>
          </nav>

          {/* Search Bar */}
          <div className="hidden sm:flex items-center">
            <input
              type="search"
              placeholder="Search news..."
              className="px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition-all text-sm"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
