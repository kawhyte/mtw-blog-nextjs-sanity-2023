/* eslint-disable @next/next/no-html-link-for-pages */
import { inter } from 'app/fonts';
import Link from 'next/link';
import { ReactNode } from 'react';
import * as LucideReact from 'lucide-react';

interface ButtonProps {
  children?: ReactNode;
  link?: string;
  text?: string;
  size?: 'xs'| 'sm' | 'md' | 'lg';
  fontSize?: 'sm' | 'md' | 'lg';
  hoverColor?: string;
  icon?: any
  iconSize?: number;
  noBorder?: boolean; // Add noBorder prop
}

const sizeClasses: { [key in ButtonProps['size']]: string } = {
  xs: 'text-xs py-1 px-3',
  sm: 'text-sm py-1 px-3',
  md: 'text-base py-2 px-5',
  lg: 'text-lg py-3 px-7',
};

const fontSizeClasses: { [key in ButtonProps['fontSize']]: string } = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

export default function Button({
  text,
  link,
  children,
  size = 'md',
  fontSize = 'md',
  hoverColor = 'pink-200',
  icon,
  iconSize = 16,
  noBorder = false, // Default value for noBorder
}: ButtonProps) {
  const IconComponent = icon ? LucideReact[icon] : null;
  if (link) {
  return (
    <Link href={link} passHref legacyBehavior>
      <div
      className={` flex
        text-shade-90 after:bg-shine after:hover:animate-shine before:bg-gradient-btn text-t4
        relative z-10  w-full scale-95 overflow-hidden whitespace-nowrap
        rounded-[36px]  bg-white text-center font-medium uppercase
        leading-6 tracking-tight  transition-transform duration-300 text-gray-700
        before:absolute before:inset-0 before:-z-10 before:rounded-[36px] before:opacity-0
        before:transition-opacity before:duration-500 after:absolute after:inset-0
        after:rounded-[36px] after:bg-[position:-3em] after:bg-no-repeat after:[background-size:auto_100%]
        hover:scale-100 hover:before:opacity-100 after:hover:[animation-fill-mode:forwards]
        focus:scale-100 focus:before:opacity-100 motion-reduce:hover:scale-95
        motion-reduce:after:hover:animate-none motion-reduce:focus:scale-95
        ${sizeClasses[size]} ${fontSizeClasses[fontSize]} hover:bg-${hoverColor}
        ${noBorder ? '' : 'border-4 border-[#1f1f1f] shadow-[4px_4px_#1f1f1f]'} 
      `}
      >
        {/* {IconComponent && <IconComponent className="mr-2" size={iconSize} />} */}
      {icon &&  <span className='mr-2'>
        {icon}</span>}
        <div> 
        {text}
        {children}</div>
      </div>
    </Link>
  );
}else{
  return (
    <button
      className={` flex items-center text-gray-700
        text-shade-90 after:bg-shine after:hover:animate-shine before:bg-gradient-btn text-t4
        relative z-10  w-full scale-95 overflow-hidden whitespace-nowrap
        rounded-[36px]  bg-white text-center font-medium uppercase
        leading-6 tracking-tight  transition-transform duration-300
        before:absolute before:inset-0 before:-z-10 before:rounded-[36px] before:opacity-0
        before:transition-opacity before:duration-500 after:absolute after:inset-0
        after:rounded-[36px] after:bg-[position:-3em] after:bg-no-repeat after:[background-size:auto_100%]
        hover:scale-100 hover:before:opacity-100 after:hover:[animation-fill-mode:forwards]
        focus:scale-100 focus:before:opacity-100 motion-reduce:hover:scale-95
        motion-reduce:after:hover:animate-none motion-reduce:focus:scale-95
        ${sizeClasses[size]} ${fontSizeClasses[fontSize]} hover:bg-${hoverColor}
        ${noBorder ? '' : 'border-4 border-[#1f1f1f] shadow-[4px_4px_#1f1f1f]'} 
      `}
    >
      {/* {IconComponent && <IconComponent className="mr-2" size={iconSize} />} */}
      {icon &&  <span className='mr-2'>
        {icon}</span>}
      {text}
      {children}
    </button>
  )
}
}