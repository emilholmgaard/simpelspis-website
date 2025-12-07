import { Container } from '@/components/container'
import { GradientBackground } from '@/components/gradient'
import { Link } from '@/components/link'
import { Navbar } from '@/components/navbar'
import { Heading, Subheading } from '@/components/text'
import { ArrowLeftIcon, ChevronRightIcon } from '@heroicons/react/16/solid'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getBlogPostBySlug, getAllBlogPostsWithData, type BlogPost } from '@/lib/blog'

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
    title: `${post.title} - Blog`,
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
      title: `${post.title} - Blog`,
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
      title: `${post.title} - Blog`,
      description: post.excerpt,
    },
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('da-DK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

function parseMarkdown(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  let currentIndex = 0
  
  // Match **bold** text
  const boldRegex = /\*\*(.*?)\*\*/g
  let lastIndex = 0
  let match
  
  while ((match = boldRegex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index))
    }
    // Add bold text
    parts.push(
      <strong key={`bold-${match.index}`} className="font-semibold text-gray-950 dark:text-gray-50">
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
  // Split content into paragraphs (double newlines)
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
    
    // Split paragraph by single newlines to handle mixed content
    const lines = trimmed.split('\n').map(l => l.trim()).filter(l => l)
    
    lines.forEach((line) => {
      // Check if it's a heading (starts with ##)
      if (line.startsWith('## ')) {
        // Close any open list
        if (inList) {
          elements.push(
            <ul key={`list-${elementIndex++}`} className="list-disc list-inside mb-4 space-y-1 text-lg text-gray-700 dark:text-gray-300">
              {listItems.map((item, i) => (
                <li key={i}>{parseMarkdown(item.replace(/^[-*]\s*/, ''))}</li>
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
            className="text-2xl font-semibold mt-8 mb-4 text-gray-950 dark:text-gray-50"
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
            <ul key={`list-${elementIndex++}`} className="list-disc list-inside mb-4 space-y-1 text-lg text-gray-700 dark:text-gray-300">
              {listItems.map((item, i) => (
                <li key={i}>{parseMarkdown(item.replace(/^[-*]\s*/, ''))}</li>
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
            className="text-xl font-semibold mt-6 mb-3 text-gray-950 dark:text-gray-50"
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
          <ul key={`list-${elementIndex++}`} className="list-disc list-inside mb-4 space-y-1 text-lg text-gray-700 dark:text-gray-300">
            {listItems.map((item, i) => (
              <li key={i}>{parseMarkdown(item.replace(/^[-*]\s*/, ''))}</li>
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
          className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-4"
        >
          {parseMarkdown(line)}
        </p>
      )
    })
  })
  
  // Close any remaining list
  if (inList && listItems.length > 0) {
    elements.push(
      <ul key={`list-${elementIndex++}`} className="list-disc list-inside mb-4 space-y-1 text-lg text-gray-700 dark:text-gray-300">
        {listItems.map((item, i) => (
          <li key={i}>{parseMarkdown(item.replace(/^[-*]\s*/, ''))}</li>
        ))}
      </ul>
    )
  }
  
  return <>{elements}</>
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.simpelspis.dk'

  // Article schema for SEO
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    datePublished: post.datePublished,
    dateModified: post.dateModified || post.datePublished,
    publisher: {
      '@type': 'Organization',
      name: 'Simpel Spis',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo_black.svg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${slug}`,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <main className="overflow-hidden min-h-screen bg-white dark:bg-gray-950">
        <GradientBackground />
        <Navbar />
        <Container className="mt-28 pb-24">
          {/* Breadcrumbs */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link href="/" className="data-hover:text-gray-950 dark:data-hover:text-gray-50">
                  Forside
                </Link>
              </li>
              <li>
                <ChevronRightIcon className="size-4" />
              </li>
              <li>
                <Link href="/blog" className="data-hover:text-gray-950 dark:data-hover:text-gray-50">
                  Blog
                </Link>
              </li>
              <li>
                <ChevronRightIcon className="size-4" />
              </li>
              <li className="text-gray-950 dark:text-gray-50 font-medium" aria-current="page">
                {post.title}
              </li>
            </ol>
          </nav>

          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-2 text-sm/6 font-medium text-gray-600 dark:text-gray-400 data-hover:text-gray-950 dark:data-hover:text-gray-50"
          >
            <ArrowLeftIcon className="size-4" />
            Tilbage til blog
          </Link>

          <article className="max-w-4xl">
            {post.category && (
              <Subheading className="mb-2">{post.category}</Subheading>
            )}
            <Heading as="h1" className="mb-4">
              {post.title}
            </Heading>
            
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500 mb-8">
              <time dateTime={post.datePublished}>
                {formatDate(post.datePublished)}
              </time>
              {post.author && (
                <>
                  <span>•</span>
                  <span>{post.author}</span>
                </>
              )}
            </div>

            {post.image && (
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-auto rounded-2xl mb-8"
              />
            )}

            <div className="prose prose-lg dark:prose-invert max-w-none">
              {formatContent(post.content)}
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Tags:</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>
        </Container>
      </main>
    </>
  )
}
