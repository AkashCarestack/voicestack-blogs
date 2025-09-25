export default function IconBadge({
  icon,
  currentColor,
}: {
  icon?: string
  currentColor?: string
}) {
  return (
    <div className=" rounded-[6666px] transition-all duration-300 ease-in-out group-hover:border-white/20 group-hover:bg-gradient-to-l group-hover:from-[#4A3CE1] group-hover:to-[#CAC5FF] group-hover:backdrop-blur-[5.33px] border-0 border-white/40 bg-[#E0DDFF] backdrop-blur-[5.33px] py-3 px-6 w-fit">
    {icon && <span dangerouslySetInnerHTML={{ __html: icon }} className="text-[#1E2939] group-hover:text-white" ></span>}
    </div>
  )
}
    