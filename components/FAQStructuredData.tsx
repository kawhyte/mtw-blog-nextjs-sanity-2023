interface FAQStructuredDataProps {
  faqs: { question: string; answer: string }[]
}

export default function FAQStructuredData({ faqs }: FAQStructuredDataProps) {
  if (!faqs || faqs.length === 0) return null

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }),
      }}
    />
  )
}
