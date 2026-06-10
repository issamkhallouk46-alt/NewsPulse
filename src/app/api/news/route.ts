import { NextRequest, NextResponse } from 'next/server';
import Parser from 'rss-parser';

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  link: string;
  source: string;
  pubDate: string;
  image?: string;
}

const parser = new Parser({
  timeout: 10000,
});

// Multiple news sources
const RSS_FEEDS = [
  { url: 'https://news.google.com/rss', name: 'Google News' },
  { url: 'https://feeds.cnbc.com/cnbc/snp500', name: 'CNBC' },
  { url: 'https://feeds.bloomberg.com/markets/news.rss', name: 'Bloomberg' },
];

export async function GET(request: NextRequest) {
  try {
    const limit = request.nextUrl.searchParams.get('limit') || '50';
    const limitNum = Math.min(parseInt(limit), 100);

    // Fetch from multiple RSS feeds in parallel
    const feedPromises = RSS_FEEDS.map((feed) =>
      parser
        .parseURL(feed.url)
        .then((parsedFeed) => ({
          items: (parsedFeed.items || []).slice(0, 20).map((item, index) => ({
            id: `${feed.name}-${index}-${Date.now()}`,
            title: item.title || 'No title',
            description: item.content || item.contentSnippet || item.summary || '',
            link: item.link || '',
            source: feed.name,
            pubDate: item.pubDate || new Date().toISOString(),
            image: item.enclosure?.url || extractImageFromDescription(item.content || ''),
          })),
        }))
        .catch((error) => {
          console.error(`Error parsing ${feed.name}:`, error);
          return { items: [] };
        })
    );

    const results = await Promise.all(feedPromises);

    // Combine and sort articles
    const articles: NewsArticle[] = results
      .flatMap((result) => result.items)
      .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
      .slice(0, limitNum);

    // Add caching headers
    return NextResponse.json(
      {
        success: true,
        data: articles,
        count: articles.length,
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=600, s-maxage=1200', // Cache for 10 minutes
        },
      }
    );
  } catch (error) {
    console.error('News API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch news articles',
      },
      { status: 500 }
    );
  }
}

// Helper function to extract image URL from HTML content
function extractImageFromDescription(html: string): string | undefined {
  const imgRegex = /<img[^>]+src="([^">]+)"/;
  const match = html.match(imgRegex);
  return match ? match[1] : undefined;
}
