interface HotelWeights {
    Location: number;
    Bed_Comfort: number;
    Room_Cleanliness: number;
    Gym: number;
    Pool: number;
    Service: number;
    Internet_Speed: number;
    Room_Amenities: number;
    Value: number;
  }
  
  interface TakeoutWeights {
    tasteAndFlavor: number;
    presentation: number;
    accuracy: number;
    packaging: number;
    overallSatisfaction: number;
    foodValue: number;
  }
  
  interface DineinWeights {
    Restaurant_Location: number;
    Restaurant_Service: number;
    Food_Value: number;
    Presentation_on_Plate: number;
    Memorability: number;
    Restaurant_Cleanliness: number;
    Flavor_and_Taste: number;
  }

export function ratingWeights( linkType:string, diningType:string):Partial<HotelWeights & TakeoutWeights & DineinWeights>  {
    
    let weights: Partial<HotelWeights & TakeoutWeights & DineinWeights> = {};
    
    switch (linkType) {
    case 'hotel':
      weights.Location = 0.2
      weights.Bed_Comfort = 0.2
      weights.Room_Cleanliness = 0.1
      weights.Gym = 0.05
      weights.Pool = 0.05
      weights.Service = 0.15
      weights.Internet_Speed = 0.05
      weights.Room_Amenities = 0.1
      weights.Value = 0.1
      break
    case 'food':
      switch (diningType) {
        case 'takeout':
          weights.tasteAndFlavor = 0.1
          weights.presentation = 0.3
          weights.accuracy = 0.1
          weights.packaging = 0.1
          weights.overallSatisfaction = 0.2
          weights.foodValue = 0.2
          break
        case 'dinein':
          weights.Restaurant_Location = 0.05
          weights.Restaurant_Service = 0.2
          weights.Food_Value = 0.15
          weights.Presentation_on_Plate = 0.05
          weights.Memorability = 0.15
          weights.Restaurant_Cleanliness = 0.2
          weights.Flavor_and_Taste = 0.2
          break

        default:
          weights.Restaurant_Location = 0.05
          weights.Restaurant_Service = 0.2
          weights.Food_Value = 0.15
          weights.Presentation_on_Plate = 0.05
          weights.Memorability = 0.15
          weights.Restaurant_Cleanliness = 0.2
          weights.Flavor_and_Taste = 0.2
          break
      }

      break

    default:
      weights.Restaurant_Location = 0.2
    //   weights.Food = 0.4
      weights.packaging = 0.1
      break
  }

  return weights
}
