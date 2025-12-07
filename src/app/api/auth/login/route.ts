import { NextRequest, NextResponse } from 'next/server'
import { createClientFromRequest } from '@/lib/supabase/server'

const supabaseUrl = 
  process.env.NEXT_PUBLIC_SUPABASE_URL || 
  process.env['simpelspisSUPABASE_URL'] ||
  process.env['simpelspis_SUPABASE_URL'] ||
  ''

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
    const supabase = createClientFromRequest(request)

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
    const projectRef = supabaseUrl ? supabaseUrl.split('//')[1]?.split('.')[0] || 'default' : 'default'
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

