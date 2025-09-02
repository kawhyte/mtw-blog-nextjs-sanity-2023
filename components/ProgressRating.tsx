import React from "react";

function ProgressRating({ progress, color }) {
	
	
	let progressPercentage = (Math.floor(progress) / 5) * 100;

	return (
		<>
			<div className='h-2 w-full bg-gray-300 '>
				<div
					style={{ width: `${progressPercentage}%` }}
					// className={`h-full  ${
					// 	progressPercentage < 65 ? "bg-linear-to-r from-pink-500 via-red-500 to-yellow-500 rounded-lg " : "bg-linear-to-r from-green-500 to-green-700 rounded-lg "
					// }`}

					className="h-full bg-slate-500 rounded-2xl"
					
					>


					</div>
			</div>
			<span className='text-sm ml-3 md:text-base font-bold '>{progress.toFixed(1)} </span>
		</>
	);
}

export default ProgressRating;
