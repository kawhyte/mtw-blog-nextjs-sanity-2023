'use client'

import * as React from 'react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface FAQItem {
  question: string
  answer: string
  id?: string
}

interface FAQSectionProps {
  title?: string
  items: FAQItem[]
  className?: string
}

export function FAQSection({
  title = 'Frequently Asked Questions',
  items,
  className,
}: FAQSectionProps) {
  if (!items || items.length === 0) {
    return null
  }

  return (
    <section className={className}>
      <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>
      <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
        {items.map((item, index) => (
          <AccordionItem
            key={item.id || `faq-${index}`}
            value={`item-${index}`}
          >
            <AccordionTrigger className="text-left hover:text-brand-primary">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}

// Predefined FAQ sets for common blog topics
export const hotelFAQs: FAQItem[] = [
  {
    id: 'booking',
    question: 'How far in advance should I book a hotel?',
    answer:
      'For the best rates and availability, we recommend booking 2-4 weeks in advance for domestic travel and 6-8 weeks for international destinations. However, last-minute deals can sometimes offer great value.',
  },
  {
    id: 'cancellation',
    question: 'What should I know about hotel cancellation policies?',
    answer:
      'Always read the cancellation policy before booking. Many hotels offer free cancellation up to 24-48 hours before check-in, while others may charge fees. Book directly with hotels or use flexible booking options when possible.',
  },
  {
    id: 'amenities',
    question: 'What amenities should I look for in a hotel?',
    answer:
      'Essential amenities include free Wi-Fi, air conditioning, and clean facilities. Consider your needs: business travelers might want a fitness center and business services, while families might prioritize pools and connecting rooms.',
  },
  {
    id: 'location',
    question: 'How important is hotel location?',
    answer:
      'Location is crucial for your travel experience. Consider proximity to attractions, public transportation, restaurants, and safety of the neighborhood. A slightly more expensive hotel in a better location often provides better value.',
  },
]

export const foodFAQs: FAQItem[] = [
  {
    id: 'reservations',
    question: 'Do I need reservations at restaurants?',
    answer:
      'For popular or fine dining restaurants, reservations are highly recommended, especially during peak hours and weekends. Many restaurants now use online booking systems or apps like OpenTable.',
  },
  {
    id: 'dietary',
    question: 'How do I handle dietary restrictions when dining out?',
    answer:
      'Always inform the restaurant about allergies or dietary restrictions when making reservations and again when ordering. Many restaurants can accommodate vegetarian, vegan, gluten-free, and other dietary needs with advance notice.',
  },
  {
    id: 'tipping',
    question: "What's the proper tipping etiquette?",
    answer:
      'In the US, 18-20% is standard for good service at sit-down restaurants. For takeout, 10-15% is appropriate. Always check if gratuity is already included in your bill, especially for large groups.',
  },
  {
    id: 'peak-times',
    question: 'When are the best times to dine out?',
    answer:
      'To avoid crowds, consider dining during off-peak hours: lunch before 12pm or after 2pm, dinner before 6pm or after 8pm. Weekend brunch typically requires reservations due to popularity.',
  },
]

export const travelFAQs: FAQItem[] = [
  {
    id: 'packing',
    question: 'What are the essential packing tips?',
    answer:
      'Pack versatile clothing that can be mixed and matched. Roll clothes instead of folding to save space. Always pack essentials (medications, documents, change of clothes) in your carry-on. Check airline baggage restrictions before packing.',
  },
  {
    id: 'documents',
    question: 'What travel documents do I need?',
    answer:
      'Always carry a valid passport for international travel. Check visa requirements for your destination. Keep digital and physical copies of important documents. Consider travel insurance for international trips.',
  },
  {
    id: 'safety',
    question: 'How do I stay safe while traveling?',
    answer:
      'Research your destination beforehand, stay aware of your surroundings, keep valuables secure, and trust your instincts. Share your itinerary with someone at home and register with your embassy for international travel.',
  },
  {
    id: 'budget',
    question: 'How do I budget for travel?',
    answer:
      'Plan for accommodation, transportation, food, activities, and emergency funds. Use travel apps to track expenses, look for free activities, and consider travel during shoulder seasons for better prices.',
  },
]
