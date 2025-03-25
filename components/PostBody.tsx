import { PortableText } from '@portabletext/react';
import { getImageDimensions } from '@sanity/asset-utils';
import { urlForImage } from 'lib/sanity.image';

import styles from './PostBody.module.css';

// Image Component
const SampleImageComponent = ({ value }) => {
  const { width, height } = getImageDimensions(value);
  return (
    <figure className="image-container">
      <img
        src={urlForImage(value).height(height).width(width).url()}
        alt={value.alt || ' '}
        loading="lazy"
        className="single-image"
        style={{ aspectRatio: width / height }}
      />
      {value.caption && <figcaption className="image-caption">{value.caption}</figcaption>}
    </figure>
  );
};

export default function PostBody({ content }) {
  const processBlocks = (blocks) => {
    let result = [];
    let imageGroup = [];

    blocks.forEach((block) => {
      if (block._type === "image") {
        imageGroup.push(block);
      } else {
        if (imageGroup.length > 0) {
          result.push({ _type: "imageGroup", images: imageGroup });
          imageGroup = [];
        }
        result.push(block);
      }
    });

    if (imageGroup.length > 0) {
      result.push({ _type: "imageGroup", images: imageGroup });
    }

    return result;
  };

  return (
    <div className={`max-w-7xl leading-loose text-sm md:text-base font-thin ${styles.portableText}`}>
      <PortableText
        value={processBlocks(content)}
        components={{
          types: {
            image: SampleImageComponent,
            imageGroup: ({ value }) => (
              <div className="image-grid">
                {value.images.map((img, idx) => (
                  <SampleImageComponent key={idx} value={img} />
                ))}
              </div>
            ),
          },
        }}
      />
    </div>
  );
}