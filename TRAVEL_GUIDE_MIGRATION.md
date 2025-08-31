# Travel Guide Migration Documentation

This guide explains how to backup and migrate travel guide data from the old `post` schema (with `linkType: 'story'`) to the new independent `guide` document type.

## Overview

The migration process consists of two main steps:
1. **Backup**: Export existing travel guide data from posts
2. **Migration**: Convert and import data to new guide schema

## Prerequisites

Ensure you have the following environment variables set in your `.env.local`:
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`
- `SANITY_API_WRITE_TOKEN` (required for backup and migration)

## Step 1: Backup Travel Guide Data

Create a backup of all existing travel guide posts:

```bash
npm run backup-guides
```

This will:
- Query all posts with `linkType == 'story'`
- Export them to `backups/travel-guides-backup-[timestamp].json`
- Create a summary report in `backups/travel-guides-summary-[timestamp].json`

### Backup Output

The backup includes:
- All post data (title, slug, date, content, gallery, etc.)
- Image assets with URLs
- Metadata for tracking
- Summary statistics

## Step 2: Preview Migration (Dry Run)

Before actually migrating, preview what will be converted:

```bash
npm run migrate-guides
```

This shows:
- How many guides will be migrated
- Preview of 3 converted guides
- Category assignments
- Data mapping results

### Schema Mapping

The migration maps old post fields to new guide fields:

| Old Post Field | New Guide Field | Notes |
|----------------|-----------------|-------|
| `title` | `title` | Direct copy |
| `slug.current` | `slug.current` | Direct copy |
| `date` | `date` | Story/guide date |
| `coverImage` | `coverImage` | Direct copy |
| `gallery` | `gallery` | Direct copy |
| `content` | `content` | Direct copy |
| `tip` | `tip` | Travel guide tip |
| `location` | `tags` | Added as tag |
| Auto-detected | `category` | Based on title keywords |

### Category Detection

Categories are auto-assigned based on title keywords:
- **City Guide**: "city", "guide to"
- **Transportation**: "transport", "flight", "train"
- **Culture & History**: "culture", "history"
- **Adventure**: "adventure", "hiking"
- **Family Travel**: "family", "kids"
- **Budget Travel**: "budget", "cheap"
- **Luxury Travel**: "luxury", "premium"
- **Travel Tips**: (default)

## Step 3: Execute Migration

When you're ready to migrate:

```bash
npm run migrate-guides:live
```

⚠️ **Warning**: This creates new documents in your Sanity dataset. Make sure you have backups!

### Migration Process

The script will:
1. Load backup data
2. Convert each post to guide format
3. Create new guide documents in batches
4. Provide progress updates
5. Generate a migration log

### Migration Log

A detailed log is saved to `backups/migration-log-[timestamp].json` containing:
- Migration timestamp
- Success/failure counts
- Individual results
- Error details

## Step 4: Verification

After migration:

1. **Check Sanity Studio**:
   - Go to your studio (`/studio`)
   - Verify new "Guide" documents appear
   - Check preview functionality

2. **Test Frontend**:
   - Visit `/guide/[slug]` pages
   - Verify content renders correctly
   - Test gallery and tip sections

3. **Compare Data**:
   - Use the backup summary to verify all guides migrated
   - Check that categories were assigned correctly

## Step 5: Cleanup (Optional)

After successful migration and verification:

1. **Keep Original Posts**: You may want to keep original posts for reference
2. **Or Delete Original Story Posts**: If confident in migration, you can clean up old posts

### Delete Old Story Posts (Careful!)

```javascript
// In Sanity Studio Vision or via script
*[_type == "post" && linkType == "story"] {
  _id
}

// Then delete manually or via script
```

## Troubleshooting

### Common Issues

1. **Missing Environment Variables**:
   ```
   Error: Missing SANITY_API_WRITE_TOKEN
   ```
   - Ensure all environment variables are set in `.env.local`

2. **No Travel Guides Found**:
   ```
   Found 0 travel guide posts
   ```
   - Check if you have posts with `linkType == "story"`
   - Verify your dataset connection

3. **Migration Failures**:
   - Check the migration log for specific errors
   - Common issues: missing required fields, slug conflicts

### Recovery

If something goes wrong:
1. **Restore from Backup**: Use the JSON backup to recreate data
2. **Delete Failed Migrations**: Remove partially created guides
3. **Re-run Migration**: Fix issues and retry

## Files Created

- `scripts/backupTravelGuides.mjs` - Backup script
- `scripts/migrateTravelGuidesToNewSchema.mjs` - Migration script
- `backups/travel-guides-backup-*.json` - Data backups
- `backups/travel-guides-summary-*.json` - Summary reports
- `backups/migration-log-*.json` - Migration logs

## Schema Differences

### Old Post Schema (for Stories)
```javascript
{
  _type: "post",
  linkType: "story",
  title: string,
  slug: {current: string},
  date: datetime,
  content: array,
  gallery: array,
  tip: array,
  // Many fields hidden for stories
}
```

### New Guide Schema
```javascript
{
  _type: "guide",
  title: string,
  slug: {current: string},
  date: datetime,
  excerpt2: array, // Rich text summary
  category: string, // City, Tips, Transport, etc.
  content: array,
  gallery: array,
  tip: array,
  tags: array, // For better searchability
}
```

## Benefits of New Schema

1. **Simpler Queries**: No complex filtering needed
2. **Better Performance**: Lighter queries, no streaming limits
3. **Travel-Specific Fields**: Categories, tags optimized for guides
4. **Independent Preview**: No conflicts with hotel/food posts
5. **Future-Proof**: Easy to add guide-specific features

## Support

If you encounter issues:
1. Check the migration logs
2. Verify your environment variables
3. Test with a small subset first
4. Reach out for technical support if needed

