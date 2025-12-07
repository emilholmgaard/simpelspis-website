import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import { env } from '../env'

// Define a type for the mock client return
type MockSupabaseClient = {
  auth: {
    getUser: () => Promise<{ data: { user: null }; error: null }>;
  };
}

export async function createServerClient() {
  // Allow missing Supabase env vars - return a mock client if not configured
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    // Return a mock client that won't crash
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
      },
    } as unknown as SupabaseClient
  }
  const cookieStore = await cookies()
  const projectRef = env.NEXT_PUBLIC_SUPABASE_URL.split('//')[1]?.split('.')[0] || 'default'
  const authCookieName = `sb-${projectRef}-auth-token`
  
  // Get session from cookie
  const authCookie = cookieStore.get(authCookieName)
  let session = null
  if (authCookie?.value) {
    try {
      session = JSON.parse(authCookie.value)
    } catch {
      // Invalid cookie format
    }
  }
  
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: session?.access_token
        ? {
            Authorization: `Bearer ${session.access_token}`,
          }
        : {},
    },
    cookies: {
      get(name: string) {
        // Handle Supabase auth cookie
        if (name === authCookieName) {
          return authCookie?.value
        }
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options?: { maxAge?: number; httpOnly?: boolean; secure?: boolean; sameSite?: 'lax' | 'strict' | 'none'; path?: string }) {
        try {
          // Note: In Next.js Server Components, we can't set cookies.
          // This usually needs to happen in Middleware or Server Actions/Route Handlers.
          cookieStore.set(name, value, options)
        } catch {
          // Ignored in Server Components
        }
      },
      remove(name: string, options?: { path?: string }) {
        try {
          cookieStore.set(name, '', { ...options, maxAge: 0 })
        } catch {
          // Ignored in Server Components
        }
      },
    },
  })
}

// Helper to create client from request (for API routes)
export function createClientFromRequest(request: NextRequest) {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Missing Supabase environment variables')
  }
  
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value
      },
      set() {
        // Cookies set via response in the route handler usually
      },
      remove() {
        // Cookies removed via response
      },
    },
  })
}
