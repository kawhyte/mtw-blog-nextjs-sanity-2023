/* This example requires Tailwind CSS v2.0+ */
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { BellIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";

const navigation = [
	{
		name: "Our Top Picks",
		href: "/top_picks",
		icon: "/icon/crown.svg",
		text: "Book icon",
		bg: "  border-dashed border-2 border-yellow-500 bg-yellow-50  hover:decoration-yellow-500/50 focus:decoration-yellow-500/50 hover:bg-yellow-100 ",
		current: false,
	},
	{
		name: "All Reviews",
		href: "/allreviews",
		icon: "/icon/walk.svg",
		text: "Man walking",
		bg: " underline decoration-pink-500 hover:decoration-pink-500/50 focus:decoration-pink-500/50",
		current: false,
	},
	{
		name: "Hotel Reviews",
		href: "/hotel",
		icon: "/icon/hotel.svg",
		text: "Hotel icon",
		bg: "   underline decoration-pink-500 hover:decoration-pink-500/50 focus:decoration-pink-500/50",
		current: false,
	},
	{
		name: "Food Reviews",
		href: "/food",
		icon: "/icon/food2.svg",
		text: "Food icon",
		bg: "   underline decoration-pink-500 hover:decoration-pink-500/50 focus:decoration-pink-500/50",
		current: false,
	},
	{
	name: "Stories/Guides",
	href: "/story",
	icon: "/icon/book.svg",
	text: "Book icon",
	bg: "   underline decoration-pink-500 hover:decoration-pink-500/50 focus:decoration-pink-500/50",
	current: false,
},
	

];

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

export default function Nav({ color="bg-black", bgColor }) {
	let col = color ? " text-gray-900" : " text-white";
	let bg = bgColor ? " bg-white  shadow-l" : " ";

	return (
        <Disclosure
			as='nav'
			className={
				" whitespace-nowrap pt-6  sticky top-0 py-4 mx-auto h-[72px] bg-transparent w-full  z-50   mt- backdrop-blur-sm bg-opacity-50   bg-clip-padding backdrop-filter blur-backdrop-filter bg-white max-w-8xl xl:px-8 firefox:bg-opacity-90  " +
				bg
			}>
			{({ open }) => (
				<>
					<div className='max-w-8xl  container mx-auto cursor-pointer'>
						<div className='relative flex items-center justify-between h-6'>
							<div className='absolute inset-y-0 left-0 flex items-center md:hidden'>
								{/* Mobile menu button*/}
								<Disclosure.Button className='inline-flex items-center justify-center p-2 rounded-md text-gray-200 bg-gray-700 ml-2  hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'>
									<span className='sr-only'>Open main menu</span>
									{open ? (
										<XIcon className='block h-6 w-6' aria-hidden='true' />
									) : (
										<MenuIcon className='block h-6 w-6' aria-hidden='true' />
									)}
								</Disclosure.Button>
							</div>
							<div className='flex-1 flex items-center justify-center sm:items-stretch md:justify-start '>
								<Link href='/' className='cursor-pointer' passHref legacyBehavior>
									<div className='flex-shrink-0 flex justify-center items-center '>
										<div className='mx-4 '>
											<Image
												className='rounded-xl '
												src='/icon/icon.jpg'
												alt='MTW icon'
												width={45}
												height={45}
											/>
											
										</div>

									</div>
								</Link>
								<div className='hidden md:block sm:ml-6'>
									<div className='flex flex-row align-middle justify-center items-center  space-x-4'>
										{navigation.map((item) => (
											<Link href={item.href} key={item.name} passHref legacyBehavior>
												<div className='flex flex-row justify-center align-middle items-center'>
													<button
														key={item.name}
														// href={item.href}
														className={classNames(
															item.current
																? "bg-gray-900 text-white"
																: "text-black   " + col,
															
																" px-2 py-2 rounded-xl flex flex-row justify-center align-middle items-center  decoration-[0.25rem] motion-safe:transition-all motion-safe:duration-200 hover:decoration-[0.5rem] focus:decoration-[0.5rem] " + item.bg
														)}>
														<div className="hidden lg:block">
														<Image
															className=''
															src={item.icon}
															alt={item.text}
															width={25}
															height={25}
														/>
</div>
														<span className='mx-1 ml-2  '>
															{item.name}
														</span>
													</button>
												</div>
											</Link>
										))}
									</div>
								</div>
							</div>
			
						</div>
					</div>

					<Disclosure.Panel className='sm:hidden'>
						<div className='px-2 pt-2 pb-3 space-y-1'>
							{navigation.map((item) => (
								<a
									key={item.name}
									href={item.href}
									className={classNames(
										item.current
											? "bg-gray-900 text-white"
											: "text-black hover:bg-gray-700 hover:text-white",
										"block px-3 py-2 rounded-md text-base font-medium bg-green-100"
									)}
									aria-current={item.current ? "page" : undefined}>
									{item.name}
								</a>
							))}
						</div>
					</Disclosure.Panel>
				</>
			)}
		</Disclosure>
    );
}

	{/*
		name: "Stories/Guides",
		href: "/story",
		icon: "/icon/book.svg",
		text: "Book icon",
		current: false,
	*/}