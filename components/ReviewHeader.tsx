import lottie from 'lottie-web'
import Image from "next/image";
import React, {useEffect, useRef} from "react";






function ReviewHeader({ title, pattern, summary, animation }) {
//	console.log("pattern ", animation)
	
 const container = useRef(null)

	useEffect(() => {
	lottie.loadAnimation({
		container:container.current,
		renderer:'svg',
		loop:true,
		autoplay:true,
		path: animation
	})	

	
	}, [animation])

	return (
		<div className='mx-12  flex justify-center   '>
		<div ></div>
			<section className='text-gray-600 body-font'>
				<div  className='container  rounded-2xl mt-12  mb-20 justify-center   mx-auto flex  pb-12 md:flex-row flex-col items-center'>
					<div ref={container} className='lg:max-w-lg    lg:w-full  mb-10 md:mb-0'>
						{/*<video
							className='object-cover object-center h-96'
							autoPlay
							loop
							muted>
							Your browser does not support the video tag.
							<source
								// src='https://dl.dropboxusercontent.com/s/0c76v5mrs9duv12/MTW-video.mp4'
								src={animation}
								type='video/mp4'
							/>
						</video>*/}
					</div>
					<div className='lg:grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center'>
						<h1 className='font-fancy mb-1 py-1 text-6xl md:text-7xl font-bold tracking-tighter leading-tight bg-white text-pink-500'>
							{title}
						</h1>
						<p className='mb-8 leading-relaxed text-2xl'>{summary}</p>
					</div>
				</div>
			</section>
		</div>
	);
}

export default ReviewHeader;
