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
