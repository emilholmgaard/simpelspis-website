// Simple environment variable validation and centralization
// This replaces the scattered process.env checks across the codebase

function getEnvVar(key: string, required: boolean = false): string {
  // Check standard name
  let value = process.env[key];
  
  // Check Vercel/Supabase specific variants if not found
  if (!value) {
    // Try without NEXT_PUBLIC prefix if present
    const baseKey = key.replace('NEXT_PUBLIC_', '');
    
    // Check specific prefixed versions seen in the codebase
    const variants = [
      `simpelspis${baseKey}`,
      `simpelspis_${baseKey}`,
      key // retry original just in case
    ];

    for (const variant of variants) {
      if (process.env[variant]) {
        value = process.env[variant];
        break;
      }
    }
  }

  if (!value && required && process.env.NODE_ENV === 'production') {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value || '';
}

export const env = {
  // Database
  POSTGRES_URL: getEnvVar('POSTGRES_URL') || getEnvVar('POSTGRES_URL_NON_POOLING'), // Fallback logic inside getEnvVar handles variants, but here we handle the pool/non-pool preference
  
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: getEnvVar('NEXT_PUBLIC_SUPABASE_URL', true),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY', true),
  
  // Node Env
  NODE_ENV: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
} as const;
