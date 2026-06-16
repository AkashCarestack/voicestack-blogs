import Link from 'next/link'

import Header from '~/resources/layout/Header'
import VSfooter from '~/resources/layout/VSfooter'

import { useGlobalData } from './Context/GlobalDataContext'

interface LayoutProps {
  children: React.ReactNode
  fullWidth?: boolean
  className?: string
}

export default function Layout({
  children,
  className,
  fullWidth = false,
}: LayoutProps) {

  const { homeSettings } = useGlobalData();

  return (
    <div
      className={`flex flex-col w-full h-full items-center min-h-[100vh]`}
    >
      <Header />
      <main className="w-full flex flex-col">
      {children}</main>
      <VSfooter className={`w-full flex content-center `} />
    </div>
  )
}
