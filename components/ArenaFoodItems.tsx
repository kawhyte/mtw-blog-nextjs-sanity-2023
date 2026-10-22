import SwipeRow from 'components/listing/SwipeRow'
import DishCard, { type FoodReviewDish } from 'components/review/DishCard'

interface ArenaFoodItemsProps {
  food: FoodReviewDish[]
}

/** "What we ate": the same dish cards and swipe row as "What we ordered" on food reviews */
const ArenaFoodItems = ({ food }: ArenaFoodItemsProps) => {
  if (!food || food.length === 0) return null

  return (
    <SwipeRow
      title="What we ate"
      subtitle="Food and drinks we tried at the arena."
    >
      {food.map((dish, index) => (
        <DishCard key={dish._key ?? index} dish={dish} />
      ))}
    </SwipeRow>
  )
}

export default ArenaFoodItems
