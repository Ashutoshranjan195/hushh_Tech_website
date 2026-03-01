/**
 * Hushh Agents - Home Page
 * 
 * Simple agent selection - NO restrictions, everyone has full access.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLogOut, FiMessageCircle, FiMic, FiLock, FiArrowRight, FiGlobe } from 'react-icons/fi';
import { getActiveAgents, ROUTES, HUSHH_BRANDING, SUPPORTED_LANGUAGES } from '../core/constants';
import type { HushhAgentUser } from '../core/types';

const playfair = { fontFamily: "'Playfair Display', serif" };

interface HomePageProps {
  user: HushhAgentUser | null;
  onSignOut: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ user, onSignOut }) => {
  const navigate = useNavigate();
  const agents = getActiveAgents();
  
  const handleAgentSelect = (agentId: string) => {
    navigate(ROUTES.CHAT_WITH_AGENT(agentId));
  };

  // Default to Hushh agent for quick start
  const handleQuickStart = () => {
    navigate(ROUTES.CHAT_WITH_AGENT('hushh'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-hushh-blue to-blue-600 flex items-center justify-center">
              <span className="text-white text-lg font-bold">H</span>
            </div>
            <div>
              <h1 
                className="text-lg font-semibold text-black"
                style={playfair}
              >
                {HUSHH_BRANDING.FULL_NAME}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm text-gray-500">{user?.email}</span>
            <button
              onClick={onSignOut}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Sign out"
            >
              <FiLogOut className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Welcome */}
        <section className="text-center mb-12">
          <motion.h2 
            className="text-4xl sm:text-5xl font-normal text-black mb-4"
            style={playfair}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            What can I help you with?
          </motion.h2>
          <motion.p 
            className="text-gray-500 text-lg max-w-lg mx-auto mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Chat with Hushh Intelligence in Hindi, English, or Tamil.
            Voice and text — completely unlimited.
          </motion.p>

          {/* Quick Start Button */}
          <motion.button
            onClick={handleQuickStart}
            className="inline-flex items-center gap-2 px-8 py-4 bg-hushh-blue text-white rounded-full text-lg font-medium hover:bg-hushh-blue/90 transition-colors shadow-lg shadow-hushh-blue/25"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Chatting
            <FiArrowRight className="w-5 h-5" />
          </motion.button>
        </section>

        {/* Language Support */}
        <section className="flex flex-wrap items-center justify-center gap-3 mb-16">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <span 
              key={lang.code}
              className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm flex items-center gap-2 hover:border-hushh-blue transition-colors"
            >
              <span>{lang.flag}</span>
              <span className="text-gray-700">{lang.nativeName}</span>
            </span>
          ))}
        </section>

        {/* Agents Grid */}
        <section className="mb-16">
          <h3 
            className="text-xl font-normal text-center mb-8 text-gray-800"
            style={playfair}
          >
            Choose Your Agent
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {agents.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <button
                  onClick={() => handleAgentSelect(agent.id)}
                  className="w-full p-6 rounded-2xl text-left transition-all duration-200 border-2 border-gray-100 hover:border-hushh-blue hover:shadow-xl hover:shadow-hushh-blue/10 bg-white group"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-hushh-blue to-blue-600 group-hover:scale-110 transition-transform">
                      <span className="text-white text-2xl font-bold">
                        {agent.name.charAt(0)}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg text-gray-900">{agent.name}</h3>
                        <FiArrowRight className="w-4 h-4 text-gray-400 group-hover:text-hushh-blue group-hover:translate-x-1 transition-all" />
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                        {agent.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <FiMessageCircle className="w-3 h-3" /> Text
                        </span>
                        <span className="flex items-center gap-1">
                          <FiMic className="w-3 h-3" /> Voice
                        </span>
                        <span className="flex items-center gap-1">
                          <FiGlobe className="w-3 h-3" /> Multi-lingual
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <FeatureCard
            icon={<FiMessageCircle className="w-6 h-6" />}
            title="Unlimited Chat"
            description="No message limits, chat as much as you want"
          />
          <FeatureCard
            icon={<FiMic className="w-6 h-6" />}
            title="Voice Support"
            description="Speak naturally in any supported language"
          />
          <FeatureCard
            icon={<FiLock className="w-6 h-6" />}
            title="Private & Secure"
            description="Your conversations stay private"
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-gray-100">
        <p className="text-xs text-gray-400">
          {HUSHH_BRANDING.POWERED_BY}
        </p>
      </footer>
    </div>
  );
};

// Feature Card Component
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="p-5 rounded-xl text-center bg-white border border-gray-100">
    <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center bg-hushh-blue/10 text-hushh-blue">
      {icon}
    </div>
    <h4 className="font-medium text-gray-900 mb-1">{title}</h4>
    <p className="text-sm text-gray-500">{description}</p>
  </div>
);

export default HomePage;
