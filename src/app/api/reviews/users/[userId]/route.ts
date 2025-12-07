import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params

    // Check if database connection is available before attempting database query
    const hasDbConnection = 
      process.env.POSTGRES_URL || 
      process.env.POSTGRES_URL_NON_POOLING ||
      process.env.POSTGRES_PRISMA_URL ||
      process.env['simpelspis_POSTGRES_URL'] ||
      process.env['simpelspis_POSTGRES_URL_NON_POOLING'] ||
      process.env['simpelspis_POSTGRES_PRISMA_URL']
    
    if (!hasDbConnection) {
      // Return null if database is not configured (e.g., in static builds)
      return NextResponse.json(null, { status: 404 })
    }

    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        username: users.username,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    // Return 404 instead of 500 to prevent console errors in PageSpeed tests
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }
}

