import os
import feedparser
from openai import OpenAI

# إعداد الربط مع OpenAI
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

def get_human_like_article(topic_title, lang):
    prompt = f"اكتب مقالاً احترافياً عن الموضوع التالي: '{topic_title}'. باللغة {lang}. يجب أن يكون الأسلوب بشرياً وتحليلياً. أضف رؤية مستقبلية في النهاية."
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "system", "content": "أنت صحفي خبير."}, {"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content

def run_news_pulse():
    # استخدام RSS Feed بدلاً من pytrends
    feeds = {'العربية': 'https://news.google.com/rss/headlines/section/topic/WORLD?hl=ar&gl=MA',
             'الفرنسية': 'https://news.google.com/rss/headlines/section/topic/WORLD?hl=fr&gl=FR'}
    
    for lang, url in feeds.items():
        print(f"جاري جلب الأخبار من: {lang}")
        feed = feedparser.parse(url)
        # جلب أول خبر فقط
        top_topic = feed.entries[0].title
        
        print(f"العنوان الرائج: {top_topic}")
        article = get_human_like_article(top_topic, lang)
        print(f"--- المقال بـ {lang} ---")
        print(article)
        print("-" * 30)

if __name__ == "__main__":
    run_news_pulse()
