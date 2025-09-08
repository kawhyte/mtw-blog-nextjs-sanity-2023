import {
  FILTER_OPTIONS,
  FilterCriteriaType,
  SORT_OPTIONS,
  SortCriteriaType,
} from 'utils/arena/arenaConstants'

interface ArenaFiltersProps {
  sortCriteria: SortCriteriaType
  filterCriteria: FilterCriteriaType
  onSortChange: (criteria: SortCriteriaType) => void
  onFilterChange: (criteria: FilterCriteriaType) => void
  isSortDisabled: boolean
}

export default function ArenaFilters({
  sortCriteria,
  filterCriteria,
  onSortChange,
  onFilterChange,
  isSortDisabled,
}: ArenaFiltersProps) {
  return (
    <div className="container mx-auto mb-12 mt-6 flex max-w-4xl flex-col items-center justify-between gap-y-4 rounded-lg bg-muted px-4 py-4 shadow-sm md:flex-row md:gap-y-0 md:px-6">
      {/* Sort By Dropdown */}
      <div className="flex w-full items-center md:w-auto">
        <label
          htmlFor="sort"
          className="mr-2 whitespace-nowrap text-sm font-medium text-muted-foreground"
        >
          Sort by:
        </label>
        <select
          id="sort"
          value={sortCriteria}
          onChange={(e) => onSortChange(e.target.value as SortCriteriaType)}
          className="grow appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring md:grow-0"
          disabled={isSortDisabled}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Filter By Buttons */}
      <div className="flex w-full items-center justify-center space-x-2 md:w-auto md:justify-end">
        <span className="mr-2 hidden text-sm font-medium text-muted-foreground sm:inline">
          Filter:
        </span>
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onFilterChange(option.value)}
            className={`rounded-md px-3 py-2 text-sm font-medium capitalize transition-colors duration-150 ${
              filterCriteria === option.value
                ? 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90'
                : 'border border-border bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}