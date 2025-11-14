import React, { useState, useEffect } from 'react'
import { urlForVideo } from '~/lib/sanity.image'
import useMediaQuery from '~/utils/mediaQuery'

export default function VideoPlayers({
  video,
  thumbnail,
}: {
  video: any
  thumbnail: any
}) {

  const [isPlaying, setIsPlaying] = useState(false)
  const [showThumbnail, setShowThumbnail] = useState(true)

  const getVideoEmbedUrl = () => {
    const { videoPlatform, videoId } = video

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

  return (
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
  )
}
