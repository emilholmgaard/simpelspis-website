import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { db } from '@/lib/db'
import { users, reviews } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

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
    if (supabaseServiceKey) {
      const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
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

