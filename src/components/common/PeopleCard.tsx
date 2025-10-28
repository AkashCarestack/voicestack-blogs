import React from 'react'
import LinkedIn from '../icons/LinkedIn'

import H3 from '../typography/H3'
import ImageLoader from './imageLoader/imageLoader'

function PeopleCardHeader({ name, designation, socialMediaLinks }) {
  return (
    <div className="flex flex-row justify-between ">
      <div>
        <H3 className="text-md md:text-lg">{name}</H3>
        <p className="text-sm text-[#F768D1]">{designation}</p>
      </div>
      <div>
        {socialMediaLinks?.Linkedin ? (
          <a href={socialMediaLinks.Linkedin}>
            <LinkedIn className="text-black hover:text-stone-500" />
          </a>
        ) : (
          <LinkedIn className="text-black hover:text-stone-500" />
        )}
      </div>
    </div>
  )
}

function PeopleCard({
  name,
  designation,
  description,
  socialMediaLinks,
  image,
}) {
  return (
    <div className="max-w-xl flex flex-col gap-8 xl:gap-2 xl:flex-row bg-slate-100 p-8 rounded-xl">
      <div className="xl:pr-8 flex justify-start">
        <ImageLoader
          radius={12}
          className="!w-[132px] !h-[132px] !rounded-2xl"
          image={image}
        />
      </div>
      <div className="flex flex-col gap-3">
        <PeopleCardHeader {...{ name, designation, socialMediaLinks }} />
        <div>
          <p className="text-gray-600 text-[16px]">{description}</p>
        </div>
      </div>
    </div>
  )
}

export default PeopleCard
