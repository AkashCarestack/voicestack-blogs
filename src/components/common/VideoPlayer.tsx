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

  const videoData = Array.isArray(video) ? video[0] : video

  // Priority 1: Check if uploadedVideo exists (uploaded file - play directly)
  const hasUploadedVideo = !!videoData?.uploadedVideo

  // Priority 2: Check if videoUrl exists (direct video URL - play directly)
  // If videoUrl exists, always play it directly regardless of platform
  const hasDirectVideoUrl = !!videoData?.videoUrl

  // Priority 3: Check if video has a platform (youtube, vidyard, vimeo) with videoId - use embedded iframe
  // Only use platform-based if no direct videoUrl or uploaded video exists
  const hasVideoPlatform = !hasUploadedVideo && !hasDirectVideoUrl && 
    videoData?.videoPlatform && 
    videoData?.videoId && 
    ['youtube', 'vidyard', 'vimeo'].includes(videoData.videoPlatform)

  // Get uploaded video URL if available
  const uploadedVideoUrl = hasUploadedVideo ? urlForVideo(videoData.uploadedVideo) : null

  const [isPlaying, setIsPlaying] = useState(hasVideoPlatform || hasDirectVideoUrl || hasUploadedVideo)
  const [showThumbnail, setShowThumbnail] = useState(!hasVideoPlatform && !hasDirectVideoUrl && !hasUploadedVideo)

  // Auto-play when video changes
  useEffect(() => {
    if (hasVideoPlatform || hasDirectVideoUrl || hasUploadedVideo) {
      setIsPlaying(true)
      setShowThumbnail(false)
    } else {
      setIsPlaying(false)
      setShowThumbnail(true)
    }
  }, [videoData?.videoPlatform, videoData?.videoId, videoData?.videoUrl, videoData?.uploadedVideo])

  const getVideoEmbedUrl = () => {
    if (!videoData) return null
    const { videoPlatform, videoId } = videoData

    switch (videoPlatform) {
      case 'youtube':
        // Remove controls, enable autoplay, loop, mute, and minimal branding
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&playsinline=1`
      case 'vimeo':
        // Remove controls, enable autoplay and loop
        return `https://player.vimeo.com/video/${videoId}?autoplay=1&loop=1&muted=1&controls=0&title=0&byline=0&portrait=0`
      case 'vidyard':
        // Enable autoplay and loop (Vidyard may have different parameters)
        return `https://play.vidyard.com/${videoId}?autoplay=1&loop=1&muted=1`
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
      {hasUploadedVideo && uploadedVideoUrl && (isPlaying || !thumbnail) ? (
        // Uploaded video file playback (MP4, MOV, WebM from Sanity)
        <video
          src={uploadedVideoUrl}
          muted
          loop
          playsInline
          autoPlay
          controls={false}
          className="w-full h-full object-cover display-block"
        />
      ) : hasDirectVideoUrl && (isPlaying || !thumbnail) ? (
        // Direct video URL playback (MP4, WebM, or any direct video URL)
        <video
          src={videoData.videoUrl}
          muted
          loop
          playsInline
          autoPlay
          controls={false}
          className="w-full h-full object-cover display-block"
        />
      ) : hasVideoPlatform ? (
        // Platform-based embedded video (YouTube, Vimeo, Vidyard)
        <iframe
          src={getVideoEmbedUrl()}
          className="w-full h-full rounded-2xl"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      ) : thumbnail ? (
        <div className="relative w-full h-full">
          <img 
            src={thumbnail}
            alt=""
            className="w-full h-full object-cover display-block"
          />
        </div>
      ) : (
        // Fallback when no thumbnail and no video
        null
      )}
    </div>
    </>
  )
}
