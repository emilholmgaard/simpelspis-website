import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

const supabaseUrl = 
  process.env.NEXT_PUBLIC_SUPABASE_URL || 
  process.env['simpelspisSUPABASE_URL'] ||
  process.env['simpelspis_SUPABASE_URL'] ||
  ''
const supabaseAnonKey = 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  process.env['simpelspisSUPABASE_ANON_KEY'] ||
  process.env['simpelspis_SUPABASE_ANON_KEY'] ||
  ''

export async function createServerClient() {
  // Allow missing Supabase env vars - return a mock client if not configured
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client that won't crash
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
      },
    } as any
  }
  const cookieStore = await cookies()
  const projectRef = supabaseUrl.split('//')[1]?.split('.')[0] || 'default'
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
  
  return createClient(supabaseUrl, supabaseAnonKey, {
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
          cookieStore.set(name, value, options)
        } catch {
          // The `set` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
      remove(name: string, options?: { path?: string }) {
        try {
          cookieStore.set(name, '', { ...options, maxAge: 0 })
        } catch {
          // The `delete` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  } as Parameters<typeof createClient>[2])
}

// Helper to create client from request (for API routes)
export function createClientFromRequest(request: NextRequest) {
  const url = 
    process.env.NEXT_PUBLIC_SUPABASE_URL || 
    process.env['simpelspisSUPABASE_URL'] ||
    process.env['simpelspis_SUPABASE_URL'] ||
    ''
  const key = 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
    process.env['simpelspisSUPABASE_ANON_KEY'] ||
    process.env['simpelspis_SUPABASE_ANON_KEY'] ||
    ''
  
  if (!url || !key) {
    throw new Error('Missing Supabase environment variables')
  }
  
  return createClient(url, key, {
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
        // Cookies set via response
      },
      remove() {
        // Cookies removed via response
      },
    },
  } as Parameters<typeof createClient>[2])
}

