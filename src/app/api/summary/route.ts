import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export async function POST(request: NextRequest) {
  try {
    const { title, description, link } = await request.json();

    // Validate input
    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: 'Title and description are required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not configured');
      return NextResponse.json(
        { success: false, error: 'API configuration error' },
        { status: 500 }
      );
    }

    // Prepare the prompt for Gemini
    const prompt = `You are a professional news summarizer. Create a concise, well-structured summary of the following news article in 2-3 sentences. Focus on the key points and make it engaging for readers.

Article Title: ${title}
Article Description: ${description}

Provide only the summary without any additional text or formatting.`;

    // Call Gemini API
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 256,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);

      // Handle specific error cases
      if (response.status === 429) {
        return NextResponse.json(
          { success: false, error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { success: false, error: 'Failed to generate summary' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Extract the summary from Gemini response
    const summary =
      data.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate summary';

    return NextResponse.json(
      {
        success: true,
        summary: summary.trim(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Summary API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
