import Link from "next/link";
import { cn } from "~/lib/utils";

export interface PromoBannerButtonSectionProps {
  className?: string;
  demoLink?: string;
}

const HARDCODED_COPY = {
  prefix: "Unlock ",
  highlight: "up to $50,000",
  suffix: " in added revenue per location per month. ",
  cta: "Book a demo to learn how.",
} as const;

export default function PromoBannerButtonSection({
  className,
  demoLink = "/demo",
}: PromoBannerButtonSectionProps) {
  return (
    <Link
      href={demoLink}
      className={cn(
        "group block w-full bg-vs-purple hover:bg-[#3d32c4] transition-colors duration-200",
        "flex items-center justify-center px-4 sm:px-6 py-6 sm:py-8 cursor-pointer",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
        className
      )}
      aria-label={`${HARDCODED_COPY.prefix}${HARDCODED_COPY.highlight}${HARDCODED_COPY.suffix}${HARDCODED_COPY.cta}`}
    >
      <p className="font-geist font-normal text-center text-white text-[20px] leading-6 sm:text-lg sm:leading-8 lg:text-2xl lg:leading-9 max-w-[1120px] pointer-events-none">
        <span>{HARDCODED_COPY.prefix}</span>
        <span className="bg-[#efb100] text-[#894b00] px-1 sm:px-1.5 box-decoration-clone group-hover:bg-[#f5c233] transition-colors duration-200">
          {HARDCODED_COPY.highlight}
        </span>
        <span>{HARDCODED_COPY.suffix}</span>
        <span className="underline decoration-solid underline-offset-[3px]">
          {HARDCODED_COPY.cta}
        </span>
      </p>
    </Link>
  );
}
