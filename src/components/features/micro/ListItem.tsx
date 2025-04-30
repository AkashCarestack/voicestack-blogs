import { PortableText, PortableTextReactComponents } from '@portabletext/react';
import React from 'react'
import H3 from '~/components/typography/H3'
import Paragraph from '~/components/typography/Paragraph'
import useMediaQuery from '~/utils/mediaQuery'

export default function ListItem(props) {
  const startPoint = props.index * (100/props.numberOfItems)
  const endPoint = (props.index+1) * (100/props.numberOfItems)
  const actualPercentScrolled = props.percentScrolled> 0 ?((props.percentScrolled-startPoint)/(endPoint-startPoint))*100 : 0
  const liRef = React.useRef(null)
  const isMobile: any = useMediaQuery(767);

  const customComponents: Partial<PortableTextReactComponents> = {
    block: {
      normal: ({ children }) => <span className="your-custom-class">{children}</span>,
    },
  };

  return (
    <li  onClick={() => props.onClick(props.percentScrolled,props.index,liRef)} className={`group flex w-full gap-3 md:cursor-auto cursor-pointer rounded-lg ${props.showDesc ? "bg-vs-blue/10" : 'bg-vs-blue/0'}`}>
      <div className='bg-gray-200 w-1 rounded-full flex'>
        <div ref={liRef} style={{height: isMobile ? '100%' : `${actualPercentScrolled}%`}} className={`w-1 ${props.showDesc == true ? "bg-vs-blue" : "bg-transparent"} max-h-[100%] h-full rounded-full`}></div>
      </div>
      <div className={`flex flex-col px-2 ${props.showDesc? 'py-3':' '} `}>
        <H3 className={`${props.showDesc? '!text-lg':' opacity-50 h-[1.75rem]'}`}>{props.title}</H3>
        <div className={`overflow-y-hidden ease-linear transform transition-all delay-100 ${props.showDesc ? 'opacity-100 md:h-16':' h-0 opacity-1'}`}>
        {props?.desc && (
          <Paragraph className="flex">
            <PortableText value={props.desc} components={customComponents} />
          </Paragraph>
        )}
        </div>
      </div>
    </li>
  )
}