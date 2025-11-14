import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { urlForVideo } from '~/lib/sanity.image'
import useMediaQuery from '~/utils/mediaQuery'
import { videoJsonLd } from '~/components/utils/jsonld'

export default function VideoPlayers({
  video,
  thumbnail,
}: {
  video: any
  thumbnail: any
}) {

  const [isPlaying, setIsPlaying] = useState(false)
  const [showThumbnail, setShowThumbnail] = useState(true)

  // Handle array case for video
  const videoData = Array.isArray(video) ? video[0] : video

  const getVideoEmbedUrl = () => {
    if (!videoData) return null
    const { videoPlatform, videoId } = videoData

    switch (videoPlatform) {
      case 'youtube':
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`
      case 'vimeo':
        return `https://player.vimeo.com/video/${videoId}?autoplay=1&title=0&byline=0&portrait=0`
      case 'vidyard':
        return `https://play.vidyard.com/${videoId}?autoplay=1`
      default:
        return null
    }
  }

  const handlePlay = () => {
    setIsPlaying(true)
    setShowThumbnail(false)
  }

  const handleClose = () => {
    setIsPlaying(false)
    setShowThumbnail(true)
  }

  const jsonLd = videoData ? videoJsonLd(videoData) : null
  const hasVideoData = jsonLd !== null && videoData?.videoId

  useEffect(() => {
    if (hasVideoData && jsonLd && videoData?.videoId) {
      const scriptId = `videoJSON-${videoData.videoId || Date.now()}`
      const existingScript = document.getElementById(scriptId)
      if (existingScript) {
        existingScript.remove()
      }
      
      const script = document.createElement('script')
      script.id = scriptId
      script.type = 'application/ld+json'
      script.innerHTML = JSON.stringify(jsonLd)
      document.head.appendChild(script)
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Video JSON-LD added to head:', jsonLd)
      }
      
      return () => {
        const scriptToRemove = document.getElementById(scriptId)
        if (scriptToRemove) {
          scriptToRemove.remove()
        }
      }
    }
    // Silently skip JSON-LD if video doesn't have videoId (local video file)
  }, [hasVideoData, jsonLd, videoData?.videoId])

  return (
    <>
    {hasVideoData && jsonLd && (
      <Head>
        <script
          key={`videoJSON-${videoData?.videoId || Date.now()}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
    )}
    <div
      className="relative w-full h-full group"
     
    >
      {isPlaying ? (
        <div className="relative w-full h-full cursor-pointer" onClick={handlePlay}>
          <iframe
            src={getVideoEmbedUrl()}
            className="w-full h-full rounded-2xl"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
          
        </div>
      ) : (
        <>
          {thumbnail ? (
            <video
              muted
              loop
              playsInline
              autoPlay
              className="w-full h-full object-cover"
            >
              <source
                src={urlForVideo(thumbnail)}
                // type="video/mp4"
              />
              Your browser does not support HTML5 video.
            </video>
          ) : (
            // Fallback when no thumbnail
            null
          )}
        </>
      )}
    </div>
    </>
  )
}
