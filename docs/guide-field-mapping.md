# Guide Field Mapping Analysis

## Legacy Post → New Guide Schema Mapping

### ✅ **Direct Mappings (1:1)**

| Legacy Post Field | New Guide Field | Status    | Notes                               |
| ----------------- | --------------- | --------- | ----------------------------------- |
| `title`           | `title`         | ✅ Direct | String field                        |
| `slug`            | `slug`          | ✅ Direct | Slug object with `current` property |
| `date`            | `date`          | ✅ Direct | DateTime field                      |
| `coverImage`      | `coverImage`    | ✅ Direct | Image object with asset references  |
| `content`         | `content`       | ✅ Direct | Portable Text array                 |
| `gallery`         | `gallery`       | ✅ Direct | Array of image objects              |

### 🔄 **Transformed Mappings**

| Legacy Post Field | New Guide Field | Status       | Transformation                               |
| ----------------- | --------------- | ------------ | -------------------------------------------- |
| `linkType`        | **N/A**         | 🗑️ Skip      | Used for filtering, not needed in new schema |
| `location`        | `tags`          | 🔄 Transform | Extract location into tags array             |
| `positives`       | **N/A**         | 🗑️ Skip      | Not relevant for guides                      |
| `negatives`       | **N/A**         | 🗑️ Skip      | Not relevant for guides                      |
| `verdict`         | **N/A**         | 🗑️ Skip      | Not relevant for guides                      |
| `youtube`         | **N/A**         | 🗑️ Skip      | Can be embedded in content                   |

### 🚫 **Skipped Fields (User Request)**

| Legacy Post Field | New Guide Field | Status  | Notes                       |
| ----------------- | --------------- | ------- | --------------------------- |
| `excerpt2`        | **N/A**         | 🚫 Skip | Hidden field, usually empty |
| `tip`             | **N/A**         | 🚫 Skip | Hidden field, usually empty |

### 🆕 **New Fields (Generated)**

| Legacy Post Field | New Guide Field | Status      | Generation Logic                                 |
| ----------------- | --------------- | ----------- | ------------------------------------------------ |
| **N/A**           | `category`      | 🆕 Generate | Analyze title/content for category keywords      |
| **N/A**           | `tags`          | 🆕 Generate | Combine location + category + "travel" + "guide" |

## Category Generation Logic

```javascript
function generateCategory(title, content) {
  const titleLower = title?.toLowerCase() || ''

  if (titleLower.includes('city') || titleLower.includes('guide to'))
    return 'city'
  if (
    titleLower.includes('transport') ||
    titleLower.includes('flight') ||
    titleLower.includes('train')
  )
    return 'transport'
  if (titleLower.includes('culture') || titleLower.includes('history'))
    return 'culture'
  if (titleLower.includes('adventure') || titleLower.includes('hiking'))
    return 'adventure'
  if (titleLower.includes('family') || titleLower.includes('kids'))
    return 'family'
  if (titleLower.includes('budget') || titleLower.includes('cheap'))
    return 'budget'
  if (titleLower.includes('luxury') || titleLower.includes('premium'))
    return 'luxury'

  return 'tips' // default
}
```

## Tags Generation Logic

```javascript
function generateTags(post) {
  const tags = []

  // Add location if available
  if (post.location) {
    const locationParts = post.location.split(',').map((part) => part.trim())
    tags.push(...locationParts)
  }

  // Add category
  const category = generateCategory(post.title, post.content)
  if (category !== 'tips') tags.push(category)

  // Add default tags
  tags.push('travel', 'guide')

  return tags.filter(Boolean).slice(0, 8) // Max 8 tags
}
```

## Schema Compatibility Check

### Current Guide Schema Requirements:

- ✅ `title` - Required ✅ Available
- ✅ `slug` - Required ✅ Available
- ✅ `date` - Required ✅ Available
- ✅ `content` - Required ✅ Available
- ✅ `excerpt2` - Optional ❌ Skip per user request
- ✅ `coverImage` - Optional ✅ Available (16/21 posts)
- ✅ `category` - Optional 🆕 Generate
- ✅ `gallery` - Optional ✅ Available (14/21 posts)
- ✅ `tags` - Optional 🆕 Generate

### ✅ **Migration Compatibility: 100%**

All required fields can be satisfied from legacy data or generated appropriately.

## Image Handling Strategy

### Cover Images (16/21 available)

- **Action**: Copy as-is with full asset references
- **Missing**: 5/21 posts without cover images - leave field empty

### Gallery Images (14/21 available)

- **Action**: Copy as-is with full asset references and alt text
- **Missing**: 7/21 posts without gallery - leave field empty

### Content Images

- **Action**: Embedded images in content will be preserved as-is
- **Risk**: Low - Portable Text structure remains unchanged
