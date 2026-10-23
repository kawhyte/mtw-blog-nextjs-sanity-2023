import { Search, X } from 'lucide-react'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

/**
 * The search box on the /search page itself, filled in with the current
 * search so it can be changed right there (phones only have an icon in the
 * navbar). Enter searches; the X clears it and starts over.
 */
export default function SearchField({
  query,
  autoFocus = false,
}: {
  query: string
  autoFocus?: boolean
}) {
  const router = useRouter()
  const [value, setValue] = useState(query)
  const inputRef = useRef<HTMLInputElement>(null)

  // Follow the URL when it changes (popular search tapped, back button)
  useEffect(() => setValue(query), [query])

  // Ready to type when nothing has been searched yet (not over results,
  // where it would pop the phone keyboard up)
  useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const next = value.trim()
    if (!next) return
    inputRef.current?.blur()
    router.push(`/search?q=${encodeURIComponent(next)}`)
  }

  const clear = () => {
    setValue('')
    inputRef.current?.focus()
    if (query) router.push('/search', undefined, { shallow: true })
  }

  return (
    <form
      role="search"
      aria-label="Search the site"
      onSubmit={submit}
      className="flex h-[50px] w-full max-w-[720px] items-center gap-3 rounded-full border-[3px] border-border-bold bg-card pl-4 pr-3 md:h-14 md:pl-5 md:pr-4"
    >
      <Search className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
      <input
        ref={inputRef}
        type="search"
        enterKeyHint="search"
        autoComplete="off"
        aria-label="Search hotels, food, guides or arenas"
        placeholder="Search hotels, food, guides or arenas"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="min-w-0 flex-1 bg-transparent text-base font-semibold text-foreground placeholder:font-normal placeholder:text-muted-foreground focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 md:text-lg [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={clear}
          aria-label="Clear search"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      )}
    </form>
  )
}
