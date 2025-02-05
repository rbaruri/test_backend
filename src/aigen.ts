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

async function sendMessageToGPT(syllabusText: string, startDate: string, endDate: string): Promise<string | null> {
  // For now, return a mock response since we don't have a working AI endpoint
  const mockResponse = {
    courseName: "Sample Course",
    totalDuration: "4 weeks",
    startDate: startDate,
    endDate: endDate,
    totalHours: "40 hours",
    hoursPerWeek: "10 hours",
    modules: [
      {
        id: 1,
        title: "Introduction",
        description: "Basic concepts and fundamentals",
        duration: "1 week",
        hoursRequired: "10 hours",
        startDate: startDate,
        endDate: new Date(new Date(startDate).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: "pending"
      },
      {
        id: 2,
        title: "Core Concepts",
        description: "Main topics and principles",
        duration: "2 weeks",
        hoursRequired: "20 hours",
        startDate: new Date(new Date(startDate).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(new Date(startDate).getTime() + 21 * 24 * 60 * 60 * 1000).toISOString(),
        status: "pending"
      },
      {
        id: 3,
        title: "Advanced Topics",
        description: "Complex concepts and applications",
        duration: "1 week",
        hoursRequired: "10 hours",
        startDate: new Date(new Date(startDate).getTime() + 21 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: endDate,
        status: "pending"
      }
    ]
  };

  return JSON.stringify(mockResponse);
}

export {
  sendMessageToGPT,
};