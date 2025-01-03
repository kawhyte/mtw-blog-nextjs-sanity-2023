import { AIRPORT, DAY_TRIP,FOOD, HOTEL } from "../lib/constants";

import { FaRegGrinTongueWink } from "react-icons/fa";


const ratingItem = {
	//Hotel
	Location: {
		name: "Location",
		icon: "/icon/location.svg",
		rate:.20
	},
	Bed_Comfort: {
		name: "Bed Comfort",
		icon: "/icon/bed.svg",
		rate:.20
	},
	Room_Cleanliness: {
		name: "Cleanliness",
		icon: "/icon/clean.svg",
		rate:.10
	},
	Gym: {
		name: "Gym",
		icon: "/icon/gym.svg",
		rate:.05
	},
	Pool: {
		name: "Pool",
		icon: "/icon/pool.svg",
		rate:.05
	},
	Service: {
		name: "Service",
		icon: "/icon/bathroom.svg",
		rate:.15
	},
	Internet_Speed: {
		name: "WiFi",
		icon: "/icon/wifi.svg",
		rate:.05
	},
	Room_Amenities: {
		name: "Room Amenities (TV, Fridge etc.)",
		icon: "/icon/amenities.svg",
		rate:.10
	},
	Value: {
		name: "Value",
		icon: "/icon/value.svg",
		rate:.10
	},

	/// Food dine-in
	Restaurant_Location: {
		name: "Location",
		icon: "/icon/location.svg",
		rate:.05
	},

	Flavor_and_Taste: {
		name: "Taste",
		icon: "/icon/taste.svg",
		rate:.20
	},
	Presentation_on_Plate: {
		name: "Presentation",
		icon: "/icon/presentation.svg",
		rate:.05
	},
	Memorability: {
		name: "Likelihood of us eating here again.",
		icon: "/icon/memo.svg",
		rate:.15
	},

	Restaurant_Service: {
		name: "Service",
		icon: "/icon/coffee.svg",
		rate:.20
	},
	Restaurant_Cleanliness: {
		name: "Cleanliness",
		icon: "/icon/clean.svg",
		rate:.20
	},

	Food_Value: {
		name: "Value",
		icon: "/icon/value.svg",
		rate:.15
	},

	/// Food dine-out
	tasteAndFlavor: {
		name: "Taste & Flavor",
		icon: "/icon/taste.svg",
		rate:.20
	},
	presentation: {
		name: "Presentation",
		icon: "/icon/presentation.svg",
		rate:.10
	},
	foodValue: {
		name: "Food Value",
		icon: "/icon/value2.svg",
		rate:.20
	},
	accuracy: {
		name: "Order Accuracy",
		icon: "/icon/coffee.svg",
		rate:.1
	},
	packaging: {
		name: "Food Packaging",
		icon: "/icon/memo.svg",
		rate:.1
	},
	overallSatisfaction: {
		name: "Overall Satisfaction",
		icon: "/icon/clean.svg",
		rate:.3
	},


};

export { ratingItem };

// export function getReviewType(categories) {
// 	let value1 = " ";
// 	let value2 = " ";
// 	let value3 = " ";
// 	let value4 = " ";
// 	let value5 = " ";
// 	let value6 = " ";
// 	let value7 = " ";
// 	let value8 = " ";
// 	let value9 = " ";
// 	switch (categories[0]._ref) {
// 		//Food
// 		case FOOD:
// 			value1 = "Flavor & Taste";
// 			value2 = "Presentation";
// 			value3 = "Service";
// 			value4 = "Value";
// 			value5 = "Ambiance";
// 			value6 = "Cleanliness";
// 			value7 = "Bathroom";
// 			value8 = "Location";
// 			value9 = "Memorability";
// 			break;
// 		//Hotel
// 		case HOTEL:
// 			value1 = "Location";
// 			value2 = "Cleanliness";
// 			value3 = "Service/Staff";
// 			value4 = "Value";
// 			value5 = "Bed Comfort";
// 			value6 = "Internet Speed";
// 			value7 = "Room Amenities";
// 			value8 = "Gym";
// 			value9 = "Pool";
// 			break;

// 		//Day Trips
// 		case DAY_TRIP:
// 			value1 = "Day Trips ";
// 			value2 = "Day Trips ";
// 			value3 = "Day Trips ";
// 			value4 = "Day Trips ";

// 			break;

// 		//AirPort
// 		case AIRPORT:
// 			value1 = "AirPort";
// 			value2 = "AirPort";
// 			value3 = "AirPort";
// 			value4 = "AirPort";

// 			break;

// 		default:
// 			// let value1 = "Category not found";
// 			// let value2 = "Category not found";
// 			// let value3 = "Category not found";
// 			// let value4 = "Category not found";
// 			break;
// 	}
// 	return {
// 		value1,
// 		value2,
// 		value3,
// 		value4,
// 		value5,
// 		value6,
// 		value7,
// 		value8,
// 		value9,
// 	};
// }



	// Bathroom: {
	// 	name: "Bathroom",
	// 	icon: "/icon/bathroom2.svg",
	// 	rate:.05
	// },

		// Ambiance: {
	// 	name: "Ambiance",
	// 	icon: "/icon/ambiance.svg",
	// 	rate:.05
	// },