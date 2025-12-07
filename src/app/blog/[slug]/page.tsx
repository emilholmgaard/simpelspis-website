import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { GradientBackground } from '@/components/gradient'
import { Link } from '@/components/link'
import { Navbar } from '@/components/navbar'
import { Heading, Subheading } from '@/components/text'
import { getBlogPostBySlug, getAllBlogPostsWithData, categoryToSlug, type BlogPost } from '@/lib/blog'
import { ChevronLeftIcon } from '@heroicons/react/16/solid'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const posts = getAllBlogPostsWithData()
  return posts.map((post: BlogPost) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)

  if (!post) {
    return {
      title: 'Blogindlæg ikke fundet',
      description: 'Det ønskede blogindlæg kunne ikke findes.',
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.simpelspis.dk'
  const url = `${baseUrl}/blog/${slug}`

  return {
    title: post.title,
    description: post.excerpt,
    keywords: [
      post.title.toLowerCase(),
      ...(post.tags || []),
      'blog',
      'mad tips',
      'simpel spis',
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: url,
      siteName: 'Simpel Spis',
      locale: 'da_DK',
      publishedTime: post.datePublished,
      modifiedTime: post.dateModified || post.datePublished,
      authors: [post.author],
      ...(post.image && { images: [post.image] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return date.toLocaleDateString('da-DK', options)
}

function parseMarkdown(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  
  // Match **bold** text
  const boldRegex = /\*\*(.*?)\*\*/g
  let match
  
  while ((match = boldRegex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index))
    }
    // Add bold text
    parts.push(
      <strong key={`bold-${match.index}`} className="font-semibold text-gray-950">
        {match[1]}
      </strong>
    )
    lastIndex = match.index + match[0].length
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex))
  }
  
  return parts.length > 0 ? parts : [text]
}

function formatContent(content: string): React.ReactNode {
  const paragraphs = content.split('\n\n')
  const elements: React.ReactNode[] = []
  let listItems: string[] = []
  let inList = false
  let elementIndex = 0
  
  paragraphs.forEach((paragraph) => {
    const trimmed = paragraph.trim()
    
    if (!trimmed) {
      return
    }
    
    const lines = trimmed.split('\n').map(l => l.trim()).filter(l => l)
    
    lines.forEach((line) => {
      // Check if it's a heading (starts with ##)
      if (line.startsWith('## ')) {
        // Close any open list
        if (inList) {
          elements.push(
            <ul key={`list-${elementIndex++}`} className="list-disc pl-4 text-base/8 marker:text-gray-400">
              {listItems.map((item, i) => (
                <li key={i} className="my-2 pl-2">
                  {parseMarkdown(item.replace(/^[-*]\s*/, ''))}
                </li>
              ))}
            </ul>
          )
          listItems = []
          inList = false
        }
        
        const headingText = line.replace('## ', '')
        elements.push(
          <h2
            key={`h2-${elementIndex++}`}
            className="mt-12 mb-10 text-2xl/8 font-medium tracking-tight text-gray-950 first:mt-0 last:mb-0"
          >
            {parseMarkdown(headingText)}
          </h2>
        )
        return
      }
      
      // Check if it's a subheading (starts with ###)
      if (line.startsWith('### ')) {
        // Close any open list
        if (inList) {
          elements.push(
            <ul key={`list-${elementIndex++}`} className="list-disc pl-4 text-base/8 marker:text-gray-400">
              {listItems.map((item, i) => (
                <li key={i} className="my-2 pl-2">
                  {parseMarkdown(item.replace(/^[-*]\s*/, ''))}
                </li>
              ))}
            </ul>
          )
          listItems = []
          inList = false
        }
        
        const headingText = line.replace('### ', '')
        elements.push(
          <h3
            key={`h3-${elementIndex++}`}
            className="mt-12 mb-10 text-xl/8 font-medium tracking-tight text-gray-950 first:mt-0 last:mb-0"
          >
            {parseMarkdown(headingText)}
          </h3>
        )
        return
      }
      
      // Check if it's a list item (starts with - or *)
      if (line.startsWith('- ') || line.startsWith('* ')) {
        if (!inList) {
          inList = true
        }
        listItems.push(line)
        return
      }
      
      // Close any open list before a regular paragraph
      if (inList) {
        elements.push(
          <ul key={`list-${elementIndex++}`} className="list-disc pl-4 text-base/8 marker:text-gray-400">
            {listItems.map((item, i) => (
              <li key={i} className="my-2 pl-2">
                {parseMarkdown(item.replace(/^[-*]\s*/, ''))}
              </li>
            ))}
          </ul>
        )
        listItems = []
        inList = false
      }
      
      // Regular paragraph line
      elements.push(
        <p
          key={`p-${elementIndex++}`}
          className="my-10 text-base/8 first:mt-0 last:mb-0"
        >
          {parseMarkdown(line)}
        </p>
      )
    })
  })
  
  // Close any remaining list
  if (inList && listItems.length > 0) {
    elements.push(
      <ul key={`list-${elementIndex++}`} className="list-disc pl-4 text-base/8 marker:text-gray-400">
        {listItems.map((item, i) => (
          <li key={i} className="my-2 pl-2">
            {parseMarkdown(item.replace(/^[-*]\s*/, ''))}
          </li>
        ))}
      </ul>
    )
  }
  
  return <>{elements}</>
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)
  
  if (!post) notFound()

  return (
    <main className="overflow-hidden">
      <GradientBackground />
      <Navbar />
      <Container>
        <Subheading className="mt-16">
          {formatDate(post.datePublished)}
        </Subheading>
        <Heading as="h1" className="mt-2">
          {post.title}
        </Heading>
        {post.category && (
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              href={`/blog?category=${categoryToSlug(post.category)}`}
              className="inline-flex items-center rounded-full border border-dotted border-gray-300 bg-gray-50 px-3 py-1.5 text-sm/6 font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400"
            >
              {post.category}
            </Link>
          </div>
        )}
        <div className="mt-16 grid grid-cols-1 gap-8 pb-24 lg:grid-cols-[15rem_1fr] xl:grid-cols-[15rem_1fr_15rem]">
          <div></div>
          <div className="text-gray-700">
            <div className="max-w-2xl xl:mx-auto">
              {post.image && (
                <img
                  alt={post.title}
                  src={post.image}
                  className="mb-10 aspect-3/2 w-full rounded-2xl object-cover shadow-xl"
                />
              )}
              {formatContent(post.content)}
              <div className="mt-10">
                <Button variant="outline" href="/blog">
                  <ChevronLeftIcon className="size-4" />
                  Tilbage til blog
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <Footer />
    </main>
  )
}
