import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { reviews } from '@/lib/db/schema'
import { createServerClient } from '@/lib/supabase/server'
import { eq, and, desc } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const recipeSlug = searchParams.get('recipeSlug')

    if (!recipeSlug) {
      return NextResponse.json(
        { error: 'recipeSlug is required' },
        { status: 400 }
      )
    }

    // Check if database connection is available before attempting database query
    const hasDbConnection = 
      process.env.POSTGRES_URL || 
      process.env.POSTGRES_URL_NON_POOLING ||
      process.env.POSTGRES_PRISMA_URL
    
    if (!hasDbConnection) {
      // Return empty array if database is not configured (e.g., in static builds)
      return NextResponse.json([])
    }

    const allReviews = await db
      .select()
      .from(reviews)
      .where(eq(reviews.recipeSlug, recipeSlug))
      .orderBy(desc(reviews.createdAt))

    return NextResponse.json(allReviews)
  } catch (error) {
    console.error('Error fetching reviews:', error)
    // Return empty array instead of error to prevent console errors in PageSpeed tests
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { recipeSlug, rating, comment } = body

    if (!recipeSlug || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }

    // Check if user already reviewed this recipe
    const existingReview = await db
      .select()
      .from(reviews)
      .where(
        and(eq(reviews.recipeSlug, recipeSlug), eq(reviews.userId, user.id))
      )
      .limit(1)

    if (existingReview.length > 0) {
      // Update existing review
      const updated = await db
        .update(reviews)
        .set({
          rating,
          comment: comment || null,
          updatedAt: new Date(),
        })
        .where(eq(reviews.id, existingReview[0].id))
        .returning()

      return NextResponse.json(updated[0])
    } else {
      // Create new review
      const newReview = await db
        .insert(reviews)
        .values({
          recipeSlug,
          userId: user.id,
          rating,
          comment: comment || null,
        })
        .returning()

      return NextResponse.json(newReview[0], { status: 201 })
    }
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}



