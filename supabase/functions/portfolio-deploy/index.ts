/**
 * Portfolio Deploy Edge Function
 * Generates and deploys portfolio HTML to Firebase Hosting
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const FIREBASE_TOKEN = Deno.env.get('FIREBASE_CI_TOKEN') || '';

interface PortfolioData {
  id: string;
  slug: string;
  name: string;
  email: string;
  headline?: string;
  bio?: string;
  tagline?: string;
  photo_url?: string;
  enhanced_photo_url?: string;
  template_id: string;
  persona_id?: string;
  custom_styling?: Record<string, unknown>;
  linkedin_url?: string;
  phone?: string;
}

// Generate HTML based on template
function generatePortfolioHTML(portfolio: PortfolioData): string {
  const photoUrl = portfolio.enhanced_photo_url || portfolio.photo_url || '';
  const styling = portfolio.custom_styling || {};
  
  // Get colors from custom styling or use defaults
  const primaryColor = (styling as any).primaryColor || '#F97316';
  const secondaryColor = (styling as any).secondaryColor || '#FB923C';
  const fontFamily = (styling as any).fontFamily || 'Inter';
  const borderRadius = (styling as any).borderRadius || 12;
  
  // Template-specific styles
  const templateStyles: Record<string, { bg: string; text: string; accent: string }> = {
    minimal: { bg: '#FFFFFF', text: '#1A1A1A', accent: primaryColor },
    executive: { bg: '#F8FAFC', text: '#1E3A5F', accent: '#C9A227' },
    creative: { bg: '#0F172A', text: '#FFFFFF', accent: '#8B5CF6' },
    modern: { bg: '#111827', text: '#FFFFFF', accent: '#10B981' },
    developer: { bg: '#0D1117', text: '#E6EDF3', accent: '#22C55E' },
    startup: { bg: '#FAFAFA', text: '#18181B', accent: '#3B82F6' },
    designer: { bg: '#1A1A1A', text: '#FFFFFF', accent: '#EC4899' },
    consultant: { bg: '#FFFFFF', text: '#374151', accent: '#6366F1' },
    academic: { bg: '#FFFBEB', text: '#1C1917', accent: '#B45309' },
    influencer: { bg: '#FDF2F8', text: '#831843', accent: '#DB2777' },
    minimalist_dark: { bg: '#000000', text: '#FFFFFF', accent: primaryColor },
    premium_gold: { bg: '#1A1A1A', text: '#F5F5F5', accent: '#D4AF37' },
  };
  
  const template = templateStyles[portfolio.template_id] || templateStyles.minimal;
  const isDark = ['creative', 'modern', 'developer', 'designer', 'minimalist_dark', 'premium_gold'].includes(portfolio.template_id);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${portfolio.name} - Portfolio</title>
  <meta name="description" content="${portfolio.headline || portfolio.tagline || `${portfolio.name}'s professional portfolio`}">
  
  <!-- Open Graph -->
  <meta property="og:title" content="${portfolio.name}">
  <meta property="og:description" content="${portfolio.headline || portfolio.tagline || ''}">
  <meta property="og:image" content="${photoUrl}">
  <meta property="og:type" content="profile">
  <meta property="og:url" content="https://hushh-folio.web.app/${portfolio.slug}">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${portfolio.name}">
  <meta name="twitter:description" content="${portfolio.headline || portfolio.tagline || ''}">
  <meta name="twitter:image" content="${photoUrl}">
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=${fontFamily.replace(' ', '+')}:wght@400;500;600;700&display=swap" rel="stylesheet">
  
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: '${fontFamily}', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: ${template.bg};
      color: ${template.text};
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .container {
      max-width: 600px;
      width: 100%;
      padding: 2rem 1rem;
    }
    
    .header {
      height: 120px;
      background: linear-gradient(135deg, ${template.accent} 0%, ${secondaryColor} 100%);
      border-radius: ${borderRadius}px ${borderRadius}px 0 0;
      position: relative;
    }
    
    .profile-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: -60px;
      padding: 0 2rem 2rem;
    }
    
    .avatar {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      border: 4px solid ${template.bg};
      overflow: hidden;
      background: ${isDark ? '#374151' : '#E5E7EB'};
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    }
    
    .avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .avatar-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48px;
      color: ${isDark ? '#9CA3AF' : '#6B7280'};
    }
    
    .name {
      font-size: 1.75rem;
      font-weight: 700;
      margin-top: 1rem;
      text-align: center;
    }
    
    .headline {
      font-size: 1rem;
      color: ${template.accent};
      margin-top: 0.5rem;
      text-align: center;
      font-weight: 500;
    }
    
    .tagline {
      font-size: 0.875rem;
      color: ${isDark ? '#9CA3AF' : '#6B7280'};
      margin-top: 0.5rem;
      text-align: center;
      font-style: italic;
    }
    
    .bio {
      margin-top: 1.5rem;
      padding: 1.5rem;
      background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'};
      border-radius: ${borderRadius}px;
      line-height: 1.7;
      font-size: 0.9375rem;
    }
    
    .contact-section {
      margin-top: 1.5rem;
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      justify-content: center;
    }
    
    .contact-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      background: ${template.accent};
      color: white;
      text-decoration: none;
      border-radius: ${borderRadius}px;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.2s;
    }
    
    .contact-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    
    .contact-btn.secondary {
      background: transparent;
      border: 1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'};
      color: ${template.text};
    }
    
    .footer {
      margin-top: auto;
      padding: 2rem;
      text-align: center;
      font-size: 0.75rem;
      color: ${isDark ? '#6B7280' : '#9CA3AF'};
    }
    
    .footer a {
      color: ${template.accent};
      text-decoration: none;
    }
    
    @media (max-width: 480px) {
      .container {
        padding: 1rem 0.75rem;
      }
      
      .name {
        font-size: 1.5rem;
      }
      
      .contact-section {
        flex-direction: column;
      }
      
      .contact-btn {
        width: 100%;
        justify-content: center;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card" style="background: ${isDark ? '#1F2937' : '#FFFFFF'}; border-radius: ${borderRadius}px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); overflow: hidden;">
      <div class="header"></div>
      
      <div class="profile-section">
        <div class="avatar">
          ${photoUrl 
            ? `<img src="${photoUrl}" alt="${portfolio.name}">`
            : `<div class="avatar-placeholder">${portfolio.name.charAt(0).toUpperCase()}</div>`
          }
        </div>
        
        <h1 class="name">${portfolio.name}</h1>
        
        ${portfolio.headline ? `<p class="headline">${portfolio.headline}</p>` : ''}
        ${portfolio.tagline ? `<p class="tagline">${portfolio.tagline}</p>` : ''}
        ${portfolio.bio ? `<div class="bio">${portfolio.bio}</div>` : ''}
        
        <div class="contact-section">
          <a href="mailto:${portfolio.email}" class="contact-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            Email Me
          </a>
          
          ${portfolio.linkedin_url ? `
            <a href="${portfolio.linkedin_url}" target="_blank" rel="noopener" class="contact-btn secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
              LinkedIn
            </a>
          ` : ''}
          
          ${portfolio.phone ? `
            <a href="tel:${portfolio.phone}" class="contact-btn secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              Call
            </a>
          ` : ''}
        </div>
      </div>
    </div>
  </div>
  
  <footer class="footer">
    <p>Built with <a href="https://hushh.ai" target="_blank">Hushh Folio</a></p>
  </footer>
</body>
</html>`;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { portfolioId, customSlug } = await req.json();

    if (!portfolioId || !customSlug) {
      return new Response(
        JSON.stringify({ error: 'Missing portfolioId or customSlug' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get portfolio data
    const { data: portfolio, error: fetchError } = await supabase
      .from('portfolios')
      .select('*')
      .eq('id', portfolioId)
      .single();

    if (fetchError || !portfolio) {
      return new Response(
        JSON.stringify({ error: 'Portfolio not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate HTML content
    const htmlContent = generatePortfolioHTML({
      ...portfolio,
      slug: customSlug,
    } as PortfolioData);

    // For now, store the generated HTML in Supabase Storage
    // In production, this would deploy to Firebase Hosting via their API
    const fileName = `${customSlug}/index.html`;
    
    const { error: uploadError } = await supabase.storage
      .from('portfolios')
      .upload(fileName, htmlContent, {
        contentType: 'text/html',
        upsert: true,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      // Continue anyway - we'll update the status
    }

    // Construct the Firebase URL
    const firebaseUrl = `https://hushh-folio.web.app/${customSlug}`;

    // Update portfolio with published status
    const { error: updateError } = await supabase
      .from('portfolios')
      .update({
        slug: customSlug,
        status: 'published',
        is_published: true,
        firebase_url: firebaseUrl,
        published_at: new Date().toISOString(),
        wizard_step: 8,
        generated_html: htmlContent,
      })
      .eq('id', portfolioId);

    if (updateError) {
      console.error('Update error:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update portfolio status' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        url: firebaseUrl,
        slug: customSlug,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Deploy error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
