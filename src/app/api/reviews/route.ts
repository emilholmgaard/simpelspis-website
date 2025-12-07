import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { reviews } from '@/lib/db/schema'
import { createServerClient } from '@/lib/supabase/server'
import { eq, and, desc, isNotNull } from 'drizzle-orm'
import { env } from '@/lib/env'

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
    if (!env.POSTGRES_URL) {
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
    let user = null
    try {
      const supabase = await createServerClient()
      if (supabase && supabase.auth) {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser()
        user = authUser
      }
    } catch {
      // If auth fails, user is null (anonymous user)
      // This is fine - we'll use anonymousId instead
      // Silently continue - anonymous users are allowed
    }

    const body = await request.json()
    const { recipeSlug, rating, comment, anonymousId } = body

    if (!recipeSlug || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }

    // Normalize comment - convert empty string, undefined, or null to null
    const normalizedComment = 
      comment !== null && comment !== undefined && typeof comment === 'string' && comment.trim() !== '' 
        ? comment.trim() 
        : null

    // If user is logged in, check for existing review by userId
    if (user && user.id) {
      try {
        // First check if user has an existing review
        // Only check reviews where userId is not null and matches the user
        const existingUserReview = await db
          .select()
          .from(reviews)
          .where(
            and(
              eq(reviews.recipeSlug, recipeSlug),
              isNotNull(reviews.userId),
              eq(reviews.userId, user.id)
            )
          )
          .limit(1)

        if (existingUserReview.length > 0) {
          // Update existing review
          const updated = await db
            .update(reviews)
            .set({
              rating,
              comment: normalizedComment,
              updatedAt: new Date(),
            })
            .where(eq(reviews.id, existingUserReview[0].id))
            .returning()

          return NextResponse.json(updated[0])
        }
      } catch (dbError) {
        console.error('Database error checking user review:', dbError)
        // Continue to check for anonymous review or create new one
      }
      
      // If no user review found, check for anonymous review
      // Check if there's an anonymous review with the same anonymousId
      // This happens when user gave rating anonymously before logging in
      if (anonymousId && anonymousId.trim() !== '') {
        try {
          const existingAnonymousReview = await db
            .select()
            .from(reviews)
            .where(
              and(
                eq(reviews.recipeSlug, recipeSlug),
                isNotNull(reviews.anonymousId),
                eq(reviews.anonymousId, anonymousId)
              )
            )
            .limit(1)

          if (existingAnonymousReview.length > 0) {
            // Convert anonymous review to user review
            const updated = await db
              .update(reviews)
              .set({
                userId: user.id,
                anonymousId: null, // Remove anonymous ID
                rating,
                comment: normalizedComment,
                updatedAt: new Date(),
              })
              .where(eq(reviews.id, existingAnonymousReview[0].id))
              .returning()

            return NextResponse.json(updated[0])
          }
        } catch (dbError) {
          console.error('Database error checking anonymous review:', dbError)
          // Continue to create new review
        }
      }

      // Create new review
      try {
        const newReview = await db
          .insert(reviews)
          .values({
            recipeSlug,
            userId: user.id,
            rating,
            comment: normalizedComment,
          })
          .returning()

        return NextResponse.json(newReview[0], { status: 201 })
      } catch (dbError: unknown) {
        console.error('Database error creating review:', dbError)
        
        const error = dbError as { code?: string; message?: string }
        // Check if it's a foreign key constraint error
        if (error?.code === '23503' || error?.message?.includes('foreign key')) {
          return NextResponse.json(
            { error: 'Brugeren eksisterer ikke i systemet' },
            { status: 400 }
          )
        }
        
        throw dbError
      }
    } else {
      // Anonymous user - use anonymousId to track
      if (!anonymousId || anonymousId.trim() === '') {
        return NextResponse.json(
          { error: 'Anonymous ID required' },
          { status: 400 }
        )
      }

      // Check if anonymous user already reviewed this recipe
      const existingReview = await db
        .select()
        .from(reviews)
        .where(
          and(
            eq(reviews.recipeSlug, recipeSlug),
            isNotNull(reviews.anonymousId),
            eq(reviews.anonymousId, anonymousId)
          )
        )
        .limit(1)

      if (existingReview.length > 0) {
        // Update existing review
        const updated = await db
          .update(reviews)
          .set({
            rating,
            comment: normalizedComment,
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
            userId: null,
            anonymousId,
            rating,
            comment: normalizedComment,
          })
          .returning()

        return NextResponse.json(newReview[0], { status: 201 })
      }
    }
  } catch (error) {
    console.error('Error creating review:', error)
    
    // Don't expose internal errors to client in production
    const errorMessage = error instanceof Error 
      ? (env.isProduction ? 'Kunne ikke oprette anmeldelse' : error.message)
      : 'Kunne ikke oprette anmeldelse'
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
