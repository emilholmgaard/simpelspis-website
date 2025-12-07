import { Container } from '@/components/container'
import { GradientBackground } from '@/components/gradient'
import { Link } from '@/components/link'
import { Navbar } from '@/components/navbar'
import { Heading, Lead, Subheading } from '@/components/text'
import { ChevronRightIcon } from '@heroicons/react/16/solid'
import type { Metadata } from 'next'
import { getAllBlogPosts, type BlogPostListItem } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Blog - Tips, Tricks og Inspiration',
  description:
    'Udforsk vores blog med tips, tricks og inspiration til nem hverdagsmad. Lær om vegetarisk mad, budgetvenlige opskrifter og meget mere.',
  keywords: ['mad blog', 'kogebog blog', 'mad tips', 'nemme opskrifter blog', 'mad inspiration'],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.simpelspis.dk'}/blog`,
  },
  openGraph: {
    title: 'Blog - Tips, Tricks og Inspiration',
    description: 'Udforsk vores blog med tips, tricks og inspiration til nem hverdagsmad.',
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.simpelspis.dk'}/blog`,
    siteName: 'Simpel Spis',
    locale: 'da_DK',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - Tips, Tricks og Inspiration',
    description: 'Udforsk vores blog med tips, tricks og inspiration til nem hverdagsmad.',
  },
}

export default function BlogPage() {
  const posts = getAllBlogPosts().sort((a, b) => {
    return new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime()
  })

  return (
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
            <li className="text-gray-950 dark:text-gray-50 font-medium" aria-current="page">
              Blog
            </li>
          </ol>
        </nav>

        <div className="max-w-4xl">
          <Subheading>Blog</Subheading>
          <Heading as="h1" className="mt-2 mb-4">
            Tips, Tricks og Inspiration
          </Heading>
          <Lead className="mb-12">
            Udforsk vores blog med tips, tricks og inspiration til nem hverdagsmad. Lær om
            vegetarisk mad, budgetvenlige opskrifter og meget mere.
          </Lead>

          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                Ingen blogindlæg endnu. Kom snart tilbage!
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="border-b border-gray-200 dark:border-gray-800 pb-8 last:border-b-0"
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block group"
                  >
                    {post.category && (
                      <Subheading className="mb-2">{post.category}</Subheading>
                    )}
                    <Heading
                      as="h2"
                      className="text-3xl sm:text-4xl mb-3 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors"
                    >
                      {post.title}
                    </Heading>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                      {post.excerpt}
                    </p>
                    {post.author && (
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                        <span>{post.author}</span>
                      </div>
                    )}
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </Container>
    </main>
  )
}
