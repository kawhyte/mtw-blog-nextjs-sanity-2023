# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Development:**

- `npm run dev` - Start Next.js development server
- `npm run build` - Build the application for production
- `npm start` - Start production server

**Code Quality:**

- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run linting with auto-fix and formatting
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

**Data Migration Scripts:**

- `npm run backup-guides` - Backup travel guides
- `npm run migrate-guides` - Migrate travel guides (dry run)
- `npm run migrate-guides:live` - Migrate travel guides (live)
- `npm run backup-hotels` - Backup hotel reviews
- `npm run migrate-hotels:live` - Migrate hotel reviews (live)
- `npm run backup-food` - Backup food reviews
- `npm run migrate-food:live` - Migrate food reviews (live)
- `npm run check-doc-size` - Check document sizes in Sanity

## Architecture Overview

This is a Next.js blog with Sanity CMS backend focused on travel content (hotels, food, guides, NBA arenas). The architecture follows a hybrid approach with both legacy post documents and new independent document types.

### Content Types & Data Structure

**Legacy System (post documents):**

- Uses `linkType` field to differentiate content: "hotel", "food", "story"
- Single `post` schema with all possible fields
- Located in `schemas/post.ts`

**New Independent Systems:**

- `guide` - Standalone travel guides (`schemas/guide.ts`)
- `hotelReview` - Independent hotel reviews (`schemas/hotelReview.ts`)
- `foodReview` - Independent food reviews (`schemas/foodReview.ts`)
- `arenas` - NBA arena reviews (`schemas/nbaArenas.ts`)
- `essential` - Travel essentials (`schemas/travelEssentials.ts`)

### Key Directories

**Data Layer:**

- `lib/sanity.queries.ts` - Comprehensive GROQ queries with TypeScript interfaces
- `lib/sanity.client.ts` - Sanity client configuration
- `lib/sanity.api.ts` - API configuration and environment variables
- `lib/calculateRatings.ts`, `lib/calculateRating.ts` - Rating calculation utilities

**Components:**

- `components/` - React components organized by functionality
- `components/ui/` - Reusable UI components (buttons, cards, etc.)

**Pages Structure:**

- `/` - Homepage with featured content
- `/hotels`, `/hotel/[slug]` - Hotel listings and individual reviews
- `/food`, `/food/[slug]` - Food listings and individual reviews
- `/guides`, `/guide/[slug]` - Travel guide listings and individual guides
- `/arenas`, `/arena/[slug]` - NBA arena listings and individual reviews
- `/studio` - Sanity Studio interface

### Rating System

The app uses a sophisticated weighted rating system:

- Hotel ratings: Location (20%), Bed Comfort (20%), Service (15%), Value (10%), etc.
- Food ratings: Different weights for dine-in vs takeout experiences
- Arena ratings: Custom rating categories for NBA venues
- Rating utilities in `lib/` handle calculations and text conversions

### Sanity Studio Configuration

- Studio mounted at `/studio` route
- Schema definitions in `schemas/` directory
- Custom plugins for preview, media management, and Unsplash integration
- Preview functionality with live content updates

### Migration & Data Management

Active migration from legacy post system to independent document types:

- Backup scripts preserve existing data
- Migration scripts handle schema transformations
- Document size monitoring for Sanity limits
- Both dry-run and live migration options available

### Tech Stack

- **Frontend:** Next.js 13 (Pages Router), React 18, TypeScript
- **CMS:** Sanity v3 with custom studio
- **Styling:** Tailwind CSS with custom UI components
- **Images:** Sanity image handling with optimization
- **Content:** Portable Text for rich content
- **Deployment:** Vercel-optimized with ISR support

### Key Patterns

1. **Content Queries:** Use `lib/sanity.queries.ts` for all GROQ queries - it's extensively documented with TypeScript interfaces
2. **Rating Calculations:** Import utilities from `lib/calculateRatings.ts` for consistent rating logic
3. **Image Handling:** Use Sanity's built-in image optimization and hotspot features
4. **Content Structure:** Rich content uses Portable Text with custom serializers
5. **Schema Validation:** All schemas include proper validation rules and preview configurations
