#!/usr/bin/env node
/**
 * One-time script: creates the NBA Arena Road Trip Guide as an UNPUBLISHED
 * draft in Sanity. Run once, then delete this file.
 */

import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

let k = 0
const key = () => `k${++k}`

const span = (text, marks = []) => ({
  _type: 'span',
  _key: key(),
  text,
  marks,
})

const block = (style, children, markDefs = []) => ({
  _type: 'block',
  _key: key(),
  style,
  children,
  markDefs,
})

const h2 = (text) => block('h2', [span(text)])
const h3 = (text) => block('h3', [span(text)])
const p = (children, markDefs = []) => block('normal', children, markDefs)

const linkKey = (id) => `link-${id}`

// Linked text inside a paragraph
const linkedSpan = (text, href) => {
  const lk = key()
  return {
    children: [span(text, [lk])],
    markDefs: [{ _type: 'link', _key: lk, href }],
  }
}

const callout = (type, children) => ({
  _type: 'callout',
  _key: key(),
  type,
  text: children,
})

const content = [

  // ── INTRO ──────────────────────────────────────────────────────────────
  p([span('We have a problem. A very fun, very expensive, completely irrational problem.')]),

  p([span('We decided to visit every NBA arena in the United States and Canada. All 30 of them. Somewhere along the way, that casual "wouldn\'t that be cool?" conversation turned into a spreadsheet, a hotel points strategy, and a real opinion about the parking situation in Oklahoma City.')]),

  p([span('If you\'ve ever watched a game from your couch and thought "what if I just actually went" — this guide is for you. We\'ve been doing this for a while, and we\'ve picked up a lot along the way. How to plan your trips around the schedule, how to stack multiple arenas into one visit, which buildings are genuinely worth the flight, and what to do once you get there.')]),

  p([span('This isn\'t a listicle. It\'s a real guide from people who are actually working through the list.')]),

  // ── WHY ────────────────────────────────────────────────────────────────
  h2('Why Visiting Every NBA Arena Is Worth It'),

  p([span('Most people watch basketball from their couch. And honestly, the TV angles are better, parking is free, and nobody elbows you for the armrest. We get it.')]),

  p([span('But there\'s something a live NBA game does that a 75-inch screen just can\'t replicate: it shows you how fast and enormous these people actually are. On TV, the court looks compact. In person, you\'re watching humans move at a speed your eyes have to recalibrate to process. The sound when someone throws down a dunk reverberates in your chest in a way your soundbar was never designed to handle.')]),

  p([span('And then there\'s the arena itself. Each one has a personality. Each one tells you something about its city.')]),

  p([span('Fiserv Forum in Milwaukee has an entire neighborhood that turns into a street festival three hours before tip-off. State Farm Arena in Atlanta is one of the sharpest renovated buildings in the league. Mohegan Sun Arena in Connecticut is the only NBA venue sitting inside a casino resort — which creates a game-day experience you genuinely can\'t find anywhere else.')]),

  p([span('The point is: visiting NBA arenas is a legitimately great reason to see parts of the country you might never otherwise make it to. Indianapolis, Oklahoma City, Memphis, Portland — cities that rarely top anyone\'s travel list but have real things to offer if you actually show up.')]),

  // ── HOW TO PLAN ────────────────────────────────────────────────────────
  h2('How to Plan Your NBA Arena Road Trip'),

  p([span('Here\'s the mistake most people make when they start planning: they look at a map and try to find arenas that are close together. That\'s the wrong starting point. Start with the schedule.')]),

  h3('Follow the NBA Schedule, Not the Map'),

  p([span('The NBA releases its full schedule every August for the upcoming season. That document is your real planning tool. Cross-reference your target arenas against home game dates and find the windows where two or three cities overlap within the same week.')]),

  p([span('Example: Dallas, San Antonio, and Houston are all within driving distance of each other. But that trip only works if the Mavericks, Spurs, and Rockets all have home games during the same 5-7 day stretch. Some seasons the schedule lines up perfectly. Other times you\'re doing two out of three and adding the third to next year\'s list.')]),

  p([span('The schedule also shows you which games are nationally televised — those tend to have better atmospheres, more energy in the building, and higher ticket prices to match. Mid-week games against non-contenders are your budget-friendly options without sacrificing much of the experience.')]),

  callout('tip', [
    p([span('The NBA app lets you filter the full schedule by date and city. Set a reminder for when the schedule drops in August — that\'s when you plan the whole season\'s trips.')]),
  ]),

  h3('How to Stack Multiple Arenas in One Trip'),

  p([span('Our most efficient trip covered four arenas in six days. It was exhausting. It was also the most fun we\'ve had on any trip we\'ve taken.')]),

  p([span('The key to stacking is picking cities you can connect by short flight or reasonable drive. Some natural groupings:')]),

  p([span('Dallas → San Antonio → Houston — all drivable, three arenas in three days if the schedules cooperate.')]),

  p([span('New York (Madison Square Garden) → Brooklyn (Barclays Center) → Philadelphia (Wells Fargo Center) — train travel the whole way, three arenas in close proximity.')]),

  p([span('Denver → Salt Lake City → Phoenix — short flights between, three completely different arena vibes.')]),

  p([span('Toronto → Detroit → Cleveland → Indianapolis — a Midwest/Canada run that hits four arenas with a border crossing built in.')]),

  p([span('One rule we\'ve learned the hard way: don\'t do more than two arenas on back-to-back nights if you actually want to enjoy either of them. Day games help when you can find them.')]),

  // ── COST ───────────────────────────────────────────────────────────────
  h2('What It Actually Costs: An Honest Budget Breakdown'),

  p([span('Let\'s be real about money, because visiting every NBA arena isn\'t cheap. Here\'s how we think about the budget for each city.')]),

  h3('Tickets: $30 to $300+ Per Seat'),

  p([span('The range is enormous. A Tuesday night game for a rebuilding team in a mid-market city — Oklahoma City, Memphis, Indianapolis — might run you $30-60 a seat in the lower bowl on the secondary market. A weekend game for a contender in New York, Boston, or Golden State? Easily $150-300 before fees.')]),

  p([span('Our go-to approach: lower bowl seats in the 100-level, bought 2-3 weeks before the game on SeatGeek or StubHub. Prices almost always drop in that window unless it\'s a marquee matchup. The one exception: Milwaukee when the Bucks are good. Prices hold because locals actually show up.')]),

  h3('Hotels: $120-200 Per Night'),

  p([span('We budget $120-200 per night for a hotel within walking distance of the arena. That last part matters more than it sounds. After a game in a city like New York or Chicago, Uber surge pricing is real, the lines are long, and your night ends on a bad note. If you can walk back to your hotel, everything is better.')]),

  p([span('Hotel points are one of the best things you can spend on arena travel. Most major arenas have a points hotel within a few blocks. We\'ve stayed on points at places we definitely couldn\'t have afforded otherwise.')]),

  h3('Total Cost Per City: $400-700 Per Person'),

  p([span('Flying in, staying one night, attending one game: realistically budget $400-700 per person. That covers the flight, hotel, ticket, food at the game, and transportation.')]),

  p([span('Cities like Milwaukee, Indianapolis, Oklahoma City, and Memphis come in well under that range. New York, Boston, San Francisco, and Toronto will push well over it. Plan your list with that in mind — mix expensive markets with affordable ones so the overall project stays manageable.')]),

  callout('info', [
    p([span('If you have a specific number of arenas you want to hit in a season, figure out which expensive markets you can\'t avoid and budget those first. Everything else gets easier to plan around them.')]),
  ]),

  // ── BEST ARENAS ────────────────────────────────────────────────────────
  h2('The Arenas Worth Flying For'),

  p([span('We\'re not going to pretend every arena is a destination on its own. Some you visit because you\'re working the list. Others you\'d go back to even if you\'d already been. Here are the ones that genuinely stood out:')]),

  h3('Fiserv Forum — Milwaukee, WI'),

  (() => {
    const lk = key()
    return p(
      [span('We were not prepared for '), span('Fiserv Forum', [lk]), span('. The building itself is excellent — sightlines are great, acoustics are loud in the best way, and the food is actually worth eating. But the real story is outside. The Deer District, the block surrounding the arena, starts filling up three hours before tip-off and turns into a full street festival: bars, live music, thousands of people who are clearly here to have a night out, not just watch a game. If you\'re choosing one arena for the atmosphere alone, Milwaukee is it.')],
      [{ _type: 'link', _key: lk, href: '/arena/fiserv-forum' }]
    )
  })(),

  h3('State Farm Arena — Atlanta, GA'),

  (() => {
    const lk = key()
    return p(
      [span('Atlanta\'s arena went through a full renovation a few years back and it completely changed what the building feels like. '), span('State Farm Arena', [lk]), span(' is now one of the cleanest, sharpest venues in the league — and the food has improved significantly. The surrounding area keeps getting better too, with restaurants and bars within easy walking distance. A Trae Young game here with a good crowd is one of the better atmospheres we\'ve been in.')],
      [{ _type: 'link', _key: lk, href: '/arena/state-farm-arena' }]
    )
  })(),

  h3('Gainbridge Fieldhouse — Indianapolis, IN'),

  (() => {
    const lk = key()
    return p(
      [span('Indianapolis is one of the most underrated arena cities on this list and it\'s not particularly close. '), span('Gainbridge Fieldhouse', [lk]), span(' is right in the middle of downtown, surrounded by walkable restaurants and a city that genuinely rallies around its teams. The building has history — it feels lived-in in the best way. Indiana Fever games here are also genuinely worth attending if you follow the WNBA at all. Caitlin Clark playing in this building is an experience.')],
      [{ _type: 'link', _key: lk, href: '/arena/gainbridge-fieldhouse' }]
    )
  })(),

  h3('T-Mobile Arena — Las Vegas, NV'),

  (() => {
    const lk = key()
    return p(
      [span('This one comes with a built-in reason to visit. '), span('T-Mobile Arena', [lk]), span(' is a legitimately good NBA venue — solid sightlines, great energy — but you\'re clearly combining this trip with everything else Las Vegas offers. Budget accordingly and plan to stay a few extra days. The Golden Knights games here are also worth checking out if the schedule overlaps.')],
      [{ _type: 'link', _key: lk, href: '/arena/t-mobile-arena' }]
    )
  })(),

  h3('Mohegan Sun Arena — Uncasville, CT'),

  (() => {
    const lk = key()
    return p(
      [span('This one is genuinely unlike any other arena in North American sports. '), span('Mohegan Sun Arena', [lk]), span(' sits inside a full casino resort in the middle of Connecticut — and the game-day experience reflects that completely. It\'s compact, it\'s intimate, and the parking situation is so easy you\'ll forget arenas are usually a headache. The Connecticut Sun are one of the best WNBA franchises, and watching a playoff game here with a sold-out crowd is electric. Perfect quick weekend trip from anywhere in New England or the New York area.')],
      [{ _type: 'link', _key: lk, href: '/arena/mohegan-sun-arena' }]
    )
  })(),

  // ── FOOD ───────────────────────────────────────────────────────────────
  h2('Arena Food: What\'s Actually Worth Your Money'),

  p([span('Every arena claims to have great food now. Some of them are actually telling the truth.')]),

  p([span('The general rule: the newer or more recently renovated the arena, the better the food options. Older buildings that haven\'t been updated are still leaning on the same basic concession stands they were running in 2005. This is not always bad — some of those stands are genuinely iconic — but you shouldn\'t expect a culinary experience.')]),

  p([span('Our approach at any new arena: do one full lap of the concourse before sitting down. Every arena has at least one local food concept tucked into a corner that you\'d completely miss if you went straight to your seat. That\'s almost always the best thing in the building.')]),

  p([span('A few specific things we\'ve eaten that were worth the arena markup: pretty much anything on the upper concourse at Fiserv Forum, the fried chicken situation at State Farm Arena, the craft beer options at Gainbridge Fieldhouse, and the general food quality at Moda Center in Portland, which reflects that city\'s food culture in a way most arenas don\'t bother to.')]),

  callout('tip', [
    p([span('Have dinner or at least drinks at a restaurant near the arena before the game. It\'ll save you $15-20 per drink, the food will be better, and you\'ll actually be able to have a conversation. Then grab something at the arena concourse during the first quarter when the lines have thinned out.')]),
  ]),

  // ── TIPS ───────────────────────────────────────────────────────────────
  h2('Tips We Wish Someone Had Told Us Before We Started'),

  h3('Arrive 45 Minutes Before Tip-Off, Minimum'),

  p([span('This is the single tip that has improved every arena visit we\'ve had since we started doing it. Arriving early means you can walk the full concourse without fighting through a crowd, grab food while the lines are short, watch warmups — which are genuinely interesting up close — and actually find your seats and get settled before the game starts.')]),

  p([span('Most arenas open 90 minutes before tip-off. The people who show up in that first half-hour have a fundamentally different experience than the people rushing to their seats at tip-off. Be the first group.')]),

  h3('Lower Bowl for the First Visit, Upper Deck After'),

  p([span('For your first time at any arena, spend the extra money for a lower bowl seat. Once you know how a building is laid out and feels, you can go upper deck on a future visit and be totally happy. But for a first visit, being close to the floor gives you context for the building that you can\'t get from row 35 of the 200-level.')]),

  p([span('The exception: some arenas have upper decks that are genuinely close to the court because of how they\'re designed. Fiserv Forum and Barclays Center are both good examples. Check the seat view on SeatGeek before you decide.')]),

  h3('Rideshare or Transit Over Arena Parking'),

  p([span('For any arena in a major city, skip the arena parking lots. The post-game traffic situation will add 45-60 minutes to your night and cost you $30-50 for the privilege. Take a rideshare or public transit, then walk back to a restaurant after the game and wait out the rush over a drink. You\'ll have a better night and get home faster.')]),

  p([span('For smaller markets — Indianapolis, Oklahoma City, Memphis, Salt Lake City — arena parking is usually a different story. The post-game exit is quick, lots are reasonably priced, and it\'s genuinely the easiest option.')]),

  h3('What to Pack'),

  p([span('Mobile tickets only — don\'t print anything, most arenas won\'t scan paper anymore and you\'ll be the person holding up the security line.')]),

  p([span('A light jacket regardless of the season. Arenas run cold, especially in the upper deck. Even in August.')]),

  p([span('A portable battery pack. You\'ll be taking photos, running Uber or Lyft, checking scores, and your phone will be at 12% by the third quarter.')]),

  p([span('A small amount of cash. Most arenas are cashless now, but some of the best vendors — especially the older independent concession spots — still prefer it.')]),

  callout('tip', [
    p([span('If you\'re hitting multiple arenas in one trip, pack light enough to carry everything on the plane. Checking bags between cities adds time, stress, and the occasional lost bag. A carry-on and a personal item is all you need for a 4-5 day arena trip.')]),
  ]),

  // ── FULL LIST ──────────────────────────────────────────────────────────
  h2('Every NBA and WNBA Arena We\'ve Reviewed'),

  p([span('We\'re working through the full list. Here are the arenas where we\'ve published complete reviews with our honest ratings, food picks, parking tips, and game-day breakdowns:')]),

  (() => {
    const arenas = [
      { name: 'Fiserv Forum — Milwaukee, WI (Bucks)', slug: 'fiserv-forum' },
      { name: 'State Farm Arena — Atlanta, GA (Hawks)', slug: 'state-farm-arena' },
      { name: 'Gainbridge Fieldhouse — Indianapolis, IN (Pacers / Fever)', slug: 'gainbridge-fieldhouse' },
      { name: 'T-Mobile Arena — Las Vegas, NV (Golden Knights / NBA expansion)', slug: 't-mobile-arena' },
      { name: 'Mohegan Sun Arena — Uncasville, CT (Connecticut Sun)', slug: 'mohegan-sun-arena' },
      { name: 'Moda Center — Portland, OR (Trail Blazers)', slug: 'moda-center' },
      { name: 'Target Center — Minneapolis, MN (Timberwolves / Lynx)', slug: 'target-center' },
      { name: 'Amway Center — Orlando, FL (Magic)', slug: 'amway-center' },
      { name: 'Barclays Center — Brooklyn, NY (Nets)', slug: 'barclays-center' },
      { name: 'Entertainment and Sports Arena — Washington, D.C. (Mystics)', slug: 'entertainment-and-sports-arena' },
      { name: 'Paycom Center — Oklahoma City, OK (Thunder)', slug: 'paycom-center' },
    ]
    return arenas.map(({ name, slug }) => {
      const lk = key()
      return p(
        [span(name, [lk])],
        [{ _type: 'link', _key: lk, href: `/arena/${slug}` }]
      )
    })
  })(),

  p([span('We add new reviews after every trip. Bookmark this page if you want to follow along.')]),

  // ── OUTRO ──────────────────────────────────────────────────────────────
  h2('The Bottom Line'),

  p([span('There\'s no single right way to do an NBA arena road trip. Your budget will shape some of it, the schedule will shape the rest, and at some point you\'ll be checking into a hotel in a city you\'ve never been to specifically because two basketball teams happen to be playing there on a Wednesday.')]),

  p([span('But that\'s kind of the point. The arenas are the reason to go, but the cities are what you actually remember.')]),

  p([span('Start small. One trip, two or three arenas, cities close enough together that the logistics are manageable. See how it feels. For us, that first trip turned into this — a full spreadsheet, a running list, and a genuine reason to go places we\'d never otherwise have on our radar.')]),

  p([span('We\'re not done yet. But we\'re a lot closer than we were when this started. We\'ll see you at a game.')]),

].flat()

const doc = {
  _type: 'guide',
  title: 'The NBA Arena Road Trip Guide: How We\'re Visiting Every Team in the League (And How You Can Too)',
  slug: { _type: 'slug', current: 'nba-arena-road-trip-guide' },
  date: new Date().toISOString(),
  category: 'tips',
  summary: 'We\'re on a mission to visit every NBA arena. Here\'s everything we\'ve learned — how to plan trips, stack cities, budget smart, and actually enjoy every game.',
  tags: ['NBA', 'arena', 'road trip', 'basketball', 'travel tips', 'sports travel', 'NBA arenas', 'WNBA'],
  content,
  // No publishedAt — stays as a draft
}

async function main() {
  console.log('Creating NBA Arena Road Trip Guide draft in Sanity…')
  const result = await client.create(doc)
  console.log(`✅ Created! Document ID: ${result._id}`)
  console.log(`   Open in Studio: http://localhost:3000/studio/desk/guide;${result._id}`)
}

main().catch((err) => {
  console.error('❌ Error:', err.message)
  process.exit(1)
})
