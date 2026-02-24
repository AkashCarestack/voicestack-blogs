import React from 'react';
import { defineArrayMember, defineType } from 'sanity';
import { HighlightIcon } from '@sanity/icons';

const HighlightDecorator = (props) => (
  <span style={{ backgroundColor: 'yellow' }}>{props.children}</span>
);

export default defineType({
  title: 'Portable Content Area',
  name: 'portableContent',
  type: 'array',
  of: [
    defineArrayMember({
      title: 'Block',
      type: 'block',
      styles: [{ title: 'Normal', value: 'normal' }],
      marks: {
        decorators: [
          {
            title: 'Highlight',
            value: 'highlight',
            component: HighlightDecorator,
            icon: HighlightIcon, 
          },
        ],
        annotations: [], 
      },
      lists: [], 
      options: {
        spellCheck: true,
      },
    }),
    defineArrayMember({
      type: 'htmlCode',
      name: 'portableHtmlCodeBlock',
    }),
  ],
});
