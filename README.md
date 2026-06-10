# NewsPulse - AI-Powered News Website

A modern, responsive news website built with Next.js, Tailwind CSS, and Google Gemini AI. Get instant AI-generated summaries of the latest headlines from top news sources.

![NewsPulse](https://img.shields.io/badge/NextJS-15.0-black?style=flat-square&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.3-38B2AC?style=flat-square&logo=tailwind-css)
![Gemini AI](https://img.shields.io/badge/Gemini-AI-blue?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square&logo=typescript)

## 🚀 Features

- **Modern Dark Theme**: Sleek, eye-friendly dark UI with responsive design
- **Real-time News Feed**: Aggregates latest headlines from multiple RSS feeds (Google News, CNBC, Bloomberg)
- **AI-Powered Summaries**: One-click generation of professional summaries using Google Gemini 1.5-flash
- **Mobile Responsive**: Fully optimized for desktop, tablet, and mobile devices
- **Fast Performance**: Optimized images, API caching, and efficient component rendering
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Copy-to-Clipboard**: Easy sharing of generated summaries

## 📋 Tech Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework with dark mode support
- **React 18**: UI components and hooks

### Backend
- **Next.js API Routes**: Serverless API handlers
- **RSS Parser**: Multi-source news aggregation
- **Gemini 1.5-flash API**: AI-powered content generation

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- Google Gemini API Key ([Get it here](https://makersuite.google.com/app/apikey))

### Step 1: Clone & Install Dependencies

```bash
git clone https://github.com/issamkhallouk46-alt/NewsPulse.git
cd NewsPulse
npm install
```

### Step 2: Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# API URL (for development)
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# News RSS Feeds (comma-separated)
NEWS_RSS_FEEDS=https://news.google.com/rss,https://feeds.cnbc.com/cnbc/snp500,https://feeds.bloomberg.com/markets/news.rss
```

**How to get your Gemini API Key:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key and paste it into `.env.local`

### Step 3: Install Dependencies & Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

The app will be available at **http://localhost:3000**

## 🎨 Project Structure

```
NewsPulse/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── news/route.ts          # RSS news aggregation endpoint
│   │   │   └─��� summary/route.ts       # Gemini AI summarization endpoint
│   │   ├── layout.tsx                 # Root layout with metadata
│   │   └── page.tsx                   # Main news feed page
│   ├── components/
│   │   ├── ArticleCard.tsx           # Article display card component
│   │   ├── ErrorBoundary.tsx         # React error boundary
│   │   ├── Header.tsx                # Navigation header
│   │   ├── NewsFeed.tsx              # Main feed with pagination
│   │   ├── Skeleton.tsx              # Loading placeholders
│   │   ├── SummaryModal.tsx          # Summary display modal
│   │   └── Toast.tsx                 # Error/success messages
│   ├── lib/
│   │   ├── api-client.ts             # Axios API client with error handling
│   │   └── utils.ts                  # Formatting & utility functions
│   ├── styles/
│   │   └── globals.css               # Global styles & Tailwind directives
│   └── types/
│       └── index.ts                  # TypeScript type definitions
├── public/                            # Static assets
├── tailwind.config.js                # Tailwind CSS configuration
├── next.config.js                    # Next.js configuration
├── tsconfig.json                     # TypeScript configuration
├── postcss.config.js                 # PostCSS configuration
├── package.json                      # Dependencies & scripts
└── .env.local                        # Environment variables (local development)
```

## 🔑 Key Components & Features

### 1. **News Aggregation** (`/api/news`)
- Fetches from multiple RSS feeds in parallel
- Returns 50 latest articles (customizable)
- 10-minute caching for performance
- Error resilience: continues fetching from other sources if one fails

### 2. **AI Summarization** (`/api/summary`)
- Uses Gemini 1.5-flash model
- Generates 2-3 sentence professional summaries
- Safety settings enabled for content filtering
- Rate limit handling with user-friendly messages

### 3. **Frontend Components**
- **ArticleCard**: Displays article with image, metadata, and action buttons
- **NewsFeed**: Grid layout with lazy loading (12 articles per load)
- **SummaryModal**: Full-screen modal with AI summary display
- **Header**: Sticky navigation with branding
- **Error Handling**: ErrorBoundary for React errors, Toast messages for API errors

## 🎯 Usage Guide

### Viewing News
1. Open the app at `http://localhost:3000`
2. Browse articles in a responsive grid layout
3. Scroll down to load more articles

### Getting AI Summaries
1. Click the **"✨ Summarize"** button on any article
2. Wait for the AI to generate a professional summary
3. View the summary in the modal window
4. Click **"📋 Copy Summary"** to copy to clipboard
5. Click the article title or "📖 View Original Article" to read the full article

### Mobile Experience
- Fully responsive design works on all screen sizes
- Touch-friendly buttons and interactions
- Optimized images with lazy loading

## ⚙️ API Endpoints

### GET `/api/news`
Fetches aggregated news articles from multiple RSS feeds.

**Query Parameters:**
- `limit` (optional): Number of articles (default: 50, max: 100)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "google-news-0-1234567890",
      "title": "Article Title",
      "description": "Article description...",
      "link": "https://example.com",
      "source": "Google News",
      "pubDate": "2026-06-10T12:00:00Z",
      "image": "https://example.com/image.jpg"
    }
  ],
  "count": 50
}
```

### POST `/api/summary`
Generates an AI summary using Google Gemini.

**Request Body:**
```json
{
  "title": "Article Title",
  "description": "Article description...",
  "link": "https://example.com"
}
```

**Response:**
```json
{
  "success": true,
  "summary": "AI-generated summary of 2-3 sentences..."
}
```

## 🎨 Styling & Customization

### Dark Theme Colors
- **Primary**: `bg-dark-950` to `bg-dark-50`
- **Accent**: `accent-500` (Sky Blue) - Used for CTAs and highlights
- **Hover Effects**: Smooth transitions with glow effects

### Custom Tailwind Classes
- `.btn-primary`: Primary action button
- `.btn-secondary`: Secondary action button
- `.card`: Article/content card with border
- `.card-hover`: Hover state with glow effect
- `.fade-in`: Fade-in animation

## 🚀 Performance Optimizations

- **Image Optimization**: Next.js Image component with lazy loading
- **API Caching**: 10-minute cache on news feed for reduced API calls
- **Code Splitting**: Dynamic component imports
- **Skeleton Loading**: Smooth loading states with placeholder components
- **Debounced Search**: Optimized API calls on user input
- **Mobile-First**: Responsive design prioritizes mobile performance

## 🔒 Security Features

- **Environment Variables**: API keys never exposed in code
- **CORS Handling**: Safe API requests from frontend
- **Content Security**: Safety settings enabled on Gemini API
- **Error Boundaries**: Graceful error handling
- **Input Validation**: API validates all inputs before processing

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

## 🐛 Troubleshooting

### Issue: "GEMINI_API_KEY is not configured"
**Solution:** Ensure `.env.local` file exists with your API key:
```env
GEMINI_API_KEY=your_key_here
```

### Issue: News feed shows "No Articles Found"
**Solution:** 
1. Check internet connection
2. Verify RSS feeds are accessible
3. Check browser console for error messages
4. Click "Refresh News" button to retry

### Issue: Summaries not generating
**Solution:**
1. Verify Gemini API key is valid
2. Check rate limits (Gemini free tier: 60 requests/minute)
3. Check browser console for detailed error message
4. Wait a few seconds before retrying

### Issue: Slow load times
**Solution:**
1. Check network throttling (DevTools)
2. Clear browser cache
3. Ensure `npm run build` completes without errors
4. Use production build: `npm run build && npm start`

## 📈 Future Enhancements

- [ ] Category/topic filtering
- [ ] Personalized news preferences
- [ ] Search functionality
- [ ] Bookmarking/favorites
- [ ] Share to social media
- [ ] Dark/light theme toggle
- [ ] Multiple language support
- [ ] Reading time estimates
- [ ] Newsletter subscription
- [ ] Progressive Web App (PWA)

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For issues, questions, or suggestions:
- Open an [issue](https://github.com/issamkhallouk46-alt/NewsPulse/issues)
- Contact: [issamkhallouk46@gmail.com](mailto:issamkhallouk46@gmail.com)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Google Gemini](https://deepmind.google/technologies/gemini/) - AI Model
- [RSS Parser](https://www.npmjs.com/package/rss-parser) - RSS parsing library

---

**Made with ❤️ by Issam Khallouk**

⭐ If you find this project helpful, please consider giving it a star!
