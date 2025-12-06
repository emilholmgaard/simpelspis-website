import { MetadataRoute } from 'next'

// Hent alle opskrifter fra opskrifter-siden
const recipes = [
  'hjemmelavet-kebab',
  'hjemmelavet-kodsovs',
  'hjemmelavet-pizza',
  'hjemmelavet-boller',
  'hjemmelavet-glog',
  'hjemmelavet-knaekbrod',
  'hjemmelavet-pasta',
  'hjemmelavet-granola',
  'hjemmelavet-is',
  'hjemmelavet-brod',
  'hjemmelavet-pandekager',
  'hjemmelavet-cookies',
  'hjemmelavet-frikadeller',
  'hjemmelavet-chokoladeskeer',
  'hjemmelavet-braendtemandler',
  'hjemmelavet-floedeboller',
  'hjemmelavet-smashburger',
  'ribeye',
  'entrecote',
  'hjemmelavet-chilicheesetops',
  'hjemmelavet-cheeseburger',
  'hjemmelavet-vaniljekranse',
  'hjemmelavet-rod-grod-med-flode',
  'hjemmelavet-flaeskesteg',
  'hjemmelavet-risengrod',
  'hjemmelavet-aebleskiver',
  'hjemmelavet-banankage',
  'hjemmelavet-chokoladekage',
  'hjemmelavet-nutella',
  'hjemmelavet-lagkage',
  'hjemmelavet-flutes',
  'hjemmelavet-baguette',
  'hjemmelavet-kanelsnegle',
  'hjemmelavet-aeggekage',
  'hjemmelavet-omelet',
  'hjemmelavet-schones',
  'hjemmelavet-naan-brod',
  'hjemmelavet-bagels',
  'hjemmelavet-polsehorn',
  'hjemmelavet-chunk-cookies',
  'hjemmelavet-chocolate-chip-cookies',
  'hjemmelavet-doner-boks',
  'hjemmelavet-gyros',
  'hjemmelavet-taquitos',
  'hjemmelavet-shawarma',
  'hjemmelavet-chicken-tender',
  'hjemmelavet-pizza-slice',
  'hjemmelavet-kylling-sandwich',
  'hjemmelavet-flaeskestegssandwich',
  'hjemmelavet-roastbeef-sandwich',
  'hjemmelavet-avocado-sandwich-a-la-joe-the-juice',
  'hjemmelavet-tunacado-a-la-joe-the-juice',
  'hjemmelavet-mayo',
  'hjemmelavet-chilimayo',
  'hjemmelavet-pomfritter',
  'hjemmelavet-nuggets',
  'hjemmelavet-rejechips',
  'hjemmelavet-bagtkartofel',
  'hjemmelavet-lasagne',
  'hjemmelavet-margherita-pizza',
  'hjemmelavet-pasta-carbonara',
]

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

  // Dynamiske opskriftssider
  const recipePages: MetadataRoute.Sitemap = recipes.map((slug) => ({
    url: `${baseUrl}/opskrifter/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [...staticPages, ...recipePages]
}

