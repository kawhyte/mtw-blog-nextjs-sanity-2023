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

      <div className="container mx-auto grid grid-cols-1 gap-x-6 gap-y-24 px-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, i) => {
          const rank = i + 1
          return (
            <div key={post._id} className="group relative pt-16">
              {/* Large rank number — top 3 get medal tones */}
              <span
                className={`absolute left-1/2 top-0 z-0 -translate-x-1/2 -translate-y-12 font-epilogue text-[9rem] font-black leading-none transition-all duration-300 group-hover:scale-110 sm:-translate-y-24 sm:text-[14rem] ${getRankColor(rank)}`}
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
                  showRating={false}
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
                  calculatedRating={
                    'calculatedRating' in post
                      ? (post as any).calculatedRating
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
