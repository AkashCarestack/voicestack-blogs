import Anchor from "~/components/common/anchor";
import React from "react";

interface EventStripProps {
  href?: string;
  target?: string;
  className?: string;
  logo?: React.ReactNode;
  variant?: "green" | "white";
  isMobile?: boolean;
}

const EventStrip: React.FunctionComponent<EventStripProps> = ({
  href = "#",
  target,
  className = "",
  logo,
  variant = "green",
  isMobile = false,
}) => {
  const isGreen = variant === "green";
  return (
    <div className={`flex items-center ${className}`}>
      <Anchor
        href={href}
        target={target}
        prefetch={false}
        aria-label="Get Early Bird Tickets for Inner Circle 2027"
        className={`group relative inline-flex max-w-full overflow-hidden rounded-[6px] px-4 lg:px-[6px] py-[4px] text-[13px] font-medium leading-snug no-underline transition-colors duration-200 border-solid ${isGreen ? "bg-white/10 hover:bg-white/20 border border-white/20" : "bg-[rgba(21,45,24,0.05)] hover:bg-black/10 border border-black/10"}`}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 -left-full w-1/2 animate-shine bg-gradient-to-r from-transparent to-transparent ${isGreen ? "via-white/25" : "via-white"}`}
        />

        <span className={`relative z-[1] flex min-w-0 items-center justify-center gap-2 `}>
            {isMobile && (
              <span className="flex shrink-0 items-center justify-center">
                {logo}
              </span>
            )}
            <div className={`flex ${isMobile ? "flex-col" : "flex-row gap-2"}`}>
              <span className="flex min-w-0 items-center gap-[6px]">

                {!isMobile && (
                  <span className="flex h-[21.77px] w-[21.77px] shrink-0 items-center justify-center rounded-[4px]">
                    {logo}
                  </span>
                )}

                <span className={`min-w-0 text-[16px] lg:text-[13px] ${isGreen ? "text-white" : "text-black"}`}>
                  {isMobile ? (
                    "Inner Circle 2027"
                  ) : (
                    <div className="">
                      Inner Circle 2027 - Go Unbound
                      <span className={`px-[6px] hidden xl:inline ${isGreen ? "text-white/50 group-hover:text-white/60" : "text-black/50 group-hover:text-black/60"}`}>{"\u2022"}</span>
                      <span className={`hidden xl:inline ${isGreen ? " text-white/50 group-hover:text-white/60" : "text-black/50 group-hover:text-black/60"}`}>Jan 21-23 in Orlando, FL</span>
                    </div>
                  )}
                </span>
              </span>

              <span className="flex lg:hidden xl:flex font-normalshrink-0 items-center gap-[2px] whitespace-nowrap text-black/50 lg:text-[#84BD00]">
                <span>Get Early Bird Tickets</span>
                {!isMobile && (
                <svg
                  className="opacity-50 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 12L10 8L6 4"
                    stroke="#84BD00"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                )}
              </span>
            </div>
        </span>
      </Anchor>
    </div>
  );
};

export default EventStrip;
