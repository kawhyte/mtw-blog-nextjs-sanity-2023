import { oswald } from 'app/fonts'

export default function AuthorAvatar({ data }) {

  return (
    <div className=" col-span-3 lg:col-span-2   h-60 rounded-3xl bg-gray-200 outline  ">
      <div className="flex flex-col  md:flex-row items-center pl-4  ">
        <img
          src={data.image}
          className=" -ml-10  h-48 w-48 md:h-56 md:w-56 lg:h-52 lg:w-52 max-w-full "
          alt="title image"
        />
        <div className="md:mt-2 flex md:flex-col md:justify-start">
          <p
            className={`${oswald.variable}  title-font md:my-2   font-heading text-3xl font-medium text-${data.color}-500 text-gray-900 sm:text-4xl`}
          >
            {data.name}
          </p>
          <div className="hidden md:block my-2 mr-6 border-t-2 border-indigo-500"></div>

          {/**/} <div className=" mr-4">
            <span className="hidden md:block  mt-2  text-base  font-extralight text-gray-500">
              &quot;{data.quote}&quot; {data.quote_by}
            </span>
          </div> 

          {/* <div className=" ">
            <p className=" mt- ml-2 text-start  text-sm  font-extralight text-gray-500">
              Things I Like:
            </p>

            <div className="text-nowrap mt-2 grid grid-cols-4  gap-x-4 gap-y-1 pr-3">
              {data.favorite?.map((item) => (
                <div
                  key={item.id}
                  className=" text-nowrap flex flex-col items-center gap-x-2 text-center font-light leading-relaxed text-gray-500"
                >
                  <span>{item.img} </span>
                  <span
                    className={`text-nowrap rounded-full lg:hidden 2xl:block   px-2 py-1 text-xs    font-extralight  text-gray-500 `}
                  >
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div> */}


        </div>
        
      </div>

      
    </div>
  )
}
