/**
 * Hushh Agents - Chat Page
 * 
 * Production-grade chat interface similar to Claude AI.
 * Features: Text chat, voice input, multi-language support, chat history.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiArrowLeft, 
  FiSend, 
  FiMic, 
  FiMicOff,
  FiGlobe,
  FiMoreVertical,
  FiTrash2,
  FiCopy,
  FiCheck,
  FiLoader
} from 'react-icons/fi';
import { 
  getAgentById, 
  ROUTES, 
  HUSHH_BRANDING, 
  SUPPORTED_LANGUAGES,
  type LanguageCode
} from '../core/constants';
import type { ChatMessage, HushhAgentUser } from '../core/types';
import { 
  sendChatMessage, 
  createUserMessage, 
  createAssistantMessage,
} from '../services/hushhIntelligenceService';

const playfair = { fontFamily: "'Playfair Display', serif" };

interface ChatPageProps {
  user: HushhAgentUser | null;
}

const ChatPage: React.FC<ChatPageProps> = ({ user }) => {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const agent = getAgentById(agentId || 'hushh');
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<LanguageCode>('en-US');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Voice state
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognitionCompat | null>(null);
  
  // Check voice support on mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setVoiceSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: SpeechRecognitionEventCompat) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputValue(transcript);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }
  }, []);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  // Handle language change for speech recognition
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = language;
    }
  }, [language]);
  
  // Send message handler
  const handleSendMessage = useCallback(async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isLoading) return;
    
    // Add user message
    const userMessage = createUserMessage(trimmedInput);
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Convert messages to history format
      const history = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));
      
      // Send to API
      const response = await sendChatMessage({
        message: trimmedInput,
        history,
        agentId: agentId || 'hushh',
        language,
        systemPrompt: agent?.systemPrompt,
      });
      
      if (response.success) {
        const assistantMessage = createAssistantMessage(response.message);
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        // Show error as assistant message
        const errorMessage = createAssistantMessage(
          response.error || 'Sorry, I encountered an error. Please try again.'
        );
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage = createAssistantMessage(
        'Sorry, something went wrong. Please check your connection and try again.'
      );
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }, [inputValue, isLoading, messages, agentId, language, agent]);
  
  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Toggle voice input
  const toggleVoiceInput = () => {
    if (!recognitionRef.current) return;
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };
  
  // Copy message to clipboard
  const copyMessage = async (message: ChatMessage) => {
    await navigator.clipboard.writeText(message.content);
    setCopiedId(message.id);
    setTimeout(() => setCopiedId(null), 2000);
  };
  
  // Clear chat
  const clearChat = () => {
    setMessages([]);
  };
  
  // Get greeting based on language
  const getGreeting = () => {
    switch (language) {
      case 'hi-IN':
        return 'नमस्ते! मैं कैसे मदद कर सकता हूं?';
      case 'ta-IN':
        return 'வணக்கம்! நான் எப்படி உதவ முடியும்?';
      default:
        return 'Hello! How can I help you today?';
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="flex-shrink-0 bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(ROUTES.HOME)}
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Back"
            >
              <FiArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-hushh-blue to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold">{agent?.name.charAt(0) || 'H'}</span>
            </div>
            
            <div>
              <h1 className="font-semibold text-gray-900" style={playfair}>
                {agent?.name || 'Hushh'}
              </h1>
              <p className="text-xs text-gray-500">
                {isLoading ? HUSHH_BRANDING.THINKING_TEXT : 'Online'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors text-sm"
              >
                <FiGlobe className="w-4 h-4 text-gray-500" />
                <span className="hidden sm:inline text-gray-600">
                  {SUPPORTED_LANGUAGES.find(l => l.code === language)?.flag}
                </span>
              </button>
              
              <AnimatePresence>
                {showLanguageMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[160px] z-50"
                  >
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setShowLanguageMenu(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm flex items-center gap-3 hover:bg-gray-50 ${
                          language === lang.code ? 'text-hushh-blue font-medium' : 'text-gray-700'
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.nativeName}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* More Options */}
            <div className="relative group">
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <FiMoreVertical className="w-5 h-5 text-gray-500" />
              </button>
              <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[140px] z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <button
                  onClick={clearChat}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <FiTrash2 className="w-4 h-4" />
                  Clear Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {messages.length === 0 ? (
            // Empty state
            <div className="flex flex-col items-center justify-center h-full py-20 text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-hushh-blue to-blue-600 flex items-center justify-center mb-6">
                <span className="text-white text-3xl font-bold">H</span>
              </div>
              <h2 className="text-2xl font-normal text-gray-900 mb-2" style={playfair}>
                {getGreeting()}
              </h2>
              <p className="text-gray-500 max-w-md">
                Type a message or use voice input to start chatting with {agent?.name || 'Hushh'}.
              </p>
              
              {/* Quick prompts */}
              <div className="flex flex-wrap justify-center gap-2 mt-8">
                {[
                  'Tell me about yourself',
                  'Help me write an email',
                  'Explain something complex',
                  'Creative writing help',
                ].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => setInputValue(prompt)}
                    className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-600 hover:border-hushh-blue hover:text-hushh-blue transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Messages list
            <div className="space-y-6">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  onCopy={() => copyMessage(message)}
                  isCopied={copiedId === message.id}
                />
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-hushh-blue to-blue-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">H</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-2xl">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-sm text-gray-500">{HUSHH_BRANDING.THINKING_TEXT}</span>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>
      
      {/* Input Area */}
      <footer className="flex-shrink-0 bg-white border-t border-gray-100 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-3">
            {/* Voice Button */}
            {voiceSupported && (
              <button
                onClick={toggleVoiceInput}
                className={`p-3 rounded-full transition-all flex-shrink-0 ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                aria-label={isListening ? 'Stop listening' : 'Start voice input'}
              >
                {isListening ? <FiMicOff className="w-5 h-5" /> : <FiMic className="w-5 h-5" />}
              </button>
            )}
            
            {/* Text Input */}
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={isListening ? 'Listening...' : 'Type your message...'}
                rows={1}
                className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-hushh-blue focus:border-transparent text-gray-900 placeholder-gray-400"
                style={{ minHeight: '48px', maxHeight: '200px' }}
                disabled={isListening}
              />
              
              {/* Send Button */}
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className={`absolute right-2 bottom-2 p-2 rounded-xl transition-all ${
                  inputValue.trim() && !isLoading
                    ? 'bg-hushh-blue text-white hover:bg-hushh-blue/90'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                aria-label="Send message"
              >
                {isLoading ? (
                  <FiLoader className="w-5 h-5 animate-spin" />
                ) : (
                  <FiSend className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          
          {/* Voice indicator */}
          {isListening && (
            <p className="text-center text-sm text-red-500 mt-2 animate-pulse">
              🎤 {HUSHH_BRANDING.LISTENING_TEXT}
            </p>
          )}
        </div>
      </footer>
    </div>
  );
};

// Helper function to format markdown to clean text
const formatMessage = (content: string): string => {
  let formatted = content;
  
  // Remove markdown bold (**text** or __text__)
  formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '$1');
  formatted = formatted.replace(/__([^_]+)__/g, '$1');
  
  // Remove standalone italic markers (*text* or _text_) - simplified regex
  // This matches single asterisks that aren't at line start (list items)
  formatted = formatted.replace(/([^\n*])\*([^*\n]+)\*([^\n*]|$)/g, '$1$2$3');
  formatted = formatted.replace(/([^\n_])_([^_\n]+)_([^\n_]|$)/g, '$1$2$3');
  
  // Convert bullet points (* item or - item) to clean bullets (•)
  formatted = formatted.replace(/^\s*[\*\-]\s+/gm, '• ');
  
  // Remove markdown headers (# Header)
  formatted = formatted.replace(/^#+\s+/gm, '');
  
  // Remove code backticks
  formatted = formatted.replace(/`([^`]+)`/g, '$1');
  formatted = formatted.replace(/```[\s\S]*?```/g, (match) => {
    return match.replace(/```\w*\n?/g, '').replace(/```/g, '');
  });
  
  // Clean up extra whitespace
  formatted = formatted.replace(/\n{3,}/g, '\n\n');
  
  return formatted.trim();
};

// Message Bubble Component
interface MessageBubbleProps {
  message: ChatMessage;
  onCopy: () => void;
  isCopied: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onCopy, isCopied }) => {
  const isUser = message.role === 'user';
  const formattedContent = isUser ? message.content : formatMessage(message.content);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-4 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
        isUser 
          ? 'bg-gray-200' 
          : 'bg-gradient-to-br from-hushh-blue to-blue-600'
      }`}>
        <span className={`font-bold ${isUser ? 'text-gray-600' : 'text-white'}`}>
          {isUser ? 'U' : 'H'}
        </span>
      </div>
      
      {/* Message Content */}
      <div className={`flex-1 max-w-[80%] ${isUser ? 'flex justify-end' : ''}`}>
        <div className={`group relative px-4 py-3 rounded-2xl ${
          isUser 
            ? 'bg-hushh-blue text-white rounded-tr-sm' 
            : 'bg-gray-50 text-gray-900 rounded-tl-sm'
        }`}>
          {/* Message text with proper formatting */}
          <div className="whitespace-pre-wrap break-words text-[15px] leading-relaxed">
            {formattedContent}
          </div>
          
          {/* Copy button (for assistant messages) */}
          {!isUser && (
            <button
              onClick={onCopy}
              className="absolute -bottom-8 left-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
            >
              {isCopied ? (
                <>
                  <FiCheck className="w-3 h-3" />
                  Copied!
                </>
              ) : (
                <>
                  <FiCopy className="w-3 h-3" />
                  Copy
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// SpeechRecognition types for browser compatibility
interface SpeechRecognitionResultItem {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResult {
  0: SpeechRecognitionResultItem;
  length: number;
  isFinal: boolean;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEventCompat {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionCompat {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEventCompat) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionCompat;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export default ChatPage;
