import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "~/lib/utils";
import { TabItemProps } from '../types';
import PauseButton from './PauseButton';
import ProgressBar from './ProgressBar';

export default function TabItem({
  tab,
  isActive,
  index,
  totalTabs,
  progress,
  isPaused,
  onTabClick,
  onPauseToggle,
}: TabItemProps) {
  const zIndex = isActive ? 10 : totalTabs - index;

  return (
    <motion.div
      key={tab.key}
      className={cn(
        "  border-gray-200 relative overflow-hidden",
        // index === 0 && "border-t",
        isActive ? "bg-gray-50 border-b" : "bg-white cursor-pointer hover:bg-gray-50/50 border-b",
        // index === totalTabs - 1 && "border-b"
        index === 0 && "border-t ",
        index === totalTabs - 1 && "border-b-0 ",
      )}
      style={{ 
        zIndex,
        willChange: 'transform',
      }}
      animate={{
        backgroundColor: isActive ? "#F9FAFB" : "#FFFFFF",
      }}
      transition={{
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1], // Custom cubic-bezier for smoothness
      }}
    >
      {/* Collapsed state */}
      {!isActive && (
        <div
          onClick={() => onTabClick(tab.key)}
          className="flex gap-6 items-center px-12 py-6 w-full"
        >
          <div className="flex flex-col justify-center font-geist font-normal text-base text-gray-500 leading-6 tracking-normal whitespace-nowrap">
            <p>{tab.step.replace('STEP ', '')}</p>
          </div>
          <div className="flex flex-col flex-1 gap-0.5 items-start">
            <div className="flex flex-col justify-center w-full font-geist font-normal text-base text-gray-500 leading-[150%] tracking-normal">
              <p className="whitespace-pre-wrap leading-[150%]">{tab.title}</p>
            </div>
          </div>
        </div>
      )}

      {isActive && (
        <motion.div
          key={`expanded-${tab.key}`}
          initial={{ opacity: 0, }}
          animate={{ 
            opacity: 1, 
            transform: 'translateY(0)',
          }}
          style={{
            willChange: 'transform',
            // height: isActive ? '!important 282px' : '!important 70px',
          }}
          transition={{
            opacity: {
              duration: 0.25,
              ease: [0.4, 0, 0.2, 1],
            },
            transform: {
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1],
            },
          }}
          className="flex flex-col gap-12 items-start justify-center p-12"
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col justify-center font-geist font-normal text-base text-vs-purple leading-[125%] tracking-normal uppercase whitespace-nowrap">
              <p className="leading-[125%]">{tab.step}</p>
            </div>
            <PauseButton isPaused={isPaused} onToggle={onPauseToggle} />
          </div>

          <div className="flex flex-col gap-1.5 items-start w-full tracking-normal">
            <div className="flex flex-col justify-center w-full font-geist font-medium text-lg text-gray-950 leading-[155.55%]">
              <p className="whitespace-pre-wrap leading-[155.55%]">{tab.title}</p>
            </div>
            <div className="flex flex-col justify-center w-full font-geist font-normal text-base text-gray-700 leading-[150%]">
              <p className="whitespace-pre-wrap leading-[150%]">{tab.description}</p>
            </div>
          </div>

          {/* Progress bar */}
          <ProgressBar progress={progress} activeTab={tab.key} />
        </motion.div>
      )}
    </motion.div>
  );
}
