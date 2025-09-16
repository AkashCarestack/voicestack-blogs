# Dynamic Components System

A flexible, reusable component system that separates data structure from presentation using slugs as the bridge.

## 🚀 How It Works

1. **User selects Component Type** (data structure) in CMS
2. **User enters Section Slug** (presentation override)
3. **System maps slug to component** using `SLUG_COMPONENT_MAP`
4. **Component renders** with data from the selected type

## 📁 Component Structure

```
src/components/dynamic/
├── DynamicComponentRenderer.tsx  # Main renderer
├── ListingComponent.tsx          # List display
├── RightImageComponent.tsx       # Content with right image
├── FeatureGridComponent.tsx      # Feature grid layout
├── TestimonialComponent.tsx      # Customer testimonials
├── CustomComponent.tsx           # Custom content with global refs
├── index.ts                      # Export file
└── README.md                     # This file
```

## 🎯 Available Components

### 1. ListingComponent
**Purpose**: Display lists of items in various layouts
**Layouts**: `vertical`, `grid`, `cards`
**Best For**: Features, services, benefits, team members

```typescript
// Data Structure
{
  title: string,
  description: string,
  items: [
    {
      title: string,
      description: string,
      icon?: image reference
    }
  ],
  layout: 'vertical' | 'grid' | 'cards'
}
```

### 2. TestimonialComponent
**Purpose**: Display customer testimonials with ratings
**Layouts**: `grid`, `carousel`, `list`
**Best For**: Customer reviews, client feedback, success stories

```typescript
// Data Structure
{
  title: string,
  testimonials: [
    {
      quote: string,
      author: string,
      position?: string,
      company?: string,
      rating?: number (1-5),
      avatar?: image reference
    }
  ],
  layout: 'grid' | 'carousel' | 'list',
  showRating: boolean
}
```

### 3. FeatureGridComponent
**Purpose**: Display features in responsive grid
**Grid Sizes**: `2`, `3`, `4` columns
**Best For**: Product features, service offerings, key benefits

```typescript
// Data Structure
{
  title: string,
  description: string,
  features: [
    {
      title: string,
      description: string,
      icon?: image reference,
      link?: string
    }
  ],
  gridColumns: '2' | '3' | '4',
  showIcons: boolean
}
```

### 4. RightImageComponent
**Purpose**: Content with image on the right
**Alignments**: `top`, `center`, `bottom`
**Best For**: Product showcases, service descriptions, about sections

```typescript
// Data Structure
{
  title: string,
  description: string,
  image: image reference,
  imageAlt?: string,
  contentAlignment: 'top' | 'center' | 'bottom',
  backgroundColor: 'white' | 'gray' | 'blue'
}
```

### 5. CustomComponent
**Purpose**: Custom content with global schema references
**Features**: Global refs, comparison tables, custom content
**Best For**: Complex content, comparison tables, global data

```typescript
// Data Structure
{
  title: string,
  subtitle: string,
  content: string,
  buttonText?: string,
  buttonLink?: string,
  backgroundColor: 'white' | 'gray' | 'blue',
  image?: image reference,
  referenceGlobalSchema?: {
    _ref: string,
    _type: 'reference'
  },
  referenceSchemaSlug?: string
}
```

## 🔧 Slug Mapping

The system uses slugs to override component types:

```typescript
const SLUG_COMPONENT_MAP = {
  'heroGrid': { componentType: 'FeatureGrid' },
  'testimonialSection': { componentType: 'Testimonial' },
  'testimonial': { componentType: 'Testimonial' },
  'listingSection': { componentType: 'Listing' },
  'rightImageSection': { componentType: 'RightImage' },
  'customSection': { componentType: 'Custom' }
}
```

## 💡 Usage Examples

### Example 1: Listing Data → Feature Grid
```typescript
// CMS Configuration
Component Type: "Listing"
Section Slug: "heroGrid"
Result: Listing data rendered as FeatureGrid component
```

### Example 2: Testimonial Data → Right Image
```typescript
// CMS Configuration
Component Type: "Testimonial"
Section Slug: "rightImageSection"
Result: Testimonial data rendered as RightImage component
```

### Example 3: Custom Data → Any Component
```typescript
// CMS Configuration
Component Type: "Custom"
Section Slug: "heroGrid"
Result: Custom data rendered as FeatureGrid component
```

## 🛠️ Adding New Components

1. **Create component file** in `src/components/dynamic/`
2. **Add to exports** in `index.ts`
3. **Add to switch statement** in `DynamicComponentRenderer.tsx`
4. **Add slug mapping** in `SLUG_COMPONENT_MAP`
5. **Update this README**

## 🎨 Styling

All components use Tailwind CSS classes and are fully responsive. They include:
- Mobile-first design
- Responsive grid layouts
- Hover effects and transitions
- Consistent spacing and typography
- Dark/light theme support

## 🐛 Debugging

Enable debug logging in development:
```typescript
// In DynamicComponentRenderer.tsx
if (process.env.NODE_ENV === 'development') {
  console.log('DynamicComponentRenderer Debug:', {
    slug,
    predefinedComponent,
    originalComponentType: component?.componentType,
    finalComponentType: componentType,
    hasComponentData: !!componentToRender
  })
}
```

## 📝 Best Practices

1. **Always provide fallback data** for testing
2. **Use semantic HTML** for accessibility
3. **Include proper alt text** for images
4. **Test all layout variations**
5. **Keep components focused** on single responsibility
6. **Document data structures** clearly
7. **Use TypeScript interfaces** for type safety

## 🔄 Data Flow

```
CMS Data → DynamicComponentRenderer → Slug Override → Component → Rendered HTML
```

This system provides maximum flexibility while maintaining clean, reusable code!
