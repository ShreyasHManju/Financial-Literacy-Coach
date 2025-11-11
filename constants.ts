import React from 'react';
import { UserAgeGroup, Page, Badge, Lesson } from './types';
import { RupeeIcon, BookOpenIcon, TrophyIcon, ShieldIcon, ClipboardCheckIcon, TrendingUpIcon, TargetIcon, BanknoteIcon, BriefcaseIcon, UsersIcon, UmbrellaIcon, CalculatorIcon, GaugeIcon, PercentIcon } from './components/icons';

interface AgeGroupConfig {
  title: string;
  range: string;
  emoji: string;
  tools: { name: string; icon: React.ReactNode; page: Page }[];
  systemInstruction: string;
}

// FIX: Replace JSX syntax with React.createElement to be compatible with .ts files.
// Using JSX in .ts files causes parsing errors, so React.createElement is used instead.
export const ALL_BADGES: Record<string, Badge> = {
  budget_master: {
    id: 'budget_master',
    name: 'Budget Master',
    description: 'Completed the first budgeting lesson.',
    icon: React.createElement(TrophyIcon, { className: "w-8 h-8 text-amber-400" }),
  },
  saving_pro: {
    id: 'saving_pro',
    name: 'Saving Pro',
    description: 'Completed the lesson on Saving vs. Investing.',
    icon: React.createElement(TrendingUpIcon, { className: "w-8 h-8 text-lime-400" }),
  },
  smart_spender: {
    id: 'smart_spender',
    name: 'Smart Spender',
    description: 'Completed the lesson on Needs vs. Wants.',
    icon: React.createElement(BanknoteIcon, { className: "w-8 h-8 text-emerald-400" }),
  },
  interest_genius: {
    id: 'interest_genius',
    name: 'Interest Genius',
    description: 'Completed the lesson on Compound Interest.',
    icon: React.createElement(TrendingUpIcon, { className: "w-8 h-8 text-sky-400" }),
  },
  goal_getter: {
    id: 'goal_getter',
    name: 'Goal Getter',
    description: 'Completed the lesson on setting SMART goals.',
    icon: React.createElement(TargetIcon, { className: "w-8 h-8 text-rose-400" }),
  },
  paycheck_pro: {
    id: 'paycheck_pro',
    name: 'Paycheck Pro',
    description: 'Completed the lesson on understanding your first paycheck.',
    icon: React.createElement(BriefcaseIcon, { className: "w-8 h-8 text-orange-400" }),
  },
  credit_builder: {
    id: 'credit_builder',
    name: 'Credit Builder',
    description: 'Used the credit score simulator to learn about improving your score.',
    icon: React.createElement(ShieldIcon, { className: "w-8 h-8 text-blue-400" }),
  },
  loan_savvy: {
    id: 'loan_savvy',
    name: 'Loan Savvy',
    description: 'Used the AI Loan Predictor for the first time.',
    icon: React.createElement(TrophyIcon, { className: "w-8 h-8 text-cyan-400" }),
  },
  investment_initiate: {
    id: 'investment_initiate',
    name: 'Investment Initiate',
    description: 'Explored the investment portfolio to start your journey.',
    icon: React.createElement(ShieldIcon, { className: "w-8 h-8 text-purple-400" }),
  },
  retirement_ready: {
    id: 'retirement_ready',
    name: 'Retirement Ready',
    description: 'Reviewed the retirement and pension planner.',
    icon: React.createElement(TrophyIcon, { className: "w-8 h-8 text-orange-400" }),
  },
  quiz_whiz: {
    id: 'quiz_whiz',
    name: 'Quiz Whiz',
    description: 'Scored high on a financial literacy quiz.',
    icon: React.createElement(TrophyIcon, { className: "w-8 h-8 text-indigo-400" }),
  },
  family_budget_planner: {
    id: 'family_budget_planner',
    name: 'Family Planner',
    description: 'Used the Family Budgeting tool to add a shared expense.',
    icon: React.createElement(UsersIcon, { className: "w-8 h-8 text-teal-400" }),
  },
  withdrawal_planner_user: {
    id: 'withdrawal_planner_user',
    name: 'Withdrawal Planner',
    description: 'Used the AI Retirement Withdrawal Planner.',
    icon: React.createElement(CalculatorIcon, { className: "w-8 h-8 text-rose-400" }),
  },
  health_score_checker: {
    id: 'health_score_checker',
    name: 'Health Checker',
    description: 'Used the AI Financial Health Score tool.',
    icon: React.createElement(GaugeIcon, { className: "w-8 h-8 text-lime-400" }),
  },
  tax_savvy: {
    id: 'tax_savvy',
    name: 'Tax Savvy',
    description: 'Used the AI Tax Estimator.',
    icon: React.createElement(PercentIcon, { className: "w-8 h-8 text-indigo-400" }),
  },
  budget_optimizer: {
    id: 'budget_optimizer',
    name: 'Budget Optimizer',
    description: 'Used the AI Budget Optimizer.',
    icon: React.createElement(TrophyIcon, { className: "w-8 h-8 text-emerald-400" }),
  },
};

export const TEEN_LESSONS: Lesson[] = [
    {
        id: 'budgeting_101',
        title: 'Lesson 1: Budgeting Basics',
        badgeToAward: 'budget_master',
        quizTopic: 'budgeting for teens',
        content: [
            "Welcome to your first lesson! Budgeting sounds complicated, but it's just a plan for your money. Think of it like a roadmap for your cash.",
            "The first step is knowing your income (money you get) and expenses (money you spend). Income could be allowance or from a part-time job. Expenses are things like snacks, games, or saving for something big.",
            "A popular rule is 50/30/20: 50% of your money for needs (like lunch money), 30% for wants (like movie tickets), and 20% for savings. This helps you balance fun and your future goals!",
            "Try using the 'Pocket Planner' below to see this in action. Add some things you'd typically buy and see how it affects your balance."
        ]
    },
    {
        id: 'saving_investing',
        title: 'Lesson 2: Saving vs. Investing',
        badgeToAward: 'saving_pro',
        quizTopic: 'saving and investing for teens',
        content: [
            "So you've started saving money - awesome! But did you know there's a difference between saving and investing?",
            "Saving is usually for short-term goals. You put money in a safe place (like a savings account) for things you want soon, like a new phone or a concert ticket. It's low-risk, but it doesn't grow much.",
            "Investing is for long-term goals, like college or a car. You use your money to buy things like stocks or bonds, which can grow in value over time. It has more risk, but also the potential for a much bigger reward thanks to 'compound interest' - where your money starts making its own money!",
            "A good strategy is to have both: a savings account for safety and short-term goals, and an investment plan for your future."
        ]
    },
    {
        id: 'needs_vs_wants',
        title: "Lesson 3: Needs vs. Wants",
        badgeToAward: 'smart_spender',
        quizTopic: "differentiating needs and wants",
        content: [
            "Ever feel like your money just disappears? Understanding the difference between 'needs' and 'wants' is the secret to taking control!",
            "A 'need' is something you absolutely must have to live, like food, water, a place to live, and basic clothes. Think survival stuff.",
            "A 'want' is everything else – the fun stuff! This includes things like the latest video game, designer sneakers, or going out for pizza with friends. You can live without them, but they make life more enjoyable.",
            "Smart budgeting isn't about cutting out all wants. It's about prioritizing your needs first, then planning for the wants you care about most. This stops you from accidentally spending your lunch money on a new game!"
        ]
    },
    {
        id: 'compound_interest',
        title: "Lesson 4: The Power of Compound Interest",
        badgeToAward: 'interest_genius',
        quizTopic: "compound interest",
        content: [
            "Want to know the secret to making your money grow all by itself? It's a magical thing called compound interest. Albert Einstein called it the eighth wonder of the world!",
            "Here's how it works: You save or invest money, and you earn interest on it. Simple, right? But with *compound* interest, you then start earning interest on your original money PLUS the interest you've already earned.",
            "It creates a snowball effect. Your money starts making its own money, which then makes even more money. The earlier you start, even with a small amount, the bigger your snowball can get over time.",
            "This is why investing, even just a little from a part-time job, is so powerful for long-term goals like buying a car or for college."
        ]
    },
    {
        id: 'smart_goals',
        title: "Lesson 5: Setting SMART Financial Goals",
        badgeToAward: 'goal_getter',
        quizTopic: "setting SMART financial goals",
        content: [
            "Saying 'I want to save money' is great, but it's too vague. To actually succeed, you need SMART goals!",
            "S - Specific: What exactly are you saving for? (e.g., 'A new gaming console').",
            "M - Measurable: How much does it cost? (e.g., '₹50,000').",
            "A - Achievable: Is it realistic for you to save this amount? (e.g., 'Yes, if I save ₹5,000 a month').",
            "R - Relevant: Why is this goal important to you? (e.g., 'I want to play the new games with my friends').",
            "T - Time-bound: When do you want to achieve it? (e.g., 'In 10 months'). Now your goal is: 'I will save ₹5,000 a month to buy a ₹50,000 console in 10 months.' See how much clearer that is?"
        ]
    },
    {
        id: 'first_paycheck',
        title: "Lesson 6: Understanding Your First Paycheck",
        badgeToAward: 'paycheck_pro',
        quizTopic: "understanding a paycheck stub",
        content: [
            "Getting your first paycheck is an amazing feeling! But looking at the pay stub can be confusing. Let's break it down.",
            "'Gross Pay' is the total amount of money you earned before anything is taken out. If you worked 10 hours at ₹150/hour, your gross pay is ₹1,500.",
            "'Deductions' are the amounts taken out of your gross pay. This usually includes taxes (like Federal and State income tax) and FICA (for Social Security and Medicare).",
            "'Net Pay' (or 'take-home pay') is what's left after all deductions. This is the actual amount that gets deposited into your bank account. It's super important to base your budget on your net pay, not your gross pay!"
        ]
    }
];

// FIX: Replace JSX syntax with React.createElement to be compatible with .ts files.
// This resolves parsing errors and ensures object properties like 'page' are correctly identified.
export const AGE_GROUP_CONFIG: Record<UserAgeGroup, AgeGroupConfig> = {
  Teen: {
    title: 'Teen',
    range: '13-18 years',
    emoji: '👦',
    tools: [
       { name: 'Lessons', icon: React.createElement(BookOpenIcon, null), page: 'GamifiedLesson' },
       { name: 'Quizzes', icon: React.createElement(ClipboardCheckIcon, null), page: 'Quizzes' },
    ],
    systemInstruction: "You are a friendly, cool, and helpful financial coach for teenagers. Use simple language, emojis, and relatable examples (like saving for a video game or first car). Explain concepts like budgeting, saving, and needs vs. wants. Keep your answers concise and encouraging."
  },
  YoungAdult: {
    title: 'Young Adult',
    range: '18-25 years',
    emoji: '👨‍🎓',
    tools: [],
    systemInstruction: "You are a knowledgeable and supportive financial advisor for young adults. Focus on topics like building credit, managing student loans, creating a 50/30/20 budget, and starting to invest. Be clear, practical, and provide actionable steps."
  },
  Adult: {
    title: 'Adult',
    range: '25-60 years',
    emoji: '👨',
    tools: [],
    systemInstruction: "You are an expert financial planner for adults. Address more complex topics like mortgages, retirement savings (401k, IRA), investment strategies, and family financial planning. Provide detailed, data-driven advice and sophisticated explanations."
  },
  Senior: {
    title: 'Senior',
    range: '60+ years',
    emoji: '👵',
    tools: [],
    systemInstruction: "You are a patient and trustworthy financial guide for seniors. Focus on retirement income, pension planning, healthcare costs, and fraud prevention. Use clear, large-text-friendly language. Be empathetic and focus on security and peace of mind."
  },
};