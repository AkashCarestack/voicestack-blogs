import React from 'react'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import Container from '../structure/Container'
import Section from '../structure/Section'
import H1 from '../typography/H1'
import { urlForImage } from '~/lib/sanity.image'
import Link from 'next/link'
import AppleIcon from '../../../public/assets/AppleIcon'
import PlayIcon from '../../../public/assets/PlayIcon'
import FeatureHero from '~/v2/sections/FeatureHero'

interface AppDownloadHeroProps {
  data: any
  slugData?: any
}

const AppDownloadHero: React.FC<AppDownloadHeroProps> = ({ data }) => {
  if (!data) return null

  const {
    heroStrip,
    heroheading,
    heroDescription,
    heroImage,
    heroImageSecondary,
    
  } = data
  const appStoreLinks = data?.contentArea[0]?.appStoreLinks || null
  return (
    <>
      <FeatureHero
        data={{
          heroStrip,
          heroheading,
          heroDescription,
          heroImage: heroImage || heroImageSecondary,
          bookBtnContent: null,
        }}
        type="feature"
        isCentered={true}
        pageType={'download-app'}
        appStoreLinks={appStoreLinks}
      />
    </>
  )
}

export default AppDownloadHero

