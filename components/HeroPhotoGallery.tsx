"use client"

import { useState } from "react"
import Image from "next/image"
import { Grid, X } from "lucide-react"
import { useMediaQuery } from "hooks/use-media-query"
import { urlForImage } from 'lib/sanity.image'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"


interface Photo {
  id: number
  src: string
  alt: string
}

export default function PhotoGallery({photos}) {
  const [showAllPhotos, setShowAllPhotos] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  
  // Handle the photoGallerySection structure
  const photoGallery = photos || {}
  const mainImage = photoGallery.mainImage
  const otherImages = photoGallery.otherImages || []
  
  // Create a flat array for the dialog
  const allPhotos = []
  if (mainImage) allPhotos.push(mainImage)
  if (otherImages.length > 0) allPhotos.push(...otherImages)
  return (
    <>
      <div className="relative w-full">
        {/* Mobile view - single photo */}
        <div className="block md:hidden">
          <div className="relative aspect-4/3 w-full">
            {mainImage ? (
              <Image
                src={urlForImage(mainImage)
                  .width(800)
                  .height(450)
                  .fit('crop')
                  .url()}
                alt={mainImage?.alt || 'Gallery photo'}
                fill
                className="object-cover"
                sizes="100vw"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No photos available</span>
              </div>
            )}
            {/* <Button
              variant="secondary"
              size="sm"
              className="absolute bottom-4 right-4 gap-1.5"
              onClick={() => setShowAllPhotos(true)}
            >
              <Grid className="h-4 w-4" />
              Show all photoArray
            </Button> */}
          </div>
        </div>

        {/* Desktop view - photo grid */}
        <div className="hidden md:grid md:grid-cols-4 md:grid-rows-2 md:gap-2 md:h-[438px]">
          {/* Main large photo */}
          {mainImage && (
            <div className="relative col-span-2 row-span-2">
              <Image
                src={urlForImage(mainImage)
                  .width(560)
                  .height(438)
                  .fit('crop')
                  .url()}
                alt={mainImage.alt || 'Main gallery image'}
                fill
                className="object-cover rounded-l-xl"
                sizes="(min-width: 768px) 50vw, 100vw"
                priority
              />
            </div>
          )}

          {/* Top right photoArray */}
          <div className="relative">
            <Image
              src={urlForImage(otherImages[0])
                .width(300) // Recommended width
                .height(300) // Recommended height
                .fit('crop')
                .auto('format')
                .url()}
              alt={otherImages[0].alt || 'Gallery image 1'}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 25vw, 100vw"
            />
          </div>
          <div className="relative">
            <Image
              src={urlForImage(otherImages[1])
                .width(300) // Recommended width
                .height(300) // Recommended height
                .fit('crop')
                .auto('format')
                .url()}
              alt={otherImages[1].alt || 'Gallery image 2'}
              fill
              className="object-cover rounded-tr-xl"
              sizes="(min-width: 768px) 25vw, 100vw"
            />
          </div>

          {/* Bottom right photoArray */}
          <div className="relative">
            <Image
              src={urlForImage(otherImages[2])
                .width(300) // Recommended width
                .height(300) // Recommended height
                .fit('crop')
                .auto('format')
                .url()}
              alt={otherImages[2].alt || 'Gallery image 3'}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 25vw, 100vw"
            />
          </div>
          <div className="relative">
            <Image
              src={urlForImage(otherImages[3])
                .width(300) // Recommended width
                .height(300) // Recommended height
                .fit('crop')
                .auto('format')
                .url()}
              alt={otherImages[3].alt || 'Gallery image 4'}
              fill
              className="object-cover rounded-br-xl"
              sizes="(min-width: 768px) 25vw, 100vw"
            />
            {/* <Button
              variant="secondary"
              size="sm"
              className="absolute bottom-4 right-4 gap-1.5"
              onClick={() => setShowAllPhotos(true)}
            >
              <Grid className="h-4 w-4" />
              Show all photoArray
            </Button> */}
          </div>
        </div>
      </div>

      {/* Full photo gallery modal */}
      <Dialog open={showAllPhotos} onOpenChange={setShowAllPhotos}>
        <DialogContent className="max-w-7xl w-full p-0 h-[90vh] overflow-y-auto">
          <div className="sticky top-0 z-10 flex justify-between items-center p-4 bg-background/90 backdrop-blur-sm border-b">
            <h2 className="text-lg font-semibold text-foreground">All Photos</h2>
            <Button variant="ghost" size="icon" onClick={() => setShowAllPhotos(false)} className="rounded-full">
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <div className="p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {allPhotos.map((photo, index) => (
              <div key={index} className="relative aspect-video w-full group">
                <Image
                  src={urlForImage(photo).width(600).height(400).fit('crop').url()}
                  alt={photo.alt || `Gallery image ${index + 1}`}
                  fill
                  className="object-cover rounded-lg transition-transform group-hover:scale-105"
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                />
                {photo.alt && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 rounded-b-lg">
                    <p className="text-sm truncate">{photo.alt}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

