import Head from "next/head";
import PromoBannerButtonSection from "~/v2/sections/PromoBannerButtonSection";

export default function PromoBannerButtonPreviewPage() {
  return (
    <>
      <Head>
        <title>Promo Banner Button Preview | VoiceStack</title>
      </Head>
      <PromoBannerButtonSection />
      <div className="min-h-[60vh] bg-gray-50 flex items-center justify-center px-4">
        <p className="font-geist text-gray-500 text-center text-sm sm:text-base max-w-md">
          Preview page for the Figma Banner-button component. Page content would
          render below the banner.
        </p>
      </div>
    </>
  );
}
