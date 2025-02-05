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
      "status": "pending",
      "quiz": {
        "questions": [
          {
            "question": "Quiz question text",
            "options": [
              "Option 1",
              "Option 2",
              "Option 3",
              "Option 4"
            ],
            "correctAnswer": "Option 1"
          }
        ]
      }
    }
  ]
}

Important Requirements:
1. Ensure the entire learning path fits within the specified start and end dates
2. Break down the content into manageable modules
3. Provide realistic time estimates for each module
4. Include specific dates for each module
5. Calculate required hours per week based on the content and timeline
6. Generate quiz questions for each module based on the description
7. The response must be in valid JSON format`;
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
        status: "pending",
        quiz: {
          questions: [
            {
              question: "What is the main concept introduced in this module?",
              options: [
                "Foundation principles",
                "Advanced applications",
                "System architecture",
                "Implementation details"
              ],
              correctAnswer: "Foundation principles"
            },
            {
              question: "Which learning approach is recommended for beginners?",
              options: [
                "Start with complex problems",
                "Begin with fundamentals",
                "Skip basic concepts",
                "Focus on implementation only"
              ],
              correctAnswer: "Begin with fundamentals"
            },
            {
              question: "What is the primary goal of the introductory module?",
              options: [
                "Building strong foundations",
                "Advanced problem solving",
                "System optimization",
                "Performance tuning"
              ],
              correctAnswer: "Building strong foundations"
            },
            {
              question: "How should students approach the learning material?",
              options: [
                "Skip theoretical concepts",
                "Focus only on practical aspects",
                "Balance theory and practice",
                "Memorize without understanding"
              ],
              correctAnswer: "Balance theory and practice"
            },
            {
              question: "What is the recommended study pattern?",
              options: [
                "Irregular intervals",
                "Consistent daily practice",
                "Weekend cramming",
                "Monthly reviews"
              ],
              correctAnswer: "Consistent daily practice"
            }
          ]
        }
      },
      {
        id: 2,
        title: "Core Concepts",
        description: "Main topics and principles",
        duration: "2 weeks",
        hoursRequired: "20 hours",
        startDate: new Date(new Date(startDate).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(new Date(startDate).getTime() + 21 * 24 * 60 * 60 * 1000).toISOString(),
        status: "pending",
        quiz: {
          questions: [
            {
              question: "Which principle is fundamental to core concepts?",
              options: [
                "Modularity",
                "Complexity",
                "Ambiguity",
                "Redundancy"
              ],
              correctAnswer: "Modularity"
            },
            {
              question: "How do core concepts build upon introduction?",
              options: [
                "They are completely independent",
                "They extend basic principles",
                "They replace basic concepts",
                "They are unrelated"
              ],
              correctAnswer: "They extend basic principles"
            },
            {
              question: "What is the key focus of core concept implementation?",
              options: [
                "Speed over accuracy",
                "Quantity over quality",
                "Quality and efficiency",
                "Minimal effort"
              ],
              correctAnswer: "Quality and efficiency"
            },
            {
              question: "How should core concepts be applied in practice?",
              options: [
                "Randomly",
                "Systematically",
                "Occasionally",
                "Never"
              ],
              correctAnswer: "Systematically"
            },
            {
              question: "What is the relationship between different core concepts?",
              options: [
                "They are isolated",
                "They are interconnected",
                "They are contradictory",
                "They are redundant"
              ],
              correctAnswer: "They are interconnected"
            }
          ]
        }
      },
      {
        id: 3,
        title: "Advanced Topics",
        description: "Complex concepts and applications",
        duration: "1 week",
        hoursRequired: "10 hours",
        startDate: new Date(new Date(startDate).getTime() + 21 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: endDate,
        status: "pending",
        quiz: {
          questions: [
            {
              question: "What distinguishes advanced topics from core concepts?",
              options: [
                "Level of complexity",
                "Amount of content",
                "Study duration",
                "Number of examples"
              ],
              correctAnswer: "Level of complexity"
            },
            {
              question: "How should advanced topics be approached?",
              options: [
                "Rush through quickly",
                "Skip difficult parts",
                "Methodically and thoroughly",
                "Memorize without understanding"
              ],
              correctAnswer: "Methodically and thoroughly"
            },
            {
              question: "What is the best way to master advanced concepts?",
              options: [
                "Skipping prerequisites",
                "Regular practice and application",
                "Memorization only",
                "Avoiding challenges"
              ],
              correctAnswer: "Regular practice and application"
            },
            {
              question: "How do advanced topics relate to real-world applications?",
              options: [
                "They are purely theoretical",
                "They have direct practical applications",
                "They are unnecessary",
                "They are outdated"
              ],
              correctAnswer: "They have direct practical applications"
            },
            {
              question: "What is the expected outcome of mastering advanced topics?",
              options: [
                "Basic understanding",
                "Intermediate knowledge",
                "Expert-level proficiency",
                "No improvement"
              ],
              correctAnswer: "Expert-level proficiency"
            }
          ]
        }
      }
    ]
  };

  return JSON.stringify(mockResponse);
}

export {
  sendMessageToGPT,
};
