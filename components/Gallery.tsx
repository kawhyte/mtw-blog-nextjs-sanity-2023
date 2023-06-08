// import "react-medium-image-zoom/dist/styles.css";

import { getImageDimensions } from "@sanity/asset-utils";
// import Masonry from "react-masonry-css";
// import Zoom from "react-medium-image-zoom";
import { urlForImage } from 'lib/sanity.image'
import Image from "next/image";
import React from "react";

// import { urlForImage } from 'lib/sanity.image'
//import cn from "classnames";
const breakpointColumnsObj = {
	default: 3,
	1100: 2,
	700: 2,
	500: 1,
};

function Gallery({ posts, heading }) {

	return (
		<section className='body-font'>
			<div className='container px-5 mx-auto'>
				<div className='flex flex-col font-medium text-center w-full mb-10 lg:mb-12'>
					<div className='flex '>
						<p className='font-fancy text-5xl md:text-5xl lg:text-5xl font-semibold tracking-tighter leading-tight md:leading-none text-left'>
							Photo Gallery
						</p>
					</div>
				</div>
				{/* <Masonry
					breakpointCols={breakpointColumnsObj}
					className='my-masonry-grid'
					columnClassName='my-masonry-grid_column'> */}

                    <div className="w-full max-w-7xl  p-5 pb-10 mx-auto mb-10 gap-5 columns-3 space-y-5"> 
					{posts.gallery.images.map((item, i) => (
						<div key={i}>
							<div key={i} className=' rounded-3xl p-1 '>
								{/* <Zoom> */}
									<Image
										className=' object-cover rounded-3xl '
										// blurDataURL={imageBuilder(posts.gallery.images[i])
											// .width(1000)
											// .height(1000)
											// .quality(1)
											// .format("webp")
											// .url()}
										// placeholder='blur'
										alt={item?.alt}
                                        src={urlForImage(posts.gallery.images[i]).height(1000).width(2000).url()}
										
										width={getImageDimensions(posts.gallery.images[i]).width}
										height={getImageDimensions(posts.gallery.images[i]).height}
									/>
								{/* </Zoom> */}

								<span className='px-4 my-4 mx-4 text-xs sm:text-sm md:text-base text-black'>
									{item?.alt}
								</span>
							</div>
						</div>
					))}
                    </div>
				{/* </Masonry> */}
			</div>
		</section>
	);
}

export default Gallery;
