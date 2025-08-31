# Mantine to shadcn/ui Component Mapping

## Component Migration Map

| Mantine Component | shadcn/ui Equivalent | Files Using | Migration Notes |
|-------------------|---------------------|-------------|-----------------|
| `Badge` | `@/components/ui/badge` | 4 files | Direct replacement, similar API |
| `Pagination` | `@/components/ui/pagination` | 2 files | API differs, needs refactoring |
| `Progress` | `@/components/ui/progress` | 3 files | Direct replacement |
| `Loader` | `@/components/ui/loader` (custom) | 1 file | Custom implementation |
| `Spoiler` | `@/components/ui/spoiler` (custom) | 1 file | Custom collapsible component |
| `Skeleton` | `@/components/ui/skeleton` | 1 file | Direct replacement |
| `Blockquote` | Custom Tailwind classes | 1 file | Replace with styled div |
| `Flex` | Custom Tailwind classes | 1 file | Replace with div + flex classes |
| `Text` | Custom Tailwind classes | 1 file | Replace with p/span + typography classes |
| `MantineProvider` | Remove (use CSS variables) | 1 file | Theme handled by shadcn CSS vars |

## Files to Update

### Badge Usage (4 files):
- `components/TravelEssentialsLayout.tsx`
- `components/IndividualFoodRating.tsx` 
- `components/AreanaRating.tsx`
- `components/PostHeader.tsx`

### Pagination Usage (2 files):
- `pages/search.tsx`
- `components/MoreStories.tsx`

### Progress Usage (3 files):
- `components/AreanaRating.tsx`
- `components/ArenaPageHeader.tsx`
- `components/ReviewHeader.tsx`

### Other Components (1 file each):
- `components/MoreStories.tsx` (Loader)
- `components/ProConList.tsx` (Spoiler)
- `components/NBAArenaCard.tsx` (Skeleton)
- `components/CoverImage.tsx` (Skeleton)
- `components/PostHeader.tsx` (Blockquote, Flex, Text)

### Provider:
- `pages/_app.tsx` (MantineProvider)

## Migration Strategy

1. **Phase 1**: Replace simple components (Badge, Progress, Skeleton)
2. **Phase 2**: Replace complex components (Pagination, Loader, Spoiler)  
3. **Phase 3**: Replace layout components (Flex, Text, Blockquote)
4. **Phase 4**: Remove MantineProvider and cleanup dependencies
