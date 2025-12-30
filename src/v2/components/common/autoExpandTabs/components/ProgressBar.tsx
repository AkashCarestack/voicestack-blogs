import React from 'react';
import { motion } from 'framer-motion';
import { ProgressBarProps } from '../types';

export default function ProgressBar({ progress, activeTab }: ProgressBarProps) {
  return (
    <div className="hidden md:block absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden bg-transparent">
      <motion.div
        className="h-full bg-vs-purple"
        initial={{ scaleX: 0 }}
        animate={{ 
          scaleX: progress / 100
        }}
        transition={{
          duration: 0,
          ease: "linear"
        }}
        style={{
          transformOrigin: "left"
        }}
        key={`progress-${activeTab}`}
      />
    </div>
  );
}

