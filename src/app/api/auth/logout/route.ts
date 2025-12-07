import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

const supabaseUrl = 
  process.env.NEXT_PUBLIC_SUPABASE_URL || 
  process.env['simpelspisSUPABASE_URL'] ||
  process.env['simpelspis_SUPABASE_URL'] ||
  ''

export async function POST() {
  try {
    const supabase = await createServerClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Clear auth cookies
    const projectRef = supabaseUrl ? supabaseUrl.split('//')[1]?.split('.')[0] || 'default' : 'default'
    const cookieName = `sb-${projectRef}-auth-token`
    
    const response = NextResponse.json({ message: 'Logged out successfully' })
    response.cookies.delete(cookieName)
    
    return response
  } catch (error) {
    console.error('Error logging out:', error)
    return NextResponse.json(
      { error: 'Failed to log out' },
      { status: 500 }
    )
  }
}

