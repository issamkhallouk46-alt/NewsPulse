'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { NewsFeed } from '@/components/NewsFeed';
import { SummaryModal } from '@/components/SummaryModal';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { apiClient } from '@/lib/api-client';
import { Article } from '@/types';

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [loadingArticleId, setLoadingArticleId] = useState<string | null>(null);

  // Fetch news articles
  const fetchNews = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.get<{ success: boolean; data: Article[] }>(
        '/api/news?limit=50'
      );

      if (response.data && Array.isArray(response.data)) {
        setArticles(response.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch news articles';
      setError(errorMessage);
      console.error('Error fetching news:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch summary for an article
  const handleSummarize = useCallback(async (article: Article) => {
    try {
      setSelectedArticle(article);
      setSummary(null);
      setIsSummarizing(true);
      setLoadingArticleId(article.id);

      const response = await apiClient.post<{ success: boolean; summary: string }>(
        '/api/summary',
        {
          title: article.title,
          description: article.description,
          link: article.link,
        }
      );

      if (response.success) {
        setSummary(response.summary);

        // Update the article with the summary
        setArticles((prevArticles) =>
          prevArticles.map((a) =>
            a.id === article.id ? { ...a, summary: response.summary } : a
          )
        );
      } else {
        setError(response.error || 'Failed to generate summary');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to generate summary';
      setError(errorMessage);
      console.error('Error generating summary:', err);
    } finally {
      setIsSummarizing(false);
      setLoadingArticleId(null);
    }
  }, []);

  // Copy summary to clipboard
  const handleCopySummary = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // Optional: Show success message
      alert('Summary copied to clipboard!');
    });
  }, []);

  // Load news on mount
  useEffect(() => {
    fetchNews();

    // Optional: Refresh news every 5 minutes
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchNews]);

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen bg-dark-950">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <NewsFeed
            articles={articles}
            isLoading={isLoading}
            error={error}
            onSummarize={handleSummarize}
            onRetry={fetchNews}
            loadingArticleId={loadingArticleId}
          />
        </main>

        {/* Summary Modal */}
        <SummaryModal
          article={selectedArticle}
          summary={summary}
          isLoading={isSummarizing}
          onClose={() => {
            setSelectedArticle(null);
            setSummary(null);
          }}
          onCopy={handleCopySummary}
        />

        {/* Footer */}
        <footer className="mt-20 border-t border-dark-700 bg-dark-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-dark-400 text-sm">
              <p>NewsPulse © 2026 | Powered by Gemini AI</p>
              <p className="mt-2">
                Stay informed with AI-generated summaries of the latest news
              </p>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}
