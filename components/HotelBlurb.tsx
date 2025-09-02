// components/HotelBlurb.tsx

import { PortableText } from '@portabletext/react';
import { Quote } from 'lucide-react';
import Link from 'next/link';

interface HotelBlurbProps {
  content?: any[]; // Portable text content
  source?: string;
  url?: string;
}

export default function HotelBlurb({ content, source, url }: HotelBlurbProps) {
  if (!content) {
    return null;
  }

  return (
    <div className="my-8 bg-muted p-6 rounded-lg">
      <blockquote className="relative">
        <Quote className="absolute -top-4 -left-4 h-10 w-10 text-muted-foreground/20" />
        <div className="text-lg italic text-foreground leading-relaxed">
          <PortableText value={content} />
        </div>
        {source && (
          <footer className="mt-4 text-right text-sm font-semibold text-muted-foreground">
            —{' '}
            {url ? (
              <Link
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {source}
              </Link>
            ) : (
              source
            )}
          </footer>
        )}
      </blockquote>
    </div>
  );
}