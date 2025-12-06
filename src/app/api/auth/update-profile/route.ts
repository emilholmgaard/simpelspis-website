import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { username, email } = body

    // Update user in database
    const updates: any = {}
    if (username !== undefined) {
      updates.username = username || null
    }
    if (email !== undefined && email !== authUser.email) {
      // Update email in Supabase Auth first
      const { error: updateError } = await supabase.auth.updateUser({
        email: email,
      })

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 400 })
      }

      updates.email = email
    }

    if (Object.keys(updates).length > 0) {
      await db
        .update(users)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(users.id, authUser.id))
    }

    // Get updated user
    const [updatedUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, authUser.id))
      .limit(1)

    return NextResponse.json({
      user: updatedUser,
      message: 'Profil opdateret',
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

