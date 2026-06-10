'use client';

import React from 'react';
import { Article } from '@/types';

interface SummaryModalProps {
  article: Article | null;
  summary: string | null;
  isLoading: boolean;
  onClose: () => void;
  onCopy?: (text: string) => void;
}

export const SummaryModal: React.FC<SummaryModalProps> = ({
  article,
  summary,
  isLoading,
  onClose,
  onCopy,
}) => {
  if (!article) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-dark-700 bg-dark-800">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white truncate">{article.title}</h2>
            <p className="text-dark-400 text-sm mt-1">{article.source}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 text-dark-400 hover:text-white text-2xl transition-colors"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Original Article Link */}
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-accent-500 hover:text-accent-400 text-sm"
          >
            📖 View Original Article
            <span>→</span>
          </a>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center gap-3 py-8">
              <div className="w-5 h-5 border-3 border-accent-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-dark-300">Generating AI summary...</p>
            </div>
          )}

          {/* Summary Display */}
          {summary && !isLoading && (
            <div className="space-y-4">
              <div className="bg-accent-500/10 border border-accent-500/30 rounded-lg p-4">
                <h3 className="text-accent-500 font-bold mb-3 flex items-center gap-2">
                  ✨ AI-Generated Summary
                </h3>
                <p className="text-dark-100 leading-relaxed whitespace-pre-wrap break-words">
                  {summary}
                </p>
              </div>

              {/* Copy Button */}
              {onCopy && (
                <button
                  onClick={() => onCopy(summary)}
                  className="w-full btn-secondary text-sm py-2"
                >
                  📋 Copy Summary
                </button>
              )}
            </div>
          )}

          {/* Article Metadata */}
          {!isLoading && (
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-dark-700 text-sm">
              <div>
                <p className="text-dark-400 mb-1">Published</p>
                <p className="text-white">
                  {new Date(article.pubDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-dark-400 mb-1">Source</p>
                <p className="text-white">{article.source}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
