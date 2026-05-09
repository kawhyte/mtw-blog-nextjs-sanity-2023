import { Car, CheckCircle2, ConciergeBell, Laptop, Mail, MonitorPlay, Tv, UtensilsCrossed, Video, Wifi, XCircle } from 'lucide-react'
import React from 'react'

import SectionTitle from './SectionTitle'

// --- Themed Data Definitions ---

// Internet speed tiers now use semantic theme colors
const speedTiers = [
  { threshold: 40, text: 'Excellent', theme: 'success' },
  { threshold: 23, text: 'Fast', theme: 'success' },
  { threshold: 13, text: 'Average', theme: 'accent' },
  { threshold: 6, text: 'Slow', theme: 'destructive' },
  { threshold: 0, text: 'Poor', theme: 'destructive' },
  { threshold: -Infinity, text: 'N/A', theme: 'muted' },
]

const techConfig = [
  { key: 'USB', label: 'Key Card for Elevator' },
  { key: 'HDMI', label: 'Guest In-Room Tablet' },
  { key: 'TV', label: 'Mobile Key Access' },
  { key: 'Chromecast', label: 'Smart TV' },
  { key: 'Wired', label: 'Wired Internet' },
  { key: 'Bluetooth', label: 'Hospitality App/Texting' },
]

const amenityConfig = [
  { key: 'Coffee', label: 'Coffee Machine', showValue: true },
  { key: 'Toothpaste', label: 'Toothpaste' },
  { key: 'Fridge', label: 'Useable Fridge' },
  { key: 'Slippers', label: 'Slippers/Robes' },
  { key: 'Soap', label: 'Soap Provided', showValue: true },
  { key: 'Other', label: 'Additional Amenities' },
]

const wifiCapabilities = [
  { label: 'Check Email & Browse', minSpeed: 2, icon: <Mail className="h-4 w-4 mr-2 shrink-0" /> },
  { label: 'Video Call (Zoom, FaceTime)', minSpeed: 5, icon: <Video className="h-4 w-4 mr-2 shrink-0" /> },
  { label: 'Watch Netflix / HD Streaming', minSpeed: 8, icon: <Tv className="h-4 w-4 mr-2 shrink-0" /> },
  { label: 'Stream in 4K', minSpeed: 25, icon: <MonitorPlay className="h-4 w-4 mr-2 shrink-0" /> },
]

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
        <span className="text-sm text-muted-foreground italic">
          ({details})
        </span>
      )}
    </div>
  </div>
)

// A reusable card for Tech and Amenities sections
const InfoCard = ({ title, icon, color, config, data }) => {
  if (!data || Object.keys(data).length === 0) return null

  const themeClasses = {
    primary: { border: 'border-primary', text: 'text-primary' },
    secondary: { border: 'border-secondary', text: 'text-secondary' },
    third: { border: 'border-success', text: 'text-success' },
  }
  const theme = themeClasses[color]

  return (
    <div
      className={`flex h-full flex-col rounded-2xl border-2 bg-card p-5 shadow-lg ${theme.border}`}
    >
      <div
        className={`mb-3 flex items-center border-b border-border pb-3  font-bold uppercase tracking-wider ${theme.text}`}
      >
        {React.cloneElement(icon, { className: 'h-5 w-5 mr-3 ' })}
        {title}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 text-base ">
        {config.map((item) => {
          const value = data[item.key]
          const isAvailable =
            value?.toLowerCase() === 'yes' ||
            (item.showValue &&
              value &&
              !['no', 'none'].includes(value.toLowerCase()))
          const details =
            item.showValue && isAvailable && value.toLowerCase() !== 'yes'
              ? value
              : undefined
          return (
            <FeatureItem
              key={item.key}
              label={item.label}
              isAvailable={isAvailable}
              details={details}
            />
          )
        })}
      </div>
    </div>
  )
}

const PARKING_LABELS: Record<string, string> = {
  valet: 'Valet',
  self_park: 'Self-park',
  street: 'Street',
  none: 'No Parking',
}

const BREAKFAST_LABELS: Record<string, string> = {
  included: 'Breakfast Included',
  paid: 'Breakfast (Paid)',
  none: 'No On-site Breakfast',
}

// --- Main Exported Component ---

const RoomTech = ({
  speed = 0,
  techAvailable,
  roomAmenitiesAvailiable,
  parking,
  breakfast,
}: {
  speed?: number
  techAvailable?: any
  roomAmenitiesAvailiable?: any
  parking?: { parkingType?: string; dailyCost?: number }
  breakfast?: string
}) => {
  const speedTier =
    speedTiers.find((tier) => speed >= tier.threshold) ||
    speedTiers[speedTiers.length - 1]

  const themeClasses = {
    success: 'bg-success text-success-foreground',
    accent: 'bg-accent text-accent-foreground',
    destructive: 'bg-destructive text-destructive-foreground',
    muted: 'bg-muted text-muted-foreground',
  }
  const badgeClass = themeClasses[speedTier.theme]

  return (
    <section className="my-16">
      <SectionTitle header={'Technology & Amenities'} />
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* --- Internet Speed Card --- */}
          <div className="flex h-full flex-col rounded-2xl border-2 border-success bg-card p-5 shadow-lg">
            <div className="mb-3 flex items-center border-b border-border pb-3 font-bold uppercase tracking-wider text-success">
              <Wifi className="h-6 w-6 mr-3 text-green-500" />
              Internet Speed
              <span
                className={`ml-auto rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}
              >
                {speedTier.text}
              </span>
            </div>
            <div className="flex items-end text-foreground">
              <span className="text-6xl font-bold leading-none">
                {speed || '0'}
              </span>
              <span className="ml-2 pb-1 text-lg font-normal text-muted-foreground">
                Mbps
              </span>
            </div>
            <p className="mt-4 mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Can you...
            </p>
            <div className="flex flex-col gap-2 text-sm">
              {wifiCapabilities.map(({ label, minSpeed, icon }) => {
                const capable = speed >= minSpeed
                return (
                  <div
                    key={label}
                    className={`flex items-center ${capable ? 'text-foreground' : 'text-muted-foreground opacity-50'}`}
                  >
                    {capable ? (
                      <CheckCircle2 className="h-4 w-4 mr-2 shrink-0 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-2 shrink-0 text-destructive" />
                    )}
                    {label}
                  </div>
                )
              })}
            </div>
          </div>

          {/* --- Tech Available Card --- */}
          <InfoCard
            title="Tech Available"
            icon={<Laptop />}
            color="third"
            config={techConfig}
            data={techAvailable}
          />

          {/* --- Room Amenities Card --- */}
          <InfoCard
            title="Room Amenities"
            icon={<ConciergeBell />}
            color="third"
            config={amenityConfig}
            data={roomAmenitiesAvailiable}
          />
        </div>

        {/* --- Parking & Breakfast row (only shown when data exists) --- */}
        {(parking?.parkingType || breakfast) && (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {parking?.parkingType && (
              <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
                <Car className="h-5 w-5 shrink-0 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Parking
                  </p>
                  <p className="font-medium text-foreground">
                    {PARKING_LABELS[parking.parkingType] ?? parking.parkingType}
                    {parking.dailyCost != null && parking.dailyCost > 0 && (
                      <span className="ml-1 text-muted-foreground font-normal">
                        (${parking.dailyCost}/day)
                      </span>
                    )}
                    {parking.dailyCost === 0 && (
                      <span className="ml-1 text-muted-foreground font-normal">
                        (Free)
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}

            {breakfast && (
              <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
                <UtensilsCrossed className="h-5 w-5 shrink-0 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Breakfast
                  </p>
                  <p className="font-medium text-foreground">
                    {BREAKFAST_LABELS[breakfast] ?? breakfast}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default RoomTech
