import { UserIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'hotelRating',
    type: 'object',
    title: 'hotelRating',
    description: "Rating for HOTEL",
    fieldsets: [{ name: "social", title: "Give a rating 1-5 for each item" }],
	options: {
		collapsible: true, // Makes the whole fieldset collapsible
		collapsed: false, // Defines if the fieldset should be collapsed by default or not
		columns: 3, // Defines a grid for the fields and how many columns it should have
	},
	// initialValue: {
	// 	Bed_Comfort: 1,
	// 	Gym: 1,
	// 	Internet_Speed: 1,
	// 	Location: 1,
	// 	Pool: 1,
	// 	Room_Amenities: 1,
	// 	Room_Cleanliness: 1,
	// 	Service: 1,
	// 	Value: 1,
	// },

	fields: [
		{
			title: "Location of Hotel",
			name: "Location",
			type: "number",

			options: {
				list: [
					{ title: "5 stars", value: 5 },
					{ title: "4.5 stars", value: 4.5 },
					{ title: "4 stars", value: 4 },
					{ title: "3.5 stars", value: 3.5 },
					{ title: "3 stars", value: 3 },
					{ title: "2.5 stars", value: 2.5 },
					{ title: "2 stars", value: 2 },
					{ title: "1.5 stars", value: 1.5 },
					{ title: "1 stars", value: 1 },
					{ title: ".5 stars", value: 0.5 },
				],
				layout: "radio",
			},
		},
		{
			title: "Room Cleanliness",
			name: "Room_Cleanliness",
			type: "number",

			options: {
				list: [
					{ title: "5 stars", value: 5 },
					{ title: "4.5 stars", value: 4.5 },
					{ title: "4 stars", value: 4 },
					{ title: "3.5 stars", value: 3.5 },
					{ title: "3 stars", value: 3 },
					{ title: "2.5 stars", value: 2.5 },
					{ title: "2 stars", value: 2 },
					{ title: "1.5 stars", value: 1.5 },
					{ title: "1 stars", value: 1 },
					{ title: ".5 stars", value: 0.5 },
				],
				layout: "radio",
			},
		},
		{
			title: "Hotel Service",
			name: "Service",
			type: "number",

			options: {
				list: [
					{ title: "5 stars", value: 5 },
					{ title: "4.5 stars", value: 4.5 },
					{ title: "4 stars", value: 4 },
					{ title: "3.5 stars", value: 3.5 },
					{ title: "3 stars", value: 3 },
					{ title: "2.5 stars", value: 2.5 },
					{ title: "2 stars", value: 2 },
					{ title: "1.5 stars", value: 1.5 },
					{ title: "1 stars", value: 1 },
					{ title: ".5 stars", value: 0.5 },
				],
				layout: "radio",
			},
		},

		{
			title: "Bed Comfort",
			name: "Bed_Comfort",
			type: "number",

			options: {
				list: [
					{ title: "5 stars", value: 5 },
					{ title: "4.5 stars", value: 4.5 },
					{ title: "4 stars", value: 4 },
					{ title: "3.5 stars", value: 3.5 },
					{ title: "3 stars", value: 3 },
					{ title: "2.5 stars", value: 2.5 },
					{ title: "2 stars", value: 2 },
					{ title: "1.5 stars", value: 1.5 },
					{ title: "1 stars", value: 1 },
					{ title: ".5 stars", value: 0.5 },
				],
				layout: "radio",
			},
		},
		{
			title: "Internet Speed",
			name: "Internet_Speed",
			type: "number",
			//hidden: true,

			options: {
				list: [
					{ title: "5 stars (> 40)", value: 5 },
					{ title: "4.5 stars (27 to 40)", value: 4.5 },
					{ title: "4 stars (19 & 26)", value: 4 },
					{ title: "3.5 stars (13 to 18)", value: 3.5 },
					{ title: "3 stars (10 to 12)", value: 3 },
					{ title: "2.5 stars (8 to 9)", value: 2.5 },
					{ title: "2 stars (6 to 7)", value: 2 },
					{ title: "1.5 stars(4 to 5) ", value: 1.5 },
					{ title: "1 stars  (2 to 3)", value: 1 },
					{ title: ".5 stars (< 2)", value: 0.5 },
					{ title: "No Internet", value: 0 },
				],
				layout: "radio", 
			},
		},
		{
			title: "Room Amenities (TV, Coffee machine etc.)",
			name: "Room_Amenities",
			type: "number",

			options: {
				list: [
					{ title: "5 stars", value: 5 },
					{ title: "4.5 stars", value: 4.5 },
					{ title: "4 stars", value: 4 },
					{ title: "3.5 stars", value: 3.5 },
					{ title: "3 stars", value: 3 },
					{ title: "2.5 stars", value: 2.5 },
					{ title: "2 stars", value: 2 },
					{ title: "1.5 stars", value: 1.5 },
					{ title: "1 stars", value: 1 },
					{ title: ".5 stars", value: 0.5 },
				],
				layout: "radio",
			},
		},
		{
			title: "Hotel Gym",
			name: "Gym",
			type: "number",

			options: {
				list: [
					{ title: "5 stars", value: 5 },
					{ title: "4.5 stars", value: 4.5 },
					{ title: "4 stars", value: 4 },
					{ title: "3.5 stars", value: 3.5 },
					{ title: "3 stars", value: 3 },
					{ title: "2.5 stars", value: 2.5 },
					{ title: "2 stars", value: 2 },
					{ title: "1.5 stars", value: 1.5 },
					{ title: "1 stars", value: 1 },
					{ title: ".5 stars", value: 0.5 },
					{ title: "No Gym", value: 0 },
				],
				layout: "radio",
			},
		},
		{
			title: " Hotel Pool",
			name: "Pool",
			type: "number",

			options: {
				list: [
					{ title: "5 stars", value: 5 },
					{ title: "4.5 stars", value: 4.5 },
					{ title: "4 stars", value: 4 },
					{ title: "3.5 stars", value: 3.5 },
					{ title: "3 stars", value: 3 },
					{ title: "2.5 stars", value: 2.5 },
					{ title: "2 stars", value: 2 },
					{ title: "1.5 stars", value: 1.5 },
					{ title: "1 stars", value: 1 },
					{ title: ".5 stars", value: 0.5 },
					{ title: "No Pool", value: 0 },
				],
				layout: "radio",
			},
		},

		{
			title: "Hotel Value",
			name: "Value",
			type: "number",

			options: {
				list: [
					{ title: "5 stars", value: 5 },
					{ title: "4.5 stars", value: 4.5 },
					{ title: "4 stars", value: 4 },
					{ title: "3.5 stars", value: 3.5 },
					{ title: "3 stars", value: 3 },
					{ title: "2.5 stars", value: 2.5 },
					{ title: "2 stars", value: 2 },
					{ title: "1.5 stars", value: 1.5 },
					{ title: "1 stars", value: 1 },
					{ title: ".5 stars", value: 0.5 },
				],
				layout: "radio",
			},
		},
	],
 
})


