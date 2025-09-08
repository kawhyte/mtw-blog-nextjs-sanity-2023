// Simple weight configurations for different review types
export const FOOD_WEIGHTS = {
  Flavor_and_Taste: 0.3, // 30% - Most important
  Food_Value: 0.2, // 20%
  Restaurant_Service: 0.15, // 15%
  Memorability: 0.15, // 15%
  Presentation_on_Plate: 0.1, // 10%
  Restaurant_Cleanliness: 0.05, // 5%
  Restaurant_Location: 0.05, // 5%
}

export const HOTEL_WEIGHTS = {
  Location: 0.25, // 25% - Very important
  Bed_Comfort: 0.25, // 25% - Very important
  Service: 0.15, // 15%
  Value: 0.15, // 15%
  Room_Cleanliness: 0.1, // 10%
  Room_Amenities: 0.05, // 5%
  Internet_Speed: 0.03, // 3%
  Gym: 0.01, // 1%
  Pool: 0.01, // 1%
}
