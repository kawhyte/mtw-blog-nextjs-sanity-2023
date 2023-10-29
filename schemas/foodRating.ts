import { UserIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
	type: "object",
	name: "foodRating",
	description: "Rating for Food",
	title: "foodRating",
    fieldsets: [{ name: "social", title: "Give a rating 1-5 for each item" }],
	options: {
		collapsible: true, // Makes the whole fieldset collapsible
		collapsed: false, // Defines if the fieldset should be collapsed by default or not
		columns: 3, // Defines a grid for the fields and how many columns it should have
	},
	initialValue: {
		Ambiance: 1,
		Bathroom: 1,
		Cleanliness: 1,
		Flavor_and_Taste: 1,
		Location: 1,
		Memorability: 1,
		Presentation_on_Plate: 1,
		Service: 1,
		Value: 1,
	},

	fields: [
		{
			title: "Restaurant Location",
			name: "Restaurant_Location",
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
					{ title: ".5 stars", value: .5 },
				],
				layout: "radio",
			},

			
		},

		{
			title: "Food Flavor & Taste",
			name: "Flavor_and_Taste",
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
					{ title: ".5 stars", value: .5 },
				],
				layout: "radio",
			},

			
		
		},
		{
			title: "Food Presentation",
			name: "Presentation_on_Plate",
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
					{ title: ".5 stars", value: .5 },
				],
				layout: "radio",
			},

		
		},
		{
			title: "Restaurant Service/Staff",
			name: "Restaurant_Service",
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
					{ title: ".5 stars", value: .5 },
				],
				layout: "radio",
			},

		},

		
		{
			title: "Restaurant Cleanliness",
			name: "Restaurant_Cleanliness",
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
					{ title: ".5 stars", value: .5 },
				],
				layout: "radio",
			},

	
		},
		

		{
			title: "Would we return to this Restaurant?",
			name: "Memorability",
			type: "number",

			options: {
				list: [
					{ title: "5 stars - Fo sho! we would travel for this food  👍🏽", value: 5 },
					{ title: "4.5 stars - Yes, but only if we were in the area 😉", value: 4.5 },
					{ title: "4 stars", value: 4 },
					{ title: "3.5 stars", value: 3.5 },
					{ title: "3 stars - Maybe", value: 3 },
					{ title: "2.5 stars", value: 2.5 },
					{ title: "2 stars - ", value: 2 },
					{ title: "1.5 stars - Only if we were starving  ", value: 1.5 },
					{ title: "1 star - Nah 👎🏽", value: 1 },
					{ title: ".5 star - F*ck No! 🤬", value: .5 },
				],
				layout: "radio",
			},

		},


		{
			title: "Food Value",
			name: "Food_Value",
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
					{ title: ".5 stars", value: .5 },
				],
				layout: "radio",
			},

		
		},
		

		
	],
 
})


