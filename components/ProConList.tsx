import { inter } from "app/fonts";
import React from "react";


import PostBody from "../components/PostBody";
import { Spoiler } from "@mantine/core";

function ProConList({ positives, negatives, verdict2 }) {
	
	return (
		<>
			<section className='text-gray-800 body-font'>
				<h1 className='font-fancy text-6xl md:text-5xl lg:text-5xl font-bold tracking-tighter leading-tight md:leading-none text-center md:text-left'>
					Bottom Line
				</h1>

				


				
				<div className='container md:px- py-6 lg:py-12 mx-auto flex flex-wrap'>
					<div className=' grid grid-cols-1  gap-6 2xl:grid-cols-3'>
						<div className='md:  md:w-full'>
							<div className='flex flex-col rounded-lg  bg-gradient-to-b from-gray-100 via-gray-200 to-green-100 border-opacity-50 p-2 md:p-5  '>
								<div className='flex align-middle justify-start '>
									<h2 className='font-fancy text-gray-900 text-lg md:text-2xl title-font font-bold mb-3 pr-3'>
										What we loved
									</h2>
									<div className='w-8 h-8 mx-3  sm:mr-8 sm:mb-0 mb-4 inline-flex items-center justify-center rounded-full bg-green-100  text-green-500 flex-shrink-0'>
										<svg
											xmlns='http://www.w3.org/2000/svg'
											className=' '
											viewBox='0 0 20 20'
											fill='currentColor'>
											<path d='M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z' />
										</svg>
									</div>
								</div>
								<div className='grow bg-white p-8 rounded-xl'>
									<div className='flex flex-col sm:items-start sm:text-left   items-center -mb-1 space-y-2.5'>

									<Spoiler maxHeight={320} color="pink" showLabel="Show more" hideLabel="Hide">

										<ul>
											{positives?.map((positive, index) => (
												<li
													key={index}
													className={`${inter.variable} font-secondary  my-3 leading-relaxed text-base md:text-lg font-extralight`}>
													<span className='bg-green-100 text-green-500 w-4 h-4 mr-2 rounded-full inline-flex items-center justify-center'>
														<svg
															fill='none'
															stroke='currentColor'
															strokeLinecap='round'
															strokeLinejoin='round'
															strokeWidth='3'
															className='w-3 h-3'
															viewBox='0 0 24 24'>
															<path d='M20 6L9 17l-5-5'></path>
														</svg>
													</span>
													{positive}
												</li>
											))}
										</ul>
										</Spoiler>
									</div>
								</div>
							</div>
						</div>
						<div className=' md:w-full'>
							<div className='flex flex-col  rounded-lg  bg-gradient-to-b from-gray-100 via-gray-200 to-red-100 border-opacity-50 mr-0 md:p-5  '>
								<div className='flex align-middle justify-start '>
									<h2 className='font-fancy text-gray-900 text-lg md:text-2xl title-font font-bold mb-3 pr-3'>
										What we did not like
									</h2>
									<div className='w-8 h-8 mx-3  sm:mr-8 sm:mb-0 mb-4 inline-flex items-center justify-center rounded-full bg-red-100   text-red-500 flex-shrink-0'>
										<svg
											xmlns='http://www.w3.org/2000/svg'
											className='h-8 w-8'
											viewBox='0 0 20 20'
											fill='currentColor'>
											<path d='M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z' />
										</svg>
									</div>
								</div>
								<div className='grow bg-white p-8 rounded-xl'>
									<div className='flex flex-col sm:items-start sm:text-left   items-center -mb-1 space-y-2.5'>
										<ul>
											{negatives?.map((negative, index) => (
												<li
													key={index}
													className={`${inter.variable} font-secondary my-3 leading-relaxed text-base md:text-lg font-extralight`}>
													<span className='bg-gray-100 text-red-500 w-4 h-4 mr-2 rounded-full inline-flex items-center justify-center'>
														<svg
															xmlns='http://www.w3.org/2000/svg'
															fill='currentColor'
															className='h-4 w-4'
															width='24'
															height='24'
															viewBox='0 0 24 24'>
															<path d='M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.151 17.943l-4.143-4.102-4.117 4.159-1.833-1.833 4.104-4.157-4.162-4.119 1.833-1.833 4.155 4.102 4.106-4.16 1.849 1.849-4.1 4.141 4.157 4.104-1.849 1.849z' />
														</svg>
													</span>
													{negative}
												</li>
											))}
										</ul>
									</div>
								</div>
							</div>
						</div>
						<div className=' md:w-full'>
							<div className='flex flex-col  rounded-lg  bg-gradient-to-r from-indigo-200 via-red-200 to-yellow-100 border-opacity-50 p-2 md:p-5  '>
								<div className='flex align-middle justify-start '>
									<h2 className='font-fancy text-gray-900 text-lg md:text-2xl title-font font-bold mb-3 pr-3'>
										Verdict
									</h2>
									<div className='w-8 h-8 mx-3  sm:mr-8 sm:mb-0 mb-4 inline-flex items-center justify-center rounded-full  bg-yellow-100 text-yellow-500  flex-shrink-0'>
										<svg
											xmlns='http://www.w3.org/2000/svg'
											className='h-8 w-8'
											fill='none'
											viewBox='0 0 24 24'
											stroke='currentColor'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
											/>
										</svg>
									</div>
								</div>
								<div className='grow bg-white p- rounded-xl'>
									<div className={`${inter.variable} font-secondary  flex flex-col px-7 sm:items-start text-base lg:text-lg leading-relaxed` }>
										{/*<p className='font-sans text-base md:text-lg'>{verdict}</p>*/}
										<PostBody content={verdict2} />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}

export default ProConList;
