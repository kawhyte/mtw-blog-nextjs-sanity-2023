import Avatar from 'components/AuthorAvatar'
import CoverImage from 'components/CoverImage'
import Date from 'components/PostDate'
import PostTitle from 'components/PostTitle'
import type { Post } from 'lib/sanity.queries'
import BodySectionSeparator from './body-section-separator'

export default function PostHeader(
  props: Pick<Post, 'title' | 'coverImage' | 'date' | 'author' | 'slug' | 'location' |'linkType' | 'room' |'excerpt'>
) {
  const { title, coverImage, date, author, slug, location,linkType, room, excerpt } = props

  // console.log("PROPs ", props.room)
  return (
    <>
      <PostTitle>{title}</PostTitle>
      {/* <div className="hidden md:mb-12 md:block">
        {author && <Avatar name={author.name} picture={author.picture} />}
      </div> */}

      <div className='flex flex-col justify-start align-middle md:flex-row'>
						<div>
							<p className='text-gray-900 font-medium md:text-sm p-1 text-center md:text-left '>
								<span className='text-lg capitalize'>
									{location ? location : "No address provided"}{" "}
								</span>
								|{" "}
								<span className='ml-1 text-gray-900 font-medium text-lg'>
								{linkType === "hotel" || linkType==="food"?	"Visited ": "Published on "} <Date dateString={date} />
								</span>
							</p>
							{room && (
								<p className=' text-gray-900 font-medium  md:text-lg  text-center md:text-left'>
									{linkType === "hotel" ? `${room || "test"}` : ""}{" "}
								</p>
							)}
						</div>

						{/* <ShareButtons shareURL={shareURL}></ShareButtons> */}
					</div>






      <div className="mb-8 sm:mx-0 md:mb-16">
        <CoverImage title={title} image={coverImage} priority slug={slug} />
     
        {excerpt && (
				<>
					<div>
						<div className='max-w-4xl text-justify lg:text-lg mx-4 my-8 '>
						{excerpt}
            
            
						</div>
					</div>
					<BodySectionSeparator />
				</>
			)}
     
      </div>
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 block md:hidden">
          {author && <Avatar name={author.name} picture={author.picture} />}
        </div>
        <div className="mb-6 text-lg">
          <Date dateString={date} />
        </div>
      </div>
    </>
  )
}
