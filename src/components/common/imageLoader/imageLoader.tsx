import Image from 'next/image'
import React, { useEffect, useState, useRef } from 'react'
import { urlForImage } from '~/lib/sanity.image'
import useBoundingWidth from '~/components/utils/UseBoundingWidthHook'
import { DeviceType } from '~/components/utils/boundingWidthHook'

interface ImageLoaderProps {
  width?: number
  height?: number
  image: any
  alt?: string
  title?: string
  className?: string
  imageClassName?: string
  useClientWidth?: boolean
  onColorExtracted?: (color: string) => void
  maxWidth?: number
  fixed?: boolean
  [x: string]: any
}

const ImageLoader: React.FC<ImageLoaderProps> = ({
  image,
  width = 700,
  height = 400,
  alt,
  title,
  className = '',
  imageClassName = '',
  useClientWidth = false,
  maxWidth = 1200,
  onColorExtracted,
  fixed = true,
  radius = 0,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const autoContainerRef = useRef<HTMLDivElement>(null)
  const [clientWidth, setClientWidth] = useState<number>(width)
  const [clientHeight, setClientHeight] = useState<number>(height)
  const [imageData, setImageData] = useState({
    url: typeof image === 'string' ? image : '',
    width: 0,
    height: 0,
    ratio: 0,
  })

  const deviceObtained = useBoundingWidth() as DeviceType

  useEffect(() => {
    const processImage = async () => {
      if (typeof image === 'string') {
        setImageData({
          url: image,
          width: clientWidth,
          height: clientHeight,
          ratio: clientWidth / clientHeight,
        })
        return
      }

      const imageWidthFromCdn = image?.metadata?.dimensions?.width
      const imageRatio = image?.metadata?.dimensions?.aspectRatio

      // If image has direct URL, use it as fallback
      const directUrl = image?.url || image?.asset?.url

      if (imageWidthFromCdn && imageRatio) {
        let newProposedWidth = maxWidth
        switch (deviceObtained) {
          case 'smallMobile':
            newProposedWidth = Math.min(imageWidthFromCdn, 600)
            break
          case 'largeMobile':
            newProposedWidth = Math.min(imageWidthFromCdn, 767)
            break
          case 'tab':
            newProposedWidth = Math.min(imageWidthFromCdn, maxWidth)
            break
        }

        const newHeight = newProposedWidth / imageRatio
        const imageID = image._id
          ? image._id
          : image.asset
            ? image.asset._id
            : image._id || image.asset?._id || image

        const url = urlForImage(imageID, {
          width: newProposedWidth,
          height: newHeight,
          quality: 90,
        })
        setImageData({
          url: url || directUrl || '',
          width: newProposedWidth,
          height: newHeight,
          ratio: imageRatio,
        })
      } else if (directUrl) {
        // Fallback: use direct URL if metadata is not available
        setImageData({
          url: directUrl,
          width: clientWidth,
          height: clientHeight,
          ratio: clientWidth / clientHeight,
        })
      }
    }

    processImage()
  }, [
    image,
    deviceObtained,
    maxWidth,
    onColorExtracted,
    clientWidth,
    clientHeight,
  ])

  useEffect(() => {
    if (autoContainerRef.current) {
      setClientHeight(autoContainerRef.current.clientHeight)
      setClientWidth(autoContainerRef.current.clientWidth)
    }
  }, [imageData.width])

  if (!imageData.url) {
    return null
  }

  if (fixed) {
    return (
      <div
        ref={containerRef}
        className={`flex w-full h-full relative ${className}`}
      >
        <Image
          src={imageData.url}
          alt={alt || (image?.altText ?? '') || ''}
          title={title || (image?.title ?? '') || ''}
          className={`object-cover object-center ${imageClassName}`}
          fill
          style={{borderRadius:radius+'px'}}
        />
      </div>
    )
  }

  return (
    <div
      ref={autoContainerRef}
      className={`w-full h-auto relative ${className}`}
    >
      <Image
        className={`!m-0 ${imageClassName}`}
        src={imageData.url}
        alt={alt || (image?.altText ?? '') || ''}
        title={title || (image?.title ?? '') || ''}
        width={imageData.width || clientWidth}
        height={imageData.height || clientHeight}
        style={{borderRadius:radius+'px'}}
      />
    </div>
  )
}

export default ImageLoader
