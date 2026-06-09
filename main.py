import os
from pytrends.request import TrendReq
from openai import OpenAI

# إعداد الربط
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

def get_human_like_article(topic, lang):
    prompt = f"اكتب مقالاً احترافياً عن '{topic}' باللغة {lang}. يجب أن يكون الأسلوب بشرياً، تحليلياً، وجذاباً، بعيداً عن الصياغة الآلية. أضف رأياً أو رؤية مستقبلية في النهاية."
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "system", "content": "أنت صحفي خبير ومحلل تريند عالمي."},
                  {"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content

def run_news_pulse():
    pytrend = TrendReq()
    
    # قائمة دول للمراقبة (يمكنك إضافة المزيد)
    countries = {'morocco': 'العربية', 'france': 'الفرنسية', 'united_states': 'الإنجليزية'}
    
    for country, lang in countries.items():
        print(f"جاري مراقبة التريند في: {country}")
        trends = pytrend.trending_searches(pn=country)
        top_topic = trends[0][0]
        
        print(f"الموضوع الرائج هو: {top_topic}")
        article = get_human_like_article(top_topic, lang)
        
        # هنا سنقوم لاحقاً بإضافة كود النشر في موقعك
        print(f"تمت كتابة المقال بـ {lang}:")
        print(article)
        print("-" * 30)

if __name__ == "__main__":
    run_news_pulse()
