import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { db } from '@/lib/db'
import { users, reviews } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { env } from '@/lib/env'

export async function DELETE() {
  try {
    const supabase = await createServerClient()
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Delete all reviews by this user
    await db.delete(reviews).where(eq(reviews.userId, authUser.id))

    // Delete user from database
    await db.delete(users).where(eq(users.id, authUser.id))

    // Delete user from Supabase Auth using service role
    if (env.SUPABASE_SERVICE_ROLE_KEY) {
      const adminClient = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })

      const { error } = await adminClient.auth.admin.deleteUser(authUser.id)
      if (error) {
        console.error('Error deleting user from auth:', error)
        // Continue anyway - user is deleted from our database
      }
    }

    return NextResponse.json({ message: 'Konto slettet succesfuldt' })
  } catch (error) {
    console.error('Error deleting account:', error)
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    )
  }
}
