import React from "react";

function RoomTech({ speed = 10, techAvailable }) {
	let speedResult = ["Web Browsing", "Email"];
	let textResult = "OK";

	//console.log("techAvailable ", techAvailable)

	if (speed < 2) {
		speedResult = ["Web Browsing", "Emails"];
		textResult = "Poor";
	} else if (speed >= 3 && speed < 5) {
		speedResult = ["Web Browsing", "Emails", "Streaming Music"];
		textResult = "Slow";
	} else if (speed >= 6 && speed < 8) {
		speedResult = [
			"Web Browsing",
			"Emails",
			"Streaming Music",
			"Streaming Youtube",
		];
		textResult = "Slow";
	} else if (speed >= 8 && speed < 13) {
		textResult = "Average";
		speedResult = [
			"Web Browsing",
			"Emails",
			"Streaming Music",
			"Streaming Youtube",
		];
	} else if (speed >= 13 && speed < 22) {
		textResult = "Average";
		speedResult = [
			"Web Browsing",
			"Emails",
			"Zoom Meetings",
			"Streaming Music",
			"Streaming Youtube",
		];
	} else if (speed >= 23 && speed < 30) {
		textResult = "Fast";
		speedResult = [
			"Web Browsing",
			"Emails",
			"Zoom Meetings",
			"Streaming Music",
			"Streaming Youtube",
			"Streaming HD Movies",
		];
	} else if (speed >= 30 && speed < 40) {
		textResult = "Very Fast";
		speedResult = [
			"Web Browsing",
			"Emails",
			"Zoom Meetings",
			"Streaming Music",
			"Streaming Youtube",
			"Streaming HD Movies",
			"Streaming 4k Movies",
		];
	} else if (speed >= 40) {
		textResult = "Excellent";
		speedResult = [
			"Web Browsing",
			"Emails",
			"Zoom Meetings",
			"Streaming Music",
			"Streaming Youtube",
			"Streaming HD Movies",
			"Streaming 4k Movies",
			"Streaming Video Games",
		];
	} else {
		textResult = "No Internet";
		speedResult = ["No Internet"];
		// Fall through
	}
	return (
		<section className=''>
			<section className='text-gray-800 body-font overflow-hidden'>
				<div className='container md:px-5 pb-20 mx-auto'>
					<div className='flex flex-col text-center w-full mb-12'>
						<h1 className='font-fancy text-6xl md:text-5xl lg:text-5xl font-bold tracking-tighter leading-tight md:leading-none text-center md:text-left'>
							Hotel Techology
						</h1>
					</div>
					<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
						<div className='md:p-4  w-full'>
							{/*Internet Section */}
							<div className='h-full p-6 rounded-lg border-2 border-green-500 flex flex-col relative overflow-hidden'>
								<span className='bg-green-500 text-white px-3 py-1 m-1 sm:hidden md:block tracking-widest text-base absolute right-0 top-0 uppercase'>
									{textResult}
								</span>
								<h2 className='text-pink-500  text-base  tracking-widest title-font mb-1 font-medium uppercase'>
									Internet Speed
								</h2>

								<h1 className='text-5xl text-gray-900 leading-none flex items-start pb-4 mb-4 border-b border-gray-200'>
									<span className='text-8xl'>{speed}</span>
									<span className='text-lg ml-1 font-normal text-gray-500'>
										Mbps
									</span>
								</h1>

								<p className='mb-3 text-gray-900 font-medium text-lg pb-2'>
									This internet speed is great for:
								</p>

								<div className='grid grid-cols-2 lg:grid-cols-3 gap-3'>
									{speedResult.map((item, i) => (
										<p
											key={i}
											className='flex text-sm md:text-base  items-center text-gray-600 mb-2'>
											<span className='w-4 h-4 mb-2 mr-2 inline-flex items-center justify-center bg-green-400 text-white rounded-full flex-shrink-0'>
												<svg
													fill='none'
													stroke='currentColor'
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth='2.5'
													className='w-3 h-3'
													viewBox='0 0 24 24'>
													<path d='M20 6L9 17l-5-5'></path>
												</svg>
											</span>
											{item}
										</p>
									))}
								</div>
							</div>
						</div>
						{/*Internet Section Ends Here*/}

						{/*Ports, Plugs & TV */}

						<div className='pt-4 md:p-4  w-full'>
							<div className='h-full p-6 rounded-lg border-2 border-pink-500 flex flex-col relative overflow-hidden'>
								<h2 className='text-pink-500  text-base tracking-widest title-font mb-1 font-medium uppercase'>
									TV Ports, Plugs   & other tech
								</h2>
								<h1 className='text-5xl text-gray-900 leading-none flex items-center pb-4 mb-4 border-b border-gray-200'></h1>
								<p className='mb-3 text-gray-900 font-medium text-lg pb-2'>
									Availiable in the room/hotel
								</p>

								<section className='text-gray-600 body-font'>
									<div className='container px-2 py-2 mx-auto'>
										<div className=' grid grid-cols-2 sm:grid-cols-2 gap-4 text-center'>
											<div className=' '>
												<h2 className='title-font font-medium sm:text-3xl text-3xl text-gray-900 uppercase'>
													{techAvailable.USB}
												</h2>
												<p className='leading-relaxed'>Key Card needed for Elevator</p>
											</div>
											<div className=''>
												<h2 className='title-font font-medium sm:text-3xl text-3xl text-gray-900 uppercase'>
													{techAvailable.HDMI}
												</h2>

												<p className='leading-relaxed'>Guest In-Room Tablet</p>
											</div>
											<div className=''>
												<h2 className='title-font font-medium sm:text-3xl text-3xl text-gray-900 uppercase'>
													{techAvailable.TV}
												</h2>
												<p className='leading-relaxed'>Mobile Key Access</p>
											</div>
											<div className=''>
												<h2 className='title-font font-medium sm:text-3xl text-3xl text-gray-900 uppercase'>
													{techAvailable.Chromecast}
												</h2>
												<p className='leading-relaxed'>Chromecast/Smart TV</p>
											</div>
											<div className=''>
												<h2 className='title-font font-medium sm:text-3xl text-3xl text-gray-900'>
													{techAvailable.Wired}
												</h2>
												<p className='leading-relaxed'>Wired Internet</p>
											</div>
											<div className=''>
												<h2 className='title-font font-medium sm:text-3xl text-3xl text-gray-900'>
													{techAvailable.Bluetooth}
												</h2>
												<p className='leading-relaxed '>Hospitality App/Texting Available</p>
											</div>
										</div>
									</div>
								</section>
							</div>
						</div>
						{/*Ports, Plugs & TV  Ends here*/}
					</div>
				</div>
			</section>
		</section>
	);
}

export default RoomTech;
