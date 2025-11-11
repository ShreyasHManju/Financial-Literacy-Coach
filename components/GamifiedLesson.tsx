import React, { useState, useMemo } from 'react';
import { TEEN_LESSONS } from '../constants';
import { QuizQuestion, Lesson } from '../types';
import { generateQuiz } from '../services/geminiService';
import { SparklesIcon, PlusCircleIcon, CheckCircleIcon, XCircleIcon, BookOpenIcon } from './icons';

interface GamifiedLessonProps {
  awardBadge: (badgeId: string) => void;
}

interface Expense {
    id: string;
    description: string;
    amount: number;
}

const LessonContent: React.FC<{ lesson: Lesson, awardBadge: (badgeId: string) => void, onBack: () => void }> = ({ lesson, awardBadge, onBack }) => {
  // Pocket Planner State
  const [pocketMoney, setPocketMoney] = useState(50);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newExpenseDesc, setNewExpenseDesc] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');

  // AI Quiz State
  const [quizQuestion, setQuizQuestion] = useState<QuizQuestion | null>(null);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(newExpenseAmount);
    if (!newExpenseDesc || !amount || amount <= 0) return;
    
    if (amount > pocketMoney) {
        alert("You don't have enough pocket money for that!");
        return;
    }

    const newExpense: Expense = {
        id: new Date().toISOString(),
        description: newExpenseDesc,
        amount,
    };
    setExpenses(prev => [newExpense, ...prev]);
    setPocketMoney(prev => prev - amount);
    setNewExpenseDesc('');
    setNewExpenseAmount('');
  };

  const handleGenerateQuiz = async () => {
    setIsLoadingQuiz(true);
    setQuizQuestion(null);
    setSelectedAnswer(null);
    setQuizFeedback(null);
    try {
        const response = await generateQuiz(lesson.quizTopic);
        const parsed = JSON.parse(response);
        if (parsed.error) {
            console.error(parsed.error);
        } else {
            setQuizQuestion(parsed);
        }
    } catch(e) {
        console.error(e);
    } finally {
        setIsLoadingQuiz(false);
    }
  };

  const handleAnswerSubmit = () => {
    if (!selectedAnswer || !quizQuestion) return;

    if (selectedAnswer === quizQuestion.answer) {
        setQuizFeedback('correct');
        awardBadge(lesson.badgeToAward);
    } else {
        setQuizFeedback('incorrect');
    }
  };

  const remainingBalance = useMemo(() => {
    return pocketMoney;
  }, [pocketMoney]);

  return (
    <div className="space-y-8">
       <div>
         <button onClick={onBack} className="text-cyan-400 hover:text-cyan-300 mb-4">&larr; Back to Lessons</button>
         <h2 className="text-3xl font-bold text-white mb-2">{lesson.title}</h2>
         <p className="text-slate-400">Learn and interact to earn badges!</p>
       </div>

      <div className="bg-slate-800 p-6 rounded-xl shadow-lg space-y-4">
        {lesson.content.map((paragraph, index) => (
          <p key={index} className="text-slate-300">{paragraph}</p>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pocket Planner */}
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
            <h3 className="flex items-center text-xl font-semibold text-white mb-4">
                <SparklesIcon className="w-6 h-6 mr-2 text-cyan-400" />
                Pocket Planner
            </h3>
            <div className="text-center bg-slate-900 p-4 rounded-lg mb-4">
                <p className="text-slate-400 text-sm">Remaining Balance</p>
                <p className="text-4xl font-bold text-cyan-400">₹{remainingBalance.toFixed(2)}</p>
            </div>
            <form onSubmit={handleAddExpense} className="space-y-3">
                 <input
                    type="text"
                    value={newExpenseDesc}
                    onChange={(e) => setNewExpenseDesc(e.target.value)}
                    placeholder="Expense description (e.g., Movie)"
                    className="w-full bg-slate-700 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                 <input
                    type="number"
                    value={newExpenseAmount}
                    onChange={(e) => setNewExpenseAmount(e.target.value)}
                    placeholder="Amount (₹)"
                    className="w-full bg-slate-700 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <button type="submit" className="w-full flex items-center justify-center bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg transition">
                   <PlusCircleIcon className="w-5 h-5 mr-2" /> Add Expense
                </button>
            </form>
             <div className="mt-4">
                <h4 className="text-md font-semibold mb-2 text-slate-300">Recent Expenses</h4>
                <ul className="space-y-2 max-h-32 overflow-y-auto pr-2">
                    {expenses.length === 0 && <p className="text-slate-500 text-sm">No expenses added yet.</p>}
                    {expenses.map(e => (
                        <li key={e.id} className="flex justify-between items-center bg-slate-900/50 p-2 rounded-md text-sm">
                            <span className="text-slate-300">{e.description}</span>
                            <span className="font-semibold text-white">₹{e.amount.toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

        {/* AI Quiz */}
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-4">Test Your Knowledge!</h3>
            {!quizQuestion && (
                <div className="text-center">
                    <p className="text-slate-400 mb-4">Click below to generate a quiz question with AI.</p>
                    <button onClick={handleGenerateQuiz} disabled={isLoadingQuiz} className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition hover:opacity-90 disabled:opacity-50">
                        {isLoadingQuiz ? 'Generating...' : 'Start AI Quiz'}
                    </button>
                </div>
            )}
            {quizQuestion && (
                <div className="space-y-4">
                    <p className="font-semibold text-slate-200">{quizQuestion.question}</p>
                    <div className="space-y-2">
                        {quizQuestion.options.map(option => (
                            <button
                                key={option}
                                onClick={() => setSelectedAnswer(option)}
                                disabled={!!quizFeedback}
                                className={`w-full text-left p-3 rounded-lg transition ${selectedAnswer === option ? 'bg-cyan-600' : 'bg-slate-700 hover:bg-slate-600'} ${quizFeedback ? 'cursor-not-allowed' : ''}`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                    {!quizFeedback ? (
                         <button onClick={handleAnswerSubmit} disabled={!selectedAnswer} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50">
                            Submit Answer
                        </button>
                    ) : (
                         <div className={`mt-4 p-4 rounded-lg flex items-center ${quizFeedback === 'correct' ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
                            {quizFeedback === 'correct' ? <CheckCircleIcon className="w-8 h-8 text-green-400 mr-3" /> : <XCircleIcon className="w-8 h-8 text-red-400 mr-3" />}
                            <div>
                                <p className={`font-bold ${quizFeedback === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
                                    {quizFeedback === 'correct' ? 'Correct! Badge Unlocked!' : 'Not quite!'}
                                </p>
                                <p className="text-sm text-slate-300">
                                    {quizFeedback === 'correct' ? `You've earned the '${lesson.badgeToAward}' badge.` : `The correct answer was: ${quizQuestion.answer}`}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  )
}


const GamifiedLesson: React.FC<GamifiedLessonProps> = ({ awardBadge }) => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  if (!selectedLesson) {
    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
             <div>
                <h2 className="text-3xl font-bold text-white mb-2">Interactive Lessons</h2>
                <p className="text-slate-400 mb-8">Choose a lesson to start learning and earning badges!</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {TEEN_LESSONS.map(lesson => (
                    <button
                        key={lesson.id}
                        onClick={() => setSelectedLesson(lesson)}
                        className="bg-slate-800 p-6 rounded-lg shadow-lg text-left h-full flex flex-col hover:bg-slate-700 hover:shadow-cyan-500/20 transition-all duration-300 transform hover:-translate-y-1"
                    >
                       <div className="flex-grow">
                         <div className="bg-cyan-900/50 text-cyan-400 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                            <BookOpenIcon className="w-6 h-6"/>
                         </div>
                         <h3 className="text-xl font-semibold text-white">{lesson.title}</h3>
                       </div>
                       <p className="text-sm text-slate-400 mt-2">Click to start &rarr;</p>
                    </button>
                ))}
            </div>
        </div>
    )
  }

  return (
    <LessonContent 
        lesson={selectedLesson}
        awardBadge={awardBadge}
        onBack={() => setSelectedLesson(null)}
    />
  );
};

export default GamifiedLesson;