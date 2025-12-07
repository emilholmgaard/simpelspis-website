import { NextRequest, NextResponse } from 'next/server'
import { createClientFromRequest } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { env } from '@/lib/env'

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

    // Create an empty response object first that Supabase can modify
    const response = NextResponse.json({}, { status: 200 })

    // Create a Supabase client that writes cookies to this response
    const supabase = createClientFromRequest(request, response)

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
    } catch {
      // User might already exist, which is fine
      console.log('User might already exist in database')
    }

    // Create final response
    const finalResponse = NextResponse.json({
      user: authData.user,
      message: 'User created successfully',
    })

    // Copy cookies from the Supabase-modified response to the final response
    if (authData.session) {
      response.cookies.getAll().forEach((cookie) => {
        finalResponse.cookies.set(cookie.name, cookie.value, {
          ...cookie,
          sameSite: 'lax',
          httpOnly: true,
          secure: env.isProduction
        })
      })
    }

    return finalResponse
  } catch (error) {
    console.error('Error signing up:', error)
    return NextResponse.json(
      { error: 'Failed to sign up' },
      { status: 500 }
    )
  }
}
