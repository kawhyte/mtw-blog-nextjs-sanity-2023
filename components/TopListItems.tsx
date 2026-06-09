import DynamicPostCard from 'components/DynamicPostCard'
import type { FoodReview, HotelReview, Post } from 'lib/sanity.queries'

import SectionTitle from './SectionTitle'

const getRankColor = (rank: number): string => {
  if (rank === 1) return 'text-yellow-400/65'
  if (rank === 2) return 'text-slate-400/55'
  if (rank === 3) return 'text-orange-600/55'
  return 'text-secondary/25'
}

export default function TopListItems({
  posts,
  title,
  contentType = 'post',
}: {
  posts: (Post | HotelReview | FoodReview)[]
  title?: string
  contentType?: 'post' | 'hotel' | 'food'
}) {
  if (!posts || posts.length === 0) {
    return null
  }

  return (
    <section className="my-12">
      {title && <SectionTitle header={title} />}

      <div className="container mx-auto max-w-7xl grid grid-cols-1 gap-x-6 gap-y-4 sm:gap-y-6 px-4 sm:px-6 lg:px-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, i) => {
          const rank = i + 1
          return (
            <div
              key={post._id}
              className={`group relative pt-0 sm:pt-[14rem]${
                i === posts.length - 1 && posts.length % 3 === 1
                  ? ' lg:col-start-2'
                  : ''
              }`}
            >
              {/* Large rank number — visible on sm+ only; hidden on mobile */}
              <span
                className={`hidden sm:block absolute left-1/2 sm:-top-1 z-0 -translate-x-1/2 font-epilogue font-black leading-none transition-all duration-300 group-hover:scale-110 sm:text-[14rem] ${getRankColor(rank)}`}
                aria-hidden="true"
              >
                {rank}
              </span>

              <div className="relative z-10 h-full w-full rounded-2xl bg-card">
                <DynamicPostCard
                  key={post._id}
                  title={post.title}
                  coverImage={post.coverImage}
                  date={post.date}
                  author={'author' in post ? post.author : undefined}
                  slug={post.slug}
                  excerpt2={post.excerpt2}
                  location={post.location}
                  category={'category' in post ? post.category : undefined}
                  showRating={true}
                  rank={rank}
                  linkType={
                    contentType === 'hotel'
                      ? 'hotel'
                      : contentType === 'food'
                        ? 'food'
                        : undefined
                  }
                  hotelRating={
                    contentType === 'hotel'
                      ? (post as HotelReview).hotelRating
                      : undefined
                  }
                  foodRating={
                    contentType === 'food'
                      ? (post as FoodReview).foodRating
                      : undefined
                  }
                  takeoutRating={
                    contentType === 'food'
                      ? (post as FoodReview).takeoutRating
                      : undefined
                  }
                  diningType={
                    contentType === 'food'
                      ? (post as FoodReview).diningType
                      : undefined
                  }
                  revisitCount={
                    'revisitCount' in post
                      ? (post as HotelReview | FoodReview).revisitCount
                      : undefined
                  }
                />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
