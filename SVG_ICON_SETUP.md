# SVG Icon Setup for Category Features

## Overview
Category icons now support both image uploads and SVG code from the CMS. SVG code takes priority and automatically changes color based on the active state.

## How to Use

### 1. In Sanity CMS
1. Go to **Features & Components** → **Feature Category**
2. Create or edit a category
3. **Option A**: Upload an image in **"Category Icon"** field
4. **Option B**: Paste SVG code in **"Icon SVG Code"** field (overrides image)
5. If SVG code is provided, it will be used instead of the uploaded image

### 2. SVG Code Examples

#### Phone Icon
```svg
<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
</svg>
```

#### Chart/Analytics Icon
```svg
<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M18 20V10"/>
  <path d="M12 20V4"/>
  <path d="M6 20v-6"/>
</svg>
```

#### Chat/AI Icon
```svg
<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  <path d="M13 8H7"/>
  <path d="M17 12H7"/>
</svg>
```

#### VoIP Icon
```svg
<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  <path d="M14.05 2a9 9 0 0 1 8 7.94"/>
  <path d="M20.05 2a9 9 0 0 1 2 7.94"/>
</svg>
```

### 3. Important Notes

- **Color Inheritance**: The SVG will automatically use `currentColor` for both `fill` and `stroke` attributes
- **Size**: The SVG will be sized to 32x32 pixels (w-8 h-8)
- **Validation**: The CMS validates that you provide proper SVG code with opening and closing tags
- **Fallback**: If no SVG code is provided, it will fall back to the image icon or default emoji

### 4. Color Behavior

- **Inactive State**: Icons will be gray (`text-gray-600`)
- **Active State**: Icons will be purple (`text-purple-600`)
- **Smooth Transition**: Color changes animate smoothly with CSS transitions

### 5. Priority System

1. **SVG Code** (highest priority) - Uses SVG code from "Icon SVG Code" field
2. **Image Icon** (fallback) - Uses uploaded image from "Category Icon" field  
3. **Default Emoji** (last resort) - Falls back to 📋 emoji if neither is provided

### 6. Benefits

- **Flexibility**: Choose between image upload or SVG code
- **Color Changes**: SVG code automatically changes color on active state
- **Fallback Support**: Always has a display option
- **Easy Migration**: Can gradually move from images to SVG code

This flexible setup gives you complete control over your category icons with dynamic color changes! 🎨✨
