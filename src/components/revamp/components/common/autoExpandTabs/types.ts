export interface AutoExpandTab {
  key: string;
  step: string;
  title: string;
  description: string;
  video?: any;
  thumbnail?: string;
}

export interface AutoExpandTabsProps {
  tabs: AutoExpandTab[];
  autoPlayDuration?: number;
  className?: string;
}

export interface ProgressBarProps {
  progress: number;
  activeTab: string;
}

export interface PauseButtonProps {
  isPaused: boolean;
  onToggle: () => void;
}

export interface TabItemProps {
  tab: AutoExpandTab;
  isActive: boolean;
  index: number;
  totalTabs: number;
  progress: number;
  isPaused: boolean;
  onTabClick: (tabKey: string) => void;
  onPauseToggle: () => void;
  tabs?: AutoExpandTab[];
  activeTab?: string;
}

export interface MediaDisplayProps {
  tabs: AutoExpandTab[];
  activeTab: string;
}
