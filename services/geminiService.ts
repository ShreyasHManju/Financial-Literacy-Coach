

import { GoogleGenAI, Chat, GenerateContentStreamResult, Type } from "@google/genai";
import { UserAgeGroup, FinancialGoal, Transaction, RetirementPrediction, InsuranceAdvice, PortfolioAdvice } from '../types';
import { AGE_GROUP_CONFIG, TEEN_LESSONS } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const startChatSession = (ageGroup: UserAgeGroup): Chat => {
  const config = AGE_GROUP_CONFIG[ageGroup];
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: config.systemInstruction,
    },
  });
  return chat;
};

export const streamChatResponse = async (chat: Chat, message: string): Promise<GenerateContentStreamResult> => {
  return chat.sendMessageStream({ message });
};

export interface LoanPredictionData {
  age: number;
  income: number;
  expenses: number;
  loanAmount: number;
  creditScore: number;
}

export const getLoanPrediction = async (data: LoanPredictionData): Promise<string> => {
    const prompt = `Act as a loan eligibility prediction model. Based on the following financial data, determine if the user is likely to be approved for a loan.

    Data:
    - Age: ${data.age}
    - Monthly Income: ₹${data.income}
    - Monthly Expenses: ₹${data.expenses}
    - Loan Amount: ₹${data.loanAmount}
    - Credit Score: ${data.creditScore}

    Return a JSON object with the following structure:
    {
      "eligibility": "string (Eligible or Not Eligible)",
      "confidenceScore": "number (0-100)",
      "explanation": "string (A brief explanation of the decision, max 50 words)",
      "monthlyPayment": "number (Estimated monthly payment)",
      "maxLoanAmount": "number (Suggested maximum loan amount)"
    }`;

  try {
     const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
                eligibility: { type: Type.STRING },
                confidenceScore: { type: Type.NUMBER },
                explanation: { type: Type.STRING },
                monthlyPayment: { type: Type.NUMBER },
                maxLoanAmount: { type: Type.NUMBER },
            }
          }
        },
      });

      return response.text;
  } catch(e) {
      console.error(e);
      return JSON.stringify({ error: "Failed to get prediction from AI model." });
  }
};

export const getHealthcarePrediction = async (age: number): Promise<string> => {
  const prompt = `Act as a healthcare cost prediction model for a senior citizen. Based on the user's age, provide an estimated annual healthcare budget.

    Data:
    - Age: ${age}

    Return a JSON object with the following structure:
    {
      "predictedAnnualCost": "number (A reasonable estimate for annual healthcare costs)",
      "costBreakdown": {
        "premiums": "number (Estimated annual insurance premiums)",
        "medication": "number (Estimated annual medication costs)",
        "outOfPocket": "number (Estimated annual out-of-pocket expenses like co-pays, deductibles)"
      },
      "suggestion": "string (A brief, helpful tip for managing healthcare costs in retirement, max 40 words)"
    }`;

  try {
     const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
                predictedAnnualCost: { type: Type.NUMBER },
                costBreakdown: {
                    type: Type.OBJECT,
                    properties: {
                        premiums: { type: Type.NUMBER },
                        medication: { type: Type.NUMBER },
                        outOfPocket: { type: Type.NUMBER },
                    },
                    required: ['premiums', 'medication', 'outOfPocket']
                },
                suggestion: { type: Type.STRING },
            }
          }
        },
      });

      return response.text;
  } catch(e) {
      console.error(e);
      return JSON.stringify({ error: "Failed to get healthcare prediction from AI model." });
  }
};

export const getGoalPrediction = async (goal: FinancialGoal): Promise<string> => {
  const prompt = `Act as a financial analyst. A user wants to achieve a financial goal.
  
  User's Goal Data:
  - Goal Name: ${goal.name}
  - Target Amount: ₹${goal.targetAmount}
  - Current Amount Saved: ₹${goal.currentAmount}
  - Planned Monthly Contribution: ₹${goal.monthlyContribution}
  - Target Deadline: ${goal.deadline}
  
  Your Task:
  1. Calculate the remaining amount to be saved.
  2. Calculate the number of months required to reach the goal with the current monthly contribution.
  3. Predict the completion date in "YYYY-MM" format.
  4. Compare the predicted completion date with the user's deadline to determine the likelihood of success (a percentage from 0 to 100). If the predicted date is on or before the deadline, likelihood should be high (90-100%). If it's slightly after, it should be moderate. If it's far off, it should be low.
  5. Provide 2-3 concise, actionable suggestions to help them achieve their goal faster, especially if the likelihood is low.
  
  Return a JSON object with the following structure:
  {
    "likelihood": "number (0-100)",
    "predictedDate": "string (in 'YYYY-MM' format)",
    "suggestions": ["string", "string"]
  }`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            likelihood: { type: Type.NUMBER },
            predictedDate: { type: Type.STRING },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
          },
          required: ['likelihood', 'predictedDate', 'suggestions'],
        }
      },
    });
    return response.text;
  } catch (e) {
    console.error(e);
    return JSON.stringify({ error: "Failed to get goal prediction from AI model." });
  }
};


export const categorizeTransaction = async (description: string): Promise<string> => {
    const categories = ['Food & Drinks', 'Shopping', 'Transport', 'Bills', 'Entertainment', 'Health', 'Other'];
    const prompt = `Categorize the following expense description into one of these categories: ${categories.join(', ')}.
    
    Expense: "${description}"
    
    Return a JSON object with a single key "category". The value should be one of the provided categories.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        category: { type: Type.STRING },
                    },
                    required: ['category'],
                }
            },
        });

        const result = JSON.parse(response.text);
        if (categories.includes(result.category)) {
            return result.category;
        }
        return 'Other';
    } catch (e) {
        console.error(e);
        return 'Other';
    }
};

export const getSpendingTrendSummary = async (transactions: Transaction[]): Promise<string> => {
  const prompt = `Act as a financial analyst. Analyze the following list of transactions from the past month.
  Compare the total spending of the most recent 7 days to the 7 days prior to that.
  Identify the most significant trend (e.g., a notable increase or decrease in a specific category).
  
  Transactions:
  ${JSON.stringify(transactions.map(t => ({ date: t.date, category: t.category, amount: t.amount })))}
  
  Return a JSON object with a single key "summary" containing a one-sentence, easy-to-understand summary of this trend.
  Example: "Your spending on Food & Drinks increased by 15% this week, while your Entertainment costs went down."`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
          },
          required: ['summary'],
        }
      },
    });
    return response.text;
  } catch (e) {
    console.error(e);
    return JSON.stringify({ error: "Failed to get spending trend summary from AI model." });
  }
};


export const generateQuiz = async (topic: string): Promise<string> => {
    const prompt = `Create one multiple-choice quiz question about the basics of ${topic}.
    The question should be suitable for a teenager.
    Provide 4 answer options.
    
    Return a JSON object with the following structure:
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "answer": "string" 
    }
    The 'answer' must be one of the strings from the 'options' array.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        question: { type: Type.STRING },
                        options: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        answer: { type: Type.STRING },
                    },
                    required: ['question', 'options', 'answer'],
                }
            },
        });
        return response.text;
    } catch (e) {
        console.error(e);
        return JSON.stringify({ error: "Failed to generate quiz from AI model." });
    }
};

export const generateMultiQuestionQuiz = async (topic: string): Promise<string> => {
    const prompt = `Create a 3-question multiple-choice quiz about the basics of ${topic} for teenagers.
    For each question, provide 4 answer options. The 'answer' must be one of the strings from the 'options' array.
    Return a JSON object with a single key "quiz" which is an array of question objects.
    
    The structure for each question object should be:
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "answer": "string" 
    }`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                       quiz: {
                           type: Type.ARRAY,
                           items: {
                               type: Type.OBJECT,
                               properties: {
                                   question: { type: Type.STRING },
                                   options: {
                                       type: Type.ARRAY,
                                       items: { type: Type.STRING }
                                   },
                                   answer: { type: Type.STRING },
                               },
                               required: ['question', 'options', 'answer']
                           }
                       }
                    },
                    required: ['quiz'],
                }
            },
        });
        return response.text;
    } catch (e) {
        console.error(e);
        return JSON.stringify({ error: "Failed to generate quiz from AI model." });
    }
};

export const getCreditScoreTips = async (score: number): Promise<string> => {
    const prompt = `Act as a credit advisor. A young adult has a credit score of ${score}. 
    Provide 3 concise, actionable tips to improve or maintain this score.
    
    Return a JSON object with a single key "tips" which is an array of strings.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        tips: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                    },
                    required: ['tips'],
                }
            },
        });
        return response.text;
    } catch (e) {
        console.error(e);
        return JSON.stringify({ error: "Failed to get credit score tips from AI model." });
    }
};

export const getStudentLoanAdvice = async (amount: number, interestRate: number): Promise<string> => {
    const prompt = `Act as a student loan advisor for a young adult.
    Loan details:
    - Amount: ₹${amount}
    - Interest Rate: ${interestRate}%
    
    Your Task:
    1. Calculate the estimated monthly payment for a standard 10-year repayment plan. The formula for monthly payment M is P [ i(1 + i)^n ] / [ (1 + i)^n – 1 ], where P is the principal loan amount, i is the monthly interest rate (annual rate / 12), and n is the number of payments (120 for 10 years).
    2. Provide a brief, one-sentence summary of the loan's impact.
    3. Provide 2 key tips for managing student loans effectively.
    
    Return a JSON object with the following structure:
    {
      "monthlyPayment": "number (the calculated monthly payment, rounded to 2 decimal places)",
      "summary": "string (one-sentence summary)",
      "tips": ["string", "string"]
    }`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        monthlyPayment: { type: Type.NUMBER },
                        summary: { type: Type.STRING },
                        tips: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                    },
                    required: ['monthlyPayment', 'summary', 'tips'],
                }
            },
        });
        return response.text;
    } catch (e) {
        console.error(e);
        return JSON.stringify({ error: "Failed to get student loan advice from AI model." });
    }
};

export const getFraudTip = async (): Promise<string> => {
    const prompt = `Act as a fraud prevention expert for senior citizens.
    Provide one concise, actionable, and easy-to-understand tip to help them avoid common financial scams.
    The tip should be no longer than two sentences.

    Return a JSON object with a single key "tip".`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        tip: { type: Type.STRING },
                    },
                    required: ['tip'],
                }
            },
        });
        return response.text;
    } catch (e) {
        console.error(e);
        return JSON.stringify({ error: "Failed to get fraud tip from AI model." });
    }
};

export const getLessonRecommendation = async (completedLessonIds: string[]): Promise<string> => {
    const availableLessons = TEEN_LESSONS.filter(lesson => !completedLessonIds.includes(lesson.id))
        .map(l => ({ id: l.id, title: l.title }));

    if (availableLessons.length === 0) {
        return JSON.stringify({
            recommendedLessonId: '',
            reason: "You've completed all the lessons! Great job!"
        });
    }

    const prompt = `A teenager has completed lessons with these IDs: [${completedLessonIds.join(', ')}].
    From the following list of available lessons, which one should they take next?
    Available Lessons: ${JSON.stringify(availableLessons)}
    
    Return a JSON object with two keys:
    1. "recommendedLessonId": The ID of the single best lesson to take next.
    2. "reason": A short, encouraging, one-sentence reason why this lesson is a good next step.`;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        recommendedLessonId: { type: Type.STRING },
                        reason: { type: Type.STRING },
                    },
                    required: ['recommendedLessonId', 'reason'],
                }
            },
        });
        return response.text;
    } catch (e) {
        console.error(e);
        return JSON.stringify({ error: "Failed to get lesson recommendation." });
    }
};

export const getFinancialFact = async (): Promise<string> => {
    const prompt = `Provide one fun, interesting, and easy-to-understand financial fact suitable for a teenager.
    Keep it concise (1-2 sentences).
    
    Return a JSON object with a single key "fact".`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        fact: { type: Type.STRING },
                    },
                    required: ['fact'],
                }
            },
        });
        return response.text;
    } catch (e) {
        console.error(e);
        return JSON.stringify({ error: "Failed to get financial fact." });
    }
};

export const getRetirementPrediction = async (age: number, currentSavings: number, monthlyContribution: number): Promise<string> => {
  const prompt = `Act as a retirement planner. A user wants to understand their retirement readiness.
  
  User Data:
  - Current Age: ${age}
  - Current Retirement Savings: ₹${currentSavings}
  - Monthly Contribution: ₹${monthlyContribution}
  
  Assumptions for Calculation:
  - Retirement Age: 65
  - Annual Investment Return Rate: 7% (compounded annually)
  
  Your Task:
  1. Calculate the number of years until retirement.
  2. Calculate the future value of the current savings.
  3. Calculate the future value of the future monthly contributions (as an annuity).
  4. Sum these two values to get the total predicted retirement corpus.
  5. Calculate a "Retirement Readiness Score" (0-100). A score of 80+ is good, assuming a target corpus of ₹2 crore. The score should scale logically (e.g., ₹1 crore corpus is ~40-50 score, ₹2 crore is ~80, ₹3 crore is ~95).
  6. Provide 2 concise, actionable suggestions to improve their retirement outlook.
  
  Return a JSON object with the following structure:
  {
    "readinessScore": "number (0-100)",
    "predictedCorpus": "number (the total predicted corpus at age 65)",
    "suggestions": ["string", "string"]
  }`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            readinessScore: { type: Type.NUMBER },
            predictedCorpus: { type: Type.NUMBER },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['readinessScore', 'predictedCorpus', 'suggestions'],
        }
      },
    });
    return response.text;
  } catch (e) {
    console.error(e);
    return JSON.stringify({ error: "Failed to get retirement prediction." });
  }
};

export const getInsuranceAdvice = async (profile: { hasFamily: boolean; ownsHome: boolean }): Promise<string> => {
  const prompt = `Act as an insurance advisor. Based on the user's profile, recommend essential insurance types.
  
  User Profile:
  - Has a family: ${profile.hasFamily}
  - Owns a home: ${profile.ownsHome}
  
  Your Task:
  - Always recommend Health Insurance.
  - Recommend Term Life Insurance if they have a family.
  - Recommend Homeowners Insurance if they own a home.
  - For each recommendation, provide a brief, one-sentence reason.
  
  Return a JSON object with a single key "recommendations", which is an array of objects.
  Each object should have "type" (e.g., "Health Insurance") and "reason".
  
  Example structure:
  {
    "recommendations": [
      { "type": "Health Insurance", "reason": "Covers medical expenses and protects your savings." },
      { "type": "Term Life Insurance", "reason": "Provides financial security for your family in your absence." }
    ]
  }`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  reason: { type: Type.STRING },
                },
                required: ['type', 'reason'],
              },
            },
          },
          required: ['recommendations'],
        }
      },
    });
    return response.text;
  } catch (e) {
    console.error(e);
    return JSON.stringify({ error: "Failed to get insurance advice." });
  }
};

export const getPortfolioAdvice = async (portfolio: { name: string, value: number }[]): Promise<string> => {
    const prompt = `Act as an investment advisor. Analyze the user's investment portfolio allocation.
    
    Portfolio:
    ${JSON.stringify(portfolio)}
    
    Your Task:
    - Analyze the allocation between different asset classes (e.g., Stocks, Bonds, Real Estate).
    - Provide 2 concise, actionable suggestions for rebalancing or diversification.
    - Keep suggestions general and educational, not specific financial advice.
    
    Return a JSON object with a single key "suggestions", which is an array of strings.`;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        suggestions: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                    },
                    required: ['suggestions'],
                }
            },
        });
        return response.text;
    } catch (e) {
        console.error(e);
        return JSON.stringify({ error: "Failed to get portfolio advice." });
    }
};

export const getWithdrawalPrediction = async (corpus: number, monthlyWithdrawal: number, age: number): Promise<string> => {
    const prompt = `Act as a retirement fund sustainability calculator for a senior citizen.
    
    User Data:
    - Total Retirement Corpus: ₹${corpus}
    - Desired Monthly Withdrawal: ₹${monthlyWithdrawal}
    - Current Age: ${age}
    
    Assumptions:
    - Annual return on investment for the corpus: 5%
    
    Your Task:
    1. Calculate the annual withdrawal amount.
    2. Determine if the annual withdrawal is sustainable (i.e., less than or equal to the annual return).
    3. If not sustainable, calculate the age at which the funds will be depleted.
    4. Provide one concise suggestion for making the funds last longer.
    
    Return a JSON object with the following structure:
    {
      "isSustainable": "boolean",
      "fundsDepleteAge": "number (The age at which funds will be depleted. Return 999 if sustainable.)",
      "suggestion": "string"
    }`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        isSustainable: { type: Type.BOOLEAN },
                        fundsDepleteAge: { type: Type.NUMBER },
                        suggestion: { type: Type.STRING },
                    },
                    required: ['isSustainable', 'fundsDepleteAge', 'suggestion'],
                }
            },
        });
        return response.text;
    } catch (e) {
        console.error(e);
        return JSON.stringify({ error: "Failed to get withdrawal prediction." });
    }
};

export const getFinancialHealthScore = async (data: { income: number; savings: number; expenses: number; }): Promise<string> => {
    const prompt = `Act as a financial health analyst. Based on the user's monthly financial data, calculate a Financial Health Score and provide feedback.
    
    User Data:
    - Monthly Income: ₹${data.income}
    - Total Savings/Investments: ₹${data.savings}
    - Monthly Expenses: ₹${data.expenses}
    
    Your Task:
    1. Calculate a Financial Health Score (0-100). The score should be based on:
        - Savings Rate ((Income - Expenses) / Income). A rate > 20% is excellent.
        - Savings to Income Ratio (Total Savings / (Income * 12)). A ratio > 1 is good.
    2. Provide a brief, one-sentence summary of their financial health.
    3. Provide one key, actionable suggestion for improvement.
    
    Return a JSON object: { "score": number, "summary": "string", "suggestions": ["string"] }`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: { type: Type.NUMBER },
                        summary: { type: Type.STRING },
                        suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ['score', 'summary', 'suggestions'],
                }
            },
        });
        return response.text;
    } catch (e) {
        console.error(e);
        return JSON.stringify({ error: "Failed to get financial health score." });
    }
};

export const getTaxEstimation = async (income: number, deductions: number): Promise<string> => {
    const prompt = `Act as a tax calculator. Estimate the income tax for a user based on Indian tax slabs (New Regime).
    
    User Data:
    - Annual Income: ₹${income}
    - Annual Deductions: ₹${deductions} (Note: most deductions are not allowed in the new regime, but consider standard deduction).
    
    Your Task:
    1. Calculate the taxable income. Assume a standard deduction of ₹50,000 if applicable.
    2. Apply the new tax regime slabs to calculate the total tax.
    3. Calculate the effective tax rate.
    4. Provide one tip for tax saving.
    
    Return a JSON object: { "estimatedTax": number, "effectiveTaxRate": number, "breakdown": { "incomeTax": number, "surcharge": number }, "tips": ["string"] }`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        estimatedTax: { type: Type.NUMBER },
                        effectiveTaxRate: { type: Type.NUMBER },
                        breakdown: {
                            type: Type.OBJECT,
                            properties: {
                                incomeTax: { type: Type.NUMBER },
                                surcharge: { type: Type.NUMBER },
                            },
                            required: ['incomeTax', 'surcharge'],
                        },
                        tips: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ['estimatedTax', 'effectiveTaxRate', 'breakdown', 'tips'],
                }
            },
        });
        return response.text;
    } catch (e) {
        console.error(e);
        return JSON.stringify({ error: "Failed to get tax estimation." });
    }
};

export const getBudgetOptimizationAdvice = async (transactions: Transaction[]): Promise<string> => {
    const prompt = `Act as a budget optimization AI. Analyze the list of transactions.
    
    Transactions:
    ${JSON.stringify(transactions)}
    
    Your Task:
    1. Calculate total spending.
    2. Identify the top spending category.
    3. Suggest a new savings ratio (as a percentage) assuming an income of ₹50,000.
    4. Provide one concise piece of advice to reduce spending in the highest category.
    
    Return a JSON object: { "suggestedSavingsRatio": number, "advice": "string" }`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        suggestedSavingsRatio: { type: Type.NUMBER },
                        advice: { type: Type.STRING },
                    },
                    required: ['suggestedSavingsRatio', 'advice'],
                }
            },
        });
        return response.text;
    } catch (e) {
        console.error(e);
        return JSON.stringify({ error: "Failed to get budget advice." });
    }
};

export const getBudgetingAdvice = async (breakdown: { Needs: number, Wants: number, Savings: number }): Promise<string> => {
    const prompt = `Act as a financial advisor for a young adult using the 50/30/20 rule (50% Needs, 30% Wants, 20% Savings).
    
    User's Current Spending Breakdown:
    - Needs: ₹${breakdown.Needs}
    - Wants: ₹${breakdown.Wants}
    - Savings: ₹${breakdown.Savings}
    
    Your Task:
    - Analyze their spending against the 50/30/20 rule.
    - Provide one single, actionable piece of advice to help them better align with the rule. The advice should be concise and encouraging.
    
    Return a JSON object with a single key "advice".`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        advice: { type: Type.STRING },
                    },
                    required: ['advice'],
                }
            },
        });
        return response.text;
    } catch (e) {
        console.error(e);
        return JSON.stringify({ error: "Failed to get budgeting advice." });
    }
};