import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import VideoPlayers from '~/components/common/VideoPlayer';
import { AutoExpandTab } from '../types';
import ImageLoader from '~/components/common/imageLoader/imageLoader';

interface MediaDisplayProps {
  tabs: AutoExpandTab[];
  activeTab: string;
}

export default function MediaDisplay({ tabs, activeTab }: MediaDisplayProps) {
  // Preload all images
  useEffect(() => {
    tabs.forEach((tab) => {
      if (tab.thumbnail) {
        const img = new Image();
        img.src = tab.thumbnail as string;
      }
    });
  }, [tabs]);

  return (
    <div className="w-full h-[300px] md:h-[570px] overflow-hidden relative flex items-center justify-center">
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;
        
        return (
          <motion.div
            key={tab.key}
            initial={false}
            animate={{
              opacity: isActive ? 1 : 0,
              visibility: isActive ? 'visible' : 'hidden',
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
            style={{
              pointerEvents: isActive ? 'auto' : 'none',
            }}
          >
            {tab.thumbnail ? (
              <div className="w-full h-full relative">
                <ImageLoader
                  image={tab.thumbnail as string}
                  alt={tab.title}
                  className="w-full h-full object-cover display-block"
                />
              </div>
            ) : tab.video ? (
              <div className="w-full h-full">
                <VideoPlayers
                  video={tab.video}
                  thumbnail={undefined}
                />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-white font-geist font-medium text-base leading-6 tracking-normal whitespace-nowrap">
                  634 X 474
                </p>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
