export default function IconBadge({
  icon,
  currentColor = "#4A3CE1",
}: {
  icon?: string
  currentColor?: string
}) {
  return (
    <div className=" rounded-[6666px] transition-all duration-300 ease-in-out group-hover:border-white/20 group-hover:bg-gradient-to-l group-hover:from-[#4A3CE1] group-hover:to-[#CAC5FF] group-hover:backdrop-blur-[5.33px] border-0 border-white/40 bg-[#E0DDFF] backdrop-blur-[5.33px] py-3 px-6 w-fit">
      <svg 
        className="w-6 h-6 transition-colors duration-300 ease-in-out group-hover:text-white" 
        style={{ color: currentColor }}
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  )
}
    