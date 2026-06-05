import Image, { type ImageProps } from 'next/image'

function isSanityCdnUrl(src: ImageProps['src']): src is string {
  return typeof src === 'string' && src.includes('cdn.sanity.io')
}

function isSvgUrl(src: ImageProps['src']): src is string {
  return typeof src === 'string' && /\.svg($|\?)/i.test(src)
}

/**
 * Sanity CDN already handles resizing/format. Small SVGs should not go through
 * Next.js image optimization, which can time out in dev when many load at once.
 */
export default function SanityImage({ src, alt = '', ...props }: ImageProps) {
  if (isSvgUrl(src)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={props.className}
        width={typeof props.width === 'number' ? props.width : undefined}
        height={typeof props.height === 'number' ? props.height : undefined}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      unoptimized={isSanityCdnUrl(src)}
      {...props}
    />
  )
}
