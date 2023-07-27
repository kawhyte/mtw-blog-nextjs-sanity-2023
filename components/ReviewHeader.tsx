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
		
			<section className='text-gray-600'>
				<div  className='container mx-auto justify-center    md:flex  md:flex-row flex-col items-center'>
					<div ref={container} className=' hidden lg:block lg:max-w-lg lg:p-10    lg:w-full '>
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
					<div className='lg:grow  lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center'>
						<h1 className='font-fancy mb-1 py-1 text-6xl md:text-7xl font-bold tracking-tighter leading-tight bg-white text-pink-500'>
							{title}
						</h1>
						<p className='mb-8 leading-relaxed md:text-2xl'>{summary}</p>
					</div>
				</div>
			</section>
		</div>
	);
}

export default ReviewHeader;
