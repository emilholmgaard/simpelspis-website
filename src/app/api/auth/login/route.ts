import { NextRequest, NextResponse } from 'next/server'
import { createClientFromRequest } from '@/lib/supabase/server'

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

    // Create an empty response object first that Supabase can modify
    const response = NextResponse.json({}, { status: 200 })

    // Create a Supabase client that writes cookies to this response
    const supabase = createClientFromRequest(request, response)

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

    // Add user data to the response body (cookies are already set on 'response' object)
    // We need to recreate the response with the body, but keep the headers/cookies
    // OR simpler: just return the response we created, since the client likely just needs a 200 OK
    // But typically the frontend might expect the user object back.
    
    // Since we can't easily modify the body of an existing NextResponse without reading streams,
    // let's create a final response that copies the cookies from the intermediate one.
    
    const finalResponse = NextResponse.json({
      user: data.user,
      session: data.session,
    })

    // Copy cookies from the Supabase-modified response to the final response
    response.cookies.getAll().forEach((cookie) => {
      finalResponse.cookies.set(cookie.name, cookie.value, {
        ...cookie,
        // Ensure secure attributes are preserved/set correctly
        sameSite: 'lax', 
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      })
    })

    return finalResponse
  } catch (error) {
    console.error('Error logging in:', error)
    return NextResponse.json(
      { error: 'Failed to log in' },
      { status: 500 }
    )
  }
}
