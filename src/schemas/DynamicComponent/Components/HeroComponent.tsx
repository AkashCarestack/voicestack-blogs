import { heroFields } from '../../heroSchema'

const HeroComponent = {
  name: 'heroComponent',
  title: 'Hero Component',
  type: 'object',
  fields: heroFields,
  preview: {
    select: {
      title: 'heroheading',
      subtitle: 'heroStrip',
      media: 'heroImage',
    },
    prepare(selection: any) {
      const { title, subtitle, media } = selection;
      
      // Extract text from blockContent if it exists
      let displayTitle = 'Hero Component';
      if (title && Array.isArray(title) && title.length > 0) {
        const firstBlock = title[0];
        if (firstBlock.children && firstBlock.children.length > 0) {
          displayTitle = firstBlock.children[0].text || 'Hero Component';
        }
      }
      
      return {
        title: displayTitle,
        subtitle: subtitle || 'No subtitle',
        media,
      };
    },
  },
}

export default HeroComponent
