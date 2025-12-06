import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export async function createServerClient() {
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
      set(name: string, value: string, options: any) {
        try {
          cookieStore.set(name, value, options)
        } catch (error) {
          // The `set` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
      remove(name: string, options: any) {
        try {
          cookieStore.set(name, '', { ...options, maxAge: 0 })
        } catch (error) {
          // The `delete` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

// Helper to create client from request (for API routes)
export function createClientFromRequest(request: NextRequest) {
  return createClient(supabaseUrl, supabaseAnonKey, {
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
  })
}

