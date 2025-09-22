import createImageUrlBuilder from '@sanity/image-url';
import { dataset, projectId } from '~/lib/sanity.api';

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
});

interface ImageDimensions {
  width?: number;
  height?: number;
  quality?: number;
}

export const urlForImage = (source: any, dimensions?: ImageDimensions) => {  
  if (typeof source === 'string' && source.startsWith('http')) {
    return source; 
  }

  if (typeof source === 'object' && source?.asset?._ref ) {
    let urlBuilder = imageBuilder.image(source).auto('format');

    if (dimensions) {
      if (dimensions.width) {
        urlBuilder = urlBuilder.width(Math.round(dimensions.width));
      }
      if (dimensions.height) {
        urlBuilder = urlBuilder.height(Math.round(dimensions.height));
      }
      urlBuilder = urlBuilder.quality(dimensions.quality || 90);
    }

    return urlBuilder.url();
  }

  // if (typeof source === 'string' && source.startsWith('image-')) {
    const imageRef = {
      asset: {
        _ref: source,
        _type: 'reference',
      },
      _type: 'image',
    };
    
    let urlBuilder = imageBuilder.image(imageRef).auto('format');

    if (dimensions) {
      if (dimensions.width) {
        urlBuilder = urlBuilder.width(Math.round(dimensions.width));
      }
      if (dimensions.height) {
        urlBuilder = urlBuilder.height(Math.round(dimensions.height));
      }
      urlBuilder = urlBuilder.quality(dimensions.quality || 90);
    }

    return urlBuilder?.url();
  // }

  return undefined;
};

export const urlForVideo = (source: any) => {
  // If source is already a URL string, return it directly
  if (typeof source === 'string' && source.startsWith('http')) {
    return source;
  }

  // If source is an object with url property (from Sanity asset)
  if (typeof source === 'object' && source?.url) {
    return source.url;
  }

  // If source is a Sanity asset reference
  if (typeof source === 'object' && source?.asset?._ref) {
    // For video assets, we need to construct the URL manually
    // since Sanity doesn't have a built-in video URL builder like images
    const assetId = source.asset._ref.replace('file-', '').replace('-mp4', '');
    return `https://cdn.sanity.io/files/${projectId}/${dataset}/${assetId}.mp4`;
  }

  // If source is a string asset reference
  if (typeof source === 'string' && source.startsWith('file-')) {
    const assetId = source.replace('file-', '').replace('-mp4', '');
    return `https://cdn.sanity.io/files/${projectId}/${dataset}/${assetId}.mp4`;
  }

  return undefined;
};