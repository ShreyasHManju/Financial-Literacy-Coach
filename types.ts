// FIX: Add missing React import for React.ReactNode type.
import React from 'react';

export type UserAgeGroup = 'Teen' | 'YoungAdult' | 'Adult' | 'Senior';

export type Page = 'Dashboard' | 'LoanPredictor' | 'Chatbot' | 'GamifiedLesson' | 'Quizzes';

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  isStreaming?: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string; // ISO date string
  status?: 'pending' | 'confirmed';
}

export interface HealthcarePrediction {
  predictedAnnualCost: number;
  costBreakdown: {
    premiums: number;
    medication: number;
    outOfPocket: number;
  };
  suggestion: string;
}

export interface FinancialGoal {
    name: string;
    targetAmount: number;
    currentAmount: number;
    monthlyContribution: number;
    deadline: string;
}

export interface GoalPrediction {
    likelihood: number; // 0 to 100
    predictedDate: string; // "YYYY-MM"
    suggestions: string[];
}

export interface Lesson {
    id: string;
    title: string;
    content: string[];
    badgeToAward: string;
    quizTopic: string;
}

export interface QuizQuestion {
    question: string;
    options: string[];
    answer: string;
}

export type MultiQuiz = QuizQuestion[];

export interface CreditScoreTips {
    tips: string[];
}

export interface StudentLoanAdvice {
    monthlyPayment: number;
    summary: string;
    tips: string[];
}

export interface SpendingTrendSummary {
    summary: string;
}

export interface FraudTip {
    tip: string;
}

export interface LessonRecommendation {
    recommendedLessonId: string;
    reason: string;
}

export interface FinancialFact {
    fact: string;
}

export interface RetirementPrediction {
    readinessScore: number; // 0-100
    predictedCorpus: number;
    suggestions: string[];
}

export interface InsuranceAdvice {
    recommendations: {
        type: string;
        reason: string;
    }[];
}

export interface PortfolioAdvice {
    suggestions: string[];
}

export interface WithdrawalPrediction {
    isSustainable: boolean;
    fundsDepleteAge: number;
    suggestion: string;
}

export interface FinancialHealthScore {
    score: number;
    summary: string;
    suggestions: string[];
}

export interface TaxEstimation {
    estimatedTax: number;
    effectiveTaxRate: number;
    breakdown: {
        incomeTax: number;
        surcharge: number;
    };
    tips: string[];
}

export interface BudgetOptimization {
    suggestedSavingsRatio: number;
    advice: string;
}

export interface BudgetingAdvice {
    advice: string;
}