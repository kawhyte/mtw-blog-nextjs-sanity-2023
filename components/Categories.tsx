import React from "react";
import Link from "next/link";
import Image from "next/image";

const category = [
	{
		name: "All Reviews",
		href: "/allreviews",
		image:
			"/vista.webp",
		// image:
		// 	"https://res.cloudinary.com/babyhulk/image/upload/v1621897765/project/PXL_20210222_215622925.MP.webp",
		text: "Hotel icon",
		alt: "View of mountains",
		bgcolor :"bg-yellow-50 p-5"
	},
	{
		name: "Hotel Reviews",
		href: "/hotel",
		image:
			"/hotel.webp",
		// image:
		// 	"https://res.cloudinary.com/babyhulk/image/upload/c_scale,w_880/v1634776268/project/PXL_20210905_004151576.MP.webp",
		text: "City skyline",
		alt: "City skyline",
		bgcolor :"bg-pink-50 p-5"
	},

	{
		name: "Food Reviews",
		href: "/food",
		image:
			"/food.webp",
		// image:
		// 	"https://res.cloudinary.com/babyhulk/image/upload/v1621897187/project/MVIMG_20191203_091517.webp",
		text: "Hotel icon",
		alt: "View of Food",
		bgcolor :"bg-green-50 p-5"
	},
	{
		name: "Stories/Guides",
		href: "/story",
		image:
			"/tahoe.webp",
		// image:
		// 	"https://res.cloudinary.com/babyhulk/image/upload/v1621896780/project/PXL_20210428_025517322.MP.webp",
		text: "Sunset",
		alt: "View of Sunset at a hotel",
		bgcolor :"bg-blue-50 p-5"
	},

];

function Categories() {
	return <>
        <section className='text-gray-600  mt-2 '>
            <div className='container px-5 py-10 mx-auto '>
                <div className='flex flex-wrap w-full mb-10 '>
                    <div className='lg:w-1/2 w-full mb-6 lg:mb-0 '>
                        <h1 className='font-fancy  sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900'>
                            Browse by Category
                        </h1>
                        <div className='h-1 w-20 bg-pink-500 rounded'></div>
                    </div>
                </div>

                <div className='   '>
                    <div className='grid  grid-cols-2 md:grid-cols-2 place-items-center   lg:grid-cols-4 relative  '>
                        {category.map((item) => (
                            <div className={item.bgcolor} key={item.href} >
                                <div className='relative   rounded-xl overflow-hidden  block'>
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className='relative cursor-pointer'
                                        passHref
                                        legacyBehavior>
                                        <Image
                                            height={286}
                                            width={286}
                                            blurDataURL={item.image}
                                            placeholder='blur'
                                            className='h-40 cursor-pointer rounded-xl w-full  object-cover object-center mb-6'
                                            src={item.image}
                                            alt={item.text}
                                            quality={50}
                                        />
                                    </Link>
                                </div>
                                

                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className='relative cursor-pointer'
                                    passHref
                                    legacyBehavior>
                                    <p className='  text-gray-700 text-xl cursor-pointer '>
                                        {item.name}
                                    </p>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    </>;
}

export default Categories;