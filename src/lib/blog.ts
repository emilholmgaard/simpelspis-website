import fs from 'fs'
import path from 'path'

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  datePublished: string // ISO 8601 format (e.g., "2025-01-15T10:00:00+01:00")
  dateModified?: string // ISO 8601 format
  category?: string
  tags?: string[]
  image?: string
}

export interface BlogPostListItem {
  slug: string
  title: string
  excerpt: string
  author: string
  datePublished: string
  category?: string
  image?: string
}

const blogDirectory = path.join(process.cwd(), 'src/data/blog')

/**
 * Konverterer en kategori til et slug (URL-venligt format)
 */
export function categoryToSlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/\s*&\s*/g, '-og-') // Erstat & med -og-
    .replace(/\s+/g, '-') // Erstat whitespace med -
    .replace(/[^a-z0-9æøå-]/g, '') // Fjern specialtegn, men behold danske bogstaver
}

/**
 * Henter alle blogindlæg (kun metadata for liste)
 */
export function getAllBlogPosts(): BlogPostListItem[] {
  try {
    const filePath = path.join(blogDirectory, 'index.json')
    if (!fs.existsSync(filePath)) {
      return []
    }
    const fileContents = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(fileContents)
  } catch {
    return []
  }
}

/**
 * Henter et specifikt blogindlæg med alt data
 */
export function getBlogPostBySlug(slug: string): BlogPost | null {
  try {
    const filePath = path.join(blogDirectory, `${slug}.json`)
    if (!fs.existsSync(filePath)) {
      return null
    }
    const fileContents = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(fileContents)
  } catch {
    return null
  }
}

/**
 * Henter alle blogindlæg med fuldt data (for sitemap osv.)
 */
export function getAllBlogPostsWithData(): BlogPost[] {
  const posts = getAllBlogPosts()
  return posts
    .map((post) => getBlogPostBySlug(post.slug))
    .filter((post): post is BlogPost => post !== null)
}

/**
 * Henter alle kategorier fra blogindlæg
 */
export function getCategories(): Array<{ slug: string; title: string }> {
  const posts = getAllBlogPosts()
  const categorySet = new Set<string>()
  
  posts.forEach((post) => {
    if (post.category) {
      categorySet.add(post.category)
    }
  })
  
  return Array.from(categorySet)
    .sort()
    .map((category) => ({
      slug: categoryToSlug(category),
      title: category,
    }))
}

/**
 * Henter featured blogindlæg (første 3) med fuldt indhold
 */
export function getFeaturedPosts(count: number = 3): BlogPost[] {
  const posts = getAllBlogPosts()
  return posts
    .slice(0, count)
    .map((post) => getBlogPostBySlug(post.slug))
    .filter((post): post is BlogPost => post !== null)
}

/**
 * Henter blogindlæg med pagination og kategori filter
 */
export function getPosts(
  start: number,
  end: number,
  category?: string,
): BlogPostListItem[] {
  let posts = getAllBlogPosts()
  
  // Filtrer efter kategori hvis angivet
  if (category) {
    posts = posts.filter((post) => {
      if (!post.category) return false
      const postCategorySlug = categoryToSlug(post.category)
      return postCategorySlug === category
    })
  }
  
  // Sorter efter dato (nyeste først)
  posts.sort((a, b) => {
    return new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime()
  })
  
  return posts.slice(start, end)
}

/**
 * Tæller antal blogindlæg (med evt. kategori filter)
 */
export function getPostsCount(category?: string): number {
  let posts = getAllBlogPosts()
  
  if (category) {
    posts = posts.filter((post) => {
      if (!post.category) return false
      const postCategorySlug = categoryToSlug(post.category)
      return postCategorySlug === category
    })
  }
  
  return posts.length
}
