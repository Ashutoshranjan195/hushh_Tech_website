# Hushh Folio - Firebase Deployment Guide

## Overview

This guide explains how to deploy portfolios to Firebase Hosting for https://hushh-folio.web.app/

## Architecture

1. **Frontend (Hushh AI App)**: 8-step wizard for portfolio creation
2. **Supabase Edge Function**: `portfolio-deploy` generates HTML and updates DB
3. **Firebase Hosting**: Serves static portfolio pages

## Files Created

- `firebase/hushh-folio/firebase.json` - Firebase hosting configuration
- `firebase/hushh-folio/.firebaserc` - Firebase project settings
- `supabase/functions/portfolio-deploy/index.ts` - Deploy edge function
- `supabase/functions/portfolio-deploy/deno.json` - Deno config

## Deployment Steps

### Step 1: Deploy Edge Function to Supabase

```bash
# Using Supabase Management API
curl -X POST "https://api.supabase.com/v1/projects/docsqanvndfzxttqbgoi/functions" \
  -H "Authorization: Bearer YOUR_SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"slug": "portfolio-deploy", "verify_jwt": true}'
```

Or via Supabase Dashboard:
1. Go to https://supabase.com/dashboard/project/docsqanvndfzxttqbgoi/functions
2. Click "Deploy New Function"
3. Upload `supabase/functions/portfolio-deploy/`

### Step 2: Setup Firebase Project

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in the project
cd firebase/hushh-folio
firebase use hushh-folio
```

### Step 3: Deploy Initial Firebase Site

```bash
cd firebase/hushh-folio

# Create a simple index.html for root
mkdir -p dist
echo '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Hushh Folio</title></head><body><h1>Hushh Folio</h1><p>Create your portfolio at hushh.ai</p></body></html>' > dist/index.html

# Deploy to Firebase
firebase deploy --only hosting
```

### Step 4: Database Schema

Ensure portfolios table has these columns:
- `status` VARCHAR(50) - 'draft' or 'published'
- `is_published` BOOLEAN
- `firebase_url` TEXT
- `generated_html` TEXT
- `published_at` TIMESTAMPTZ
- `persona_id` VARCHAR(50)
- `custom_styling` JSONB

### Step 5: Test the Flow

1. Go to https://hushh.ai/hushh-ai/portfolio
2. Complete 8-step wizard
3. Click "Publish Portfolio"
4. Edge function generates HTML and stores in DB
5. Portfolio URL: https://hushh-folio.web.app/{slug}

## Current Status

- [x] Firebase config files created
- [x] Portfolio-deploy edge function created
- [ ] Edge function deployment (needs Supabase login)
- [ ] Firebase initial deployment (needs firebase login)
- [ ] Test end-to-end flow

## Notes

The current flow stores generated HTML in Supabase. For full Firebase hosting:
1. Use Firebase Admin SDK in the edge function
2. OR create a Cloud Function that syncs from Supabase to Firebase

## Alternative: Vercel Hosting

Since hushh.ai is on Vercel, portfolios could be served from:
- hushh.ai/p/{slug}

This would avoid Firebase entirely and use Next.js dynamic routes.
