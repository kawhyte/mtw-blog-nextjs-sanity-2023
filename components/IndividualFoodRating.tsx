const individualFoodRating = (food) => {

    console.log("INdi Food11", food)
    return ( <>
    
    
    
    
    
    
    {food.individualFoodRating.map((item) => (

                    
<>
  <div>{item.name}</div>
  <div>{item.review}</div>
</>
))}
    
    
    
    
    
    </> );
}
 
export default individualFoodRating;