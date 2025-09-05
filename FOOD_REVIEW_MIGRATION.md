# Food Review Migration Guide

This guide walks you through migrating food review data from the complex `post` schema to the new independent `foodReview` schema.

## 🎯 Migration Goals

- **Separate Concerns**: Extract food reviews from the complex `post` document type
- **Preserve Dining Logic**: Maintain dine-in/takeout specific functionality
- **Keep Individual Ratings**: Preserve all individual dish/drink rating systems
- **Improve Performance**: Reduce schema complexity and eliminate streaming limit issues
- **Better Organization**: Food-specific fields and rating systems in dedicated schema

## 📋 Prerequisites

1. ✅ Food review schema created (`schemas/foodReview.ts`)
2. ✅ Sanity configuration updated
3. ✅ GROQ queries and client functions added
4. ✅ Preview functionality configured
5. ✅ Environment variables set in `.env.local`:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `NEXT_PUBLIC_SANITY_API_VERSION`
   - `SANITY_API_WRITE_TOKEN`

## 🔄 Migration Process

### Step 1: Backup Food Review Data

```bash
npm run backup-food
```

**What it does:**

- Queries all `post` documents with `linkType == 'food'`
- Exports complete data to `backups/food-reviews-backup-[timestamp].json`
- Creates summary report with statistics
- Analyzes dining types, individual ratings, and data completeness

**Expected output:**

```
🍽️ Starting Food Review Data Backup...
📊 Fetching food review posts...
✅ Found X food review posts
💾 Full backup saved to: backups/food-reviews-backup-[timestamp].json
📋 Summary report saved to: backups/food-reviews-summary-[timestamp].json
```

### Step 2: Preview Migration (Dry Run)

```bash
npm run migrate-food
```

**What it does:**

- Loads the most recent backup file
- Maps old `post` data to new `foodReview` schema
- Shows preview of what would be migrated
- **NO CHANGES MADE** - safe to run multiple times

**Expected output:**

```
🍽️ Starting Food Review Migration...
🔍 DRY RUN MODE - No changes will be made
📂 Using backup file: backups/food-reviews-backup-[timestamp].json
📊 Found X food posts to migrate

🔄 Migration Preview:
📄 Documents to create: X
📝 Sample conversion: [shows sample data with dining type and individual ratings]

🔍 DRY RUN COMPLETE
📋 Summary of what would happen:
  ✅ Create X new 'foodReview' documents
  🗑️ Delete X old 'post' documents with linkType='food'
```

### Step 3: Execute Migration (Live)

```bash
npm run migrate-food:live
```

**What it does:**

- Creates new `foodReview` documents
- Deletes old `post` documents with `linkType='food'`
- Uses Sanity transactions for data integrity
- **PERMANENT CHANGES** - make sure you're ready!

**Expected output:**

```
🍽️ Starting Food Review Migration...
🚀 LIVE MODE - Changes will be applied
📂 Using backup file: backups/food-reviews-backup-[timestamp].json
📊 Found X food posts to migrate

🚀 Starting live migration...
📝 Creating new food review documents...

✅ MIGRATION COMPLETED!
📊 Results:
  ✅ Created: X food review documents
  🗑️ Deleted: X old food post documents
```

## 🗺️ Schema Mapping

### Data Transformation

| Old Post Field         | New FoodReview Field   | Notes                                        |
| ---------------------- | ---------------------- | -------------------------------------------- |
| `title`                | `title`                | Direct copy                                  |
| `slug`                 | `slug`                 | Preserves URL structure                      |
| `date`                 | `date`                 | Visit date                                   |
| `location`             | `location`             | Direct copy                                  |
| `diningType`           | `diningType`           | **PRESERVED** - Dine-in/Takeout logic        |
| `coverImage`           | `coverImage`           | Main image                                   |
| `excerpt2`             | `excerpt2`             | Restaurant summary (falls back to `excerpt`) |
| `tip`                  | `tip`                  | Restaurant quick tip                         |
| `individualFoodRating` | `individualFoodRating` | **PRESERVED** - Dish/drink ratings           |
| `gallery`              | `gallery`              | Photo gallery                                |
| `youtube`              | `youtube`              | YouTube URL                                  |
| `foodRating`           | `foodRating`           | **PRESERVED** - Dine-in rating system        |
| `takeoutRating`        | `takeoutRating`        | **PRESERVED** - Takeout rating system        |
| `positives`            | `positives`            | Positive points                              |
| `negatives`            | `negatives`            | Negative points                              |
| `verdict`              | `verdict`              | Overall verdict                              |
| `content`              | `content`              | Main content                                 |
| `linkType`             | ❌ **Removed**         | No longer needed                             |
| ➕ **New**             | `tags`                 | Auto-generated from food data                |

### 🍽️ Dining Type Logic Preservation

**Dine-in Experience:**

- Shows `foodRating` field (type: 'foodRating')
- Hidden: `takeoutRating` field
- Required validation for dine-in rating

**Takeout Experience:**

- Shows `takeoutRating` field (type: 'takeOutFoodRating')
- Hidden: `foodRating` field
- Required validation for takeout rating

### 🎖️ Individual Food Rating System

**Preserved Features:**

- Image-based ratings for individual dishes/drinks
- 40-character dish names with validation
- individualFoodType rating for each item
- 120-character reviews for each dish
- Gallery optimization settings

### Auto-Generated Tags

The migration script automatically generates relevant tags:

- **Dining Type**: "dine-in" or "takeout"
- **Location**: City, state/country from location field
- **Cuisine**: Auto-detected from dish names (Japanese, Italian, American, etc.)
- **Experience**: "highly rated" for positive reviews
- **Content**: "photo-rich" for galleries, "video review" for YouTube
- **Features**: "individual ratings" if dishes are rated

## 🧪 Testing After Migration

### 1. Sanity Studio

- ✅ New `Food Review` document type appears
- ✅ Can create new food reviews
- ✅ Dining type logic works (dine-in/takeout)
- ✅ Individual food rating system functional
- ✅ All fields render correctly
- ✅ Preview functionality works without streaming errors

### 2. Data Verification

- ✅ All food data migrated successfully
- ✅ Dining type-specific rating systems preserved
- ✅ Individual dish ratings maintained
- ✅ No data loss during transformation
- ✅ Slugs preserved for URL consistency
- ✅ Old food posts removed from `post` type

### 3. Frontend Integration (Next Steps)

- 🔄 Create `/food/[slug].tsx` page route
- 🔄 Update navigation and listing pages
- 🔄 Test individual food review pages
- 🔄 Test dine-in vs takeout functionality

## 🔧 Troubleshooting

### Common Issues

**Error: "NEXT_PUBLIC_SANITY_PROJECT_ID is not set"**

- Ensure `.env.local` has all required environment variables
- Check variable names match exactly

**Error: "No food review backup files found"**

- Run `npm run backup-food` first
- Check that `backups/` directory exists

**Error: "SANITY_API_WRITE_TOKEN is not set"**

- Create a write token in Sanity management console
- Add to `.env.local` as `SANITY_API_WRITE_TOKEN`

**Backup shows 0 food posts**

- Verify you have posts with `linkType == 'food'`
- Check Sanity Studio for existing food reviews

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
- ⚡ Dedicated food-specific rating systems

### Organization

- 🍽️ Dine-in/takeout logic preserved and enhanced
- 🍽️ Individual dish rating system maintained
- 🍽️ Auto-generated cuisine and experience tags
- 🍽️ Clean separation of concerns

### Development

- 🔧 Easier to maintain food-specific features
- 🔧 Independent schema evolution
- 🔧 Better type safety with TypeScript
- 🔧 Cleaner GROQ queries

## 📊 Migration Statistics

After running the migration, you'll have:

- ✅ Independent `foodReview` documents
- ✅ Preserved URL structure (`/food/[slug]`)
- ✅ All food data safely migrated with enhanced tagging
- ✅ Dine-in/takeout logic fully functional
- ✅ Individual dish rating system preserved
- ✅ Simplified `post` schema (no food complexity)
- ✅ Better performance and organization

---

**Ready to migrate?** Start with `npm run backup-food` to safely backup your data!
