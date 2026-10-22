import SanityImage, { type SanityImageObject } from 'components/SanityImage'

/** One rated dish or drink from a food review's "Individual Food Rating" */
export interface FoodReviewDish extends SanityImageObject {
  _key?: string
  name?: string
  price?: number | null
  review?: string | null
  /** `Dish` is 0–10; shown /2 like every other score */
  rating?: { Dish?: number }
}

/** Dishes scoring 4.5/5 or more get the "Chef's kiss" pill */
export const CHEFS_KISS_MIN = 9

export const dishScore = (dish: FoodReviewDish) =>
  dish.rating?.Dish != null ? (dish.rating.Dish / 2).toFixed(1) : null

export const dishPrice = (dish: FoodReviewDish) =>
  dish.price
    ? `$${Number.isInteger(dish.price) ? dish.price : dish.price.toFixed(2)}`
    : null

/** Square dish card for the "What we ordered" swipe row (same look as listing cards) */
export default function DishCard({ dish }: { dish: FoodReviewDish }) {
  const score = dishScore(dish)
  const price = dishPrice(dish)
  const chefsKiss = (dish.rating?.Dish ?? 0) >= CHEFS_KISS_MIN

  return (
    <div className="flex w-[60vw] max-w-56 shrink-0 snap-start flex-col gap-2 sm:w-52">
      <div className="relative aspect-square overflow-hidden rounded-2xl border-[3px] border-border-bold bg-border-bold">
        {dish.asset && (
          <SanityImage
            image={dish}
            width={420}
            height={420}
            alt={dish.alt || dish.name || 'Dish we ordered'}
            sizes="(min-width: 640px) 208px, 60vw"
            className="h-full w-full object-cover"
          />
        )}
        {chefsKiss && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-foreground shadow">
            Chef’s kiss
          </span>
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        {dish.name && (
          <span className="line-clamp-2 text-base font-bold">
            {dish.name.trim()}
          </span>
        )}
        {(score || price) && (
          <span className="text-sm font-semibold">
            {score && (
              <>
                <span aria-hidden="true">★</span> {score}
              </>
            )}
            {price && (
              <span className="font-normal text-muted-foreground">
                {score ? ' · ' : ''}
                {price}
              </span>
            )}
          </span>
        )}
        {dish.review && (
          <p className="text-sm italic text-muted-foreground">
            “{dish.review.trim()}”
          </p>
        )}
      </div>
    </div>
  )
}
