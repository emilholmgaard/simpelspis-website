import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Create a Supabase client for this request
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(_name: string, _value: string, _options?: unknown) {
          // Will be handled by response
        },
        remove(_name: string, _options?: unknown) {
          // Will be handled by response
        },
      },
    })

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    if (!data.session) {
      return NextResponse.json(
        { error: 'No session created' },
        { status: 500 }
      )
    }

    // Create response
    const response = NextResponse.json({
      user: data.user,
      session: data.session,
    })

    // Set Supabase auth cookies
    // Supabase uses specific cookie names based on project ref
    const projectRef = supabaseUrl.split('//')[1]?.split('.')[0] || 'default'
    const cookieName = `sb-${projectRef}-auth-token`
    
    // Set the session cookie that Supabase expects
    response.cookies.set(cookieName, JSON.stringify(data.session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: data.session.expires_in || 3600,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Error logging in:', error)
    return NextResponse.json(
      { error: 'Failed to log in' },
      { status: 500 }
    )
  }
}

