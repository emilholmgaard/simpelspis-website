import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createServerClient()
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()

    if (!authUser) {
      return NextResponse.json({ user: null })
    }

    // Get user from database
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, authUser.id))
      .limit(1)

    return NextResponse.json({
      user: user || {
        id: authUser.id,
        email: authUser.email,
        username: null,
      },
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ user: null })
  }
}

