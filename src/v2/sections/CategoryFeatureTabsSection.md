# CategoryFeatureTabsSection Component Documentation

## Overview

`CategoryFeatureTabsSection` is a flexible, feature-rich component designed to display categorized features with multiple layout variants. It supports tabbed navigation, smooth animations, and various display modes including carousels, grids, and simple listings.

## Table of Contents

- [Props & Interface](#props--interface)
- [Variants](#variants)
- [Data Structure](#data-structure)
- [Usage Examples](#usage-examples)
- [Visual Layouts](#visual-layouts)

---

## Props & Interface

### CategoryFeatureTabsSectionProps

```typescript
interface CategoryFeatureTabsSectionProps {
  features: Feature[] | any;           // Array of features or tabsListingComponent structure
  sectionHeading?: any;                // Section header configuration
  className?: string;                  // Additional CSS classes
  variant?: 'default' | 'carousel' | 'carouselwithcards' | 'scrollcarousel' | 'singlecard' | 'simplelisting';
}
```

### Feature Interface

```typescript
interface Feature {
  _id: string;
  basicInfo?: {
    title: string;
    slug?: { current: string };
    description?: string;
    icon?: any;
    dynamicSvg?: string;
  };
  title?: string;
  slug?: { current: string };
  language: string;
  order?: number;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: any;
  mainImage?: any;
  shortDescription?: any;
  featureCategory?: {
    name: string;
    subheading?: string;
    description?: string;
    mainImage?: any;
    icon?: any;
    iconSvgCode?: string;
  };
}
```

---

## Variants

### 1. `default` (Default Variant)

**Description:** Full-featured layout with sticky tabs, scrollable sections, and grouped feature cards.

**Layout:**
- Section header at the top
- Sticky tab navigation
- Each category displayed as a full-width section with:
  - Left column: Category label, heading, description, and CTA button
  - Right column: Category image with grid pattern background
  - Below: GroupedCardsGrid showing all features in that category (3 columns)

**Features:**
- Smooth scroll navigation between categories
- Intersection Observer for automatic tab switching
- Section dividers between categories
- Responsive grid layout

**Best For:**
- Feature pages with multiple categories
- Long-form content
- SEO-optimized pages

**Example:**
```tsx
<CategoryFeatureTabsSection
  features={featuresArray}
  sectionHeading={{
    sectionHeadingDynamic: "Feature-Packed to Improve Every Front Office Workflow",
    subheadline: "Empower team members with AI-powered calls..."
  }}
  variant="default"
/>
```

---

### 2. `carousel` (Carousel Variant)

**Description:** Two-column carousel layout with pill-shaped feature items that switch smoothly between categories.

**Layout:**
- Section header at the top
- Sticky tab navigation
- Two-column grid:
  - **Left Column:** Category label, heading, description, and pill-shaped feature links
  - **Right Column:** Category image (max-width: 500px) with grid pattern background
- Smooth fade animations when switching tabs (0.15s duration)

**Visual Structure:**
```
┌─────────────────────────────────────────┐
│         Section Header                  │
├─────────────────────────────────────────┤
│         Sticky Tabs                     │
├──────────────────┬──────────────────────┤
│                  │                      │
│  Category Label  │                      │
│  Main Heading    │    Category Image    │
│  Description     │    (max 500px)      │
│                  │                      │
│  [Pill] [Pill]   │                      │
│  [Pill] [Pill]   │                      │
│                  │                      │
└──────────────────┴──────────────────────┘
```

**Features:**
- Fast switching animations (0.15s)
- Pill-shaped clickable feature items
- Image constrained to 500px max-width
- Smooth AnimatePresence transitions

**Best For:**
- Quick feature overviews
- Interactive product showcases
- Marketing pages

**Example:**
```tsx
<CategoryFeatureTabsSection
  features={tabsListingComponent}
  sectionHeading={sectionHeadingData}
  variant="carousel"
/>
```

---

### 3. `carouselwithcards` (Carousel with Cards Variant)

**Description:** Similar to carousel but replaces pill items with a full GroupedCardsGrid below the two-column layout.

**Layout:**
- Section header at the top
- Sticky tab navigation
- Two-column grid:
  - **Left Column:** Category label, heading, description (aligned to bottom)
  - **Right Column:** Category image (max-width: 500px, centered)
- **Below:** Full-width GroupedCardsGrid with feature cards (3 columns)

**Visual Structure:**
```
┌─────────────────────────────────────────┐
│         Section Header                  │
├─────────────────────────────────────────┤
│         Sticky Tabs                     │
├──────────────────┬──────────────────────┤
│                  │                      │
│                  │                      │
│  Category Label  │    Category Image    │
│  Main Heading    │    (max 500px)      │
│  Description     │    (centered)        │
│                  │                      │
└──────────────────┴──────────────────────┘
┌─────────────────────────────────────────┐
│  [Card]  [Card]  [Card]                │
│  [Card]  [Card]  [Card]                │
│  [Card]  [Card]  [Card]                │
└─────────────────────────────────────────┘
```

**Features:**
- Fast animations (0.15s)
- Image max-width: 500px
- Full-width card grid below content
- Left content aligned to bottom (justify-end)

**Best For:**
- Feature pages requiring detailed card views
- Product comparison pages
- Comprehensive feature listings

**Example:**
```tsx
<CategoryFeatureTabsSection
  features={data['grow-your-practice']?.componentData?.refData?.tabsListingComponent}
  sectionHeading={sectionHeadingData}
  variant="carouselwithcards"
/>
```

---

### 4. `scrollcarousel` (Scroll Carousel Variant)

**Description:** Similar to default variant but optimized for scroll-based navigation.

**Layout:**
- Same as default variant
- Enhanced scroll detection
- Smooth scroll-to-section functionality

**Best For:**
- Long pages with many categories
- Scroll-heavy user experiences

---

### 5. `singlecard` (Single Card Variant)

**Description:** Displays only the first category in a simplified two-column layout with pill items.

**Layout:**
- Two-column grid:
  - **Left Column:** Category name, description, and pill-shaped feature items
  - **Right Column:** Category image with grid pattern background

**Visual Structure:**
```
┌──────────────────┬──────────────────────┐
│  Category Name   │                      │
│  Description     │    Category Image    │
│                  │                      │
│  [Pill] [Pill]   │                      │
│  [Pill] [Pill]   │                      │
└──────────────────┴──────────────────────┘
```

**Features:**
- No tabs (single category only)
- Pill-shaped feature items
- Clean, minimal design

**Best For:**
- Landing pages
- Single category showcases
- Hero sections

**Example:**
```tsx
<CategoryFeatureTabsSection
  features={singleCategoryData}
  variant="singlecard"
/>
```

---

### 6. `simplelisting` (Simple Listing Variant)

**Description:** Clean listing layout showing all tabs as cards in a 50/50 layout, perfect for product listings.

**Layout:**
- Section header (optional)
- Each tab displayed as:
  - **Left (50%):** Title, description, and feature bullets as pills
  - **Right (50%):** Product image with grid pattern background
- Borders between items

**Visual Structure:**
```
┌─────────────────────────────────────────┐
│         Section Header                  │
├──────────────────┬──────────────────────┤
│  Tab 1 Title     │    Tab 1 Image       │
│  Description     │                      │
│  [Pill] [Pill]   │                      │
├──────────────────┴──────────────────────┤
│  Tab 2 Title     │    Tab 2 Image       │
│  Description     │                      │
│  [Pill] [Pill]   │                      │
└──────────────────┴──────────────────────┘
```

**Features:**
- No tabs navigation
- All items visible at once
- Feature bullets extracted from content blocks
- Mobile-responsive (stacks vertically)

**Best For:**
- Product listings
- Phone collections
- Comparison pages
- Simple feature showcases

**Example:**
```tsx
<CategoryFeatureTabsSection
  features={tabsListingComponent}
  sectionHeading={sectionHeadingData}
  variant="simplelisting"
/>
```

---

## Data Structure

### Option 1: Feature Array Format

```typescript
const features: Feature[] = [
  {
    _id: "feature-1",
    language: "en",
    basicInfo: {
      title: "AI Call Analysis",
      description: "Detailed analysis of phone calls...",
      slug: { current: "ai-call-analysis" },
      dynamicSvg: "<svg>...</svg>"
    },
    featureCategory: {
      name: "Answer More Calls",
      subheading: "AI Receptionist",
      description: "The best AI assistant...",
      mainImage: imageAsset,
      iconSvgCode: "<svg>...</svg>"
    },
    mainImage: featureImageAsset
  }
];
```

### Option 2: tabsListingComponent Format

```typescript
const tabsListingComponent = {
  _type: "tabsListingComponent",
  tabs: [
    {
      _key: "tab-1",
      tabHeading: "Answer More Calls",
      tabSubHeading: "AI Receptionist",
      description: "Rich text or string description",
      image: categoryImageAsset,
      icon: "<svg>...</svg>",
      listItems: [
        {
          _key: "item-1",
          subfeatureHeading: "AI Call Analysis",
          subfeatureDescription: "Description text",
          subfeatureSubheading: "Optional subheading",
          subfeatureImage: featureImageAsset,
          svgCode: "<svg>...</svg>"
        }
      ]
    }
  ]
};
```

### Section Heading Format

```typescript
const sectionHeading = {
  sectionHeadingDynamic: "Feature-Packed to Improve Every Front Office Workflow",
  headline: "Alternative headline",
  subheadline: "Empower team members with AI-powered calls..."
};
```

---

## Usage Examples

### Basic Usage with Feature Array

```tsx
import CategoryFeatureTabsSection from '~/v2/sections/CategoryFeatureTabsSection';

export default function FeaturesPage({ features }) {
  return (
    <CategoryFeatureTabsSection
      features={features}
      sectionHeading={{
        sectionHeadingDynamic: "Our Features",
        subheadline: "Discover what makes us different"
      }}
      variant="default"
    />
  );
}
```

### Using tabsListingComponent Structure

```tsx
<CategoryFeatureTabsSection
  features={data['grow-your-practice']?.componentData?.refData?.tabsListingComponent}
  sectionHeading={data['grow-your-practice']?.componentData?.refData?.tabsListingComponent}
  variant="carouselwithcards"
/>
```

### With Custom Styling

```tsx
<CategoryFeatureTabsSection
  features={features}
  variant="carousel"
  className="custom-spacing-class"
  sectionHeading={headingData}
/>
```

---

## Visual Layouts

### Default Variant Layout

```
┌─────────────────────────────────────────────────────┐
│              Section Header                          │
├─────────────────────────────────────────────────────┤
│  [Tab 1] [Tab 2] [Tab 3] [Tab 4]  (Sticky)         │
├─────────────────────────────────────────────────────┤
│  ┌──────────────────┬──────────────────────────────┐│
│  │ Category Label  │                              ││
│  │ Main Heading     │    Category Image            ││
│  │ Description     │    (with grid pattern)       ││
│  │ [Book Demo]     │                              ││
│  └──────────────────┴──────────────────────────────┘│
│  ┌─────────────────────────────────────────────────┐│
│  │  [Card]  [Card]  [Card]                         ││
│  │  [Card]  [Card]  [Card]                         ││
│  └─────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────┤
│  ┌──────────────────┬──────────────────────────────┐│
│  │ Category 2       │    Category 2 Image           ││
│  └──────────────────┴──────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

### Carousel Variant Layout

```
┌─────────────────────────────────────────────────────┐
│              Section Header                          │
├─────────────────────────────────────────────────────┤
│  [Tab 1] [Tab 2] [Tab 3]  (Sticky)                  │
├──────────────────┬──────────────────────────────────┤
│  Category Label  │                                  │
│  Main Heading    │    Category Image                │
│  Description     │    (max-width: 500px)           │
│                  │                                  │
│  [Pill Item 1]   │                                  │
│  [Pill Item 2]   │                                  │
│  [Pill Item 3]   │                                  │
└──────────────────┴──────────────────────────────────┘
```

### Carousel with Cards Variant Layout

```
┌─────────────────────────────────────────────────────┐
│              Section Header                          │
├─────────────────────────────────────────────────────┤
│  [Tab 1] [Tab 2] [Tab 3]  (Sticky)                  │
├──────────────────┬──────────────────────────────────┤
│                  │                                  │
│  Category Label  │    Category Image                │
│  Main Heading    │    (max-width: 500px)           │
│  Description     │    (centered)                   │
│                  │                                  │
└──────────────────┴──────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│  [Feature Card]  [Feature Card]  [Feature Card]     │
│  [Feature Card]  [Feature Card]  [Feature Card]     │
│  [Feature Card]  [Feature Card]  [Feature Card]     │
└─────────────────────────────────────────────────────┘
```

### Simple Listing Variant Layout

```
┌─────────────────────────────────────────────────────┐
│              Section Header                          │
├──────────────────┬──────────────────────────────────┤
│  Product 1       │    Product 1 Image               │
│  Description     │                                  │
│  [Pill] [Pill]   │                                  │
├──────────────────┴──────────────────────────────────┤
│  Product 2       │    Product 2 Image               │
│  Description     │                                  │
│  [Pill] [Pill]   │                                  │
└──────────────────┴──────────────────────────────────┘
```

---

## Key Features

### Animation Settings

- **Default animations:** 0.4s duration
- **Carousel variants:** 0.15s duration (faster)
- **Easing:** `[0.16, 1, 0.3, 1]` (smooth cubic bezier)

### Responsive Behavior

- **Mobile:** Single column layout, stacked content
- **Tablet:** Two-column layout with adjusted spacing
- **Desktop:** Full two-column layout with optimal spacing

### Navigation Features

- **Sticky tabs:** Tabs remain visible while scrolling (default & carousel variants)
- **Smooth scrolling:** Automatic scroll to category sections
- **Intersection Observer:** Auto-updates active tab based on scroll position
- **Keyboard navigation:** Supported through tab navigation

### Image Handling

- **ImageLoader component:** Handles Sanity image assets
- **Grid pattern background:** Applied to image containers
- **Max-width constraints:** 500px for carousel variants
- **Responsive images:** Automatic optimization

---

## Best Practices

1. **Data Structure:** Use `tabsListingComponent` format for CMS-driven content
2. **Performance:** Use `carouselwithcards` for better performance with many features
3. **SEO:** Use `default` variant for better SEO (all content visible)
4. **Mobile:** Test all variants on mobile devices
5. **Images:** Ensure category images are optimized (recommended: 800x600px)
6. **Content:** Keep category descriptions concise (2-3 sentences)

---

## Troubleshooting

### Common Issues

1. **Tabs not switching:** Check if `activeCategory` state is properly initialized
2. **Images not loading:** Verify Sanity image asset structure
3. **Animation lag:** Reduce animation duration or disable on low-end devices
4. **Layout breaking:** Ensure proper data structure matches expected format

### Debug Tips

- Check browser console for data structure logs
- Verify `features` prop contains valid data
- Ensure `sectionHeading` is properly formatted
- Test with minimal data first, then add complexity

---

## Related Components

- `GroupedCardsGrid`: Used for displaying feature cards
- `SwitchableTabs`: Tab navigation component
- `SectionHeaderV2`: Section header component
- `ImageLoader`: Image handling component
- `GridPattern`: Background pattern component

---

## Version History

- **v2.0:** Added `carouselwithcards` variant
- **v1.5:** Added `simplelisting` variant
- **v1.0:** Initial release with default, carousel, and singlecard variants

---

## Support

For issues or questions, refer to the component source code at:
`src/v2/sections/CategoryFeatureTabsSection.tsx`

