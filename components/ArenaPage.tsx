// components/ArenaPage.tsx

import Layout from 'components/BlogLayout'
import PostPageHead from 'components/PostPageHead'
import { Arena, Settings } from 'lib/sanity.queries'
import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
import BlogHeader from './BlogHeader'
import PostBody from './PostBody'
import ImageGallery from './ImageGallery'
import { useState } from 'react'

import {
  Award,
  BadgeCheck,
  Calendar,
  Camera,
  Car,
  CheckCircle2,
  Footprints,
  Lightbulb,
  MapPin,
  Pizza,
  Sofa,
  Star,
  Ticket,
  Users,
  Video,
  Wheelchair,
  Building2,
  Users2,
  XCircle,
} from 'lucide-react'

// import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

interface ArenaPageProps {
  arena: Arena
  settings: Settings
  preview?: boolean
  loading?: boolean
}

const ratingIcons = {
  food: <Pizza className="h-5 w-5 text-muted-foreground" />,
  seatComfort: <Sofa className="h-5 w-5 text-muted-foreground" />,
  transportation: <Car className="h-5 w-5 text-muted-foreground" />,
  vibes: <Users className="h-5 w-5 text-muted-foreground" />,
  view: <Ticket className="h-5 w-5 text-muted-foreground" />,
  walkability: <Footprints className="h-5 w-5 text-muted-foreground" />,
};

const formatCategoryName = (category: string) => {
  const result = category.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};

export default function ArenaPage({
  arena,
  settings,
  preview,
  loading,
}: ArenaPageProps) {
  const { title = 'Arena Review' } = settings || {}
 

  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const galleryImages = arena.photoGallerySection ? [
    arena.photoGallerySection.mainImage,
    ...(arena.photoGallerySection.otherImages || [])
  ].filter(Boolean) : [];

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
  };

  const nextImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % galleryImages.length);
    }
  };

  const prevImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex - 1 + galleryImages.length) % galleryImages.length);
    }
  };

  const calculateOverallRating = (review) => {
    if (!review) {
      return 'N/A'
    }
    const ratings = Object.values(review).filter(
      (val) => typeof val === 'number',
    )
    if (ratings.length === 0) {
      return 'N/A'
    }
    const sum = ratings.reduce((acc, rating) => acc + rating, 0)
    const average = sum / ratings.length
    // The ratings are out of 10, but the display is out of 5.
    return (average / 2).toFixed(1)
  }

  const overallRating = calculateOverallRating(arena.arenaReview)

  return (
    <div>
      <PostPageHead settings={settings} post={arena as any} />

      <Layout preview={preview} loading={loading}>
        <BlogHeader title={title} level={2} />
        <>
          <div className="container mx-auto max-w-7xl p-4 md:p-8">
            {/* --- Main Image --- */}
            <div className="w-full overflow-hidden rounded-lg ">
              {arena.arenaImage && (
                <div className="mb-12">
                  <Image
                    src={urlForImage(arena.arenaImage)
                      .width(1200)
                      .height(630)
                      .fit('crop')
                      .url()}
                    alt={arena.name || 'Arena Cover Image'}
                    width={1200}
                    height={630}
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* --- Header & Teams --- */}
            <header className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-4xl font-bold tracking-tighter">
                  {arena.name}
                </h1>
                <div className="mt-1 flex items-center space-x-2 text-muted-foreground">
                  <MapPin className="h-5 w-5" />
                  <p className="text-lg">{arena.location}</p>
                </div>

                <div className="mt-4 flex items-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5" />
                    <span>Built: {arena.buildDate}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users2 className="h-5 w-5" />
                    <span>Capacity: {arena.capacity.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {arena.gallery.map((team) => (
                    <Badge
                      key={team.name}
                      variant="outline"
                      className="uppercase flex items-center gap-2"
                    >
                      <Image
                        src={urlForImage(team.asset)
                          .width(20)
                          .height(20)
                          .fit('crop')
                          .url()}
                        alt={team.name || 'Team logo'}
                        width={25}
                        height={25}
                        className="rounded-full"
                      />
                      {team.name} ({team.teamType})
                    </Badge>
                  ))}
                </div>
              </div>
              <Card className="mt-6 w-full md:mt-0 md:w-48">
                <CardHeader className="items-center p-4">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Overall Rating
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center p-4 pt-0">
                  <span className="text-6xl font-bold text-secondary">{overallRating}</span>
                  <span className="text-sm text-muted-foreground">
                    out of 5
                  </span>
                </CardContent>
              </Card>
            </header>

            <Separator className="my-8" />

            {/* --- Main Content Grid --- */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Left Column: Ratings */}
              <div className="space-y-8 lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Award className="h-6 w-6" />
                      <span>Arena Rating Breakdown</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {arena.arenaReview && Object.entries(arena.arenaReview).map(([category, score]) => (
                      typeof score === 'number' && (
                        <div key={category}>
                          <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {ratingIcons[category]}
                              <span className="font-medium">{formatCategoryName(category)}</span>
                            </div>
                            <span className="font-semibold">{score.toFixed(1)}</span>
                          </div>
                          <Progress value={(score / 10) * 100} className="h-2" />
                        </div>
                      )
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column (Sidebar): Details & Tips */}
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="h-6 w-6" />
                      <span>Visit Details</span>
                    </CardTitle>
                  </CardHeader>
                  {arena.date && (
                    <CardContent className="text-sm">
                      <p><strong>Date of Visit:</strong> {new Date(arena.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}</p>
                    </CardContent>
                  )}
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Lightbulb className="h-6 w-6" />
                      <span>Pro Tip</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm italic text-muted-foreground">
                      {arena?.proTip > 0  ? arena?.proTip:" No tip provided"}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Pros, Cons, Verdict */}
            {arena.prosConsVerdict && (
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {arena.prosConsVerdict.positives && arena.prosConsVerdict.positives.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-green-600">
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      What We Loved
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-inside list-disc space-y-1 text-base">
                      {arena.prosConsVerdict.positives.map((pro, index) => <li key={index}>{pro}</li>)}
                    </ul>
                  </CardContent>
                </Card>
              )}
              {arena.prosConsVerdict.negatives && arena.prosConsVerdict.negatives.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-red-600">
                      <XCircle className="mr-2 h-5 w-5" />
                      What We Didn't Like
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-inside list-disc space-y-1 text-base">
                      {arena.prosConsVerdict.negatives.map((con, index) => <li key={index}>{con}</li>)}
                    </ul>
                  </CardContent>
                </Card>
              )}
              {arena.prosConsVerdict.verdict && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-blue-600">
                      <BadgeCheck className="mr-2 h-5 w-5" />
                      The Verdict
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PostBody content={arena.prosConsVerdict.verdict} />
                  </CardContent>
                </Card>
              )}
            </div>
            )}

            {/* --- Optional Instagram Video --- */}
            {arena.instagramVideoEmbedUrl && (
              <section className="mt-8">
                <h2 className="mb-4 text-2xl font-bold tracking-tight flex items-center">
                  <Video className="mr-2 h-6 w-6" /> Our Experience
                </h2>
                <div className="overflow-hidden rounded-lg shadow-lg">
                  <iframe
                    src={arena.instagramVideoEmbedUrl}
                    className="h-full w-full"
                    frameBorder="0"
                    scrolling="no"
                    allowFullScreen
                  ></iframe>
                </div>
              </section>
            )}

            {/* --- Gallery --- */}
            {arena.photoGallerySection && (
              <section className="mt-8">
                <ImageGallery
                  images={galleryImages}
                  title="Photo Gallery"
                  selectedImageIndex={selectedImageIndex}
                  openModal={openModal}
                  closeModal={closeModal}
                  nextImage={nextImage}
                  prevImage={prevImage}
                />
              </section>
            )}
          </div>
        </>
      </Layout>
    </div>
  )
}