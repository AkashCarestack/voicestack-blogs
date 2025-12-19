# AutoExpandTabs Component Architecture

A component-based, modular architecture for auto-expanding tabs with smooth animations and progress tracking.

## 📁 Directory Structure

```
autoExpandTabs/
├── index.tsx                    # Main component entry point
├── types.ts                     # TypeScript interfaces and types
├── hooks/
│   └── useAutoAdvanceTimer.ts  # Custom hook for timer logic
├── components/
│   ├── ProgressBar.tsx         # Progress bar component
│   ├── PauseButton.tsx         # Pause/Play button component
│   ├── TabItem.tsx             # Individual tab item (collapsed/expanded)
│   ├── TabsList.tsx            # List container for tabs
│   └── MediaDisplay.tsx        # Media display component (video/image)
└── README.md                   # This file
```

## 🏗️ Architecture Overview

### Component Hierarchy

```
AutoExpandTabs (index.tsx)
├── useAutoAdvanceTimer (hook)
│   └── Manages: progress, isPaused, togglePause
├── TabsList
│   └── TabItem (multiple)
│       ├── PauseButton
│       └── ProgressBar
└── MediaDisplay
```

### Key Components

#### 1. **AutoExpandTabs** (`index.tsx`)
- Main container component
- Manages active tab state
- Coordinates between tabs list and media display
- Handles tab click events

#### 2. **useAutoAdvanceTimer** (`hooks/useAutoAdvanceTimer.ts`)
- Custom hook encapsulating all timer logic
- Manages progress animation using `requestAnimationFrame`
- Handles pause/resume functionality
- Auto-advances to next tab after duration
- Returns: `{ progress, isPaused, togglePause }`

#### 3. **TabItem** (`components/TabItem.tsx`)
- Individual tab component
- Handles both collapsed and expanded states
- Integrates PauseButton and ProgressBar
- Manages z-index stacking for proper layering

#### 4. **ProgressBar** (`components/ProgressBar.tsx`)
- Reusable progress indicator
- Uses Framer Motion for smooth animations
- Controlled by progress prop (0-100)

#### 5. **PauseButton** (`components/PauseButton.tsx`)
- Toggle button for pause/play
- Shows play icon when paused, pause icon when playing
- Accessible with proper ARIA labels

#### 6. **MediaDisplay** (`components/MediaDisplay.tsx`)
- Displays video, image, or placeholder
- Smooth transitions between media changes
- Uses AnimatePresence for exit animations

#### 7. **TabsList** (`components/TabsList.tsx`)
- Container for all tab items
- Manages tab rendering and layout

## 🎯 Design Principles

### 1. **Separation of Concerns**
- Logic separated into custom hook
- UI components are pure and focused
- Types centralized in `types.ts`

### 2. **Reusability**
- Components can be used independently
- ProgressBar and PauseButton are standalone
- Easy to extend or modify individual parts

### 3. **Maintainability**
- Clear file structure
- Single responsibility per component
- TypeScript for type safety

### 4. **Performance**
- `requestAnimationFrame` for smooth animations
- Proper cleanup of timers and animations
- Memoization where appropriate

## 🔧 Usage

```tsx
import AutoExpandTabs from '~/components/revamp/components/common/autoExpandTabs';

const tabs = [
  {
    key: 'step-1',
    step: 'STEP 01',
    title: 'Log & Identify Calls',
    description: 'Description here...',
    thumbnail: 'image-url.jpg',
  },
  // ... more tabs
];

<AutoExpandTabs 
  tabs={tabs} 
  autoPlayDuration={5000} 
  className="custom-class"
/>
```

## 🎨 Customization

### Styling
- Components use Tailwind CSS classes
- Colors: `vs-purple`, `gray-50`, `gray-200`, etc.
- Responsive breakpoints: `md:`, `lg:`

### Animation
- Progress bar: Linear animation via `requestAnimationFrame`
- Tab expansion: Framer Motion height/opacity transitions
- Media transitions: Scale and fade effects

### Behavior
- Auto-advance duration: Configurable via `autoPlayDuration` prop
- Pause functionality: Preserves progress state
- Manual tab selection: Resets timer and progress

## 🚀 Future Enhancements

- [ ] Add keyboard navigation support
- [ ] Add swipe gestures for mobile
- [ ] Add transition direction indicators
- [ ] Add customizable animation durations
- [ ] Add callback props for tab change events

## 📝 Notes

- Progress bar uses `requestAnimationFrame` for 60fps smoothness
- Timer state is preserved when pausing
- Z-index stacking ensures proper tab layering
- All components are client-side only (`"use client"`)
