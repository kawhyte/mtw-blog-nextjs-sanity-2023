import Image from "next/image";
import React from "react";
import { inter } from 'app/fonts'

function Welcome() {
	return (
		<div className=''>
			<section className='text-gray-600 body-font '>
				<div className='container relative px-5 py-2 md:py-6 mx-auto '>
				
					<div className=' flex flex-col py-12 text-center w-full   '>
						<h2 className={` mb-2 font-fancy  text-4xl md:text-6xl font-bold tracking-tighter leading-tight z-10`} >
							Hi! We are the Whytes. <br></br> Welcome to our space on the{" "}
							<span className='text-pink-500'>interwebs </span>
						</h2>

						<p className={` ${inter.variable} font-secondary lg:w-2/3  mx-auto leading-relaxed text-2xl z-10`}>
							We&apos;re a husband 👖 and wife 👗 duo. We love to travel & try
							new food.
						</p>
					</div>

					<div className='absolute bottom-0 right-0 h-48 '>
					<Image
						width={255}
						height={272}
						alt={`Cover Image for`}
						className='opacity-10 2xl:opacity-95 z-0  '
						src='/luggage.svg'
					/>
				</div>

				</div>
			</section>
		</div>
	);
}

export default Welcome;
