import { CheckCircle2, Wifi, XCircle } from 'lucide-react';
import React from 'react';

import SectionTitle from './SectionTitle';

// --- Themed Data Definitions ---

// Internet speed tiers now use semantic theme colors
const speedTiers = [
  { threshold: 40, text: 'Excellent', theme: 'success' },
  { threshold: 23, text: 'Fast', theme: 'success' },
  { threshold: 13, text: 'Average', theme: 'accent' },
  { threshold: 6, text: 'Slow', theme: 'destructive' },
  { threshold: 0, text: 'Poor', theme: 'destructive' },
  { threshold: -Infinity, text: 'N/A', theme: 'muted' },
];

const techConfig = [
  { key: 'USB', label: 'USB Ports' },
  { key: 'HDMI', label: 'HDMI Port' },
  { key: 'TV', label: 'In-Room TV' },
  { key: 'Chromecast', label: 'Chromecast / Smart TV' },
  { key: 'Wired', label: 'Wired Internet Port' },
  { key: 'Bluetooth', label: 'Bluetooth Speaker' },
];

const amenityConfig = [
  { key: 'Coffee', label: 'Coffee Machine', showValue: true },
  { key: 'Toothpaste', label: 'Toothpaste / Mouthwash' },
  { key: 'Fridge', label: 'Useable Fridge' },
  { key: 'Slippers', label: 'Slippers/Robes' },
  { key: 'Soap', label: 'Soap Provided', showValue: true },
  { key: 'Other', label: 'Additional Amenities' },
];

// --- Reusable Sub-Components ---

// A consistent item for feature lists (e.g., "USB Ports: Yes")
const FeatureItem = ({ label, isAvailable, details }) => (
  <div className="flex items-start text-foreground">
    {isAvailable ? (
      <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 shrink-0 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 mr-2 mt-0.5 shrink-0  text-destructive" />
    )}
    <div className="flex flex-col">
      <span>{label}</span>
      {details && (
        <span className="text-sm text-muted-foreground italic">({details})</span>
      )}
    </div>
  </div>
);

// A reusable card for Tech and Amenities sections
const InfoCard = ({ title, icon, color, config, data }) => {
  if (!data || Object.keys(data).length === 0) return null;

  const themeClasses = {
    primary: { border: 'border-primary', text: 'text-primary' },
    secondary: { border: 'border-secondary', text: 'text-secondary' },
    third: { border: 'border-success', text: 'text-success' },
  };
  const theme = themeClasses[color];

  return (
    <div className={`flex h-full flex-col rounded-2xl border-2 bg-card p-5 shadow-lg ${theme.border}`}>
      <div className={`mb-3 flex items-center border-b border-border pb-3 font-bold uppercase tracking-wider ${theme.text}`}>
        {React.cloneElement(icon, { className: 'h-5 w-5 mr-3 ' })}
        {title}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 ">
        {config.map((item) => {
          const value = data[item.key];
          const isAvailable = value?.toLowerCase() === 'yes' || (item.showValue && value && !['no', 'none'].includes(value.toLowerCase()));
          const details = item.showValue && isAvailable && value.toLowerCase() !== 'yes' ? value : undefined;
          return <FeatureItem key={item.key} label={item.label} isAvailable={isAvailable} details={details} />;
        })}
      </div>
    </div>
  );
};

// --- Main Exported Component ---

const RoomTech = ({ speed = 0, techAvailable, roomAmenitiesAvailiable }) => {
  const speedTier = speedTiers.find((tier) => speed >= tier.threshold) || speedTiers[speedTiers.length - 1];

  const themeClasses = {
    success: 'bg-success text-success-foreground',
    accent: 'bg-accent text-accent-foreground',
    destructive: 'bg-destructive text-destructive-foreground',
    muted: 'bg-muted text-muted-foreground',
  };
  const badgeClass = themeClasses[speedTier.theme];

  return (
    <section className="my-12">
      <SectionTitle header={'Technology & Amenities'} />
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* --- Internet Speed Card --- */}
          <div className="flex h-full flex-col rounded-2xl border-2 border-success bg-card p-5 shadow-lg">
            <div className="mb-3 flex items-center border-b border-border pb-3 font-bold uppercase tracking-wider text-success">
              <Wifi className="h-6 w-6 mr-3 text-green-500" />
              Internet Speed
              <span className={`ml-auto rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>
                {speedTier.text}
              </span>
            </div>
            <div className="flex items-end text-foreground">
              <span className="text-6xl font-bold leading-none">{speed || '0'}</span>
              <span className="ml-2 pb-1 text-lg font-normal text-muted-foreground">Mbps</span>
            </div>
            <p className="mt-4 mb-2 text-base font-medium text-foreground">Good for:</p>
            <div className="grid grid-cols-1 gap-2 text-sm">
              {['Web Browsing', 'Emails', 'Zoom', 'HD Streaming', '4K Streaming'].map((feature) => (
                <div key={feature} className="flex items-center text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" /> {feature}
                </div>
              ))}
            </div>
          </div>

          {/* --- Tech Available Card --- */}
          <InfoCard
            title="Tech Available"
            icon={<div />} // Placeholder, you can add a real icon
            color="third"
            config={techConfig}
            data={techAvailable}
          />

          {/* --- Room Amenities Card --- */}
          <InfoCard
            title="Room Amenities"
            icon={<div />} // Placeholder, you can add a real icon
            color="third"
            config={amenityConfig}
            data={roomAmenitiesAvailiable}
          />
        </div>
      </div>
    </section>
  );
};

export default RoomTech;
