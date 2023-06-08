import React from "react";

function ProgressRating({ progress }) {
	
	
	let progressPercentage = (Math.floor(progress) / 5) * 100;

	return (
		<>
			<div className='h-2 w-full bg-gray-300 '>
				<div
					style={{ width: `${progressPercentage}%` }}
					className={`h-full  ${
						progressPercentage < 65 ? "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-lg " : "bg-gradient-to-r from-green-500 to-green-700 rounded-lg "
					}`}></div>
			</div>
			<span className='text-base ml-3'>{progress} </span>
		</>
	);
}

export default ProgressRating;
