import React, { useState } from 'react';
import { getLoanPrediction, LoanPredictionData } from '../services/geminiService';

interface PredictionResult {
    eligibility: string;
    confidenceScore: number;
    explanation: string;
    monthlyPayment: number;
    maxLoanAmount: number;
}

interface LoanPredictorProps {
    awardBadge: (badgeId: string) => void;
}

const LoanPredictor: React.FC<LoanPredictorProps> = ({ awardBadge }) => {
  const [formData, setFormData] = useState<LoanPredictionData>({
    age: 25,
    income: 5000,
    expenses: 2000,
    loanAmount: 10000,
    creditScore: 650,
  });
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: Number(e.target.value) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await getLoanPrediction(formData);
      setResult(JSON.parse(response));
      awardBadge('loan_savvy');
    } catch (err) {
      setError('An error occurred while fetching the prediction.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const ResultCard: React.FC<{ result: PredictionResult }> = ({ result }) => (
    <div className={`mt-8 p-6 rounded-xl shadow-lg border ${result.eligibility === 'Eligible' ? 'bg-green-900/20 border-green-500' : 'bg-red-900/20 border-red-500'}`}>
        <h3 className="text-2xl font-bold text-center mb-4">
            Prediction Result: <span className={result.eligibility === 'Eligible' ? 'text-green-400' : 'text-red-400'}>{result.eligibility}</span>
        </h3>
        <div className="text-center mb-4">
            <div className="text-5xl font-bold text-white">{result.confidenceScore}%</div>
            <div className="text-slate-400">Confidence Score</div>
        </div>
        <p className="text-slate-300 text-center mb-6">{result.explanation}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
            <div className="bg-slate-800 p-4 rounded-lg">
                <p className="text-slate-400">Estimated Monthly Payment</p>
                <p className="text-2xl font-semibold text-cyan-400">₹{result.monthlyPayment.toLocaleString()}</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg">
                <p className="text-slate-400">Suggested Max Loan</p>
                <p className="text-2xl font-semibold text-cyan-400">₹{result.maxLoanAmount.toLocaleString()}</p>
            </div>
        </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <h2 className="text-3xl font-bold text-white mb-2">AI Loan Eligibility Predictor</h2>
      <p className="text-slate-400 mb-8">Fill in your financial details to get an AI-powered eligibility prediction.</p>
      
      <div className="bg-slate-800 p-8 rounded-xl shadow-lg">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-slate-400 mb-2">Age</label>
            <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full bg-slate-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          </div>
          <div>
            <label className="block text-slate-400 mb-2">Credit Score</label>
            <input type="number" name="creditScore" value={formData.creditScore} onChange={handleChange} className="w-full bg-slate-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          </div>
          <div>
            <label className="block text-slate-400 mb-2">Monthly Income (₹)</label>
            <input type="number" name="income" value={formData.income} onChange={handleChange} className="w-full bg-slate-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          </div>
          <div>
            <label className="block text-slate-400 mb-2">Monthly Expenses (₹)</label>
            <input type="number" name="expenses" value={formData.expenses} onChange={handleChange} className="w-full bg-slate-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-slate-400 mb-2">Loan Amount (₹)</label>
            <input type="number" name="loanAmount" value={formData.loanAmount} onChange={handleChange} className="w-full bg-slate-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          </div>
          <div className="md:col-span-2">
            <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? 'Predicting...' : 'Get Prediction'}
            </button>
          </div>
        </form>
      </div>

      {error && <div className="mt-6 text-center text-red-400">{error}</div>}
      {isLoading && <div className="mt-6 text-center text-cyan-400">AI is analyzing your data...</div>}
      {result && <ResultCard result={result} />}
    </div>
  );
};

export default LoanPredictor;