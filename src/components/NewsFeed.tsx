'use client';

import React, { useState, useEffect } from 'react';
import { Article } from '@/types';
import { ArticleCard } from './ArticleCard';
import { LoadingCard } from './Skeleton';
import { ErrorMessage } from './Toast';

interface NewsFeedProps {
  articles: Article[];
  isLoading: boolean;
  error: string | null;
  onSummarize: (article: Article) => void;
  onRetry: () => void;
  loadingArticleId?: string;
}

export const NewsFeed: React.FC<NewsFeedProps> = ({
  articles,
  isLoading,
  error,
  onSummarize,
  onRetry,
  loadingArticleId,
}) => {
  const [displayedArticles, setDisplayedArticles] = useState<Article[]>([]);
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    setDisplayedArticles(articles.slice(0, visibleCount));
  }, [articles, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 12);
  };

  return (
    <section className="py-8">
      {/* Error Message */}
      {error && (
        <div className="mb-6">
          <ErrorMessage message={error} onRetry={onRetry} />
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Loading Latest News...</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <LoadingCard count={12} />
          </div>
        </div>
      )}

      {/* Articles Grid */}
      {!isLoading && displayedArticles.length > 0 && (
        <div>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Latest News</h2>
            <p className="text-dark-400">
              {articles.length} articles found • Get AI-generated summaries instantly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onSummarize={onSummarize}
                isLoading={loadingArticleId === article.id}
              />
            ))}
          </div>

          {/* Load More Button */}
          {displayedArticles.length < articles.length && (
            <div className="flex justify-center mt-12">
              <button
                onClick={handleLoadMore}
                className="btn-primary px-8 py-3 text-lg"
              >
                Load More Articles
              </button>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && articles.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-2xl font-bold text-white mb-2">No Articles Found</h3>
          <p className="text-dark-400 mb-6">Try adjusting your filters or check back later</p>
          <button onClick={onRetry} className="btn-primary">
            Refresh News
          </button>
        </div>
      )}
    </section>
  );
};
