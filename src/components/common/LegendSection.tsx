import React from 'react';
import Section from '../structure/Section';
import ImageLoader from './imageLoader/imageLoader';
import SanityImage from '~/components/common/SanityImage';

function LegendSection() {


    const Icons = {
        'Advanced': 'https://cdn.sanity.io/images/76tr0pyh/production/4ce8892bbd32651227b49d338ecccd874a9e41c7-16x17.svg',
        'Does not exist': 'https://cdn.sanity.io/images/76tr0pyh/production/d696a46624ecb39cc509535bccf45114443123ae-17x17.svg',
        'Intermediate': 'https://cdn.sanity.io/images/76tr0pyh/production/de3aa0aefca0fe224cece39b96c97d7b6653c34c-16x16.svg',
        'Basic': 'https://cdn.sanity.io/images/76tr0pyh/production/56d5a7c69402b9a699be24d40a8e3718db0a7595-17x17.svg',
    };

    return (
        <Section id="legend">
            <div className=" w-full pt-4 ">
                <div className="flex flex-wrap pt-2  justify-start items-center border border-gray-300 rounded-md">
                    {Object.entries(Icons).map(([label, url]) => (
                        <div key={label} className="flex gap-1 items-center px-[7px] py-1 flex-shrink-0">
                            <SanityImage alt={label} width={12} height={12} className="w-3 h-3" src={url} />
                            <span className="text-black text-[10px]">{label}</span>
                        </div>
                    ))}
                  <div className=' border-t border-gray-300 w-full px-3 py-2 mt-2'>
                <span className='text-[11px] md:text-sm text-gray-600'>*Data from 3rd Party Services.</span>
                </div>  
                </div>

            </div>
        </Section>
    );
}

export default LegendSection;
