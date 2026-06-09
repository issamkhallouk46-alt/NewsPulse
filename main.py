import os
import requests
import feedparser

API_KEY = os.environ["GEMINI_API_KEY"]
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={API_KEY}"

def get_human_like_article(topic_title, lang):
    payload = {
        "contents": [{"parts": [{"text": f"اكتب مقالاً احترافياً عن الموضوع التالي: '{topic_title}'. باللغة {lang}. بأسلوب بشري وتحليلي."}]}]
    }
    try:
        response = requests.post(API_URL, json=payload)
        data = response.json()
        return data['candidates'][0]['content']['parts'][0]['text']
    except Exception as e:
        return f"خطأ في الاتصال: {str(e)}"

def run_news_pulse():
    feeds = {
        'العربية': 'https://news.google.com/rss/headlines/section/topic/WORLD?hl=ar&gl=MA',
        'الفرنسية': 'https://news.google.com/rss/headlines/section/topic/WORLD?hl=fr&gl=FR'
    }
    
    for lang, url in feeds.items():
        print(f"--- جاري جلب الأخبار من: {lang} ---")
        feed = feedparser.parse(url)
        if feed.entries:
            top_topic = feed.entries[0].title
            print(f"العنوان الرائج: {top_topic}")
            article = get_human_like_article(top_topic, lang)
            print(article)
            print("-" * 50)

if __name__ == "__main__":
    run_news_pulse()
