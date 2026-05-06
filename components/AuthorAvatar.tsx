import { urlForImage } from 'lib/sanity.image'
import type { Author } from 'lib/sanity.queries'
import Image from 'next/image'

export default function AuthorAvatar(props: Author) {
  const { name, picture } = props

  const src = picture?.asset?._ref
    ? urlForImage(picture).height(96).width(96).fit('crop').url()
    : 'https://source.unsplash.com/96x96/?face'

  return (
    <div className="flex items-center">
      <div className="relative mr-4 h-12 w-12">
        <Image
          src={src}
          className="rounded-full object-cover"
          height={96}
          width={96}
          alt="author photo"
          loading="lazy"
        />
      </div>
      <div className="text-xl font-bold">{name}</div>
    </div>
  )
}
