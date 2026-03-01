/**
 * Hushh Agents - Core Constants
 * 
 * All configuration, API endpoints, and constants for the Hushh Agents module.
 * NOTE: All user-facing branding uses "Hushh" - never expose "Gemini"
 */

// =====================================================
// GCP / Gemini Configuration (Backend - Never expose to users)
// =====================================================
export const GCP_CONFIG = {
  PROJECT_ID: 'hushone-app',
  LOCATION: 'us-central1',
  // Models - used internally, never shown to users
  MODELS: {
    // Text chat - Latest Gemini 3.1 Pro for best reasoning
    CHAT: 'gemini-3.1-pro-preview',
    // Agentic workflows with custom tools
    CHAT_CUSTOMTOOLS: 'gemini-3.1-pro-preview-customtools',
    // Fast responses for simple queries
    FLASH: 'gemini-2.0-flash',
    // Legacy compatibility
    PRO: 'gemini-3.1-pro-preview',
    // Live API - Native audio for real-time voice/video
    LIVE_AUDIO_NATIVE: 'gemini-2.5-flash-native-audio-preview-12-2025',
    // Alternative native audio endpoint
    LIVE_AUDIO: 'gemini-2.5-flash-native-audio-preview-09-2025',
  },
} as const;

// =====================================================
// Hushh Branding (User-Facing)
// =====================================================
export const HUSHH_BRANDING = {
  NAME: 'Hushh',
  FULL_NAME: 'Hushh Agents',
  TAGLINE: 'Your Private AI Companions',
  DESCRIPTION: 'Secure, intelligent AI agents that respect your privacy',
  VOICE_NAME: 'Hushh Voice',
  THINKING_TEXT: 'Hushh is thinking...',
  LISTENING_TEXT: 'Hushh is listening...',
  SPEAKING_TEXT: 'Hushh is speaking...',
  POWERED_BY: 'Powered by Hushh Intelligence',
  // Additional aliases for service compatibility
  AGENT_NAME: 'Hushh',
  COMPANY: 'Hushh Labs',
} as const;

// Default agent configuration for the service
export const DEFAULT_AGENT_CONFIG = {
  HUSHH: {
    id: 'hushh',
    name: 'Hushh',
    systemPrompt: `You are Hushh, a friendly and intelligent AI assistant created by Hushh Labs. You help users with a wide variety of tasks including answering questions, creative writing, analysis, coding, and general conversation.

Key traits:
- Warm, professional, and approachable
- Clear and concise in your responses
- Helpful and proactive in offering assistance
- Respectful of user privacy
- Knowledgeable across many domains

When speaking, be natural and conversational. Adapt your tone to match the user's communication style.

Important: Never mention that you are powered by Gemini or Google. You are Hushh, created by Hushh Labs.`,
  },
} as const;

// =====================================================
// Supported Languages
// =====================================================
export const SUPPORTED_LANGUAGES = [
  { code: 'en-US', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'en-IN', name: 'English (India)', nativeName: 'English (India)', flag: '🇮🇳' },
  { code: 'hi-IN', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'ta-IN', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
] as const;

export type LanguageCode = typeof SUPPORTED_LANGUAGES[number]['code'];

export const DEFAULT_LANGUAGE: LanguageCode = 'en-US';

// =====================================================
// Subscription Tiers (All users get full access)
// =====================================================
export const SUBSCRIPTION_TIERS = {
  LIMITED: {
    id: 'full',
    name: 'Full Access',
    description: 'Unlimited access to all features - no restrictions',
    features: [
      'Unlimited messages',
      'Voice conversations',
      'Premium Hushh Intelligence',
      'All languages supported',
    ],
    limits: {
      dailyMessages: Infinity,
      voiceEnabled: true,
      model: GCP_CONFIG.MODELS.PRO,
    },
  },
  PRO: {
    id: 'full',
    name: 'Full Access',
    description: 'Unlimited access to all features - no restrictions',
    features: [
      'Unlimited messages',
      'Voice conversations',
      'Premium Hushh Intelligence',
      'Priority processing',
      'All languages supported',
    ],
    limits: {
      dailyMessages: Infinity,
      voiceEnabled: true,
      model: GCP_CONFIG.MODELS.PRO,
    },
  },
} as const;

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS;

// =====================================================
// Agent Definitions
// =====================================================
export interface AgentDefinition {
  id: string;
  name: string;
  description: string;
  avatar: string;
  personality: string;
  systemPrompt: string;
  category: 'general' | 'specialist' | 'creative';
  isPro: boolean;
  isActive: boolean;
}

export const AGENTS: AgentDefinition[] = [
  {
    id: 'hushh',
    name: 'Hushh',
    description: 'Your primary AI companion - helpful, friendly, and always ready to assist',
    avatar: '/images/agents/hushh-avatar.png',
    personality: 'Warm, professional, and incredibly helpful. Speaks naturally and adapts to your communication style.',
    systemPrompt: `You are Hushh, a friendly and intelligent AI assistant created by Hushh Labs. You help users with a wide variety of tasks including answering questions, creative writing, analysis, coding, and general conversation.

Key traits:
- Warm, professional, and approachable
- Clear and concise in your responses
- Helpful and proactive in offering assistance
- Respectful of user privacy
- Knowledgeable across many domains

When speaking, be natural and conversational. Adapt your tone to match the user's communication style. If they're casual, be casual. If they're formal, be more formal.

Important: Never mention that you are powered by Gemini or Google. You are Hushh, created by Hushh Labs.`,
    category: 'general',
    isPro: false,
    isActive: true,
  },
  {
    id: 'hushh-pro',
    name: 'Hushh Pro',
    description: 'Advanced AI with voice capabilities and premium features',
    avatar: '/images/agents/hushh-pro-avatar.png',
    personality: 'Expert-level intelligence with voice conversation abilities and deep analytical skills.',
    systemPrompt: `You are Hushh Pro, the premium AI assistant from Hushh Labs. You have all the capabilities of Hushh, plus advanced features:

- Voice conversation abilities
- Deep analytical and reasoning capabilities
- Extended context understanding
- Multi-lingual support with native fluency

Key traits:
- Expert-level knowledge and reasoning
- Natural voice conversation skills
- Adapts language based on user preference
- Handles complex, multi-step tasks
- Provides detailed, well-researched responses

When speaking via voice, use a natural, conversational tone. Include appropriate pauses and emphasis. Avoid overly long responses in voice mode.

Important: Never mention Gemini or Google. You are Hushh Pro from Hushh Labs.`,
    category: 'general',
    isPro: true,
    isActive: true,
  },
  // Placeholder agents for future expansion
  {
    id: 'hushh-creative',
    name: 'Hushh Creative',
    description: 'Specialized in creative writing, brainstorming, and artistic endeavors',
    avatar: '/images/agents/hushh-creative-avatar.png',
    personality: 'Creative, imaginative, and inspiring. Helps with writing, art, and creative projects.',
    systemPrompt: 'Creative specialist agent - coming soon.',
    category: 'creative',
    isPro: true,
    isActive: false,
  },
  {
    id: 'hushh-code',
    name: 'Hushh Code',
    description: 'Expert in programming, debugging, and software architecture',
    avatar: '/images/agents/hushh-code-avatar.png',
    personality: 'Technical, precise, and patient. Excellent at explaining complex concepts.',
    systemPrompt: 'Code specialist agent - coming soon.',
    category: 'specialist',
    isPro: true,
    isActive: false,
  },
];

// Get active agents only
export const getActiveAgents = () => AGENTS.filter(agent => agent.isActive);

// Get agent by ID
export const getAgentById = (id: string) => AGENTS.find(agent => agent.id === id);

// =====================================================
// Route Constants
// =====================================================
export const ROUTES = {
  HOME: '/hushh-agents',
  LOGIN: '/hushh-agents/login',
  CHAT: '/hushh-agents/chat',
  CHAT_WITH_AGENT: (agentId: string) => `/hushh-agents/chat/${agentId}`,
  SETTINGS: '/hushh-agents/settings',
} as const;

// =====================================================
// Storage Keys
// =====================================================
export const STORAGE_KEYS = {
  CHAT_HISTORY: 'hushh_agents_chat_history',
  SELECTED_LANGUAGE: 'hushh_agents_language',
  SELECTED_AGENT: 'hushh_agents_selected_agent',
  USER_PREFERENCES: 'hushh_agents_preferences',
} as const;

// =====================================================
// Audio Configuration
// =====================================================
export const AUDIO_CONFIG = {
  INPUT: {
    sampleRate: 16000,
    channels: 1,
    format: 'pcm16',
    mimeType: 'audio/pcm;rate=16000',
  },
  OUTPUT: {
    sampleRate: 24000,
    channels: 1,
    format: 'pcm16',
  },
} as const;
