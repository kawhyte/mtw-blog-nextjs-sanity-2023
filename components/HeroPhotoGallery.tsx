"use client"

import { useState } from "react"
import Image from "next/image"
import { Grid, X } from "lucide-react"
import { useMediaQuery } from "hooks/use-media-query"
import { urlForImage } from 'lib/sanity.image'
// import { Button } from "@/components/ui/button"
// import { Dialog, DialogContent } from "@/components/ui/dialog"


interface Photo {
  id: number
  src: string
  alt: string
}

export default function PhotoGallery({photos}) {
  const [showAllPhotos, setShowAllPhotos] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  return (
    <>
      <div className="relative w-full">
        {/* Mobile view - single photo */}
        <div className="block md:hidden">
          <div className="relative aspect-4/3 w-full">
            <Image
              src={urlForImage(photos.mainImage)
                .width(800)
                .height(450)
                .fit('crop')
                .url()}
              alt={photos.mainImage.alt}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            {/* <Button
              variant="secondary"
              size="sm"
              className="absolute bottom-4 right-4 gap-1.5"
              onClick={() => setShowAllPhotos(true)}
            >
              <Grid className="h-4 w-4" />
              Show all photos
            </Button> */}
          </div>
        </div>

        {/* Desktop view - photo grid */}
        <div className="hidden md:grid md:grid-cols-4 md:grid-rows-2 md:gap-2 md:h-[438px]">
          {/* Main large photo */}
          <div className="relative col-span-2 row-span-2">
            <Image
              src={urlForImage(photos.mainImage)
                                  .width(560)
                                  .height(438)
                                  .fit('crop')
                                  .url()}
              alt={photos.mainImage.alt}
              fill
              className="object-cover rounded-l-xl"
              sizes="(min-width: 768px) 50vw, 100vw"
              priority
            />
          </div>

          {/* Top right photos */}
          <div className="relative">
            <Image
              src={urlForImage(photos.otherImages[0])
                .width(300) // Recommended width
                .height(300) // Recommended height
                .fit('crop')
                .auto('format')
                .url()}
              alt={photos.otherImages[0].alt || 'Gallery image 1'}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 25vw, 100vw"
            />
          </div>
          <div className="relative">
            <Image
              src={urlForImage(photos.otherImages[1])
                .width(300) // Recommended width
                .height(300) // Recommended height
                .fit('crop')
                .auto('format')
                .url()}
              alt={photos.otherImages[1].alt || 'Gallery image 2'}
              fill
              className="object-cover rounded-tr-xl"
              sizes="(min-width: 768px) 25vw, 100vw"
            />
          </div>

          {/* Bottom right photos */}
          <div className="relative">
            <Image
              src={urlForImage(photos.otherImages[2])
                .width(300) // Recommended width
                .height(300) // Recommended height
                .fit('crop')
                .auto('format')
                .url()}
              alt={photos.otherImages[2].alt || 'Gallery image 3'}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 25vw, 100vw"
            />
          </div>
          <div className="relative">
            <Image
              src={urlForImage(photos.otherImages[3])
                .width(300) // Recommended width
                .height(300) // Recommended height
                .fit('crop')
                .auto('format')
                .url()}
              alt={photos.otherImages[3].alt || 'Gallery image 4'}
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
              Show all photos
            </Button> */}
          </div>
        </div>
      </div>

      {/* Full photo gallery modal */}
      {/* <Dialog open={showAllPhotos} onOpenChange={setShowAllPhotos}>
        <DialogContent className="max-w-7xl w-full p-0 h-[90vh] overflow-y-auto">
          <div className="sticky top-0 z-10 flex justify-between items-center p-4 bg-white/90 backdrop-blur-sm">
            <h2 className="font-semibold">All photos</h2>
            <Button variant="ghost" size="icon" onClick={() => setShowAllPhotos(false)} className="rounded-full">
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <div className="p-4 grid gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="relative aspect-video w-full">
                <Image
                  src={photo.src || "/placeholder.svg"}
                  alt={photo.alt}
                  fill
                  className="object-cover rounded-lg"
                  sizes="(min-width: 768px) 90vw, 100vw"
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog> */}
    </>
  )
}

