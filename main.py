import os
from openai import OpenAI

# جلب المفتاح بأمان من GitHub Secrets
api_key = os.environ.get("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)

def run_news_pulse():
    print("NewsPulse: النظام يعمل الآن...")
    # هنا سيأتي لاحقاً كود جلب التريند وإعادة الصياغة
    # سنقوم بتطويره معاً خطوة بخطوة

if __name__ == "__main__":
    run_news_pulse()
