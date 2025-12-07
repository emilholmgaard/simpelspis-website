import { getAllBlogPosts } from '@/lib/blog'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function formatRssDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toUTCString()
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.simpelspis.dk'
  const posts = getAllBlogPosts()
    .sort((a, b) => {
      return new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime()
    })
    .slice(0, 20) // Limit to latest 20 posts

  const rssItems = posts
    .map((post) => {
      const postUrl = `${baseUrl}/blog/${post.slug}`
      const pubDate = formatRssDate(post.datePublished)
      
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(postUrl)}</link>
      <guid isPermaLink="true">${escapeXml(postUrl)}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${pubDate}</pubDate>
      <author>${escapeXml(post.author)}</author>
${post.category ? `      <category>${escapeXml(post.category)}</category>` : ''}
    </item>`
    })
    .join('\n')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Simpel Spis - Blog</title>
    <link>${baseUrl}/blog</link>
    <description>Tips, Tricks og Inspiration til nem hverdagsmad</description>
    <language>da-DK</language>
    <lastBuildDate>${formatRssDate(new Date().toISOString())}</lastBuildDate>
    <atom:link href="${baseUrl}/blog/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/logo_black.svg</url>
      <title>Simpel Spis</title>
      <link>${baseUrl}</link>
    </image>
${rssItems}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
