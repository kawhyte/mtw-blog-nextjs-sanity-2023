import {
  FILTER_OPTIONS,
  FilterCriteriaType,
  NOT_VISITED_SORT_OPTIONS,
  SORT_OPTIONS,
  SortCriteriaType,
} from 'utils/arena/arenaConstants'

interface ArenaFiltersProps {
  sortCriteria: SortCriteriaType
  filterCriteria: FilterCriteriaType
  onSortChange: (criteria: SortCriteriaType) => void
  onFilterChange: (criteria: FilterCriteriaType) => void
}

export default function ArenaFilters({
  sortCriteria,
  filterCriteria,
  onSortChange,
  onFilterChange,
}: ArenaFiltersProps) {
  const isNotVisited = filterCriteria === 'notVisited'
  const visibleSortOptions = isNotVisited
    ? SORT_OPTIONS.filter((opt) =>
        (NOT_VISITED_SORT_OPTIONS as readonly string[]).includes(opt.value),
      )
    : SORT_OPTIONS

  return (
    <div className="container mx-auto mb-12 mt-6 flex max-w-4xl flex-col items-center justify-between gap-y-4 rounded-lg border-2 border-border-bold bg-card px-4 py-4 shadow-brutalist-sm md:flex-row md:gap-y-0 md:px-6">
      {/* Sort By Dropdown */}
      <div className="flex w-full items-center md:w-auto">
        <label
          htmlFor="sort"
          className="mr-2 whitespace-nowrap text-sm font-bold text-foreground"
        >
          Sort by:
        </label>
        <select
          id="sort"
          value={sortCriteria}
          onChange={(e) => onSortChange(e.target.value as SortCriteriaType)}
          className="grow appearance-none rounded-md border-2 border-border-bold bg-background px-3 py-2 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring md:grow-0"
        >
          {visibleSortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Filter By Buttons */}
      <div className="flex w-full items-center justify-center gap-x-2 overflow-x-auto md:w-auto md:justify-end">
        <span className="mr-1 hidden shrink-0 text-sm font-bold text-foreground sm:inline">
          Filter:
        </span>
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onFilterChange(option.value)}
            className={`shrink-0 rounded-md border-2 border-border-bold px-3 py-2 text-sm font-bold capitalize transition-all duration-150 ${
              filterCriteria === option.value
                ? 'bg-primary text-primary-foreground shadow-brutalist-sm hover:bg-primary/90'
                : 'bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
