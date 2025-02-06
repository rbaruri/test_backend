import fetch from 'node-fetch';
import 'dotenv/config';

function createLearningPathPrompt(syllabusText: string, startDate: string, endDate: string): string {
  return `Based on the following syllabus content, create a detailed learning path with timeline and schedule. The learning path should start from ${startDate} and end by ${endDate}. 

Syllabus Content:
${syllabusText}

Please provide a response in the following JSON format:
{
  "courseName": "Name of the Course",
  "totalDuration": "Total duration in weeks",
  "startDate": "${startDate}",
  "endDate": "${endDate}",
  "totalHours": "Total hours required",
  "hoursPerWeek": "Recommended hours per week",
  "modules": [
    {
      "id": 1,
      "title": "Module Title",
      "description": "Detailed description of the module",
      "duration": "Duration in days/weeks",
      "hoursRequired": "Hours required for this module",
      "startDate": "Module start date",
      "endDate": "Module end date",
      "status": "pending"
    }
  ]
}

Important Requirements:
1. Ensure the entire learning path fits within the specified start and end dates
2. Break down the content into manageable modules
3. Provide realistic time estimates for each module
4. Include specific dates for each module
5. Calculate required hours per week based on the content and timeline
6. The response must be in valid JSON format`;
}
async function sendMessageToGPT(userId: string, syllabusText: string, startDate: string, endDate: string): Promise<string | null> {
  const url = 'https://duckduckgo-chat-api-production.up.railway.app/chat/gpt-4o-mini';
  const headers = {
    'User-ID': userId,
    'Content-Type': 'application/json',
  };
  
  const prompt = createLearningPathPrompt(syllabusText, startDate, endDate);
  const body = JSON.stringify({ message: prompt });

  try {
    console.log('Sending request to GPT with prompt:', prompt);
      
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: body,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json() as { response: string };
    console.log('Raw response from GPT:', data.response);

    try {
      // Try to extract JSON from the response
      const jsonMatch = data.response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON object found in response');
      }
      
      const jsonStr = jsonMatch[0];
      console.log('Extracted JSON string:', jsonStr);
      
      // Parse and validate the JSON structure
      const parsedResponse = JSON.parse(jsonStr);
      
      // Ensure the response has the required structure
      if (!parsedResponse.modules || !Array.isArray(parsedResponse.modules)) {
        throw new Error('Invalid response structure: missing modules array');
      }
      
      console.log('Parsed and validated learning path:', JSON.stringify(parsedResponse, null, 2));
      return JSON.stringify(parsedResponse);
    } catch (parseError) {
      console.error('Error parsing GPT response as JSON:', parseError);
      // Return a fallback response structure
      console.error('There was an error processing the syllabus. Please try again.');
      return null;
    }
  } catch (error) {
    console.error('Error sending message to GPT:', error);
    throw error;
  }
}

export {
  sendMessageToGPT,
};