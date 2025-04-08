// components/VideoPlayer.tsx
import React, { useEffect, useMemo, useRef, useCallback } from 'react'; // Import useCallback
import dynamic from 'next/dynamic';
import Script from 'next/script';
import SectionTitle from './SectionTitle'; // Adjust path if needed

// Dynamically import ReactPlayer, disable SSR
const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });

// Define the props for the component
interface VideoPlayerProps {
  /** The URL of the YouTube or Instagram video/reel/post */
  url: string;
  /** Optional title to display above the video */
  title?: string;
}

// Declare the global instgrm object type for TypeScript
declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

/**
 * A component to display a single YouTube video responsively using ReactPlayer
 * or an Instagram post/reel using the official embed code (without caption).
 */
const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, title }) => {
  // --- Validate URL and Determine Type ---
  const isValidUrl = useMemo(() => {
    if (!url) return false;
    const videoRegex = /^(http(s)?:\/\/)?((w){3}.)?(youtu(be|.be)?(\.com)?\/.+|instagram\.com\/(p|reel|tv)\/.+)/gm;
    return videoRegex.test(url);
  }, [url]);

  const isInstagram = useMemo(() => {
    return isValidUrl && url.includes('instagram.com');
  }, [url, isValidUrl]);

  // Ref to track if the process function has been called for the current URL
  const processedUrlRef = useRef<string | null>(null);

  // --- Function to safely call Instagram process (Memoized) ---
  // Wrap in useCallback so the function reference is stable unless 'url' changes
  const processInstagramEmbed = useCallback(() => {
    // Check if running in browser and instagram script exists
    if (typeof window !== 'undefined' && window.instgrm) {
      // Only process if the URL hasn't been marked as processed yet
      if (processedUrlRef.current !== url) {
        console.log('Processing Instagram Embed for:', url);
        window.instgrm.Embeds.process();
        processedUrlRef.current = url; // Mark this URL as processed
      } else {
        console.log('Instagram embed already processed for:', url);
      }
    } else {
      console.log('Instagram script not ready or not in browser.');
    }
  }, [url]); // Dependency: Recreate this function only if 'url' changes

  // --- Effect to attempt processing on URL change (for Instagram) ---
  useEffect(() => {
    // Only run for Instagram URLs
    if (isInstagram) {
      // Attempt processing via timeout. This helps catch cases where the component
      // renders *after* the script has loaded, or if the URL changes.
      // The processInstagramEmbed function itself prevents redundant processing using the ref.
      const timer = setTimeout(processInstagramEmbed, 50); // Short delay
      return () => clearTimeout(timer); // Cleanup timer
    }
    // If it's not Instagram, reset the processed ref for the next potential Instagram URL
    else {
        processedUrlRef.current = null;
    }
  }, [url, isInstagram, processInstagramEmbed]); // <-- Add memoized function to dependency array


  // If the URL is not valid or missing, don't render the component
  if (!isValidUrl) {
    console.warn(`VideoPlayer: Invalid or unsupported URL provided: ${url}`);
    return null;
  }

  // --- Render Component ---
  return (
    <section className="py-8 md:py-12"> {/* Adjusted padding */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Title Section */}
        {title && ( // Only render title section if title exists
            <div className="mb-6 flex w-full flex-col font-medium md:mb-8">
              <SectionTitle
                header={title || (isInstagram ? 'Instagram Post' : 'Video')}
                description={undefined}
              />
            </div>
        )}

        {/* Conditional Rendering: Instagram Embed or ReactPlayer */}
        {isInstagram ? (
          // --- Instagram Embed ---
          // Use url as key to force re-render on url change if necessary
          <div className="flex justify-center" key={url}>
            <blockquote
              className="instagram-media"
              data-instgrm-permalink={url}
              data-instgrm-version="14"
              // Basic styling to constrain width and center
              style={{
                maxWidth: '540px',
                minWidth: '326px',
                width: 'calc(100% - 2px)',
                margin: '1px auto', // Center blockquote
                boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
                borderRadius: '8px', // Add rounding
                border: '1px solid #dbdbdb', // Subtle border
                padding: '0' // Let script handle padding
              }}
            >
               {/* Placeholder while script loads */}
               <div style={{ padding: '8px', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>Loading Instagram Post...</div>
            </blockquote>
            {/* Instagram Embed Script */}
            <Script
              id={`instagram-embed-script-${url}`} // Make ID unique per URL if multiple players on page
              src="//www.instagram.com/embed.js"
              strategy="lazyOnload"
              onLoad={() => {
                console.log('Instagram embed.js script loaded for:', url);
                // Call process immediately after script loads
                // The function itself checks processedUrlRef
                processInstagramEmbed();
              }}
              onError={(e) => {
                 console.error('Error loading Instagram embed script:', e);
              }}
            />
          </div>
        ) : (
          // --- YouTube Player (ReactPlayer) ---
          <div className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-lg shadow-xl aspect-video">
            <ReactPlayer
              url={url}
              width="100%"
              height="100%"
              controls={true}
              loop={false}
              muted={false}
              playing={false}
              className="absolute left-0 top-0"
              // Consider adding light={true} for performance boost (shows thumbnail first)
              // light={true}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default VideoPlayer;
