import React, { useState, useMemo } from 'react';
import { UserAgeGroup, Page } from './types';
import { AGE_GROUP_CONFIG } from './constants';
import { UserIcon, BotIcon, BarChartIcon, BookOpenIcon, MenuIcon, XIcon, HomeIcon } from './components/icons';
import Dashboard from './components/Dashboard';
import LoanPredictor from './components/LoanPredictor';
import Chatbot from './components/Chatbot';
import GamifiedLesson from './components/GamifiedLesson';
import Quizzes from './components/Quizzes';

const App: React.FC = () => {
  const [ageGroup, setAgeGroup] = useState<UserAgeGroup | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);

  const awardBadge = (badgeId: string) => {
    if (!earnedBadges.includes(badgeId)) {
      setEarnedBadges(prev => [...prev, badgeId]);
    }
  };

  const navItems = useMemo(() => {
    if (!ageGroup) return [];
    
    interface NavItem {
        name: string;
        icon: React.ReactNode;
        page?: Page;
        action?: () => void;
    }

    const items: NavItem[] = [
      { name: 'Home', icon: <HomeIcon />, action: () => { setAgeGroup(null); setIsSidebarOpen(false); } },
      { name: 'Dashboard', icon: <BarChartIcon />, page: 'Dashboard' },
      ...AGE_GROUP_CONFIG[ageGroup].tools,
      { name: 'Financial Coach Bot', icon: <BotIcon />, page: 'Chatbot' },
    ];
    return items;

  }, [ageGroup]);

  if (!ageGroup) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500 mb-4">
            Welcome to Your Financial Literacy Coach
          </h1>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Personalized financial education for every stage of life. Select your age group to get started.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-4xl">
          {Object.keys(AGE_GROUP_CONFIG).map((group) => (
            <button
              key={group}
              onClick={() => {
                setAgeGroup(group as UserAgeGroup);
                setCurrentPage('Dashboard'); // Reset to dashboard on profile change
              }}
              className="bg-slate-800 p-6 rounded-lg shadow-lg hover:bg-slate-700 hover:shadow-cyan-500/20 transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="text-5xl mb-3">{AGE_GROUP_CONFIG[group as UserAgeGroup].emoji}</div>
              <h2 className="text-xl font-semibold text-white">{AGE_GROUP_CONFIG[group as UserAgeGroup].title}</h2>
              <p className="text-sm text-slate-400">{AGE_GROUP_CONFIG[group as UserAgeGroup].range}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'Dashboard':
        return <Dashboard ageGroup={ageGroup} earnedBadges={earnedBadges} awardBadge={awardBadge} />;
      case 'LoanPredictor':
        return <LoanPredictor awardBadge={awardBadge} />;
      case 'Chatbot':
        return <Chatbot ageGroup={ageGroup} />;
      case 'GamifiedLesson':
        return <GamifiedLesson awardBadge={awardBadge} />;
      case 'Quizzes':
        return <Quizzes awardBadge={awardBadge} />;
      default:
        return <Dashboard ageGroup={ageGroup} earnedBadges={earnedBadges} awardBadge={awardBadge} />;
    }
  };

  const SidebarContent: React.FC = () => (
     <div className="flex flex-col h-full bg-slate-900/70 backdrop-blur-lg border-r border-slate-700">
          <div className="p-4 border-b border-slate-700 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500">
              FinCoach
            </h1>
            <button
              onClick={() => setAgeGroup(null)}
              className="flex items-center text-sm text-slate-400 hover:text-cyan-400 transition"
            >
              <UserIcon className="w-4 h-4 mr-1" /> Change Profile
            </button>
          </div>
          <nav className="flex-grow p-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  if (item.action) {
                    item.action();
                  } else if (item.page) {
                    setCurrentPage(item.page);
                    setIsSidebarOpen(false);
                  }
                }}
                className={`w-full flex items-center p-3 rounded-lg text-left transition ${
                  currentPage === item.page
                    ? 'bg-cyan-500 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="w-6 h-6 mr-3">{item.icon}</div>
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </nav>
        </div>
  )

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100">
      {/* Sidebar for desktop */}
      <aside className="hidden lg:block w-64">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300 ease-in-out ${
            isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-slate-900 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="lg:hidden flex items-center justify-between p-4 bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => { setAgeGroup(null); setIsSidebarOpen(false); }}
              className="p-1 text-slate-300 hover:text-cyan-400 transition"
              aria-label="Go to homepage"
            >
              <HomeIcon />
            </button>
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500">
              {currentPage}
            </h1>
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2">
            {isSidebarOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

export default App;