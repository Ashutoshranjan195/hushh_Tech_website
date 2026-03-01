#!/bin/bash
# ============================================================================
# Hushh Agents - Gemini API Keys Setup Script
# ============================================================================
# This script helps create and test multiple Gemini API keys for production
# reliability with automatic fallback.
#
# Usage:
#   ./scripts/setup-gemini-api-keys.sh
#
# Prerequisites:
#   - gcloud CLI authenticated (gcloud auth login)
#   - Access to hushone-app project
# ============================================================================

set -e

PROJECT_ID="hushone-app"
KEYS_FILE=".env.gemini-keys"

echo "==========================================="
echo " Hushh Agents - Gemini API Keys Setup"
echo "==========================================="
echo ""

# Check gcloud authentication
echo "📋 Checking gcloud authentication..."
if ! gcloud auth list --filter="status:ACTIVE" --format="value(account)" 2>/dev/null | head -1; then
    echo "❌ Not authenticated. Please run: gcloud auth login"
    exit 1
fi

ACCOUNT=$(gcloud auth list --filter="status:ACTIVE" --format="value(account)" 2>/dev/null | head -1)
echo "✅ Authenticated as: $ACCOUNT"
echo ""

# Instructions for creating API keys
echo "==========================================="
echo " CREATE API KEYS (Manual Steps)"
echo "==========================================="
echo ""
echo "Google Gemini API keys need to be created via AI Studio (not gcloud CLI)."
echo ""
echo "1. Open: https://aistudio.google.com/apikey"
echo ""
echo "2. Create 4 API keys with these names:"
echo "   - HushhAgents-Primary"
echo "   - HushhAgents-Fallback1"
echo "   - HushhAgents-Fallback2"
echo "   - HushhAgents-Fallback3"
echo ""
echo "3. IMPORTANT: Do NOT set an expiration date (keys should never expire)"
echo ""
echo "4. Copy each key and paste below when prompted."
echo ""
echo "==========================================="
echo ""

# Prompt for keys
read -p "Enter HushhAgents-Primary key: " KEY_PRIMARY
read -p "Enter HushhAgents-Fallback1 key: " KEY_FALLBACK1
read -p "Enter HushhAgents-Fallback2 key: " KEY_FALLBACK2
read -p "Enter HushhAgents-Fallback3 key: " KEY_FALLBACK3

echo ""
echo "==========================================="
echo " TESTING API KEYS"
echo "==========================================="
echo ""

# Function to test a key
test_key() {
    local KEY_NAME=$1
    local KEY_VALUE=$2
    
    if [ -z "$KEY_VALUE" ]; then
        echo "⏭️  $KEY_NAME: Skipped (empty)"
        return 1
    fi
    
    echo "🔍 Testing $KEY_NAME..."
    
    RESPONSE=$(curl -s -w "\n%{http_code}" \
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=$KEY_VALUE" \
        -H 'Content-Type: application/json' \
        -d '{"contents":[{"parts":[{"text":"Say hello in one word"}]}]}')
    
    HTTP_CODE=$(echo "$RESPONSE" | tail -1)
    BODY=$(echo "$RESPONSE" | head -n -1)
    
    if [ "$HTTP_CODE" = "200" ]; then
        # Extract the response text
        TEXT=$(echo "$BODY" | jq -r '.candidates[0].content.parts[0].text' 2>/dev/null || echo "")
        echo "✅ $KEY_NAME: WORKING (Response: $TEXT)"
        return 0
    else
        ERROR=$(echo "$BODY" | jq -r '.error.message' 2>/dev/null || echo "Unknown error")
        echo "❌ $KEY_NAME: FAILED (HTTP $HTTP_CODE - $ERROR)"
        return 1
    fi
}

# Test all keys
WORKING_KEYS=0

if test_key "Primary" "$KEY_PRIMARY"; then
    ((WORKING_KEYS++))
fi

if test_key "Fallback1" "$KEY_FALLBACK1"; then
    ((WORKING_KEYS++))
fi

if test_key "Fallback2" "$KEY_FALLBACK2"; then
    ((WORKING_KEYS++))
fi

if test_key "Fallback3" "$KEY_FALLBACK3"; then
    ((WORKING_KEYS++))
fi

echo ""
echo "==========================================="
echo " RESULTS: $WORKING_KEYS/4 keys working"
echo "==========================================="
echo ""

if [ $WORKING_KEYS -eq 0 ]; then
    echo "❌ No working keys found. Please check your API keys."
    exit 1
fi

# Save keys to a secure file
echo "💾 Saving keys to $KEYS_FILE..."
cat > "$KEYS_FILE" << EOF
# Gemini API Keys for Hushh Agents
# Generated: $(date)
# DO NOT COMMIT THIS FILE!

VITE_GEMINI_API_KEY=$KEY_PRIMARY
VITE_GEMINI_API_KEY_FALLBACK_1=$KEY_FALLBACK1
VITE_GEMINI_API_KEY_FALLBACK_2=$KEY_FALLBACK2
VITE_GEMINI_API_KEY_FALLBACK_3=$KEY_FALLBACK3
EOF

echo "✅ Keys saved to $KEYS_FILE"
echo ""

# Create/Update .env.local
if [ -f ".env.local" ]; then
    echo "📝 Updating .env.local with new keys..."
    # Remove old Gemini keys
    grep -v "^VITE_GEMINI_API_KEY" .env.local > .env.local.tmp || true
    # Add new keys
    cat "$KEYS_FILE" >> .env.local.tmp
    mv .env.local.tmp .env.local
    echo "✅ Updated .env.local"
else
    echo "📝 Creating .env.local from .env.local.example..."
    cp .env.local.example .env.local
    # Replace placeholder keys with real keys
    sed -i.bak "s/YOUR_GEMINI_API_KEY/$KEY_PRIMARY/g" .env.local
    sed -i.bak "s/YOUR_GEMINI_FALLBACK_KEY_1/$KEY_FALLBACK1/g" .env.local
    sed -i.bak "s/YOUR_GEMINI_FALLBACK_KEY_2/$KEY_FALLBACK2/g" .env.local
    sed -i.bak "s/YOUR_GEMINI_FALLBACK_KEY_3/$KEY_FALLBACK3/g" .env.local
    rm .env.local.bak 2>/dev/null || true
    echo "✅ Created .env.local"
fi

echo ""
echo "==========================================="
echo " NEXT STEPS"
echo "==========================================="
echo ""
echo "1. Restart your dev server: npm run dev"
echo ""
echo "2. Test the chat at: http://localhost:5173/hushh-agents"
echo ""
echo "3. For production (Vercel), add these env vars:"
echo "   - VITE_GEMINI_API_KEY"
echo "   - VITE_GEMINI_API_KEY_FALLBACK_1"
echo "   - VITE_GEMINI_API_KEY_FALLBACK_2"
echo "   - VITE_GEMINI_API_KEY_FALLBACK_3"
echo ""
echo "==========================================="
echo " DONE! 🚀"
echo "==========================================="
