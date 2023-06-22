import Image from "next/image";
import React from "react";
import { useEffect,useRef } from "react";

function Hero() {
	const videoRef = useRef(null);
	useEffect(() => {
		if (videoRef) {
			videoRef.current.play();
		}
	}, []);

	return (
		<div >
			<div className='container mx-auto mt-0 sm:mt-5 rounded-none sm:rounded-2xl xl:rounded-none  bg-gradient-to-r from-indigo-200 via-red-200 to-yellow-100 relative overflow-hidden  z-30'>
				<div className='md:hidden  '>
					<Image
						//blurDataURL='https://res.cloudinary.com/babyhulk/image/upload/e_pixelate:200,q_30/v1627353251/hero-image/PXL_20210613_032035183.MP_1.webp'
						// src='https://res.cloudinary.com/babyhulk/image/upload/f_auto,q_auto/v1627353251/hero-image/PXL_20210613_032035183.MP_1.webp'
						src='/hero.webp'
						// src='/hero.webp'
						className='block absolute h-full w-full object-cover'
						layout='fill'
						sizes='50vw'
						alt='poster photo'
						quality={99}
					/>
				</div>

				<video
					autoPlay
					ref={videoRef}
					loop
					muted
					poster="/hero.webp"
					className=' hidden md:block absolute h-full w-full object-cover'>
					Your browser does not support the video tag.
					<source
						// src='https://dl.dropboxusercontent.com/s/0c76v5mrs9duv12/MTW-video.mp4'
						//  src='https://drive.google.com/uc?id=13HNQnXUK4iXBKktBCo_5lZyPRIinv5Hm'
						src='/ramen.mp4'
						type='video/mp4'
					/>
				</video>

				<div className='inset-0 bg-black opacity-40  absolute'></div>
				<header className='absolute top-0 left-0 right-0 z-20'></header>
				<div className='container mx-auto px-6 sm:px-0 relative z-10 flex items-center py-32   xl:py-40 '>
					<div className='pl-8 lg:w-3/5 xl:w-3/5 flex flex-col items-start relative z-10'>
						<span className='font-bold uppercase text-pink-500'></span>
						<h1 className=' font-fancy text-6xl sm:text-7xl text-white leading-tight mt-4'>
							Travel to Eat<span className='text-pink-500'></span>,
							<br />
							<span className='text-pink-500'> </span>Eat to Travel
						</h1>
						<h2 className='text-center font-medium text-white md:text-left text-xl mt-5'>
							Our journey in discovering and reviewing food, hotels and
							interesting locations.
						</h2>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Hero;
