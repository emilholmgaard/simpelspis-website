import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, username } = body

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
        set(name: string, value: string, options: any) {
          // Will be handled by response
        },
        remove(name: string, options: any) {
          // Will be handled by response
        },
      },
    })

    // Sign up user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }

    // Create user record in database
    try {
      await db.insert(users).values({
        id: authData.user.id,
        email: authData.user.email!,
        username: username || null,
      })
    } catch (dbError) {
      // User might already exist, which is fine
      console.log('User might already exist in database')
    }

    // Create response
    const response = NextResponse.json({
      user: authData.user,
      message: 'User created successfully',
    })

    // Set Supabase auth cookies if session exists
    if (authData.session) {
      const projectRef = supabaseUrl.split('//')[1]?.split('.')[0] || 'default'
      const cookieName = `sb-${projectRef}-auth-token`
      
      response.cookies.set(cookieName, JSON.stringify(authData.session), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: authData.session.expires_in || 3600,
        path: '/',
      })
    }

    return response
  } catch (error) {
    console.error('Error signing up:', error)
    return NextResponse.json(
      { error: 'Failed to sign up' },
      { status: 500 }
    )
  }
}

