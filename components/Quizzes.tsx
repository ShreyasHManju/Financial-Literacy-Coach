import React, { useState } from 'react';
import { MultiQuiz, QuizQuestion } from '../types';
import { generateMultiQuestionQuiz } from '../services/geminiService';
import { CheckCircleIcon, XCircleIcon, TrophyIcon } from './icons';

interface QuizzesProps {
  awardBadge: (badgeId: string) => void;
}

type QuizState = 'selecting' | 'loading' | 'in_progress' | 'completed';

const QUIZ_TOPICS = ['Saving', 'Budgeting', 'Understanding Credit', 'Investing Basics'];

const Quizzes: React.FC<QuizzesProps> = ({ awardBadge }) => {
  const [quizState, setQuizState] = useState<QuizState>('selecting');
  const [currentQuiz, setCurrentQuiz] = useState<MultiQuiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleStartQuiz = async (topic: string) => {
    setQuizState('loading');
    setError(null);
    setCurrentQuiz(null);
    setUserAnswers([]);
    setCurrentQuestionIndex(0);

    try {
      const response = await generateMultiQuestionQuiz(topic);
      const parsed = JSON.parse(response);
      if (parsed.error) {
        throw new Error(parsed.error);
      }
      if (!parsed.quiz || parsed.quiz.length === 0) {
        throw new Error("AI failed to generate a valid quiz.");
      }
      setCurrentQuiz(parsed.quiz);
      setUserAnswers(new Array(parsed.quiz.length).fill(null));
      setQuizState('in_progress');
    } catch (e) {
      console.error(e);
      setError('Could not generate a quiz. Please try again.');
      setQuizState('selecting');
    }
  };
  
  const handleAnswerSelect = (answer: string) => {
    setUserAnswers(prev => {
        const newAnswers = [...prev];
        newAnswers[currentQuestionIndex] = answer;
        return newAnswers;
    });
  };

  const handleNextQuestion = () => {
    if (currentQuiz && currentQuestionIndex < currentQuiz.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleFinishQuiz();
    }
  };

  const handleFinishQuiz = () => {
    if (!currentQuiz) return;
    let correctAnswers = 0;
    for (let i = 0; i < currentQuiz.length; i++) {
        if (userAnswers[i] === currentQuiz[i].answer) {
            correctAnswers++;
        }
    }
    const finalScore = (correctAnswers / currentQuiz.length) * 100;
    setScore(finalScore);
    setQuizState('completed');

    if (finalScore >= (2/3 * 100)) { // Award badge if score is ~67% or higher
        awardBadge('quiz_whiz');
    }
  };

  const renderContent = () => {
    switch (quizState) {
      case 'selecting':
        return (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Financial Quizzes</h2>
            <p className="text-slate-400 mb-8">Test your knowledge and earn the 'Quiz Whiz' badge!</p>
            {error && <p className="text-red-400 mb-4">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {QUIZ_TOPICS.map(topic => (
                <button
                  key={topic}
                  onClick={() => handleStartQuiz(topic)}
                  className="bg-slate-800 p-6 rounded-lg shadow-lg hover:bg-slate-700 hover:shadow-cyan-500/20 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <p className="text-xl font-semibold text-white">{topic}</p>
                </button>
              ))}
            </div>
          </div>
        );

      case 'loading':
        return <div className="text-center text-slate-300">Generating your quiz with AI...</div>;

      case 'in_progress':
        if (!currentQuiz) return null;
        const question = currentQuiz[currentQuestionIndex];
        return (
          <div>
            <div className="w-full bg-slate-700 rounded-full h-2.5 mb-4">
              <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / currentQuiz.length) * 100}%` }}></div>
            </div>
            <p className="text-sm text-slate-400 mb-2">Question {currentQuestionIndex + 1} of {currentQuiz.length}</p>
            <h3 className="text-2xl font-semibold text-white mb-6">{question.question}</h3>
            <div className="space-y-3">
              {question.options.map(option => (
                <button
                  key={option}
                  onClick={() => handleAnswerSelect(option)}
                  className={`w-full text-left p-4 rounded-lg transition border-2 ${
                    userAnswers[currentQuestionIndex] === option
                      ? 'bg-cyan-900/50 border-cyan-500'
                      : 'bg-slate-800 border-transparent hover:bg-slate-700'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <button
              onClick={handleNextQuestion}
              disabled={!userAnswers[currentQuestionIndex]}
              className="mt-8 w-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentQuestionIndex === currentQuiz.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </button>
          </div>
        );

      case 'completed':
        if (!currentQuiz) return null;
        return (
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Quiz Complete!</h2>
                <p className="text-5xl font-bold text-cyan-400 my-4">{Math.round(score)}%</p>
                {score >= (2/3 * 100) && (
                    <div className="inline-flex items-center bg-indigo-900/50 text-indigo-300 py-2 px-4 rounded-full mb-6">
                        <TrophyIcon className="w-6 h-6 mr-2" />
                        'Quiz Whiz' Badge Unlocked!
                    </div>
                )}
                <div className="space-y-4 text-left my-8">
                    {currentQuiz.map((q, index) => (
                        <div key={index} className="bg-slate-800 p-4 rounded-lg">
                            <p className="font-semibold text-slate-300">{q.question}</p>
                            <div className={`flex items-center mt-2 p-2 rounded-md text-sm ${userAnswers[index] === q.answer ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                                {userAnswers[index] === q.answer ? <CheckCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" /> : <XCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />}
                                Your answer: {userAnswers[index] || "No answer"}
                            </div>
                            {userAnswers[index] !== q.answer && (
                               <div className="flex items-center mt-1 p-2 rounded-md text-sm bg-slate-700 text-slate-300">
                                   <span className="font-bold mr-2">Correct answer:</span> {q.answer}
                               </div>
                            )}
                        </div>
                    ))}
                </div>
                <button onClick={() => setQuizState('selecting')} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg transition">
                    Try Another Quiz
                </button>
            </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="bg-slate-900/70 backdrop-blur-lg border border-slate-700 p-8 rounded-xl shadow-2xl">
        {renderContent()}
      </div>
    </div>
  );
};

export default Quizzes;