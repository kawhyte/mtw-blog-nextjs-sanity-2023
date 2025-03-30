/* This example requires Tailwind CSS v2.0+ */
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline';
import { inter, space } from 'app/fonts';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { IoRestaurantOutline } from 'react-icons/io5';
import { IoBasketballOutline } from 'react-icons/io5';
import { LiaBasketballBallSolid, LiaBathSolid, LiaCrownSolid } from 'react-icons/lia';
import { PiSneakerLight } from 'react-icons/pi';
import { RiHotelLine } from 'react-icons/ri';
import { TfiMapAlt } from 'react-icons/tfi';

const bg =
  '  underline decoration-pink-200 underline-offset-8 hover:decoration-pink-500 focus:decoration-pink-500/50 ';
const navigation = [
  {
    name: 'NBA & WNBA Arenas',
    href: '/arenas',
    icon: <LiaBasketballBallSolid className="h-6 w-10  text-pink-500" />,
    text: 'Man walking',
    bg: 'hover:bg-gradient-to-r from-pink-100 to-orange-100  text-white w-full  focus:decoration-orange-500/50',
    current: false,
  },
  {
    name: 'Our Top Picks',
    href: '/picks',
    icon: <LiaCrownSolid className="h-6 w-10 text-gray-700   " />,
    text: 'Book icon',
    bg: '  hover:bg-gradient-to-r from-pink-100 to-yellow-100  focus:decoration-yellow-500/50',
    current: false,
  },
  {
    name: 'Hotel Reviews',
    href: '/hotel',
    icon: <LiaBathSolid className="h-6 w-10  text-gray-700" />,
    text: 'Hotel icon',
    bg: '  hover:bg-gradient-to-r from-blue-100 to-pink-100 focus:decoration-pink-500/50',
    current: false,
  },
  {
    name: 'Food Reviews',
    href: '/food',
    icon: <IoRestaurantOutline className="h-6 w-10  text-gray-700" />,
    text: 'Food icon',
    bg: '  hover:bg-gradient-to-r from-pink-100 to-green-100 focus:decoration-green-500/50',
    current: false,
  },
  {
    name: 'Guides',
    href: '/guide',
    icon: <TfiMapAlt className="h-6 w-10   text-gray-700 " />,
    text: 'Book icon',
    bg: '  hover:bg-gradient-to-r from-pink-100 to-indigo-100  text-white w-full  focus:decoration-indigo-500/50',
    current: false,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Nav({ color = 'bg-black', bgColor }) {
  let col = color ? ' text-gray-900' : ' text-white';
  let bg = bgColor ? ' bg-white  ' : ' ';
  const container = useRef(null);
  const animation = 'food.json';

  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const [navSize, setnavSize] = useState('5rem');
  const [navImage, setnavImage] = useState(bgColor);
  const [navColor, setnavColor] = useState(bgColor);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  useEffect(() => {
    const listenScrollEvent = () => {
      if (window !== undefined) {
        window.scrollY > 10 ? setnavColor('#fcf2d7') : setnavColor(bgColor);
        window.scrollY > 10 ? setnavSize('5rem') : setnavSize('4.9rem');
        window.scrollY > 10
          ? setnavImage('linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%)')
          : setnavImage('');
      }
    };

    if (window !== undefined) {
      window.addEventListener('scroll', listenScrollEvent);
      return () => {
        window.removeEventListener('scroll', listenScrollEvent);
      };
    }
  }, [bgColor]);

  return (
    <Disclosure
      as="nav"
      className={
        ` ${inter.variable} font-sans   blur-backdrop-filter firefox:bg-opacity-90 sticky top-0 z-50  h-[72px]  w-full   whitespace-nowrap bg-transparent bg-white   bg-opacity-50   bg-clip-padding pt-6 backdrop-blur-sm backdrop-filter transition-all  ` +
        bg
      }
      style={{
        backgroundColor: navColor,
        backgroundImage: navImage,
        // height: navSize,
        transition: 'all 2s ease ',
      }}
    >
      {({ open }) => (
        <>
          <div className="max-w-8xl  container mx-auto cursor-pointer">
            <div className="relative flex h-6 items-center justify-between">
              <div className="absolute -top-2 right-0 flex items-center pr-5 md:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className=" inline-flex items-center justify-center rounded-md bg-gray-700 p-2 text-gray-200  hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>

              <div className="">
                <Link href="/" className="cursor-pointer" passHref legacyBehavior>
                  <div className="flex flex-shrink-0 items-center justify-center pl-3 transition-all  hover:text-pink-500 hover:duration-150 hover:ease-in-out  ">
                    <div className=" flex flex-row items-center space-x-4  ">
                      <Image
                        className="rounded-xl"
                        src="/icon/icon.jpg"
                        alt="MTW icon"
                        width={45}
                        height={45}
                      />
                      <p className="hidden lg:block  text-base font-space-grotesk font-bold text-gray-700">
                        {' '}
                        meet the whytes
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch md:justify-between ">
          

                {/* Search Bar */}
                <form onSubmit={handleSearchSubmit} className="ml-4 md:ml-6 hidden sm:block">
                  <div className="relative rounded-md shadow-sm">
                    <input
                      type="text"
                      className="focus:ring-pink-500 focus:border-pink-500 block w-full pl-3 pr-12 sm:text-sm border-gray-300 rounded-md"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      {searchTerm && (
                        <button
                          type="button"
                          onClick={() => setSearchTerm('')}
                          className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                          <XIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                      )}
                      {!searchTerm && (
                        <svg
                          className="h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                </form>







                <div className="hidden sm:ml-6 md:block">
                  <div className="flex flex-row items-center justify-center space-x-4  align-middle">
                    {navigation.map((item) => (
                      <Link key={item.name} href={item.href}>
                        <div
                          className={` align-middl mb-2 mt-2 flex flex-col items-center justify-center rounded-xl px-2  py-1 decoration-[0.25rem] hover:decoration-[0.5rem] focus:decoration-[0.5rem] motion-safe:transition-all motion-safe:duration-200 ${item.bg} `}
                        >
                          {item.icon}
                          <div
                            className={classNames(
                              'inline-flex items-center border-b-4 px-1 pt-1 text-sm font-medium',
                              router.route === item.href
                                ? `border-pink-500 text-gray-900`
                                : 'border-transparent text-gray-500  hover:text-gray-700'
                            )}
                            aria-current={
                              router.route === item.href ? 'page' : undefined
                            }
                          >
                            <p className="text-gray-700"> {item.name}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden ">
            <div className="space-y-1 px-2 pb-3 pt-4">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <div
                    className={classNames(
                      item.current
                        ? 'bg-gray-900 text-white'
                        : 'text-white hover:bg-gray-700 hover:text-pink-500',
                      'block rounded-md bg-gray-700 px-3 py-2 text-base font-medium'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </div>
                </Link>
              ))}
              {/* Mobile Search Bar */}
              <form onSubmit={handleSearchSubmit} className="mt-4 px-2">
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    className="focus:ring-pink-500 focus:border-pink-500 block w-full pl-3 pr-12 sm:text-sm border-gray-300 rounded-md bg-gray-700 text-white"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-md border border-transparent bg-pink-500 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                    >
                      Search
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </Disclosure.Panel>






        </>
      )}
    </Disclosure>
  );
}