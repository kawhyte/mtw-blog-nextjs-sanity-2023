# Hotel Review Migration Guide

This guide walks you through migrating hotel review data from the complex `post` schema to the new independent `hotelReview` schema.

## 🎯 Migration Goals

- **Separate Concerns**: Extract hotel reviews from the complex `post` document type
- **Improve Performance**: Reduce schema complexity and eliminate streaming limit issues
- **Better Organization**: Hotel-specific fields and rating system in dedicated schema
- **Clean Architecture**: Independent document types for different content types

## 📋 Prerequisites

1. ✅ Hotel review schema created (`schemas/hotelReview.ts`)
2. ✅ Sanity configuration updated
3. ✅ GROQ queries and client functions added
4. ✅ Preview functionality configured
5. ✅ Environment variables set in `.env.local`:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `NEXT_PUBLIC_SANITY_API_VERSION`
   - `SANITY_API_WRITE_TOKEN`

## 🔄 Migration Process

### Step 1: Backup Hotel Review Data

```bash
npm run backup-hotels
```

**What it does:**

- Queries all `post` documents with `linkType == 'hotel'`
- Exports complete data to `backups/hotel-reviews-backup-[timestamp].json`
- Creates summary report with statistics
- Analyzes data completeness and categories

**Expected output:**

```
🏨 Starting Hotel Review Data Backup...
📊 Fetching hotel review posts...
✅ Found X hotel review posts
💾 Full backup saved to: backups/hotel-reviews-backup-[timestamp].json
📋 Summary report saved to: backups/hotel-reviews-summary-[timestamp].json
```

### Step 2: Preview Migration (Dry Run)

```bash
npm run migrate-hotels
```

**What it does:**

- Loads the most recent backup file
- Maps old `post` data to new `hotelReview` schema
- Shows preview of what would be migrated
- **NO CHANGES MADE** - safe to run multiple times

**Expected output:**

```
🏨 Starting Hotel Review Migration...
🔍 DRY RUN MODE - No changes will be made
📂 Using backup file: backups/hotel-reviews-backup-[timestamp].json
📊 Found X hotel posts to migrate

🔄 Migration Preview:
📄 Documents to create: X
📝 Sample conversion: [shows sample data]

🔍 DRY RUN COMPLETE
📋 Summary of what would happen:
  ✅ Create X new 'hotelReview' documents
  🗑️ Delete X old 'post' documents with linkType='hotel'
```

### Step 3: Execute Migration (Live)

```bash
npm run migrate-hotels:live
```

**What it does:**

- Creates new `hotelReview` documents
- Deletes old `post` documents with `linkType='hotel'`
- Uses Sanity transactions for data integrity
- **PERMANENT CHANGES** - make sure you're ready!

**Expected output:**

```
🏨 Starting Hotel Review Migration...
🚀 LIVE MODE - Changes will be applied
📂 Using backup file: backups/hotel-reviews-backup-[timestamp].json
📊 Found X hotel posts to migrate

🚀 Starting live migration...
💾 Executing transaction...

✅ MIGRATION COMPLETED SUCCESSFULLY!
📊 Results:
  ✅ Created: X hotel review documents
  🗑️ Deleted: X old hotel post documents
```

## 🗺️ Schema Mapping

### Data Transformation

| Old Post Field  | New HotelReview Field | Notes                                   |
| --------------- | --------------------- | --------------------------------------- |
| `title`         | `title`               | Direct copy                             |
| `slug`          | `slug`                | Preserves URL structure                 |
| `date`          | `date`                | Visit date                              |
| `location`      | `location`            | Direct copy                             |
| `category`      | `category`            | Direct copy (defaults to 'mid-scale')   |
| `room`          | `room`                | Room type info                          |
| `lounge`        | `lounge`              | Lounge access (defaults to 'No')        |
| `coverImage`    | `coverImage`          | Main image                              |
| `excerpt2`      | `excerpt2`            | Hotel summary (falls back to `excerpt`) |
| `tip`           | `tip`                 | Hotel quick tip                         |
| `gallery`       | `gallery`             | Photo gallery                           |
| `youtube`       | `youtube`             | YouTube URL                             |
| `hotelRating`   | `hotelRating`         | Hotel rating system                     |
| `internetSpeed` | `internetSpeed`       | Internet speed                          |
| `roomAmenities` | `roomAmenities`       | Room amenities                          |
| `techRating`    | `techRating`          | Technology rating                       |
| `positives`     | `positives`           | Positive points                         |
| `negatives`     | `negatives`           | Negative points                         |
| `verdict`       | `verdict`             | Overall verdict                         |
| `content`       | `content`             | Main content                            |
| `linkType`      | ❌ **Removed**        | No longer needed                        |
| ➕ **New**      | `tags`                | Auto-generated from hotel data          |

### Auto-Generated Tags

The migration script automatically generates relevant tags:

- **Category**: luxury, mid-scale, economy
- **Location**: City, state/country from location field
- **Amenities**: "lounge access" if available
- **Internet**: "high-speed internet" if speed > 50 Mbps
- **Business**: "business travel" if business amenities present
- **General**: "reviewed" for all migrated hotels

## 🧪 Testing After Migration

### 1. Sanity Studio

- ✅ New `Hotel Review` document type appears
- ✅ Can create new hotel reviews
- ✅ All fields render correctly
- ✅ Preview functionality works without streaming errors

### 2. Data Verification

- ✅ All hotel data migrated successfully
- ✅ No data loss during transformation
- ✅ Slugs preserved for URL consistency
- ✅ Old hotel posts removed from `post` type

### 3. Frontend Integration (Next Steps)

- 🔄 Create `/hotel/[slug].tsx` page route
- 🔄 Update navigation and listing pages
- 🔄 Test individual hotel review pages

## 🔧 Troubleshooting

### Common Issues

**Error: "NEXT_PUBLIC_SANITY_PROJECT_ID is not set"**

- Ensure `.env.local` has all required environment variables
- Check variable names match exactly

**Error: "No hotel review backup files found"**

- Run `npm run backup-hotels` first
- Check that `backups/` directory exists

**Error: "SANITY_API_WRITE_TOKEN is not set"**

- Create a write token in Sanity management console
- Add to `.env.local` as `SANITY_API_WRITE_TOKEN`

**Backup shows 0 hotel posts**

- Verify you have posts with `linkType == 'hotel'`
- Check Sanity Studio for existing hotel reviews

### Recovery

If something goes wrong during migration:

- ✅ Original data is safely backed up in `backups/` folder
- ✅ Can restore from backup if needed
- ✅ Dry run mode prevents accidental changes

## 🎉 Benefits After Migration

### Performance

- ⚡ Reduced complexity in `post` schema
- ⚡ Faster queries without cross-type logic
- ⚡ No more streaming limit issues

### Organization

- 🏨 Hotel-specific rating system
- 🏨 Dedicated hotel categories
- 🏨 Auto-generated relevant tags
- 🏨 Clean separation of concerns

### Development

- 🔧 Easier to maintain hotel-specific features
- 🔧 Independent schema evolution
- 🔧 Better type safety with TypeScript
- 🔧 Cleaner GROQ queries

## 📊 Migration Statistics

After running the migration, you'll have:

- ✅ Independent `hotelReview` documents
- ✅ Preserved URL structure (`/hotel/[slug]`)
- ✅ All hotel data safely migrated
- ✅ Simplified `post` schema (food only)
- ✅ Better performance and organization

---

**Ready to migrate?** Start with `npm run backup-hotels` to safely backup your data!
