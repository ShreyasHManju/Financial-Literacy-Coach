import React, { useState, useMemo, useEffect } from 'react';
import { UserAgeGroup, HealthcarePrediction, Transaction, FinancialGoal, GoalPrediction, CreditScoreTips, StudentLoanAdvice, SpendingTrendSummary, FraudTip, LessonRecommendation, FinancialFact, RetirementPrediction, InsuranceAdvice, PortfolioAdvice, WithdrawalPrediction, FinancialHealthScore, TaxEstimation, BudgetOptimization, BudgetingAdvice } from '../types';
import { AGE_GROUP_CONFIG, ALL_BADGES, TEEN_LESSONS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts';
import { getHealthcarePrediction, categorizeTransaction, getGoalPrediction, getCreditScoreTips, getStudentLoanAdvice, getSpendingTrendSummary, getFraudTip, getLessonRecommendation, getFinancialFact, getRetirementPrediction, getInsuranceAdvice, getPortfolioAdvice, getWithdrawalPrediction, getFinancialHealthScore, getTaxEstimation, getBudgetOptimizationAdvice, getLoanPrediction, getBudgetingAdvice } from '../services/geminiService';
import { PlusCircleIcon, LightbulbIcon, GraduationCapIcon, RefreshCwIcon, CheckCircleIcon, PencilIcon, XIcon, PiggyBankIcon, BanknoteIcon, SparklesIcon, TrophyIcon, UsersIcon, UmbrellaIcon, CalculatorIcon, GaugeIcon, PercentIcon, ShieldIcon, CoinIcon, TrendingUpIcon } from './icons';

interface DashboardProps {
  ageGroup: UserAgeGroup;
  earnedBadges: string[];
  awardBadge: (badgeId: string) => void;
}

const COLORS = ['#06b6d4', '#0891b2', '#0e7490', '#155e75', '#164e63', '#083344'];
const TRANSACTION_CATEGORIES = ['Food & Drinks', 'Shopping', 'Transport', 'Bills', 'Entertainment', 'Health', 'Other'];
const FAMILY_EXPENSE_CATEGORIES = ['Groceries', 'Utilities', 'Housing', 'Education', 'Healthcare', 'Other'];

const CustomTooltip: React.FC<any> = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0];
        return (
            <div className="bg-slate-900/80 backdrop-blur-sm p-3 rounded-lg border border-slate-700 shadow-lg">
                <p className="text-sm text-slate-300">{`${data.name}`}</p>
                <p className="text-lg font-bold text-cyan-400">{`₹${Number(data.value).toFixed(2)}`}</p>
            </div>
        );
    }
    return null;
};

const AchievementsSection: React.FC<{ earnedBadges: string[] }> = ({ earnedBadges }) => {
    if (earnedBadges.length === 0) {
      return (
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg text-center">
          <h3 className="text-lg font-semibold mb-2 text-white">Achievements</h3>
          <p className="text-slate-400">Complete lessons and goals to earn badges here!</p>
        </div>
      );
    }
  
    return (
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-white">Achievements</h3>
        <div className="flex flex-wrap gap-6">
          {earnedBadges.map(badgeId => {
            const badge = ALL_BADGES[badgeId];
            if (!badge) return null;
            return (
              <div key={badge.id} className="group relative flex flex-col items-center text-center w-20">
                {badge.icon}
                <p className="text-sm font-medium mt-1 text-slate-300">{badge.name}</p>
                <div className="absolute bottom-full mb-2 w-48 p-2 bg-slate-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                  {badge.description}
                  <svg className="absolute text-slate-900 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
};

interface AgeDashboardProps {
    awardBadge: (badgeId: string) => void;
    earnedBadges: string[];
}

const FinancialGoalPlanner: React.FC<{ accentColor?: string, buttonColor?: string }> = ({ accentColor = 'cyan', buttonColor = 'indigo' }) => {
    const [goal, setGoal] = useState<FinancialGoal | null>(null);
    const [formData, setFormData] = useState({
        name: 'House Down Payment',
        targetAmount: '50000',
        currentAmount: '5000',
        monthlyContribution: '500',
        deadline: '2030-12-31',
    });
    const [prediction, setPrediction] = useState<GoalPrediction | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSetGoal = (e: React.FormEvent) => {
        e.preventDefault();
        setGoal({
            name: formData.name,
            targetAmount: parseFloat(formData.targetAmount),
            currentAmount: parseFloat(formData.currentAmount),
            monthlyContribution: parseFloat(formData.monthlyContribution),
            deadline: formData.deadline,
        });
        setPrediction(null);
    };

    const handleAnalyze = async () => {
        if (!goal) return;
        setIsLoading(true);
        setError(null);
        setPrediction(null);
        try {
            const response = await getGoalPrediction(goal);
            const parsed = JSON.parse(response);
            if(parsed.error) throw new Error(parsed.error);
            setPrediction(parsed);
        } catch (err) {
            setError('Failed to get prediction from AI.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    if (!goal) {
        return (
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold text-white mb-4">Set a Financial Goal</h3>
                <form onSubmit={handleSetGoal} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Goal Name" className={`bg-slate-700 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-${accentColor}-500`} />
                    <input name="targetAmount" type="number" value={formData.targetAmount} onChange={handleInputChange} placeholder="Target Amount (₹)" className={`bg-slate-700 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-${accentColor}-500`} />
                    <input name="currentAmount" type="number" value={formData.currentAmount} onChange={handleInputChange} placeholder="Current Amount (₹)" className={`bg-slate-700 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-${accentColor}-500`} />
                    <input name="monthlyContribution" type="number" value={formData.monthlyContribution} onChange={handleInputChange} placeholder="Monthly Contribution (₹)" className={`bg-slate-700 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-${accentColor}-500`} />
                    <div className="md:col-span-2">
                        <label className="text-sm text-slate-400">Deadline</label>
                        <input name="deadline" type="date" value={formData.deadline} onChange={handleInputChange} className={`w-full mt-1 bg-slate-700 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-${accentColor}-500`} />
                    </div>
                    <button type="submit" className={`md:col-span-2 bg-${accentColor}-600 hover:bg-${accentColor}-500 text-white font-bold py-2 px-4 rounded-lg transition`}>Set Goal</button>
                </form>
            </div>
        );
    }

    const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);

    return (
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg space-y-4">
            <div>
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">{goal.name}</h3>
                    <button onClick={() => setGoal(null)} className={`text-sm text-${accentColor}-400 hover:underline`}>Edit Goal</button>
                </div>
                <p className={`text-3xl font-bold text-${accentColor}-400`}>₹{goal.currentAmount.toLocaleString()} / <span className="text-white">₹{goal.targetAmount.toLocaleString()}</span></p>
                <div className="w-full bg-slate-700 rounded-full h-4 mt-2">
                    <div className={`bg-gradient-to-r from-${accentColor}-500 to-teal-400 h-4 rounded-full`} style={{ width: `${progress}%` }}></div>
                </div>
            </div>
            
            {!prediction && !isLoading && (
                 <button onClick={handleAnalyze} className={`w-full bg-${buttonColor}-600 hover:bg-${buttonColor}-500 text-white font-bold py-2 px-4 rounded-lg transition`}>Analyze My Goal</button>
            )}

            {isLoading && <p className="text-center text-slate-400">AI is analyzing your goal...</p>}
            {error && <p className="text-center text-red-400">{error}</p>}
            
            {prediction && (
                <div className="bg-slate-900/50 p-4 rounded-lg space-y-4 animate-fade-in">
                    <h4 className="text-md font-semibold text-white">AI Analysis</h4>
                    <div className="text-center">
                        <p className="text-slate-400">Likelihood of Success</p>
                        <p className={`text-4xl font-bold text-${accentColor}-400`}>{prediction.likelihood}%</p>
                    </div>
                    <p className="text-sm text-center text-slate-300">Predicted Completion: <span className="font-semibold">{prediction.predictedDate}</span></p>
                    <div>
                         <h5 className="flex items-center text-sm font-semibold text-slate-300 mb-2"><LightbulbIcon className="w-5 h-5 mr-2 text-amber-400" /> AI Suggestions</h5>
                         <ul className="list-disc list-inside space-y-1 text-sm text-slate-400">
                             {prediction.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                         </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

const TeenPocketMoneyTracker: React.FC = () => {
    const [balance, setBalance] = useState(500); // Starting balance
    const [transactions, setTransactions] = useState<{id: number, desc: string, amount: number}[]>([
        {id: 1, desc: "Weekly Allowance", amount: 500},
    ]);
    const [form, setForm] = useState({desc: '', amount: '', type: 'expense'});

    const handleAddTransaction = (e: React.FormEvent) => {
        e.preventDefault();
        const amount = parseFloat(form.amount);
        if (!form.desc || !amount || amount <= 0) return;

        const finalAmount = form.type === 'expense' ? -amount : amount;

        if (form.type === 'expense' && amount > balance) {
            alert("Not enough funds!");
            return;
        }

        setTransactions(prev => [{id: Date.now(), desc: form.desc, amount: finalAmount}, ...prev]);
        setBalance(prev => prev + finalAmount);
        setForm({desc: '', amount: '', type: 'expense'});
    };

    return (
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg h-full flex flex-col">
            <h3 className="flex items-center text-xl font-semibold text-white mb-4">
                <PiggyBankIcon className="w-6 h-6 mr-2 text-lime-400" />
                Pocket Money Tracker
            </h3>
            <div className="text-center bg-slate-900 p-4 rounded-lg mb-4">
                <p className="text-slate-400 text-sm">Current Balance</p>
                <p className="text-4xl font-bold text-lime-400">₹{balance.toFixed(2)}</p>
            </div>
            <form onSubmit={handleAddTransaction} className="space-y-3">
                <div className="flex gap-2">
                    <input type="text" value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} placeholder="e.g., Movie tickets" className="w-full bg-slate-700 p-2 rounded-lg" required />
                    <input type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} placeholder="Amount" className="w-32 bg-slate-700 p-2 rounded-lg" required />
                </div>
                 <div className="flex gap-2">
                    <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full bg-slate-700 p-2 rounded-lg">
                        <option value="expense">Expense (-)</option>
                        <option value="income">Income (+)</option>
                    </select>
                    <button type="submit" className="flex items-center justify-center bg-sky-500 hover:bg-sky-400 text-white font-bold py-2 px-4 rounded-lg transition w-full">
                       <PlusCircleIcon className="w-5 h-5 mr-2" /> Add
                    </button>
                </div>
            </form>
            <div className="mt-4 flex-grow">
                <h4 className="text-md font-semibold mb-2 text-slate-300">History</h4>
                <ul className="space-y-2 max-h-32 overflow-y-auto pr-2">
                    {transactions.length === 0 && <p className="text-slate-500 text-sm">No transactions yet.</p>}
                    {transactions.map(t => (
                        <li key={t.id} className="flex justify-between items-center bg-slate-900/50 p-2 rounded-md text-sm">
                            <span className="text-slate-300">{t.desc}</span>
                            <span className={`font-semibold ${t.amount < 0 ? 'text-red-400' : 'text-green-400'}`}>
                                {t.amount < 0 ? '-' : '+'}₹{Math.abs(t.amount).toFixed(2)}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const TeenBudgetGame: React.FC = () => {
    const totalBudget = 5000;
    const categories = ['Fun', 'Food', 'Savings', 'Study'];
    const PIE_COLORS = ['#84cc16', '#38bdf8', '#a3e635', '#7dd3fc'];

    const [allocations, setAllocations] = useState<Record<string, number>>(
        Object.fromEntries(categories.map(cat => [cat, 0]))
    );

    // Calculate the sum of all allocations, ensuring values are numbers
    const allocated = Object.values(allocations).reduce((sum, val) => sum + (typeof val === 'number' ? val : 0), 0);
    const remaining = totalBudget - allocated;

    const handleAllocationChange = (category: string, value: string) => {
        const amount = Number(value);
        if (!isNaN(amount) && amount >= 0) {
            setAllocations(prev => ({...prev, [category]: amount}));
        }
    };
    
    const budgetData = Object.entries(allocations).map(([name, value]) => ({ name, value }));
    if(remaining > 0) {
        budgetData.push({name: 'Unallocated', value: remaining});
    }

    return (
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg h-full flex flex-col">
            <h3 className="flex items-center text-xl font-semibold text-white mb-4">
                <BanknoteIcon className="w-6 h-6 mr-2 text-lime-400" />
                My Monthly Budget
            </h3>
            <p className="text-sm text-slate-400 mb-4">You have <span className="font-bold text-white">₹{totalBudget}</span> to budget for the month. How would you spend it?</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                <div className="space-y-3">
                    {categories.map(cat => (
                         <div key={cat}>
                            <label className="text-sm text-slate-300">{cat}</label>
                            <input
                                type="number"
                                value={allocations[cat]}
                                onChange={(e) => handleAllocationChange(cat, e.target.value)}
                                className="w-full bg-slate-700 p-2 rounded-lg mt-1"
                            />
                        </div>
                    ))}
                </div>
                 <div>
                    <ResponsiveContainer width="100%" height={200}>
                         <PieChart>
                            <Pie data={budgetData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5}>
                                {budgetData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.name === 'Unallocated' ? '#475569' : PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="text-center mt-4">
                        <p className="text-slate-400 text-sm">Unallocated</p>
                        <p className={`text-2xl font-bold ${remaining < 0 ? 'text-red-500' : 'text-lime-400'}`}>
                            ₹{remaining.toFixed(2)}
                        </p>
                        {remaining < 0 && <p className="text-xs text-red-500">You've gone over budget!</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

const TeenFunFact: React.FC = () => {
    const [fact, setFact] = useState<FinancialFact | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchFact = async () => {
        setIsLoading(true);
        try {
            const res = await getFinancialFact();
            const parsed = JSON.parse(res);
            if(parsed.error) throw new Error(parsed.error);
            setFact(parsed);
        } catch (e) {
            console.error(e);
            setFact({ fact: "Could not load a fun fact. Try again!" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFact();
    }, []);

    return (
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center">
                <h3 className="flex items-center text-lg font-semibold text-white">
                     <LightbulbIcon className="w-6 h-6 mr-2 text-lime-400" />
                    AI Fun Fact!
                </h3>
                <button onClick={fetchFact} disabled={isLoading} className="p-2 rounded-full hover:bg-slate-700 transition disabled:opacity-50">
                    <RefreshCwIcon className={`w-5 h-5 text-slate-400 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>
             <p className="text-slate-300 mt-2 min-h-[40px]">
                {isLoading ? "Thinking of a cool fact..." : fact?.fact}
             </p>
        </div>
    );
};

const TeenLessonRecommender: React.FC<{ earnedBadges: string[]; awardBadge: (badgeId: string) => void }> = ({ earnedBadges, awardBadge }) => {
    const [recommendation, setRecommendation] = useState<LessonRecommendation | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const completedLessonIds = useMemo(() => {
        return TEEN_LESSONS
            .filter(lesson => earnedBadges.includes(lesson.badgeToAward))
            .map(lesson => lesson.id);
    }, [earnedBadges]);

    useEffect(() => {
        const fetchRecommendation = async () => {
            setIsLoading(true);
            try {
                const res = await getLessonRecommendation(completedLessonIds);
                const parsed = JSON.parse(res);
                if(parsed.error) throw new Error(parsed.error);
                setRecommendation(parsed);
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRecommendation();
    }, [completedLessonIds]);

    if (isLoading) {
        return <div className="bg-slate-800 p-6 rounded-xl shadow-lg"><p className="text-slate-400">Figuring out your next step...</p></div>
    }

    if (!recommendation || !recommendation.recommendedLessonId) {
        return (
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h3 className="flex items-center text-lg font-semibold text-white">
                    <TrophyIcon className="w-6 h-6 mr-2 text-amber-400" />
                    Awesome Job!
                </h3>
                <p className="text-slate-300 mt-2">You've completed all the available lessons. Keep up the great work!</p>
            </div>
        );
    }
    
    const recommendedLesson = TEEN_LESSONS.find(l => l.id === recommendation.recommendedLessonId);

    return (
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
            <h3 className="flex items-center text-lg font-semibold text-white">
                <SparklesIcon className="w-6 h-6 mr-2 text-sky-400" />
                AI Next Lesson
            </h3>
            <p className="text-slate-300 mt-2 italic">"{recommendation.reason}"</p>
            {recommendedLesson &&
              <button onClick={() => awardBadge(recommendedLesson.badgeToAward)} className="mt-4 bg-sky-500 hover:bg-sky-400 text-white font-bold py-2 px-4 rounded-lg transition">
                  Start Lesson: {recommendedLesson.title}
              </button>
            }
        </div>
    );
};

const TeenDashboard: React.FC<AgeDashboardProps> = ({ awardBadge, earnedBadges }) => {
    return (
        <div className="space-y-6">
            <AchievementsSection earnedBadges={earnedBadges} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2">
                    <FinancialGoalPlanner accentColor="sky" buttonColor="lime" />
                </div>
                 <TeenBudgetGame />
                 <TeenPocketMoneyTracker />
                 <TeenFunFact />
                 <TeenLessonRecommender earnedBadges={earnedBadges} awardBadge={awardBadge}/>
            </div>
        </div>
    );
};

const getCreditScoreInfo = (score: number): { text: string; color: string } => {
    if (score < 580) return { text: 'Poor', color: 'text-red-400' };
    if (score < 670) return { text: 'Fair', color: 'text-amber-400' };
    if (score < 740) return { text: 'Good', color: 'text-lime-400' };
    if (score < 800) return { text: 'Very Good', color: 'text-green-400' };
    return { text: 'Excellent', color: 'text-emerald-400' };
};

const EmbeddedLoanPredictor: React.FC<{ creditScore: number, awardBadge: (badgeId: string) => void }> = ({ creditScore, awardBadge }) => {
    const [loanData, setLoanData] = useState({ income: '50000', loanAmount: '200000', expenses: '20000', age: 25 });
    const [prediction, setPrediction] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handlePredict = async () => {
        setIsLoading(true);
        setPrediction(null);
        try {
            const fullData = { ...loanData, creditScore, income: Number(loanData.income), loanAmount: Number(loanData.loanAmount), expenses: Number(loanData.expenses), age: Number(loanData.age) };
            const res = await getLoanPrediction(fullData);
            const parsed = JSON.parse(res);
            if(parsed.error) throw new Error(parsed.error);
            setPrediction(parsed);
            awardBadge('loan_savvy');
        } catch(e) { console.error(e); }
        finally { setIsLoading(false); }
    };

    return (
         <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Loan Eligibility</h3>
            <input value={loanData.income} onChange={e => setLoanData({...loanData, income: e.target.value})} placeholder="Monthly Income" className="w-full bg-slate-700 p-2 rounded-lg mb-2" />
            <input value={loanData.loanAmount} onChange={e => setLoanData({...loanData, loanAmount: e.target.value})} placeholder="Loan Amount" className="w-full bg-slate-700 p-2 rounded-lg mb-4" />
            <button onClick={handlePredict} disabled={isLoading} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white font-bold py-2 px-4 rounded-lg transition">
                {isLoading ? 'Predicting...' : 'Predict'}
            </button>
             {prediction && (
                <div className={`mt-4 text-center p-2 rounded-lg ${prediction.eligibility === 'Eligible' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                    <p className="font-bold">{prediction.eligibility} (Confidence: {prediction.confidenceScore}%)</p>
                </div>
             )}
        </div>
    );
};

const BudgetAssistant: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
    const [advice, setAdvice] = useState<BudgetingAdvice | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const spendingBreakdown = useMemo(() => {
        const needsCategories = ['Bills', 'Transport', 'Health', 'Groceries'];
        const wantsCategories = ['Shopping', 'Entertainment', 'Food & Drinks'];
        
        const breakdown = { Needs: 0, Wants: 0, Savings: 0 }; // Savings not yet tracked
        transactions.forEach(t => {
            if (needsCategories.includes(t.category)) breakdown.Needs += t.amount;
            else if (wantsCategories.includes(t.category)) breakdown.Wants += t.amount;
            // 'Other' could be split or ignored for simplicity here
        });
        return breakdown;
    }, [transactions]);
    
    const pieData = Object.entries(spendingBreakdown).map(([name, value]) => ({ name, value }));
    // FIX: Explicitly cast entry value to a number to ensure type safety in reduce.
    const totalSpent = pieData.reduce((sum, entry) => sum + Number(entry.value), 0);

    const handleGetAdvice = async () => {
        if (totalSpent === 0) return;
        setIsLoading(true);
        setAdvice(null);
        try {
            const res = await getBudgetingAdvice(spendingBreakdown);
            const parsed = JSON.parse(res);
            if(parsed.error) throw new Error(parsed.error);
            setAdvice(parsed);
        } catch(e) { console.error(e); }
        finally { setIsLoading(false); }
    };

    return (
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-white">50/30/20 Budget Assistant</h3>
            <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5}>
                        {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={['#3b82f6', '#818cf8', '#a78bfa'][index % 3]} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
            <button onClick={handleGetAdvice} disabled={isLoading || totalSpent === 0} className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50">
                {isLoading ? 'Analyzing...' : 'Get AI Advice'}
            </button>
            {advice && (
                <div className="mt-4 p-3 bg-slate-900/50 rounded-lg animate-fade-in">
                    <p className="text-sm text-slate-300 italic">"{advice.advice}"</p>
                </div>
            )}
        </div>
    );
};

const YoungAdultDashboard: React.FC<AgeDashboardProps> = ({ awardBadge, earnedBadges }) => {
    // Expense Tracker State
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [newDesc, setNewDesc] = useState('');
    const [newAmount, setNewAmount] = useState('');
    const [trackerError, setTrackerError] = useState('');
    const [suggestedCategory, setSuggestedCategory] = useState<string | null>(null);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);

    // Credit Score State
    const [creditScore, setCreditScore] = useState(650);
    const [creditTips, setCreditTips] = useState<CreditScoreTips | null>(null);
    const [isFetchingCreditTips, setIsFetchingCreditTips] = useState(false);
    
    const creditScoreInfo = useMemo(() => getCreditScoreInfo(creditScore), [creditScore]);
    
    useEffect(() => {
        if (newDesc.trim().length < 3) {
            setSuggestedCategory(null);
            return;
        }
    
        setIsSuggesting(true);
        const handler = setTimeout(async () => {
            try {
                const category = await categorizeTransaction(newDesc);
                setSuggestedCategory(category);
            } catch (error) {
                console.error("Failed to suggest category:", error);
                setSuggestedCategory(null);
            } finally {
                setIsSuggesting(false);
            }
        }, 500); // 500ms debounce delay
    
        return () => {
            clearTimeout(handler);
        };
    }, [newDesc]);

    const handleAddTransaction = (e: React.FormEvent) => {
        e.preventDefault();
        const amount = parseFloat(newAmount);
        if (!newDesc || !amount || amount <= 0) {
            setTrackerError('Please enter a valid description and amount.');
            return;
        }
        setTrackerError('');
        
        const newTransaction: Transaction = {
            id: new Date().toISOString(),
            description: newDesc,
            amount: amount,
            category: suggestedCategory || 'Other',
            date: new Date().toISOString(),
            status: 'pending',
        };
        setTransactions(prev => [newTransaction, ...prev]);
        setNewDesc('');
        setNewAmount('');
        setSuggestedCategory(null);
    };

    const handleConfirmTransaction = (id: string) => {
        setTransactions(prev =>
            prev.map(t => (t.id === id ? { ...t, status: 'confirmed' } : t))
        );
    };

    const handleUpdateCategory = (id: string, newCategory: string) => {
        setTransactions(prev =>
            prev.map(t => (t.id === id ? { ...t, category: newCategory, status: 'confirmed' } : t))
        );
        setEditingTransactionId(null);
    };

    const handleGetCreditTips = async () => {
        setIsFetchingCreditTips(true);
        setCreditTips(null);
        try {
            const response = await getCreditScoreTips(creditScore);
            const parsed = JSON.parse(response);
            if (parsed.error) throw new Error(parsed.error);
            setCreditTips(parsed);
            awardBadge('credit_builder');
        } catch (e) {
            console.error(e);
        } finally {
            setIsFetchingCreditTips(false);
        }
    };
    
    return (
         <div className="space-y-6">
            <AchievementsSection earnedBadges={earnedBadges} />

             <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 space-y-6">
                    <FinancialGoalPlanner accentColor="purple" buttonColor="indigo" />
                </div>
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                        <h3 className="text-lg font-semibold mb-2 text-white">Credit Score Coach</h3>
                        <div className="grid grid-cols-2 gap-4 items-center">
                            <div>
                                <div className={`text-5xl font-bold transition-colors duration-300 ${creditScoreInfo.color}`}>{creditScore}</div>
                                <p className={`font-semibold mt-1 transition-colors duration-300 ${creditScoreInfo.color}`}>{creditScoreInfo.text}</p>
                            </div>
                            <div>
                                <input type="range" min="300" max="850" value={creditScore} onChange={(e) => setCreditScore(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                                <button onClick={handleGetCreditTips} disabled={isFetchingCreditTips} className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50">
                                    {isFetchingCreditTips ? '...' : 'Get AI Tips'}
                                </button>
                            </div>
                        </div>
                        {creditTips && (
                            <div className="mt-4 bg-slate-900/50 p-3 rounded-lg space-y-2 animate-fade-in">
                                <ul className="list-disc list-inside space-y-1 text-sm text-slate-400">
                                    {creditTips.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                                </ul>
                            </div>
                        )}
                    </div>
                    <BudgetAssistant transactions={transactions} />
                    <EmbeddedLoanPredictor creditScore={creditScore} awardBadge={awardBadge} />
                </div>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-white">Expense Analyzer</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <h4 className="text-md font-semibold mb-2 text-slate-300">Add Transaction</h4>
                        <form onSubmit={handleAddTransaction} className="space-y-4">
                            <div>
                                <label htmlFor="description" className="text-sm text-slate-400">Description</label>
                                <input id="description" type="text" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="e.g., Coffee with friends" className="w-full mt-1 bg-slate-700 p-2 rounded-lg"/>
                                <div className="h-5 mt-1 text-xs">
                                    {isSuggesting && <p className="text-slate-400 italic">AI is suggesting a category...</p>}
                                    {suggestedCategory && !isSuggesting && <p className="text-indigo-400">Suggested category: <span className="font-semibold">{suggestedCategory}</span></p>}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="amount" className="text-sm text-slate-400">Amount (₹)</label>
                                <input id="amount" type="number" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} placeholder="e.g., 15.50" className="w-full mt-1 bg-slate-700 p-2 rounded-lg"/>
                            </div>
                            <button type="submit" className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50">
                                <PlusCircleIcon className="w-5 h-5 mr-2" /> Add Expense
                            </button>
                            {trackerError && <p className="text-red-400 text-xs mt-2">{trackerError}</p>}
                        </form>
                    </div>
                    <div>
                         <h4 className="text-md font-semibold mb-2 text-slate-300">Recent Transactions</h4>
                        <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
                             {transactions.length === 0 && <p className="text-slate-500 text-sm text-center mt-8">Your transactions will appear here.</p>}
                            {transactions.slice(0, 10).map(t => (
                                <li key={t.id} className="flex justify-between items-center bg-slate-900/50 p-2 rounded-md">
                                    {editingTransactionId === t.id ? (
                                        <div className="w-full flex items-center gap-2">
                                            <select
                                                value={t.category}
                                                onChange={(e) => handleUpdateCategory(t.id, e.target.value)}
                                                className="bg-slate-700 p-1 rounded-lg text-sm w-full focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                            >
                                                {TRANSACTION_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                            <button onClick={() => setEditingTransactionId(null)} className="text-slate-400 hover:text-white p-1">
                                                <XIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-slate-200">{t.description}</p>
                                                <div className="flex items-center">
                                                    {t.status === 'pending' && <div className="w-2 h-2 rounded-full bg-amber-400 mr-2 animate-pulse"></div>}
                                                    <p className={`text-xs ${t.status === 'pending' ? 'text-amber-400' : 'text-slate-400'}`}>
                                                        {t.category}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-semibold text-white">₹{t.amount.toFixed(2)}</p>
                                                {t.status === 'pending' && (
                                                    <div className="flex items-center gap-1">
                                                        <button onClick={() => handleConfirmTransaction(t.id)} className="text-green-400 hover:text-green-300 p-1" aria-label="Confirm category"><CheckCircleIcon className="w-5 h-5" /></button>
                                                        <button onClick={() => setEditingTransactionId(t.id)} className="text-slate-400 hover:text-white p-1" aria-label="Edit category"><PencilIcon className="w-4 h-4" /></button>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

const RetirementPlanner: React.FC = () => {
    const [formData, setFormData] = useState({ age: '30', savings: '100000', contribution: '15000' });
    const [prediction, setPrediction] = useState<RetirementPrediction | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleCalculate = async () => {
        setIsLoading(true);
        setPrediction(null);
        try {
            const res = await getRetirementPrediction(
                parseInt(formData.age),
                parseInt(formData.savings),
                parseInt(formData.contribution)
            );
            const parsed = JSON.parse(res);
            if(parsed.error) throw new Error(parsed.error);
            setPrediction(parsed);
        } catch(e) { console.error(e) }
        finally { setIsLoading(false); }
    };

    return (
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4">AI Retirement Planner</h3>
            <div className="grid grid-cols-3 gap-2 mb-4">
                <input value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} type="number" placeholder="Age" className="bg-slate-700 p-2 rounded-lg" />
                <input value={formData.savings} onChange={e => setFormData({...formData, savings: e.target.value})} type="number" placeholder="Savings (₹)" className="bg-slate-700 p-2 rounded-lg" />
                <input value={formData.contribution} onChange={e => setFormData({...formData, contribution: e.target.value})} type="number" placeholder="Monthly (₹)" className="bg-slate-700 p-2 rounded-lg" />
            </div>
            <button onClick={handleCalculate} disabled={isLoading} className="w-full bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition">
                {isLoading ? 'Calculating...' : 'Calculate Readiness'}
            </button>
            {prediction && (
                <div className="mt-4 space-y-3 animate-fade-in">
                    <div className="text-center">
                        <p className="text-slate-400">Readiness Score</p>
                        <p className="text-5xl font-bold text-blue-400">{prediction.readinessScore}/100</p>
                    </div>
                    <p className="text-center text-slate-300">Predicted Corpus at 65: <span className="font-bold text-white">₹{prediction.predictedCorpus.toLocaleString()}</span></p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-slate-400 pt-2">
                        {prediction.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </div>
            )}
        </div>
    );
};

const InsuranceAdvisor: React.FC = () => {
    const [profile, setProfile] = useState({ hasFamily: false, ownsHome: false });
    const [advice, setAdvice] = useState<InsuranceAdvice | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const handleGetAdvice = async () => {
        setIsLoading(true);
        setAdvice(null);
        try {
            const res = await getInsuranceAdvice(profile);
            const parsed = JSON.parse(res);
            if(parsed.error) throw new Error(parsed.error);
            setAdvice(parsed);
        } catch(e) { console.error(e); }
        finally { setIsLoading(false); }
    };

    return (
         <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
            <h3 className="flex items-center text-lg font-semibold text-white mb-4">
                <UmbrellaIcon className="w-6 h-6 mr-2" /> AI Insurance Advisor
            </h3>
            <div className="space-y-3 mb-4">
                <label className="flex items-center cursor-pointer">
                    <input type="checkbox" checked={profile.hasFamily} onChange={e => setProfile({...profile, hasFamily: e.target.checked})} className="h-4 w-4 rounded bg-slate-700 text-blue-600 focus:ring-blue-500 border-slate-600" />
                    <span className="ml-3 text-slate-300">I have a family / dependents</span>
                </label>
                 <label className="flex items-center cursor-pointer">
                    <input type="checkbox" checked={profile.ownsHome} onChange={e => setProfile({...profile, ownsHome: e.target.checked})} className="h-4 w-4 rounded bg-slate-700 text-blue-600 focus:ring-blue-500 border-slate-600" />
                    <span className="ml-3 text-slate-300">I own a home</span>
                </label>
            </div>
            <button onClick={handleGetAdvice} disabled={isLoading} className="w-full bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition">
                {isLoading ? 'Analyzing...' : 'Get AI Advice'}
            </button>
             {advice && (
                <div className="mt-4 space-y-3 animate-fade-in">
                    {advice.recommendations.map((rec, i) => (
                        <div key={i} className="bg-slate-900/50 p-3 rounded-lg">
                            <p className="font-semibold text-blue-400">{rec.type}</p>
                            <p className="text-sm text-slate-400">{rec.reason}</p>
                        </div>
                    ))}
                </div>
             )}
        </div>
    );
};

const FamilyBudgetOptimizer: React.FC<AgeDashboardProps> = ({ awardBadge }) => {
    const [expenses, setExpenses] = useState<Transaction[]>([]);
    const [desc, setDesc] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState(FAMILY_EXPENSE_CATEGORIES[0]);
    const [advice, setAdvice] = useState<BudgetOptimization | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleAddExpense = (e: React.FormEvent) => {
        e.preventDefault();
        const numAmount = parseFloat(amount);
        if(!desc || !numAmount || numAmount <= 0) return;
        const newExpense: Transaction = {
            id: Date.now().toString(),
            description: desc,
            amount: numAmount,
            category,
            date: new Date().toISOString()
        };
        setExpenses(prev => [newExpense, ...prev]);
        setDesc('');
        setAmount('');
        awardBadge('family_budget_planner');
    };

    const handleOptimize = async () => {
        if (expenses.length === 0) return;
        setIsLoading(true);
        setAdvice(null);
        try {
            const res = await getBudgetOptimizationAdvice(expenses);
            const parsed = JSON.parse(res);
            if(parsed.error) throw new Error(parsed.error);
            setAdvice(parsed);
            awardBadge('budget_optimizer');
        } catch(e) { console.error(e) }
        finally { setIsLoading(false) }
    };

    const totalSpent = useMemo(() => expenses.reduce((sum, exp) => sum + exp.amount, 0), [expenses]);

    return (
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
             <h3 className="flex items-center text-lg font-semibold text-white mb-4">
                <UsersIcon className="w-6 h-6 mr-2" /> Family Budget Optimizer
            </h3>
            <div className="text-center bg-slate-900 p-3 rounded-lg mb-4">
                <p className="text-slate-400 text-sm">Total This Month</p>
                <p className="text-3xl font-bold text-blue-400">₹{totalSpent.toLocaleString()}</p>
            </div>
            <form onSubmit={handleAddExpense} className="space-y-3 mb-4">
                 <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Expense (e.g., School Fees)" className="w-full bg-slate-700 p-2 rounded-lg" />
                 <div className="flex gap-2">
                    <input value={amount} onChange={e => setAmount(e.target.value)} type="number" placeholder="Amount" className="w-full bg-slate-700 p-2 rounded-lg" />
                    <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-slate-700 p-2 rounded-lg">
                        {FAMILY_EXPENSE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                 </div>
                 <button type="submit" className="w-full bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition">Add Shared Expense</button>
            </form>
            <button onClick={handleOptimize} disabled={isLoading || expenses.length === 0} className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50">
                {isLoading ? 'Optimizing...' : 'Optimize My Budget'}
            </button>
            {advice && (
                <div className="mt-4 p-3 bg-slate-900/50 rounded-lg animate-fade-in">
                    <p className="text-sm text-slate-300">AI Suggestion: <span className="italic">{advice.advice}</span></p>
                    <p className="text-sm text-slate-300 mt-1">Suggested Savings Ratio: <span className="font-bold text-blue-400">{advice.suggestedSavingsRatio}%</span></p>
                </div>
            )}
        </div>
    );
};

const TaxEstimator: React.FC<AgeDashboardProps> = ({ awardBadge }) => {
    const [income, setIncome] = useState('1000000');
    const [deductions, setDeductions] = useState('50000');
    const [estimation, setEstimation] = useState<TaxEstimation | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleCalculate = async () => {
        setIsLoading(true);
        setEstimation(null);
        try {
            const res = await getTaxEstimation(parseInt(income), parseInt(deductions));
            const parsed = JSON.parse(res);
            if(parsed.error) throw new Error(parsed.error);
            setEstimation(parsed);
            awardBadge('tax_savvy');
        } catch(e) { console.error(e) }
        finally { setIsLoading(false) }
    };

    return (
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
            <h3 className="flex items-center text-lg font-semibold text-white mb-4">
                <PercentIcon className="w-6 h-6 mr-2" /> AI Tax Estimator
            </h3>
            <div className="space-y-3 mb-4">
                <input value={income} onChange={e => setIncome(e.target.value)} type="number" placeholder="Annual Income (₹)" className="w-full bg-slate-700 p-2 rounded-lg" />
                <input value={deductions} onChange={e => setDeductions(e.target.value)} type="number" placeholder="Deductions (₹)" className="w-full bg-slate-700 p-2 rounded-lg" />
            </div>
            <button onClick={handleCalculate} disabled={isLoading} className="w-full bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition">
                {isLoading ? 'Calculating...' : 'Estimate Tax'}
            </button>
            {estimation && (
                <div className="mt-4 text-center animate-fade-in">
                    <p className="text-slate-400 text-sm">Estimated Tax (New Regime)</p>
                    <p className="text-3xl font-bold text-blue-400">₹{estimation.estimatedTax.toLocaleString()}</p>
                    <p className="text-sm text-slate-300">Effective Rate: {estimation.effectiveTaxRate}%</p>
                    <p className="text-xs text-slate-400 italic bg-slate-900/50 p-2 rounded-md mt-4">{estimation.tips[0]}</p>
                </div>
            )}
        </div>
    );
};

const FinancialHealthScoreComponent: React.FC<AgeDashboardProps> = ({ awardBadge }) => {
    const [score, setScore] = useState<FinancialHealthScore | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    // Mock data for calculation
    const financialData = { income: 75000, savings: 500000, expenses: 45000 };

    const handleCalculate = async () => {
        setIsLoading(true);
        setScore(null);
        try {
            const res = await getFinancialHealthScore(financialData);
            const parsed = JSON.parse(res);
            if(parsed.error) throw new Error(parsed.error);
            setScore(parsed);
            awardBadge('health_score_checker');
        } catch(e) { console.error(e) }
        finally { setIsLoading(false) }
    };
    
    const getScoreColor = (s: number) => {
        if (s < 40) return 'text-red-400';
        if (s < 75) return 'text-amber-400';
        return 'text-blue-400';
    };

    return (
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
             <h3 className="flex items-center text-lg font-semibold text-white mb-4">
                <GaugeIcon className="w-6 h-6 mr-2" /> AI Financial Health Score
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="relative w-40 h-40 mx-auto">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path className="text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="100, 100" />
                        <path className={`${score ? getScoreColor(score.score) : 'text-slate-500'} transition-all duration-1000`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray={`${score ? score.score : 0}, 100`} />
                    </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        {score ? (
                            <>
                                <span className={`text-4xl font-bold ${getScoreColor(score.score)}`}>{score.score}</span>
                                <span className="text-sm text-slate-400">/ 100</span>
                            </>
                        ) : (
                             <span className="text-4xl font-bold text-slate-500">?</span>
                        )}
                    </div>
                </div>
                 <div className="text-center md:text-left">
                    {!score && !isLoading && (
                        <>
                            <p className="text-slate-400 mb-4">Get a snapshot of your financial wellness.</p>
                             <button onClick={handleCalculate} className="w-full md:w-auto bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition">
                                Calculate My Score
                            </button>
                        </>
                    )}
                    {isLoading && <p className="text-slate-400">Analyzing your financial health...</p>}
                    {score && (
                        <div className="animate-fade-in space-y-3">
                             <p className="font-semibold text-white">{score.summary}</p>
                             <p className="text-sm text-slate-400 italic">"{score.suggestions[0]}"</p>
                             <button onClick={handleCalculate} className="text-sm text-blue-400 hover:underline">Recalculate</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const AdultDashboard: React.FC<AgeDashboardProps> = ({ awardBadge, earnedBadges }) => {
    const [investmentData, setInvestmentData] = useState([
        { name: 'Stocks', value: 50000 },
        { name: 'Bonds', value: 25000 },
        { name: 'Real Estate', value: 150000 },
    ]);
    const [portfolioAdvice, setPortfolioAdvice] = useState<PortfolioAdvice | null>(null);
    const [isFetchingAdvice, setIsFetchingAdvice] = useState(false);
    const PIE_COLORS = ['#2563eb', '#475569', '#64748b', '#3b82f6'];

    const handleGetAdvice = async () => {
        setIsFetchingAdvice(true);
        setPortfolioAdvice(null);
        try {
            const res = await getPortfolioAdvice(investmentData);
            const parsed = JSON.parse(res);
            if (parsed.error) throw new Error(parsed.error);
            setPortfolioAdvice(parsed);
            awardBadge('investment_initiate');
        } catch(e) { console.error(e); }
        finally { setIsFetchingAdvice(false); }
    };
    
    return (
        <div className="space-y-6">
            <AchievementsSection earnedBadges={earnedBadges} />
            <FinancialHealthScoreComponent awardBadge={awardBadge} earnedBadges={earnedBadges} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <FinancialGoalPlanner accentColor="blue" buttonColor="slate" />
                    <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                        <h3 className="text-lg font-semibold text-white mb-4">Investment Planner</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie data={investmentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                        {investmentData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div>
                                <button onClick={handleGetAdvice} disabled={isFetchingAdvice} className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition">
                                    {isFetchingAdvice ? 'Analyzing...' : 'Get AI Portfolio Advice'}
                                </button>
                                {portfolioAdvice && (
                                    <div className="mt-4 bg-slate-900/50 p-3 rounded-lg animate-fade-in">
                                        <ul className="list-disc list-inside space-y-2 text-sm text-slate-400">
                                            {portfolioAdvice.suggestions.map((s,i) => <li key={i}>{s}</li>)}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <RetirementPlanner />
                    <InsuranceAdvisor />
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <FamilyBudgetOptimizer awardBadge={awardBadge} earnedBadges={earnedBadges} />
                 <TaxEstimator awardBadge={awardBadge} earnedBadges={earnedBadges} />
            </div>
        </div>
    );
};

const RetirementWithdrawalPlanner: React.FC<AgeDashboardProps> = ({ awardBadge }) => {
    const [formData, setFormData] = useState({ corpus: '5000000', withdrawal: '30000', age: '60' });
    const [prediction, setPrediction] = useState<WithdrawalPrediction | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleAnalyze = async () => {
        setIsLoading(true);
        setPrediction(null);
        try {
            const res = await getWithdrawalPrediction(
                parseInt(formData.corpus),
                parseInt(formData.withdrawal),
                parseInt(formData.age)
            );
            const parsed = JSON.parse(res);
            if(parsed.error) throw new Error(parsed.error);
            setPrediction(parsed);
            awardBadge('withdrawal_planner_user');
        } catch(e) { console.error(e) }
        finally { setIsLoading(false) }
    };
    
    return (
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
             <h3 className="flex items-center text-xl font-semibold text-white mb-4">
                <CalculatorIcon className="w-6 h-6 mr-2" /> AI Retirement Withdrawal Planner
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
                <input value={formData.corpus} onChange={e => setFormData({...formData, corpus: e.target.value})} type="number" placeholder="Corpus (₹)" className="bg-slate-700 p-2 rounded-lg" />
                <input value={formData.withdrawal} onChange={e => setFormData({...formData, withdrawal: e.target.value})} type="number" placeholder="Monthly (₹)" className="bg-slate-700 p-2 rounded-lg" />
                <input value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} type="number" placeholder="Age" className="bg-slate-700 p-2 rounded-lg" />
            </div>
            <button onClick={handleAnalyze} disabled={isLoading} className="w-full bg-teal-700 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg transition">
                {isLoading ? 'Analyzing...' : 'Analyze Sustainability'}
            </button>
             {prediction && (
                <div className="mt-4 animate-fade-in">
                    <div className={`p-4 rounded-lg text-center ${prediction.isSustainable ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
                        <p className={`font-bold text-lg ${prediction.isSustainable ? 'text-teal-300' : 'text-amber-400'}`}>
                            {prediction.isSustainable ? 'Plan is Sustainable' : 'Plan is Not Sustainable'}
                        </p>
                        {!prediction.isSustainable && (
                            <p className="text-slate-300 text-sm">Funds may be depleted by age {prediction.fundsDepleteAge}.</p>
                        )}
                    </div>
                    <p className="text-sm text-slate-400 italic bg-slate-900/50 p-2 rounded-md mt-3">{prediction.suggestion}</p>
                </div>
             )}
        </div>
    );
};

const PensionIncomeTracker: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [desc, setDesc] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState<'income' | 'expense'>('income');

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        const numAmount = parseFloat(amount);
        if(!desc || !numAmount || numAmount <= 0) return;
        const newTx: Transaction = {
            id: Date.now().toString(),
            description: desc,
            amount: type === 'income' ? numAmount : -numAmount,
            category: type,
            date: new Date().toISOString()
        };
        setTransactions(prev => [newTx, ...prev]);
        setDesc(''); setAmount('');
    };

    const { totalIncome, totalExpenses, netBalance } = useMemo(() => {
        const income = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
        const expenses = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
        return { totalIncome: income, totalExpenses: expenses, netBalance: income - expenses };
    }, [transactions]);
    
    return (
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-4">Pension & Income Tracker</h3>
            <div className="grid grid-cols-3 gap-2 text-center bg-slate-900 p-3 rounded-lg mb-4">
                <div>
                    <p className="text-slate-400 text-xs">Income</p>
                    <p className="text-lg font-bold text-teal-300">₹{totalIncome.toLocaleString()}</p>
                </div>
                 <div>
                    <p className="text-slate-400 text-xs">Expenses</p>
                    <p className="text-lg font-bold text-red-400">₹{totalExpenses.toLocaleString()}</p>
                </div>
                 <div>
                    <p className="text-slate-400 text-xs">Net</p>
                    <p className={`text-lg font-bold ${netBalance >= 0 ? 'text-teal-300' : 'text-amber-400'}`}>₹{netBalance.toLocaleString()}</p>
                </div>
            </div>
            <form onSubmit={handleAdd} className="grid grid-cols-3 gap-2">
                <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description" className="col-span-3 bg-slate-700 p-2 rounded-lg" />
                <input value={amount} onChange={e => setAmount(e.target.value)} type="number" placeholder="Amount" className="bg-slate-700 p-2 rounded-lg" />
                <select value={type} onChange={e => setType(e.target.value as any)} className="bg-slate-700 p-2 rounded-lg">
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>
                <button type="submit" className="bg-teal-700 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg transition">Add</button>
            </form>
        </div>
    );
};


const SeniorDashboard: React.FC<AgeDashboardProps> = ({ awardBadge, earnedBadges }) => {
    const [prediction, setPrediction] = useState<HealthcarePrediction | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fraudTip, setFraudTip] = useState<FraudTip | null>(null);
    const [isFetchingFraudTip, setIsFetchingFraudTip] = useState(false);
    const [fraudTipError, setFraudTipError] = useState<string | null>(null);

    const handlePredict = async () => {
        setIsLoading(true);
        setError(null);
        setPrediction(null);
        try {
            const response = await getHealthcarePrediction(68);
            const parsedResponse = JSON.parse(response);
            if (parsedResponse.error) {
                setError(parsedResponse.error);
            } else {
                setPrediction(parsedResponse);
            }
        } catch (err) {
            setError('Failed to fetch prediction.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFetchFraudTip = async () => {
        setIsFetchingFraudTip(true);
        setFraudTipError(null);
        setFraudTip(null);
        try {
            const response = await getFraudTip();
            const parsed = JSON.parse(response);
            if (parsed.error) {
                throw new Error(parsed.error);
            }
            setFraudTip(parsed);
        } catch (err) {
            setFraudTipError("Could not fetch a new tip.");
            console.error(err);
        } finally {
            setIsFetchingFraudTip(false);
        }
    };

    useEffect(() => {
        handleFetchFraudTip();
    }, []);

    return (
        <div className="space-y-6">
            <AchievementsSection earnedBadges={earnedBadges} />
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RetirementWithdrawalPlanner awardBadge={awardBadge} earnedBadges={earnedBadges} />
                <PensionIncomeTracker />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg flex flex-col">
                    <h3 className="text-xl font-semibold text-white">AI Healthcare Budget Predictor</h3>
                    <div className="flex-grow flex flex-col justify-center">
                    {isLoading ? (
                        <p className="text-slate-400 mt-2 text-center">Predicting costs...</p>
                    ) : prediction ? (
                         <div className="mt-4 space-y-3">
                            <p className="text-3xl font-bold text-teal-300 text-center">₹{prediction.predictedAnnualCost.toLocaleString()}
                                <span className="text-lg font-normal text-slate-400"> / year</span>
                            </p>
                             <div className="text-base text-slate-300 mt-2 space-y-1">
                                 <p>Premiums: <span className="font-semibold float-right">₹{prediction.costBreakdown.premiums.toLocaleString()}</span></p>
                                 <p>Medication: <span className="font-semibold float-right">₹{prediction.costBreakdown.medication.toLocaleString()}</span></p>
                                 <p>Out-of-Pocket: <span className="font-semibold float-right">₹{prediction.costBreakdown.outOfPocket.toLocaleString()}</span></p>
                             </div>
                             <p className="text-sm text-slate-400 italic bg-slate-900/50 p-2 rounded-md mt-4">{prediction.suggestion}</p>
                        </div>
                    ) : (
                        <div className="text-center">
                            <p className="text-slate-400 mt-2">Get an AI-powered estimate of your annual healthcare expenses.</p>
                             <button onClick={handlePredict} disabled={isLoading} className="mt-4 bg-teal-700 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50">
                                Predict Costs
                            </button>
                        </div>
                    )}
                    </div>
                    {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
                </div>
                 <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold text-white">Fraud Awareness Tip</h3>
                        <button onClick={handleFetchFraudTip} disabled={isFetchingFraudTip} className="p-2 rounded-full hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Get new tip">
                            <RefreshCwIcon className={`w-5 h-5 text-slate-400 ${isFetchingFraudTip ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                    <div className="text-slate-300 mt-2 min-h-[40px] flex items-center text-base">
                        {isFetchingFraudTip && <p className="text-slate-400 italic">Generating your personalized tip...</p>}
                        {fraudTipError && <p className="text-red-400">{fraudTipError}</p>}
                        {fraudTip && <p>{fraudTip.tip}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

const Dashboard: React.FC<DashboardProps> = ({ ageGroup, earnedBadges, awardBadge }) => {
    const config = AGE_GROUP_CONFIG[ageGroup];

    const HeaderIcon = useMemo(() => {
        switch(ageGroup) {
            case 'Teen': return <CoinIcon className="w-8 h-8 mr-3 text-sky-400" />;
            case 'YoungAdult': return <GraduationCapIcon className="w-8 h-8 mr-3 text-indigo-400" />;
            case 'Adult': return <TrendingUpIcon className="w-8 h-8 mr-3 text-blue-400" />;
            case 'Senior': return <ShieldIcon className="w-8 h-8 mr-3 text-teal-300" />;
            default: return null;
        }
    }, [ageGroup]);

    const renderDashboardContent = () => {
        const props = { earnedBadges, awardBadge };
        switch (ageGroup) {
            case 'Teen': return <TeenDashboard {...props} />;
            case 'YoungAdult': return <YoungAdultDashboard {...props} />;
            case 'Adult': return <AdultDashboard {...props} />;
            case 'Senior': return <SeniorDashboard {...props} />;
            default: return <div>Coming soon...</div>;
        }
    };
    
    return (
        <div className={`
            animate-fade-in
            ${ageGroup === 'Teen' ? '[--dash-accent:theme(colors.sky.400)] [--dash-secondary:theme(colors.lime.400)]' : ''}
            ${ageGroup === 'YoungAdult' ? '[--dash-accent:theme(colors.indigo.400)] [--dash-secondary:theme(colors.purple.400)]' : ''}
            ${ageGroup === 'Adult' ? '[--dash-accent:theme(colors.blue.400)] [--dash-secondary:theme(colors.slate.400)]' : ''}
            ${ageGroup === 'Senior' ? '[--dash-accent:theme(colors.teal.300)] [--dash-secondary:theme(colors.slate.300)]' : ''}
        `}>
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
                {HeaderIcon}
                {config.title} Dashboard {config.emoji}
            </h2>
            <p className="text-slate-400 mb-8">Your personalized financial snapshot.</p>
            {renderDashboardContent()}
        </div>
    );
};

export default Dashboard;