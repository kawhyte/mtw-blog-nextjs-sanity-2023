// Common cruise departure ports with their nearby airports and terminals, for
// the Cruise Review dropdowns in Studio. Hand-maintained: add a port when we
// sail from somewhere new. Terminals are listed only where they are stable.

export interface CruisePort {
  name: string
  airports: string[]
  terminals?: string[]
}

export const CRUISE_PORTS: CruisePort[] = [
  {
    name: 'Los Angeles (San Pedro)',
    airports: ['Los Angeles (LAX)', 'Long Beach (LGB)', 'Orange County (SNA)', 'Burbank (BUR)'],
    terminals: ['World Cruise Center (Berths 91 to 93)'],
  },
  {
    name: 'Long Beach',
    airports: ['Long Beach (LGB)', 'Los Angeles (LAX)', 'Orange County (SNA)'],
    terminals: ['Long Beach Cruise Terminal'],
  },
  { name: 'San Diego', airports: ['San Diego (SAN)'] },
  {
    name: 'Seattle',
    airports: ['Seattle Tacoma (SEA)'],
    terminals: ['Pier 66 (Bell Street)', 'Pier 91 (Smith Cove)'],
  },
  { name: 'Vancouver', airports: ['Vancouver (YVR)'], terminals: ['Canada Place'] },
  {
    name: 'Miami',
    airports: ['Miami (MIA)', 'Fort Lauderdale (FLL)'],
    terminals: [
      'Terminal A', 'Terminal AA', 'Terminal B', 'Terminal C', 'Terminal D', 'Terminal E',
      'Terminal F', 'Terminal G', 'Terminal J', 'Terminal V',
    ],
  },
  {
    name: 'Fort Lauderdale (Port Everglades)',
    airports: ['Fort Lauderdale (FLL)', 'Miami (MIA)'],
    terminals: [
      'Terminal 2', 'Terminal 4', 'Terminal 18', 'Terminal 19', 'Terminal 21',
      'Terminal 25', 'Terminal 26', 'Terminal 29',
    ],
  },
  {
    name: 'Port Canaveral (Orlando)',
    airports: ['Orlando (MCO)', 'Melbourne (MLB)', 'Orlando Sanford (SFB)'],
    terminals: ['Terminal 1', 'Terminal 3', 'Terminal 5', 'Terminal 6', 'Terminal 8', 'Terminal 10'],
  },
  { name: 'Tampa', airports: ['Tampa (TPA)'] },
  {
    name: 'Galveston',
    airports: ['Houston Hobby (HOU)', 'Houston Bush (IAH)'],
    terminals: ['Terminal 10', 'Terminal 16', 'Terminal 25'],
  },
  { name: 'New Orleans', airports: ['New Orleans (MSY)'] },
  { name: 'Mobile', airports: ['Mobile (MOB)', 'Pensacola (PNS)'] },
  { name: 'Baltimore', airports: ['Baltimore (BWI)'] },
  {
    name: 'New York (Manhattan)',
    airports: ['LaGuardia (LGA)', 'New York JFK (JFK)', 'Newark (EWR)'],
  },
  { name: 'New York (Brooklyn)', airports: ['New York JFK (JFK)', 'LaGuardia (LGA)', 'Newark (EWR)'] },
  { name: 'Cape Liberty (Bayonne)', airports: ['Newark (EWR)', 'New York JFK (JFK)', 'LaGuardia (LGA)'] },
  { name: 'Boston', airports: ['Boston (BOS)'] },
  { name: 'San Juan', airports: ['San Juan (SJU)'] },
  { name: 'Honolulu', airports: ['Honolulu (HNL)'] },
  { name: 'Barcelona', airports: ['Barcelona (BCN)'] },
  { name: 'Civitavecchia (Rome)', airports: ['Rome Fiumicino (FCO)'] },
  { name: 'Southampton', airports: ['London Heathrow (LHR)', 'Southampton (SOU)'] },
  { name: 'Singapore', airports: ['Singapore Changi (SIN)'] },
  { name: 'Sydney', airports: ['Sydney (SYD)'] },
]

export const TRANSFER_OPTIONS = [
  'Uber or Lyft',
  'Taxi',
  'Cruise line transfer',
  'Hotel shuttle',
  'Private car service',
  'Drove and parked',
  'Rental car',
  'Dropped off',
]

export const DROVE_AND_PARKED = 'Drove and parked'

export const findPort = (name?: string) => CRUISE_PORTS.find((p) => p.name === name)
