import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { GradientBackground } from '@/components/gradient'
import { Link } from '@/components/link'
import { Navbar } from '@/components/navbar'
import { Heading, Lead, Subheading } from '@/components/text'
import {
  getCategories,
  getFeaturedPosts,
  getPosts,
  getPostsCount,
} from '@/lib/blog'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpDownIcon,
  RssIcon,
} from '@heroicons/react/16/solid'
import { clsx } from 'clsx'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

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

const postsPerPage = 5

async function FeaturedPosts() {
  const featuredPosts = getFeaturedPosts(2)

  if (featuredPosts.length === 0) {
    return
  }

  return (
    <div className="mt-16 bg-linear-to-t from-gray-100 dark:from-gray-900 pb-14">
      <Container>
        <h2 className="text-2xl font-medium tracking-tight">Fremhævede</h2>
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {featuredPosts.map((post) => (
            <div
              key={post.slug}
              className="relative flex flex-col rounded-3xl bg-white dark:bg-gray-800 p-2 shadow-md ring-1 shadow-black/5 dark:shadow-black/20 ring-black/5 dark:ring-white/10"
            >
              {post.image && (
                <img
                  alt={post.title}
                  src={post.image}
                  className="aspect-3/2 w-full rounded-2xl object-cover"
                />
              )}
              <div className="flex flex-1 flex-col p-8">
                <div className="text-base/7 font-medium">
                  <Link href={`/blog/${post.slug}`}>
                    <span className="absolute inset-0" />
                    {post.title}
                  </Link>
                </div>
                <div className="mt-2 flex-1 text-sm/6 text-gray-500 dark:text-gray-400">
                  {post.excerpt}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  )
}

async function Categories({ selected }: { selected?: string }) {
  const categories = getCategories()

  if (categories.length === 0) {
    return
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <Menu>
        <MenuButton className="flex items-center justify-between gap-2 font-medium">
          {categories.find(({ slug }) => slug === selected)?.title ||
            'Alle kategorier'}
          <ChevronUpDownIcon className="size-4 fill-gray-900 dark:fill-gray-100" />
        </MenuButton>
        <MenuItems
          anchor="bottom start"
          className="min-w-40 rounded-lg bg-white dark:bg-gray-800 p-1 shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 [--anchor-gap:6px] [--anchor-offset:-4px] [--anchor-padding:10px]"
        >
          <MenuItem>
            <Link
              href="/blog"
              data-selected={selected === undefined ? true : undefined}
              className="group grid grid-cols-[1rem_1fr] items-center gap-2 rounded-md px-2 py-1 data-focus:bg-gray-950/5 dark:data-focus:bg-white/10"
            >
              <CheckIcon className="hidden size-4 group-data-selected:block" />
              <p className="col-start-2 text-sm/6">Alle kategorier</p>
            </Link>
          </MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.slug}>
              <Link
                href={`/blog?category=${category.slug}`}
                data-selected={category.slug === selected ? true : undefined}
                className="group grid grid-cols-[16px_1fr] items-center gap-2 rounded-md px-2 py-1 data-focus:bg-gray-950/5 dark:data-focus:bg-white/10"
              >
                <CheckIcon className="hidden size-4 group-data-selected:block" />
                <p className="col-start-2 text-sm/6">{category.title}</p>
              </Link>
            </MenuItem>
          ))}
        </MenuItems>
      </Menu>
      <Button variant="outline" href="/blog/feed.xml" className="gap-1">
        <RssIcon className="size-4" />
        RSS Feed
      </Button>
    </div>
  )
}

async function Posts({ page, category }: { page: number; category?: string }) {
  const posts = getPosts(
    (page - 1) * postsPerPage,
    page * postsPerPage,
    category,
  )

  if (posts.length === 0 && (page > 1 || category)) {
    notFound()
  }

  if (posts.length === 0) {
    return <p className="mt-6 text-gray-500 dark:text-gray-400">Ingen indlæg fundet.</p>
  }

  return (
    <div className="mt-6">
      {posts.map((post) => (
        <div
          key={post.slug}
          className="relative grid grid-cols-1 border-b border-b-gray-100 dark:border-b-gray-800 py-10 first:border-t first:border-t-gray-200 dark:first:border-t-gray-800"
        >
          <div className="max-w-2xl">
            <h2 className="text-sm/5 font-medium">{post.title}</h2>
            <p className="mt-3 text-sm/6 text-gray-500 dark:text-gray-400">{post.excerpt}</p>
            <div className="mt-4">
              <Link
                href={`/blog/${post.slug}`}
                className="flex items-center gap-1 text-sm/5 font-medium"
              >
                <span className="absolute inset-0" />
                Læs mere
                <ChevronRightIcon className="size-4 fill-gray-400 dark:fill-gray-500" />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

async function Pagination({
  page,
  category,
}: {
  page: number
  category?: string
}) {
  function url(page: number) {
    let params = new URLSearchParams()

    if (category) params.set('category', category)
    if (page > 1) params.set('page', page.toString())

    return params.size !== 0 ? `/blog?${params.toString()}` : '/blog'
  }

  const totalPosts = getPostsCount(category)
  const hasPreviousPage = page - 1
  const previousPageUrl = hasPreviousPage ? url(page - 1) : undefined
  const hasNextPage = page * postsPerPage < totalPosts
  const nextPageUrl = hasNextPage ? url(page + 1) : undefined
  const pageCount = Math.ceil(totalPosts / postsPerPage)

  if (pageCount < 2) {
    return
  }

  return (
    <div className="mt-6 flex items-center justify-between gap-2">
      <Button
        variant="outline"
        href={previousPageUrl}
        disabled={!previousPageUrl}
      >
        <ChevronLeftIcon className="size-4" />
        Forrige
      </Button>
      <div className="flex gap-2 max-sm:hidden">
        {Array.from({ length: pageCount }, (_, i) => (
          <Link
            key={i + 1}
            href={url(i + 1)}
            data-active={i + 1 === page ? true : undefined}
            className={clsx(
              'size-7 rounded-lg text-center text-sm/7 font-medium',
              'data-hover:bg-gray-100 dark:data-hover:bg-gray-800',
              'data-active:shadow-sm data-active:ring-1 data-active:ring-black/10 dark:data-active:ring-white/20',
              'data-active:data-hover:bg-gray-50 dark:data-active:data-hover:bg-gray-700',
            )}
          >
            {i + 1}
          </Link>
        ))}
      </div>
      <Button variant="outline" href={nextPageUrl} disabled={!nextPageUrl}>
        Næste
        <ChevronRightIcon className="size-4" />
      </Button>
    </div>
  )
}

export default async function Blog({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const page =
    'page' in params
      ? typeof params.page === 'string' && parseInt(params.page) > 1
        ? parseInt(params.page)
        : notFound()
      : 1

  const category =
    typeof params.category === 'string' ? params.category : undefined

  return (
    <main className="overflow-hidden">
      <GradientBackground />
      <Navbar />
      <Container>
        <Subheading className="mt-16">Blog</Subheading>
        <Heading as="h1" className="mt-2">
          Tips, Tricks og Inspiration
        </Heading>
        <Lead className="mt-6 max-w-3xl">
          Udforsk vores blog med tips, tricks og inspiration til nem hverdagsmad. Lær om
          vegetarisk mad, budgetvenlige opskrifter og meget mere.
        </Lead>
      </Container>
      {page === 1 && !category && <FeaturedPosts />}
      <Container className="mt-16 pb-24">
        <Categories selected={category} />
        <Posts page={page} category={category} />
        <Pagination page={page} category={category} />
      </Container>
    </main>
  )
}
