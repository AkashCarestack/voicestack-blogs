import * as React from 'react'
import { CloseIcon } from '@sanity/icons'
import Button from './Button'
import ButtonArrow from '../icons/ButtonArrow'
import useMediaQuery from '~/utils/mediaQuery'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'

type VideoPlatform = 'vimeo' | 'vidyard' | 'youtube'

export interface VideoItem {
  _id?: string
  videoPlatform: VideoPlatform
  videoId: string
  title?: string
}

interface VideoProps {
  videoDetails: VideoItem | VideoItem[]
  className?: string
  isPopup?: boolean
  onClose?: () => void
  video?: VideoItem | VideoItem[]
  openForm?: () => void
  hasDemoBanner?:boolean
  refer?:any
}

  // const searchParams = useSearchParams();
  // // const source = searchParams.get("refer"); // Get 'refer' param from URL
  // const [refer, setRefer] = React.useState(null);

  // React.useEffect(() => {
  //   const sourceParam = searchParams.get("refer");
  //   setRefer(sourceParam || ""); // Set refer once available
  // }, [searchParams]);
  

const getIframeUrl = (videoPlatform: VideoPlatform, videoId: string): string => {
  switch (videoPlatform) {
    case 'vimeo':
      return `https://player.vimeo.com/video/${videoId}`
    case 'vidyard':
      return `https://play.vidyard.com/${videoId}`
    case 'youtube':
      return `https://www.youtube.com/embed/${videoId}`
    default:
      throw new Error(`Unsupported platform: ${videoPlatform}`)
  }
}

// Move VideoIframe outside of the main component to avoid re-creation on each render
const VideoIframe: React.FC<VideoItem> = ({
  videoPlatform,
  videoId,
  title = '',
}) => (
  <iframe
    src={getIframeUrl(videoPlatform, videoId)}
    title={title}
    frameBorder="0"
    allowFullScreen
    className="w-full h-full"
  />
)

export const VideoModal: React.FC<VideoProps> = ({
  videoDetails,
  className = '',
  isPopup = false,
  onClose,
  openForm,
  video,
  hasDemoBanner,
  refer
}) => {
  const videoData = video || videoDetails

  const toggleRef = React.useRef(null);
  const isMobile = useMediaQuery(767);
  const router = useRouter();

  // Close the modal if clicking on the parent outside the child
  const handleParentClick = (e) => {
    // Check if the click target is the parent
    if (e.target === e.currentTarget) {
  
      onClose();
      
    }
  };
  
  

  if (!videoData) {
    return null
  }

  return (
    <div
      
      onClick={handleParentClick}
      className={`${
        isPopup
          ? 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'
          : ''
      } ${className}`}
    >
      <div className='w-full max-w-[750px] px-4' ref={toggleRef}>
        <div
          className={`${
            isPopup
              ? 'relative w-full aspect-[16/9] bg-white'
              : 'w-full aspect-[16/9] relative '
          }`}
        >
          {isPopup && onClose && (
            <button
              className="absolute -top-10 -right-[5px] md:-right-5  hover:text-gray-800 transition-colors duration-200 p-1 rounded-full"
              onClick={onClose}
              aria-label="Close video"
            >
              <CloseIcon color="white" height={30} />
            </button>
          )}

          {Array.isArray(videoData) ? (
            videoData.map((item) => (
              <VideoIframe
                key={item._id || `${item.videoPlatform}-${item.videoId}`}
                {...item}
              />
            ))
          ) : (
            <VideoIframe {...videoData} />
          )}
        </div>
        {hasDemoBanner && (
          <div className='flex flex-col md:flex-row justify-between gap-3 md:gap-10 items-center py-4 md:py-6 px-8 bg-white'>
            <span className='text-[18px] md:text-[23px] font-medium text-gray-900'>Book a meeting with us</span>
            {refer == "carestack" ? (
              <Button type={isMobile ? "primarySm" : "primary"} link={`/demo?region=${router.locale}`} locale={false} target='_blank'>
                <ButtonArrow></ButtonArrow>
                <span className="text-base font-medium">
                  {`Book free demo`}
                </span>
              </Button>
              ):(
                <Button type={isMobile ? "primarySm" : "primary"} onClick={() => {
                  openForm();
                  onClose();
                }}>
                  <ButtonArrow></ButtonArrow>
                  <span className="text-base font-medium">
                    {/* {data?.bookBtnContent} */}
                    Book free demo
                  </span>
                </Button>
            )}
            
          </div>
        )}
      </div>
    </div>
  )
}

export { getIframeUrl }
