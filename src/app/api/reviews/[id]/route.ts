import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { reviews } from '@/lib/db/schema'
import { createServerClient } from '@/lib/supabase/server'
import { eq } from 'drizzle-orm'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const reviewId = params.id

    // Check if review exists and belongs to user
    const existingReview = await db
      .select()
      .from(reviews)
      .where(eq(reviews.id, reviewId))
      .limit(1)

    if (existingReview.length === 0) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    if (existingReview[0].userId !== user.id) {
      return NextResponse.json(
        { error: 'You can only delete your own reviews' },
        { status: 403 }
      )
    }

    // Delete the review
    await db.delete(reviews).where(eq(reviews.id, reviewId))

    return NextResponse.json({ message: 'Review deleted' })
  } catch (error) {
    console.error('Error deleting review:', error)
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    )
  }
}

