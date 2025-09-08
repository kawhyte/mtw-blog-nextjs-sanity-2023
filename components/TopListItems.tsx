import DynamicPostCard from 'components/DynamicPostCard'
import type { FoodReview, HotelReview, Post } from 'lib/sanity.queries'

import SectionTitle from './SectionTitle'

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
      {/* Optional title for the entire section */}
      {title && <SectionTitle header={title} />}

      {/* Grid container with vertical gap to space out the rows */}
      <div className="container mx-auto grid grid-cols-1 gap-x-6 gap-y-24 px-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {posts.map((post, i) => (
          // The group wrapper now has padding-top to create space for the number above the card
          <div key={post._id} className="group relative pt-16">
            {/* --- LARGE RANK NUMBER --- */}
            {/* Positioned at the top of the container, centered horizontally */}
            <span
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-16 sm:-translate-y-28 z-0 font-montserrat text-[9rem] font-black leading-none text-secondary/20 transition-all duration-300 group-hover:scale-110 group-hover:text-primary/40 sm:text-[14rem]"
              aria-hidden="true" // Decorative element
            >
              {i + 1}
            </span>

            {/* --- DYNAMIC POST CARD WRAPPER --- */}
            {/* Sits below the number, with z-10 to ensure it's clickable */}
            <div className="relative z-10 h-full w-full  rounded-2xl bg-card ">
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
                showRating={false} // Rating is implied by the rank
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
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
