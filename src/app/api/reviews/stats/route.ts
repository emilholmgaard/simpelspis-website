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

    const stats = await db
      .select({
        averageRating: sql<number>`COALESCE(AVG(${reviews.rating})::numeric, 0)`,
        totalReviews: sql<number>`COUNT(*)::int`,
        ratingDistribution: sql<number[]>`array_agg(${reviews.rating})`,
      })
      .from(reviews)
      .where(eq(reviews.recipeSlug, recipeSlug))

    const result = stats[0]
    const distribution = result.ratingDistribution || []
    const ratingCounts = [1, 2, 3, 4, 5].map(
      (rating) => distribution.filter((r) => r === rating).length
    )

    return NextResponse.json({
      averageRating: parseFloat(result.averageRating?.toString() || '0'),
      totalReviews: result.totalReviews || 0,
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

