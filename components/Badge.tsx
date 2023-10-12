import React from "react";

import PostDate from "./PostDate";


function MtwAward({ address, date }) {
	return (
        <>
		<div>
			<span className='flex flex-row-reverse justify-center items-center px-3 ml-6  md:mx-3 -my-4 z-20  text-base rounded-lg   bg-white shadow-lg absolute '>
				<p className='text-black  font-medium text-sm md:text-base p-1  '>
					{<span className='mr-1'>
						{" "}
						{address ? address : ""}{" "}
					</span>}
					| <span className='ml-1'></span> Visited <PostDate dateString={date} />
				</p>

			</span>
		</div>
          
          
          </>
	);
}

export default MtwAward;
