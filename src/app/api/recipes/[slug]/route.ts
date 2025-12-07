import { NextRequest, NextResponse } from 'next/server'
import { getRecipeBySlug } from '@/lib/recipes'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const recipe = getRecipeBySlug(slug)

    if (!recipe) {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      )
    }

    // Return only the data needed for the card
    return NextResponse.json({
      ingredients: recipe.ingredients,
      nutrition: recipe.nutrition,
    })
  } catch (error) {
    console.error('Error fetching recipe:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recipe' },
      { status: 500 }
    )
  }
}



