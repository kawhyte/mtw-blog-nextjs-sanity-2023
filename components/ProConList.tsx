import { Spoiler } from '@/components/ui/spoiler';

import React from 'react';

import { ThumbsUp,ThumbsDown, CircleCheckBig,CircleX, Scale } from 'lucide-react';


import PostBody from '../components/PostBody'; // Renders Portable Text
import SectionTitle from './SectionTitle'; // Your SectionTitle component
import type { PortableTextBlock } from '@portabletext/types'; // For verdict type

// Define expected props - matching Sanity data structure
interface ProConListProps {
  positives?: string | string[];
  negatives?: string | string[];
  verdict2?: PortableTextBlock[] | string; // Use the prop name expected by the component
}

const boxHeight = 390; // Define max height for spoiler

function ProConList({ positives, negatives, verdict2 }: ProConListProps) {
  // Basic checks to see if sections have content
  const showPositives = positives && positives.length > 0;
  const showNegatives = negatives && negatives.length > 0;
  // Check if verdict is not null AND has content (Portable Text is an array)
  const showVerdict = verdict2 && verdict2.length > 0;

  // Don't render the section at all if there's nothing to show
  if (!showPositives && !showNegatives && !showVerdict) {
    return null;
  }

  return (
    <>
      {/* Section Wrapper */}
      <section className="mx-6 text-gray-800 md:mx-0">
        {/* Section Title */}
        <SectionTitle header={'Bottom Line'} description={undefined} />

        {/* Main Content Container */}
        <div className="container flex flex-wrap py-6 md:mx-auto lg:py-8">
          {/* Grid for Pros, Cons, Verdict */}
          <div className=" grid grid-cols-1  gap-6 2xl:grid-cols-3">

            {/* --- Positives Column --- */}
            {showPositives && (
              <div className="md:w-full">
                <div className="flex h-full flex-col rounded-lg border-2 border-green-500 border-opacity-50 p-2 shadow-sm shadow-green-200/40 md:p-5">
                  {/* Header */}
                  <div className="mb-3 flex justify-start border-b border-gray-200 pb-4 align-middle ">
                    <ThumbsUp className="mr-3 h-7 w-7 rounded-2xl p-1 text-green-500 " />
                    <h2 className="title-font mb-1 text-base font-medium uppercase tracking-widest text-green-500">
                      What we loved
                    </h2>
                  </div>
                  {/* List Content */}
                  <div className="-mb-1 flex flex-col items-center space-y-2.5 sm:items-start sm:text-left">
                    <Spoiler maxHeight={boxHeight} showLabel="Show more" hideLabel="Show less">
                      <ul className="pt-2"> 
                        {Array.isArray(positives) && positives.map((positive, index) => (
                          <li key={`pro-${index}`} className=" my-3 text-sm leading-loose md:text-base">
                            <div className="flex items-baseline ">
                              <div className="mr-2 inline-flex shrink-0 items-center justify-center pt-0.5 text-green-500">
                                <CircleCheckBig className="h-5 w-5 " /> 
                              </div>
                              <p className="">{positive}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </Spoiler>
                  </div>
                </div>
              </div>
            )}

            {/* --- Negatives Column --- */}
            {showNegatives && (
              <div className="md:w-full">
                <div className="flex h-full flex-col rounded-lg border-2 border-red-500 border-opacity-50 p-2 shadow-sm shadow-red-200/60 md:p-5">
                  {/* Header */}
                  <div className="mb-3 flex justify-start border-b border-gray-200 pb-4 align-middle">
                    <ThumbsDown className="mr-3 h-7 w-7  p-1 text-red-500 " />
                    <h2 className="title-font mb-1 text-base font-medium uppercase tracking-widest text-red-500">
                      What we did not like
                    </h2>
                  </div>
                  {/* List Content */}
                  <div className="-mb-1 flex flex-col items-center space-y-2.5 sm:items-start sm:text-left">
                    <Spoiler maxHeight={boxHeight} showLabel="Show more" hideLabel="Show less">
                      <ul className="pt-2"> {/* Added padding top */}
                        {Array.isArray(negatives) && negatives.map((negative, index) => (
                          <li key={`neg-${index}`} className=" my-3 text-sm leading-loose md:text-base">
                            <div className="flex items-baseline ">
                              <div className="mr-2 inline-flex shrink-0 items-center justify-center pt-0.5  text-red-500">
                                <CircleX className="h-5 w-5 " /> {/* Added shrink-0 */}
                              </div>
                              <p className="">{negative}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </Spoiler>
                  </div>
                </div>
              </div>
            )}

            {/* --- Verdict Column --- */}
            {showVerdict && (
               <div className="md:w-full">
                <div className="flex h-full flex-col rounded-lg border-2 border-indigo-500 border-opacity-50 p-2 shadow-md shadow-indigo-100/50 md:p-5">
                  {/* Header */}
                  <div className="mb-3 flex justify-start border-b border-gray-200 pb-4 align-middle ">
                    <Scale className="ml-1 mr-3 h-7 w-7  text-indigo-500 " />
                    <h2 className="title-font mb-1 text-base font-medium uppercase tracking-widest text-indigo-500">
                      Verdict
                    </h2>
                  </div>
                  {/* Content */}
                  <div className="mb-3 text-sm leading-loose md:text-base">
                    <Spoiler maxHeight={boxHeight} showLabel="Show more" hideLabel="Show less">
                       {/* Ensure PostBody correctly handles Portable Text array */}
                       {/* Added pt-2 for padding like others */}
                      <div className="prose prose-sm md:prose-base pt-2"> {/* Added prose class for basic styling */}
                        <PostBody content={verdict2} />
                      </div>
                    </Spoiler>
                  </div>
                </div>
              </div>
            )}

          </div> {/* End Grid */}
        </div> {/* End Container */}
      </section> {/* End Section */}
    </>
  );
}

export default ProConList;