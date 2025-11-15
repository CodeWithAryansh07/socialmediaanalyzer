import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'No text provided for analysis' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured. Please add GEMINI_API_KEY to environment variables.' },
        { status: 500 }
      );
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are a social media expert. Analyze the following text as if it were a social media post and provide detailed suggestions to improve engagement.

Text to analyze:
"""
${text}
"""

Provide your analysis in the following JSON format (respond ONLY with valid JSON, no additional text):
{
  "summary": "A brief 2-3 sentence summary of the content",
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3", "suggestion 4", "suggestion 5"],
  "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5"],
  "bestTimeToPost": "Specific recommendation about when to post this content",
  "toneRecommendations": "Recommendations about the tone and style of the content"
}

Focus on:
- Making the content more engaging
- Improving clarity and impact
- Suggesting relevant hashtags
- Optimal posting times
- Tone adjustments for better audience connection`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const analysisText = response.text();

    // Parse the JSON response
    let analysis;
    try {
      // Try to extract JSON from the response
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw response:', analysisText);
      
      // Fallback response
      return NextResponse.json({
        summary: 'Unable to parse AI response properly.',
        suggestions: [
          'Add compelling hooks in the first line',
          'Include a clear call-to-action',
          'Use emojis to increase visual appeal',
          'Ask questions to encourage engagement',
          'Keep paragraphs short and scannable'
        ],
        hashtags: ['#socialmedia', '#content', '#engagement', '#marketing', '#digital'],
        bestTimeToPost: 'Weekdays between 9-11 AM or 1-3 PM when engagement is typically highest',
        toneRecommendations: 'Use a conversational and authentic tone that resonates with your audience'
      });
    }

    // Validate the response structure
    if (!analysis.summary || !Array.isArray(analysis.suggestions) || !Array.isArray(analysis.hashtags)) {
      throw new Error('Invalid response structure from AI');
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze text. Please try again.' },
      { status: 500 }
    );
  }
}
