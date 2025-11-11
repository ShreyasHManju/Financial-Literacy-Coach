import React, { useState, useEffect, useRef } from 'react';
import { UserAgeGroup, ChatMessage } from '../types';
import { startChatSession, streamChatResponse } from '../services/geminiService';
import { Chat } from '@google/genai';
import { BotIcon, UserIcon, SendIcon } from './icons';
import { AGE_GROUP_CONFIG } from '../constants';

interface ChatbotProps {
  ageGroup: UserAgeGroup;
}

const Chatbot: React.FC<ChatbotProps> = ({ ageGroup }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatRef.current = startChatSession(ageGroup);
    const welcomeMessages: Record<UserAgeGroup, string> = {
        Teen: "Hi there! I'm your financial buddy. 😊 Ask me anything about saving, pocket money, or what 'inflation' means! Let's make learning about money fun. 🚀",
        YoungAdult: "Welcome! I'm your financial coach, here to help you navigate topics like building credit, managing student loans, or creating your first real budget. What's on your mind? 👨‍🎓",
        Adult: "Hello. As your expert financial planner, I can provide insights on complex topics like mortgages, retirement planning, and investment strategies. How can I assist with your wealth-building journey today? 📈",
        Senior: "Greetings. I am your trusted financial guide, here to offer support with retirement income, healthcare costs, and fraud prevention. Please feel free to ask any questions. Your security is my priority. 🛡️"
    };
    const welcomeMessage = welcomeMessages[ageGroup];
    setMessages([{ sender: 'bot', text: welcomeMessage }]);
  }, [ageGroup]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const botMessage: ChatMessage = { sender: 'bot', text: '', isStreaming: true };
    setMessages((prev) => [...prev, botMessage]);
    
    try {
        if (chatRef.current) {
            const stream = await streamChatResponse(chatRef.current, input);
            let currentText = "";
            for await (const chunk of stream) {
                currentText += chunk.text;
                setMessages(prev => prev.map((msg, index) => 
                    index === prev.length - 1 ? { ...msg, text: currentText } : msg
                ));
            }
            setMessages(prev => prev.map((msg, index) => 
                index === prev.length - 1 ? { ...msg, isStreaming: false } : msg
            ));
        }
    } catch (error) {
        console.error("Error streaming chat response:", error);
        setMessages(prev => prev.map((msg, index) => 
            index === prev.length - 1 ? { ...msg, text: "Sorry, I encountered an error.", isStreaming: false } : msg
        ));
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-slate-800 rounded-xl shadow-2xl animate-fade-in overflow-hidden">
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-xl font-bold text-white text-center">Your Financial Coach Bot</h2>
        <p className="text-sm text-slate-400 text-center">Guidance for a {AGE_GROUP_CONFIG[ageGroup].title}</p>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            {msg.sender === 'bot' && <div className="w-8 h-8 rounded-full bg-cyan-500 flex-shrink-0 flex items-center justify-center"><BotIcon className="w-5 h-5" /></div>}
            <div className={`max-w-md p-3 rounded-xl ${msg.sender === 'user' ? 'bg-slate-700' : 'bg-slate-900'}`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
              {msg.isStreaming && <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse ml-2 inline-block"></div>}
            </div>
            {msg.sender === 'user' && <div className="w-8 h-8 rounded-full bg-slate-600 flex-shrink-0 flex items-center justify-center"><UserIcon className="w-5 h-5" /></div>}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center bg-slate-700 rounded-lg p-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a financial question..."
            className="flex-1 bg-transparent focus:outline-none px-2"
            disabled={isLoading}
          />
          <button onClick={handleSend} disabled={isLoading} className="bg-cyan-500 p-2 rounded-md hover:bg-cyan-600 disabled:bg-slate-600 disabled:cursor-not-allowed transition">
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;