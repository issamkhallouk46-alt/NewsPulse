# NewsPulse - API Integration Guide

This document provides detailed information about the API routes, data flows, and integration with Gemini AI.

## API Routes Overview

### 1. News Feed API: `/api/news`

**Endpoint:** `GET /api/news`

**Purpose:** Aggregates news from multiple RSS feeds and returns the latest articles.

**Query Parameters:**
```
?limit=50  // Number of articles (default: 50, max: 100)
```

**Implementation Details:**

```typescript
// src/app/api/news/route.ts
- Fetches from 3 RSS feeds in parallel:
  * Google News
  * CNBC Markets
  * Bloomberg Markets
- Uses RSS Parser library for XML parsing
- Combines and sorts by publication date (newest first)
- Extracts images from article content
- Implements 10-minute server-side caching
```

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "id": "unique-article-id",
      "title": "Article Headline",
      "description": "Article excerpt or full description",
      "link": "https://example.com/article",
      "source": "Google News",
      "pubDate": "2026-06-10T12:00:00Z",
      "image": "https://example.com/image.jpg"
    }
  ],
  "count": 50
}
```

**Error Handling:**
- If one RSS feed fails, continues with others (graceful degradation)
- Returns 500 status if all feeds fail
- Includes detailed console logging for debugging

---

### 2. Summarization API: `/api/summary`

**Endpoint:** `POST /api/summary`

**Purpose:** Generates AI-powered summaries using Google Gemini 1.5-flash API.

**Request Body:**
```json
{
  "title": "Article Title",
  "description": "Full article description or content",
  "link": "https://example.com/article"
}
```

**Implementation Details:**

```typescript
// src/app/api/summary/route.ts
- Validates input (title and description required)
- Constructs professional summarization prompt
- Calls Gemini 1.5-flash API via REST
- Configures safety filters (harassment, hate speech)
- Extracts summary from API response
- Handles rate limiting (429) and other HTTP errors
```

**Gemini API Configuration:**
```json
{
  "temperature": 0.7,      // Balanced creativity
  "topK": 40,              // Diversity in token selection
  "topP": 0.95,            // Nucleus sampling
  "maxOutputTokens": 256,  // Limits summary length
  "safetySettings": [...]  // Content filtering
}
```

**Response Format (Success):**
```json
{
  "success": true,
  "summary": "A concise 2-3 sentence AI-generated summary of the article."
}
```

**Response Format (Error):**
```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

**Common Error Cases:**
```
400 - Bad Request: Missing title or description
401 - Unauthorized: Invalid/missing GEMINI_API_KEY
429 - Rate Limited: Too many requests (Gemini free tier: 60/min)
500 - Server Error: Processing failed
```

---

## Frontend Integration Flow

### Data Flow Diagram

```
User Interface
     ↓
  [Main Page Component - src/app/page.tsx]
     ↓
  ┌─────────────────────────────────┐
  │  On Mount: Fetch News           │
  │  apiClient.get('/api/news')     │
  └────────────┬────────────────────┘
               ↓
  ┌─────────────────────────────────┐
  │  Display Articles in Grid       │
  │  (ArticleCard Components)       │
  └────────────┬────────────────────┘
               ↓
  User clicks "✨ Summarize" button
               ↓
  ┌─────────────────────────────────┐
  │  Request Summary                │
  │  apiClient.post('/api/summary') │
  │  with title & description       │
  └────────────┬────────────────────┘
               ↓
  ┌─────────────────────────────────┐
  │  Display in SummaryModal        │
  │  Show loading spinner while     │
  │  generating (auto-update)       │
  └─────────────────────────────────┘
```

---

## API Client Configuration

**File:** `src/lib/api-client.ts`

The API client is a wrapper around Axios with:
- Centralized configuration
- Automatic error handling
- Request/response interceptors
- TypeScript support

```typescript
// Usage in components
const response = await apiClient.get('/api/news');
const summary = await apiClient.post('/api/summary', {
  title: article.title,
  description: article.description,
  link: article.link
});
```

---

## Environment Variables

**File:** `.env.local`

```env
# REQUIRED: Google Gemini API Key
# Get from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_api_key_here

# API URL for frontend requests
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Comma-separated list of RSS feed URLs
NEWS_RSS_FEEDS=https://news.google.com/rss,https://feeds.cnbc.com/cnbc/snp500,https://feeds.bloomberg.com/markets/news.rss
```

### Getting Gemini API Key

1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key" button
4. Copy the generated key
5. Paste into `.env.local` as `GEMINI_API_KEY`

**Free Tier Limits:**
- 60 requests per minute
- 1 request per second per project
- No monthly limit for requests under quota

---

## Error Handling Strategy

### Frontend Error Handling

```typescript
// In page.tsx
try {
  const response = await apiClient.get('/api/news');
  setArticles(response.data);
} catch (err) {
  const message = err instanceof Error ? err.message : 'Failed';
  setError(message);  // Display in ErrorMessage component
}
```

### Component-Level Error Handling

```typescript
// ErrorBoundary catches React component errors
// ErrorMessage displays API errors with retry button
// Toast shows temporary success/error messages
```

### HTTP Status Codes

| Status | Meaning | Action |
|--------|---------|--------|
| 200 | Success | Use the returned data |
| 400 | Bad Request | Check request format |
| 401 | Unauthorized | Verify API key |
| 429 | Rate Limited | Wait before retrying |
| 500 | Server Error | Retry or contact support |

---

## Performance Optimization

### API Response Caching

```typescript
// News API includes cache headers
headers: {
  'Cache-Control': 'public, max-age=600, s-maxage=1200'
}
// Cached for 10 minutes on server
// Reduces unnecessary API calls
```

### Frontend Caching

```typescript
// Articles are stored in React state
// Only re-fetched after 5 minutes
const interval = setInterval(fetchNews, 5 * 60 * 1000);
```

---

## Testing the APIs

### Using cURL

```bash
# Fetch news
curl http://localhost:3000/api/news?limit=10

# Generate summary
curl -X POST http://localhost:3000/api/summary \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Breaking News",
    "description": "This is an important news story...",
    "link": "https://example.com"
  }'
```

### Using Postman

1. Create new request in Postman
2. Set method: GET for /api/news, POST for /api/summary
3. Add body (JSON) for summarization requests
4. Send and inspect responses

---

## Deployment Considerations

### Environment Variables

In production (Vercel, Railway, Heroku):
1. Set environment variables in deployment platform dashboard
2. Never commit `.env.local` to version control
3. Use `.env.example` as template for team

### API Rate Limiting

Gemini API free tier: 60 requests/minute
- Implement client-side rate limiting
- Show user message when limit exceeded
- Queue requests if necessary

### Scaling

For high traffic:
- Use Redis for response caching
- Implement request queuing
- Consider paid Gemini API tier
- Use Content Delivery Network (CDN) for static assets

---

## Troubleshooting Guide

### Issue: 401 Unauthorized (Gemini API)

**Cause:** Invalid or missing API key

**Solution:**
```bash
# Check .env.local has correct key
GEMINI_API_KEY=your_valid_key_here

# Verify key is active at:
# https://makersuite.google.com/app/apikey
```

### Issue: 429 Rate Limited

**Cause:** Exceeded Gemini API rate limits

**Solution:**
- Wait 60 seconds before retry
- Upgrade to paid API tier
- Implement request batching

### Issue: News feed empty

**Cause:** RSS feeds unavailable or network issue

**Solution:**
- Check internet connection
- Verify RSS feed URLs in code
- Check RSS feed status independently

### Issue: Slow API responses

**Cause:** Multiple RSS feeds being fetched

**Solution:**
- Reduce number of feeds
- Increase timeout in API call
- Implement feed-level caching
- Use production build (`npm run build`)

---

## Advanced Configuration

### Adding More News Sources

Edit `src/app/api/news/route.ts`:

```typescript
const RSS_FEEDS = [
  { url: 'https://feed1.com/rss', name: 'Source 1' },
  { url: 'https://feed2.com/rss', name: 'Source 2' },
  // Add more feeds here
];
```

### Customizing Summary Prompt

Edit `src/app/api/summary/route.ts`:

```typescript
const prompt = `Your custom summarization instructions here...
Article Title: ${title}
Article Description: ${description}`;
```

### Adjusting Gemini Parameters

```typescript
generationConfig: {
  temperature: 0.7,  // 0-1: Higher = more creative
  topK: 40,         // Tokens to sample from
  topP: 0.95,       // Nucleus sampling threshold
  maxOutputTokens: 256  // Max summary length
}
```

---

## API Monitoring & Logging

Add monitoring in production:

```typescript
// Example: Log API calls
console.log(`[API] GET /news - 200 OK - ${articles.length} articles`);
console.log(`[API] POST /summary - 200 OK - Generated summary`);
console.log(`[API] POST /summary - 429 Rate Limited`);
```

Use services like:
- Vercel Analytics (built-in if deployed on Vercel)
- Sentry for error tracking
- LogRocket for user session replay
- Datadog for comprehensive monitoring

---

For more information, see the main [README.md](./README.md)
