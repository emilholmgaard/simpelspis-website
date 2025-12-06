import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { reviews } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'

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

    // Get all reviews for this recipe
    const allReviews = await db
      .select()
      .from(reviews)
      .where(eq(reviews.recipeSlug, recipeSlug))

    if (allReviews.length === 0) {
      return NextResponse.json({
        averageRating: 0,
        totalReviews: 0,
        ratingCounts: [0, 0, 0, 0, 0],
      })
    }

    // Calculate stats manually
    const totalReviews = allReviews.length
    const sumRating = allReviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = sumRating / totalReviews

    // Count ratings
    const ratingCounts = [1, 2, 3, 4, 5].map(
      (rating) => allReviews.filter((r) => r.rating === rating).length
    )

    return NextResponse.json({
      averageRating,
      totalReviews,
      ratingCounts,
    })
  } catch (error) {
    console.error('Error fetching review stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch review stats' },
      { status: 500 }
    )
  }
}

