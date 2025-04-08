// components/RoomTech.tsx (Refactored)
import { inter, oswald } from 'app/fonts'; // Keep if used by SectionTitle or needed elsewhere
import React from 'react';
import SectionTitle from './SectionTitle';
import FeatureItem from './FeatureItem'; // Import the new component

// --- Data Definitions ---

// Structure for Internet Speed Tiers
const speedTiers = [
  // Order from highest threshold down
  { threshold: 40, text: 'Excellent', color: 'bg-green-700', features: ['Web Browsing', 'Emails', 'Zoom Meetings', 'Streaming Music', 'Streaming Youtube', 'Streaming HD Movies', 'Streaming 4k Movies', 'Streaming Video Games'] },
  { threshold: 30, text: 'Very Fast', color: 'bg-green-500', features: ['Web Browsing', 'Emails', 'Zoom Meetings', 'Streaming Music', 'Streaming Youtube', 'Streaming HD Movies', 'Streaming 4k Movies'] },
  { threshold: 23, text: 'Fast', color: 'bg-indigo-400', features: ['Web Browsing', 'Emails', 'Zoom Meetings', 'Streaming Music', 'Streaming Youtube', 'Streaming HD Movies'] },
  { threshold: 13, text: 'Average', color: 'bg-yellow-500', features: ['Web Browsing', 'Emails', 'Zoom Meetings', 'Streaming Music', 'Streaming Youtube'] },
  { threshold: 8, text: 'Average', color: 'bg-purple-500', features: ['Web Browsing', 'Emails', 'Streaming Music', 'Streaming Youtube'] },
  { threshold: 6, text: 'Slow', color: 'bg-blue-500', features: ['Web Browsing', 'Emails', 'Streaming Music', 'Streaming Youtube'] },
  { threshold: 3, text: 'Slow', color: 'bg-orange-500', features: ['Web Browsing', 'Emails', 'Streaming Music'] },
  { threshold: 0, text: 'Poor', color: 'bg-red-500', features: ['Web Browsing', 'Emails'] }, // Handles 0 to 2.99...
  // Fallback for invalid speed (e.g., negative, although unlikely)
  { threshold: -Infinity, text: 'No Internet', color: 'bg-gray-400', features: ['No Internet'] },
];

// Configuration for Tech Available Items
// Maps keys from the 'techAvailable' prop to display labels
const techConfig = [
  { key: 'USB', label: 'USB Ports' },
  { key: 'HDMI', label: 'HDMI Port' },
  { key: 'TV', label: 'In-Room TV' }, // Assuming TV means a standard TV
  { key: 'Chromecast', label: 'Chromecast / Smart TV' },
  { key: 'Wired', label: 'Wired Internet Port' },
  { key: 'Bluetooth', label: 'Bluetooth Speaker / Connectivity' }, // Assuming Bluetooth means speaker
  // Add other tech items here if your 'techAvailable' object has more keys
];

// Configuration for Room Amenities
// Maps keys from 'roomAmenitiesAvailiable' prop to labels and specifies if value should be shown
const amenityConfig = [
  { key: 'Coffee', label: 'Coffee Machine', showValue: true }, // Show the type of coffee
  { key: 'Toothpaste', label: 'Toothpaste/Mouthwash etc.' },
  { key: 'Fridge', label: 'Useable Fridge' },
  { key: 'Slippers', label: 'Slippers/Robes' }, // Combined based on original code using same key
  { key: 'Soap', label: 'Soap Provided', showValue: true }, // Show the type of soap
  { key: 'Other', label: 'Additional Amenities (Sewing kit etc.)' },
  // Add other amenities here
];


// --- Component Props ---
// Define more specific types if possible, using types imported from sanity queries
interface RoomTechProps {
  speed?: number | null;
  techAvailable?: Record<string, string | null | undefined> | null; // Object with string keys/values
  roomAmenitiesAvailiable?: Record<string, string | null | undefined> | null;
}

// --- Refactored Component ---

const RoomTech: React.FC<RoomTechProps> = ({
  speed = 0, // Default speed to 0 if undefined/null
  techAvailable,
  roomAmenitiesAvailiable,
}) => {

  // --- Calculate Internet Speed Details ---
  const currentSpeedTier = speedTiers.find(tier => speed >= tier.threshold) || speedTiers[speedTiers.length - 1]; // Find matching tier or use fallback
  const { text: textResult, color: bgColor, features: speedResult } = currentSpeedTier;

  // --- Render ---
  return (
    <>
      <section className="mt-8">
        <section className="overflow-hidden text-gray-800">
          <div className="mx-6 pb-12 md:container md:mx-auto">
            {/* Section Title */}
            <div className="mb-9 flex w-full flex-col">
              <SectionTitle
                header={'Hotel Technology & Amenities'}
                description={undefined}
              />
            </div>

            {/* Main Grid for Content Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 ">

              {/* --- Internet Speed Card --- */}
              <div className="w-full">
                <div className="relative flex h-full flex-col overflow-hidden rounded-lg border-2 border-green-500 p-4 py-6 md:p-5"> {/* Consistent padding */}
                  {/* Speed Rating Badge */}
                  <span className={`absolute right-0 top-0 m-1 rounded-bl-md rounded-tr-md ${bgColor} px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white`}> {/* Adjusted styling */}
                    {textResult}
                  </span>
                  {/* Card Title */}
                  <h2 className="title-font mb-3 text-base font-medium uppercase tracking-widest text-green-500"> {/* Increased mb */}
                    Internet Speed
                  </h2>
                  {/* Speed Display */}
                  <div className="mb-4 flex items-end border-b border-gray-200 pb-4 text-gray-900"> {/* Changed items-start to items-end */}
                    <span className="text-5xl font-bold leading-none lg:text-6xl">{speed}</span>
                    <span className="ml-2 pb-1 text-lg font-normal text-gray-500"> {/* Adjusted alignment/color */}
                      Mbps
                    </span>
                  </div>
                  {/* Features List */}
                  <p className="mb-3 text-base font-medium text-gray-800"> {/* Adjusted color */}
                    Good for:
                  </p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"> {/* Responsive columns for features */}
                    {speedResult.map((item, i) => (
                      // Use FeatureItem for consistency
                      <FeatureItem key={`speed-${i}`} label={item} isAvailable={true} />
                    ))}
                  </div>
                </div>
              </div>
              {/* --- End Internet Speed Card --- */}


              {/* --- Tech Available Card --- */}
              {techAvailable && Object.keys(techAvailable).length > 0 && ( // Render only if techAvailable has data
                <div className="w-full">
                  <div className="relative flex h-full flex-col overflow-hidden rounded-lg border-2 border-pink-500 p-4 py-6 md:p-5"> {/* Consistent padding */}
                    {/* Card Title */}
                    <h2 className="title-font mb-3 border-b border-gray-200 pb-3 text-base font-medium uppercase tracking-widest text-pink-500"> {/* Added border-b, padding */}
                      Tech Available
                    </h2>
                    {/* Features List */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"> {/* Responsive columns */}
                      {techConfig.map((item) => {
                        // Determine if the tech item is available ('Yes')
                        const isAvailable = techAvailable[item.key]?.toLowerCase() === 'yes';
                        // Render only if the key exists in the data, or always show status
                        // Let's always show status for clarity
                        // if (techAvailable.hasOwnProperty(item.key)) {
                          return (
                            <FeatureItem
                              key={`tech-${item.key}`}
                              label={item.label}
                              isAvailable={isAvailable}
                            />
                          );
                        // }
                        // return null;
                      })}
                    </div>
                  </div>
                </div>
              )}
              {/* --- End Tech Available Card --- */}


              {/* --- Room Amenities Card --- */}
              {roomAmenitiesAvailiable && Object.keys(roomAmenitiesAvailiable).length > 0 && ( // Render only if roomAmenitiesAvailiable has data
                <div className="w-full">
                  <div className="relative flex h-full flex-col overflow-hidden rounded-lg border-2 border-blue-500 p-4 py-6 md:p-5"> {/* Consistent padding */}
                    {/* Card Title */}
                    <h2 className="title-font mb-3 border-b border-gray-200 pb-3 text-base font-medium uppercase tracking-widest text-blue-500"> {/* Added border-b, padding */}
                      Room Amenities
                    </h2>
                     {/* Features List */}
                     <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"> {/* Responsive columns */}
                      {amenityConfig.map((item) => {
                        const value = roomAmenitiesAvailiable[item.key];
                        // Determine availability: 'Yes' or if showValue is true and value exists and isn't explicitly 'No'/'None' etc.
                        const isAvailable = value?.toLowerCase() === 'yes' ||
                                           (item.showValue && value && value.toLowerCase() !== 'no' && value.toLowerCase() !== 'none');
                        const details = (item.showValue && isAvailable && value?.toLowerCase() !== 'yes') ? value : undefined;

                        // Render only if the key exists in the data, or always show status
                        // Let's always show status for clarity
                        // if (roomAmenitiesAvailiable.hasOwnProperty(item.key)) {
                          return (
                            <FeatureItem
                              key={`amenity-${item.key}`}
                              label={item.label}
                              isAvailable={isAvailable}
                              details={details} // Pass details like Coffee/Soap type
                            />
                          );
                        // }
                        // return null;
                      })}
                    </div>
                  </div>
                </div>
              )}
              {/* --- End Room Amenities Card --- */}

            </div> {/* End Main Grid */}
          </div> {/* End Container */}
        </section>
      </section>
    </>
  );
};

export default RoomTech;

