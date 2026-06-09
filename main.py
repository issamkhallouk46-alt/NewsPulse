import os
import requests
import feedparser

def run_news_pulse():
    api_key = os.environ.get("GEMINI_API_KEY")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    
    feeds = {'العربية': 'https://news.google.com/rss/headlines/section/topic/WORLD?hl=ar&gl=MA'}
    
    for lang, rss_url in feeds.items():
        feed = feedparser.parse(rss_url)
        if feed.entries:
            topic = feed.entries[0].title
            payload = {"contents": [{"parts": [{"text": f"اكتب ملخصاً عن: {topic}"}]}]}
            response = requests.post(url, json=payload)
            if response.status_code == 200:
                print(f"المقال: {response.json()['candidates'][0]['content']['parts'][0]['text']}")
            else:
                print(f"خطأ API: {response.text}")

if __name__ == "__main__":
    run_news_pulse()
