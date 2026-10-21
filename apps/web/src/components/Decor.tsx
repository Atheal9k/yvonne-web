import type { ImgHTMLAttributes } from 'react'

/** Four-point sparkle, like the little sparkles in Yvonne's drawings. */
export function Sparkle({
  className = '',
  size = 22,
}: {
  className?: string
  size?: number
}) {
  return (
    <svg
      className={`sparkle ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 1.5c.6 5.6 2.9 8.6 9.5 10.5-6.6 1.9-8.9 4.9-9.5 10.5-.6-5.6-2.9-8.6-9.5-10.5C9.1 10.1 11.4 7.1 12 1.5Z" />
    </svg>
  )
}

/** Responsive artwork image. */
export function ArtImage({
  src,
  srcSet,
  alt,
  sizes = '(max-width: 700px) 90vw, 420px',
  ...rest
}: ImgHTMLAttributes<HTMLImageElement> & { src: string; alt: string }) {
  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      loading="lazy"
      decoding="async"
      {...rest}
    />
  )
}
