import { MetadataRoute } from 'next'
import recipesData from '@/data/recipes/index.json'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://simpelspis-website-git-main-holm-team.vercel.app'

  // Statiske sider
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/opskrifter`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]

  // Dynamiske opskriftssider - hent automatisk fra JSON fil
  const recipePages: MetadataRoute.Sitemap = recipesData.map((recipe) => ({
    url: `${baseUrl}/opskrifter/${recipe.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [...staticPages, ...recipePages]
}

