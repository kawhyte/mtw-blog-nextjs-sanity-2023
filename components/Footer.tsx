import { roboto_mono } from "app/fonts";
import Link from "next/link";

import { EXAMPLE_PATH } from "../lib/constants";

export default function Footer() {
	let year = new Date().getFullYear();
	return (
        <footer className=' mt-20 relative text-gray-600 body-font  bg-gradient-to-r from-indigo-200 via-red-200 to-yellow-100'>
		
				<div className='container px-5 py-8 mx-auto flex items-center sm:flex-row '>
					<div className='flex title-font font-medium items-center md:justify-start justify-center text-gray-900'>
						<Link href='/' passHref legacyBehavior>
							<div className='flex flex-row justify-center align-middle items-center'>
								{/* <div className=' hidden mx-4 sm:inline-block'>
									<img
										className='rounded-xl '
										src='/icon/icon.jpg'
										alt='MTW icon'
										width={45}
										height={45}
									/>
								</div> */}

								<p className={`  lg:block ${roboto_mono.variable} font-mono   hidden text-base  leading-relaxed md:inline-block mr-4 py-2 whitespace-nowrap  text-black`}>
									meet the whytes
								</p>
							</div>
						</Link>
					</div>

					<div className='flex  flex-row'>
						<a
							href='https://www.kennywhyte.com'
							className='text-blue-500 ml-1 '
							rel='noopener noreferrer'
							target='_blank'>
							{" "}
							<p
								id='copyright-year'
								className='text-sm text-gray-900 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4'>
								© {year} Created by Kenny
							</p>
						</a>
					</div>

					<span className='flex flex-row sm:ml-auto sm:mt-0 mt-4 justify-center  sm:justify-start cursor-pointer'>
						<a
							className='ml-3  text-pink-500'
							rel='noopener noreferrer nofollow'
							target='_blank'
							href='https://www.instagram.com/thepixelprince/?hl=en'>
							<svg
								fill='none'
								stroke='currentColor'
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2'
								className='w-8 h-8'
								viewBox='0 0 24 24'>
								<rect width='20' height='20' x='2' y='2' rx='5' ry='5'></rect>
								<path d='M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01'></path>
							</svg>
						</a>
						<a
							className='ml-3 text-pink-500'
							rel='noopener noreferrer nofollow'
							target='_blank'
							href='https://www.youtube.com/channel/UC519Rsb02cRpbzDNLMWflVA'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='currentColor'
								stroke='currentColor'
								width='24'
								height='24'
								className='w-8 h-8'
								viewBox='0 0 24 24'>
								<path d='M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z' />
							</svg>
						</a>
					</span>
				</div>
			
		</footer>
    );
}
