import os
import feedparser
import google.generativeai as genai

# إعداد الربط مع Gemini
genai.configure(api_key=os.environ["GEMINI_API_KEY"])
model = genai.GenerativeModel('gemini-1.5-flash')

def get_human_like_article(topic_title, lang):
    prompt = f"اكتب مقالاً احترافياً عن الموضوع التالي: '{topic_title}'. باللغة {lang}. بأسلوب بشري وتحليلي."
    response = model.generate_content(prompt)
    return response.text

def run_news_pulse():
    feeds = {'العربية': 'https://news.google.com/rss/headlines/section/topic/WORLD?hl=ar&gl=MA',
             'الفرنسية': 'https://news.google.com/rss/headlines/section/topic/WORLD?hl=fr&gl=FR'}
    
    for lang, url in feeds.items():
        print(f"جاري جلب الأخبار من: {lang}")
        feed = feedparser.parse(url)
        top_topic = feed.entries[0].title
        print(f"العنوان الرائج: {top_topic}")
        article = get_human_like_article(top_topic, lang)
        print(article)
        print("-" * 30)

if __name__ == "__main__":
    run_news_pulse()
