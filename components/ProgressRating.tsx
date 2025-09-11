import React from 'react'

function ProgressRating({ progress, color }) {
  let progressPercentage = (Math.floor(progress) / 5) * 100

  return (
    <>
      <div className="h-2 w-full bg-gray-300 rounded-2xl overflow-hidden">
        <div
          style={{
            width: `${progressPercentage}%`,
            backgroundColor: '#64748b',
            height: '100%',
            borderRadius: '1rem',
            transition: 'width 0.3s ease-in-out',
          }}
          className="h-full"
        ></div>
      </div>
      <span className="text-sm ml-3 md:text-base font-bold ">
        {(Math.floor(progress * 100) / 100).toFixed(2) || '0.00'}{' '}
      </span>
    </>
  )
}

export default ProgressRating
