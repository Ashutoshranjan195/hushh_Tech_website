/**
 * Public Portfolio Page - Dynamic Route
 * Serves published portfolios at /p/{slug}
 * Alternative to Firebase hosting - uses Vercel
 */

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Button,
  Spinner,
  Link,
} from '@chakra-ui/react';
import config from '../../resources/config/config';

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
  status: string;
  is_published: boolean;
}

// Template color schemes
const TEMPLATE_STYLES: Record<string, { bg: string; text: string; accent: string; isDark: boolean }> = {
  minimal: { bg: '#FFFFFF', text: '#1A1A1A', accent: '#F97316', isDark: false },
  executive: { bg: '#F8FAFC', text: '#1E3A5F', accent: '#C9A227', isDark: false },
  creative: { bg: '#0F172A', text: '#FFFFFF', accent: '#8B5CF6', isDark: true },
  modern: { bg: '#111827', text: '#FFFFFF', accent: '#10B981', isDark: true },
  developer: { bg: '#0D1117', text: '#E6EDF3', accent: '#22C55E', isDark: true },
  startup: { bg: '#FAFAFA', text: '#18181B', accent: '#3B82F6', isDark: false },
  designer: { bg: '#1A1A1A', text: '#FFFFFF', accent: '#EC4899', isDark: true },
  consultant: { bg: '#FFFFFF', text: '#374151', accent: '#6366F1', isDark: false },
  academic: { bg: '#FFFBEB', text: '#1C1917', accent: '#B45309', isDark: false },
  influencer: { bg: '#FDF2F8', text: '#831843', accent: '#DB2777', isDark: false },
  minimalist_dark: { bg: '#000000', text: '#FFFFFF', accent: '#F97316', isDark: true },
  premium_gold: { bg: '#1A1A1A', text: '#F5F5F5', accent: '#D4AF37', isDark: true },
};

export default function PublicPortfolioPage() {
  const { slug } = useParams<{ slug: string }>();
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!slug || !config.supabaseClient) {
        setError('Portfolio not found');
        setIsLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await config.supabaseClient
          .from('portfolios')
          .select('*')
          .eq('slug', slug)
          .eq('is_published', true)
          .single();

        if (fetchError || !data) {
          setError('Portfolio not found');
        } else {
          setPortfolio(data);
        }
      } catch (err) {
        console.error('Error fetching portfolio:', err);
        setError('Failed to load portfolio');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolio();
  }, [slug]);

  // Loading state
  if (isLoading) {
    return (
      <Flex h="100vh" align="center" justify="center" bg="#0A0A0A">
        <VStack spacing={4}>
          <Spinner size="xl" color="#F97316" />
          <Text color="gray.400">Loading portfolio...</Text>
        </VStack>
      </Flex>
    );
  }

  // Error state
  if (error || !portfolio) {
    return (
      <Flex h="100vh" align="center" justify="center" bg="#0A0A0A">
        <VStack spacing={6} textAlign="center" maxW="400px" px={4}>
          <Text fontSize="6xl">🔍</Text>
          <VStack spacing={2}>
            <Text fontSize="2xl" fontWeight="bold" color="white">
              Portfolio Not Found
            </Text>
            <Text color="gray.400">
              The portfolio you're looking for doesn't exist or hasn't been published yet.
            </Text>
          </VStack>
          <Button
            as="a"
            href="/"
            bg="linear-gradient(135deg, #F97316 0%, #FB923C 100%)"
            color="white"
            _hover={{ transform: 'translateY(-2px)' }}
          >
            Go to Hushh AI
          </Button>
        </VStack>
      </Flex>
    );
  }

  // Get template styles
  const templateStyle = TEMPLATE_STYLES[portfolio.template_id] || TEMPLATE_STYLES.minimal;
  const styling = portfolio.custom_styling || {};
  const primaryColor = (styling as any).primaryColor || templateStyle.accent;
  const fontFamily = (styling as any).fontFamily || 'Inter';
  const borderRadius = (styling as any).borderRadius || 12;
  
  const photoUrl = portfolio.enhanced_photo_url || portfolio.photo_url;

  // Set document title
  useEffect(() => {
    document.title = `${portfolio.name} - Portfolio`;
  }, [portfolio.name]);

  return (
    <>
      <Box
        minH="100vh"
        bg={templateStyle.bg}
        color={templateStyle.text}
        fontFamily={`'${fontFamily}', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`}
      >
        <Flex
          direction="column"
          align="center"
          minH="100vh"
          py={8}
          px={4}
        >
          {/* Portfolio Card */}
          <Box
            w="full"
            maxW="600px"
            bg={templateStyle.isDark ? '#1F2937' : 'white'}
            borderRadius={`${borderRadius}px`}
            boxShadow="0 8px 32px rgba(0,0,0,0.12)"
            overflow="hidden"
          >
            {/* Header Gradient */}
            <Box
              h="120px"
              bg={`linear-gradient(135deg, ${primaryColor} 0%, ${templateStyle.accent} 100%)`}
            />

            {/* Profile Section */}
            <VStack spacing={4} px={8} pb={8} mt="-60px">
              {/* Avatar */}
              <Box
                w="120px"
                h="120px"
                borderRadius="full"
                overflow="hidden"
                border="4px solid"
                borderColor={templateStyle.isDark ? '#1F2937' : 'white'}
                bg={templateStyle.isDark ? '#374151' : '#E5E7EB'}
                boxShadow="0 4px 20px rgba(0,0,0,0.15)"
              >
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={portfolio.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <Flex w="full" h="full" align="center" justify="center">
                    <Text fontSize="48px" color={templateStyle.isDark ? '#9CA3AF' : '#6B7280'}>
                      {portfolio.name.charAt(0).toUpperCase()}
                    </Text>
                  </Flex>
                )}
              </Box>

              {/* Name */}
              <Text
                fontSize="28px"
                fontWeight="bold"
                textAlign="center"
                color={templateStyle.isDark ? 'white' : templateStyle.text}
              >
                {portfolio.name}
              </Text>

              {/* Headline */}
              {portfolio.headline && (
                <Text
                  fontSize="16px"
                  fontWeight="500"
                  color={primaryColor}
                  textAlign="center"
                >
                  {portfolio.headline}
                </Text>
              )}

              {/* Tagline */}
              {portfolio.tagline && (
                <Text
                  fontSize="14px"
                  color={templateStyle.isDark ? '#9CA3AF' : '#6B7280'}
                  textAlign="center"
                  fontStyle="italic"
                >
                  {portfolio.tagline}
                </Text>
              )}

              {/* Bio */}
              {portfolio.bio && (
                <Box
                  w="full"
                  p={6}
                  mt={2}
                  bg={templateStyle.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'}
                  borderRadius={`${borderRadius}px`}
                >
                  <Text
                    fontSize="15px"
                    lineHeight="1.7"
                    color={templateStyle.isDark ? '#D1D5DB' : templateStyle.text}
                  >
                    {portfolio.bio}
                  </Text>
                </Box>
              )}

              {/* Contact Buttons */}
              <HStack spacing={3} pt={4} flexWrap="wrap" justify="center">
                <Button
                  as="a"
                  href={`mailto:${portfolio.email}`}
                  bg={primaryColor}
                  color="white"
                  size="md"
                  borderRadius={`${borderRadius}px`}
                  leftIcon={<EmailIcon />}
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  }}
                >
                  Email Me
                </Button>

                {portfolio.linkedin_url && (
                  <Button
                    as="a"
                    href={portfolio.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline"
                    size="md"
                    borderRadius={`${borderRadius}px`}
                    borderColor={templateStyle.isDark ? 'whiteAlpha.300' : 'blackAlpha.200'}
                    color={templateStyle.isDark ? 'white' : templateStyle.text}
                    leftIcon={<LinkedInIcon />}
                    _hover={{
                      transform: 'translateY(-2px)',
                      bg: templateStyle.isDark ? 'whiteAlpha.100' : 'blackAlpha.50',
                    }}
                  >
                    LinkedIn
                  </Button>
                )}

                {portfolio.phone && (
                  <Button
                    as="a"
                    href={`tel:${portfolio.phone}`}
                    variant="outline"
                    size="md"
                    borderRadius={`${borderRadius}px`}
                    borderColor={templateStyle.isDark ? 'whiteAlpha.300' : 'blackAlpha.200'}
                    color={templateStyle.isDark ? 'white' : templateStyle.text}
                    leftIcon={<PhoneIcon />}
                    _hover={{
                      transform: 'translateY(-2px)',
                      bg: templateStyle.isDark ? 'whiteAlpha.100' : 'blackAlpha.50',
                    }}
                  >
                    Call
                  </Button>
                )}
              </HStack>
            </VStack>
          </Box>

          {/* Footer */}
          <Box pt={8} textAlign="center">
            <Text fontSize="12px" color={templateStyle.isDark ? '#6B7280' : '#9CA3AF'}>
              Built with{' '}
              <Link
                href="https://hushh.ai/hushh-ai/portfolio"
                color={primaryColor}
                isExternal
              >
                Hushh Folio
              </Link>
            </Text>
          </Box>
        </Flex>
      </Box>
    </>
  );
}

// Icons
const EmailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
