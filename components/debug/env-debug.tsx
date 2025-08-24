import React, { useEffect } from 'react';

interface EnvDebugProps {
  enabled?: boolean;
}

export const EnvDebug: React.FC<EnvDebugProps> = ({ enabled = true }) => {
  useEffect(() => {
    if (!enabled) return;

    // Only log in browser environment
    if (typeof window !== 'undefined') {
      console.group('🔍 Environment Variables Debug');
      console.log('Environment:', process.env.NODE_ENV);

      // Log all NEXT_PUBLIC_ variables that should be available client-side 
      const clientEnvVars = {
        NEXT_PUBLIC_BASE_URL_API: process.env.NEXT_PUBLIC_BASE_URL_API,
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
        NEXT_PUBLIC_FRONTEND_BASE_URL: process.env.NEXT_PUBLIC_FRONTEND_BASE_URL,
        NEXT_PUBLIC_MAPBOX_API_KEY: process.env.NEXT_PUBLIC_MAPBOX_API_KEY,
        NEXT_PUBLIC_MICROSOFT_CLARITY: process.env.NEXT_PUBLIC_MICROSOFT_CLARITY,
        NEXT_PUBLIC_GOOGLE_ANALYTICS: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS,
        NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
        NEXT_PUBLIC_TWILIO_APP_NAME: process.env.NEXT_PUBLIC_TWILIO_APP_NAME,
        NEXT_PUBLIC_PHONE_INPUT_COUNTRY_ALLOWED:
          process.env.NEXT_PUBLIC_PHONE_INPUT_COUNTRY_ALLOWED,
      };

      // Log server-side variables that are mapped through next.config.js env
      const mappedEnvVars = {
        BASE_URL: process.env.BASE_URL,
        FRONTEND_BASE_URL: process.env.FRONTEND_BASE_URL,
        BASE_URL_API: process.env.BASE_URL_API,
        MAPBOX_API_KEY: process.env.MAPBOX_API_KEY,
        TWILIO_APP_NAME: process.env.TWILIO_APP_NAME,
        PHONE_INPUT_COUNTRY_ALLOWED: process.env.PHONE_INPUT_COUNTRY_ALLOWED,
        RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY,
      };

      console.table(clientEnvVars);
      console.log('📋 Mapped server variables (via next.config.js):');
      console.table(mappedEnvVars);

      // Check what _baseApi.ts would actually use
      const baseApiUrl = process.env.NEXT_PUBLIC_BASE_URL_API || process.env.BASE_URL_API;
      console.log('🌐 BaseApi would use:', baseApiUrl);

      // Show browser fallback logic
      if (!baseApiUrl) {
        const hostname = window.location.hostname;
        const isDevelopment = hostname === 'localhost' || hostname === '127.0.0.1';
        const fallbackUrl = isDevelopment
          ? 'http://localhost:4000/api'
          : `${window.location.protocol}//${hostname}/api`;
        console.log('🔄 BaseApi fallback URL:', fallbackUrl);
      }

      console.groupEnd();
    } else {
      console.log('Not in browser environment');
    }
  }, [enabled]);

  return null;
};
