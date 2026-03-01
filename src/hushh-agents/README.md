# Hushh Agents

## 🚀 Quick Start

### 1. Set Up API Keys

Run the setup script to configure your Gemini API keys:

```bash
./scripts/setup-gemini-api-keys.sh
```

Or manually:
1. Go to https://aistudio.google.com/apikey
2. Create 4 API keys (no expiry date!)
3. Add to `.env.local`:
   ```
   VITE_GEMINI_API_KEY=your-primary-key
   VITE_GEMINI_API_KEY_FALLBACK_1=your-fallback-key-1
   VITE_GEMINI_API_KEY_FALLBACK_2=your-fallback-key-2
   VITE_GEMINI_API_KEY_FALLBACK_3=your-fallback-key-3
   ```

### 2. Start Development

```bash
npm run dev
# Visit: http://localhost:5173/hushh-agents
```

---

Multi-lingual AI Chat Platform powered by GCP Gemini Live API.

## Overview

Hushh Agents is a production-ready AI chat platform that allows users to interact with intelligent agents in multiple languages (Hindi, English, Tamil). Built on top of Google Cloud Platform's Gemini API, it provides:

- **Text Chat**: Natural language conversations with AI
- **Voice Chat** (Pro): Real-time voice conversations using Gemini Live API
- **Multi-lingual Support**: Hindi (हिंदी), English, Tamil (தமிழ்)
- **Subscription Tiers**: Limited (free) and Pro (premium features)

## Architecture

```
src/hushh-agents/
├── App.tsx                    # Main app with routing & auth
├── README.md                  # This file
│
├── core/                      # Pure TypeScript - no dependencies
│   ├── constants.ts           # Configuration, agents, routes
│   └── types.ts               # Type definitions
│
├── services/
│   └── hushhIntelligenceService.ts  # Gemini API wrapper
│
├── hooks/
│   └── useAuth.ts             # Supabase authentication
│
└── pages/
    ├── index.tsx              # Entry point
    ├── HomePage.tsx           # Agent selection grid
    └── ChatPage.tsx           # Chat interface
```

## Routes

| Route | Description |
|-------|-------------|
| `/hushh-agents` | Home - Agent selection |
| `/hushh-agents/chat/:agentId` | Chat with specific agent |

## Key Features

### Branding
- All user-facing text uses "Hushh" branding
- Never exposes "Gemini" or "Google" to users
- White-labeled AI experience

### Available Agents

1. **Hushh** (Free)
   - General-purpose AI assistant
   - Text chat only
   - 50 messages/day limit

2. **Hushh Pro** (Premium)
   - All Hushh features
   - Voice conversations
   - Unlimited messages
   - Priority processing

### Supported Languages

| Code | Language | Native Name |
|------|----------|-------------|
| `en-US` | English | English |
| `en-IN` | English (India) | English (India) |
| `hi-IN` | Hindi | हिंदी |
| `ta-IN` | Tamil | தமிழ் |

## Environment Variables

```env
# Required
VITE_GEMINI_API_KEY=your_gemini_api_key

# Existing Supabase config (already in your .env)
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## Database Tables

Run the migration: `supabase/migrations/20260224000000_add_hushh_agents_tables.sql`

- `hushh_agents` - Available AI agents
- `hushh_agent_conversations` - Chat sessions
- `hushh_agent_messages` - Individual messages
- `hushh_agent_subscriptions` - User subscription tiers
- `hushh_agent_usage` - Analytics tracking

## Usage

### Accessing the Module

Navigate to: `https://your-domain.com/hushh-agents`

### Authentication

- Uses existing Supabase OAuth (Google/Apple)
- Redirects unauthenticated users to login
- Returns to `/hushh-agents` after successful auth

### Starting a Chat

1. Sign in with Google or Apple
2. Select an agent (Hushh or Hushh Pro)
3. Start chatting!

### Voice Chat (Pro only)

1. Upgrade to Pro tier
2. Click the microphone button
3. Speak naturally
4. Hushh will respond with voice

## API Integration

### Text Chat

```typescript
import { sendChatMessage } from './services/hushhIntelligenceService';

const response = await sendChatMessage({
  message: "Hello!",
  history: [],
  agentId: 'hushh',
  language: 'en-US',
});

console.log(response.message);
```

### Voice Session

```typescript
import { HushhVoiceSession } from './services/hushhIntelligenceService';

const session = new HushhVoiceSession({
  agentId: 'hushh-pro',
  language: 'hi-IN',
  onMessage: (text) => console.log('Received:', text),
  onAudio: (data) => playAudio(data),
  onError: (err) => console.error(err),
  onStateChange: (state) => console.log('State:', state),
});

await session.connect();
session.sendText("नमस्ते!");
```

## Future Roadmap

### Phase 2: Enhanced Voice
- [ ] GCP Speech-to-Text for input
- [ ] Audio playback implementation
- [ ] Voice activity detection

### Phase 3: Subscription System
- [ ] Stripe/Razorpay integration
- [ ] Rate limiting enforcement
- [ ] Usage analytics dashboard

### Phase 4: Additional Agents
- [ ] Hushh Creative (writing assistant)
- [ ] Hushh Code (programming helper)
- [ ] Custom agent builder

## Testing

```bash
# Run the development server
npm run dev

# Navigate to
open http://localhost:5173/hushh-agents
```

## Contributing

This module follows clean architecture principles:
- Keep core layer free of external dependencies
- Use services for API calls
- Keep pages simple - delegate logic to hooks

---

**Powered by Hushh Intelligence** 🤖
