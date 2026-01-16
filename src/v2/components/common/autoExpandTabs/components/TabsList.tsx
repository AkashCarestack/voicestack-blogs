import React from 'react';
import { AutoExpandTab } from '../types';
import TabItem from './TabItem';

interface TabsListProps {
  tabs: AutoExpandTab[];
  activeTab: string;
  progress: number;
  isPaused: boolean;
  onTabClick: (tabKey: string) => void;
  onPauseToggle: () => void;
}

export default function TabsList({
  tabs,
  activeTab,
  progress,
  isPaused,
  onTabClick,
  onPauseToggle,
}: TabsListProps) {
  return (
    <div className="w-full h-full flex flex-col isolate">
      {tabs.map((tab, index) => (
        <TabItem
          key={tab.key}
          tab={tab}
          isActive={tab.key === activeTab}
          index={index}
          totalTabs={tabs.length}
          progress={progress}
          isPaused={isPaused}
          onTabClick={onTabClick}
          onPauseToggle={onPauseToggle}
          tabs={tabs}
          activeTab={activeTab}
        />
      ))}
    </div>
  );
}

