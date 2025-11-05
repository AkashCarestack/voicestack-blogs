export default function CardsList({ data }: { data: any }) {
    return (
        <div className="flex md:flex-row flex-col gap-6">
          {data?.items?.map((item: any) => {
            return (
              <div
                key={item._key}
                className="flex bg-[#F4F3FA] flex-col items-start md:rounded-[24px] rounded-[12px] text-left md:p-6 p-4"
              >
                <div
                  className="w-auto md:mb-6 mb-4 bg-[#E0DDFF] md:px-6 px-4 md:py-3 py-2 rounded-full"
                  dangerouslySetInnerHTML={{ __html: item.dynamicSvg }}
                />
                <h3 className="md:text-lg w-full text-base font-bold leading-[120%] text-gray-950">
                  {item.heading}
                </h3>
                <p className="leading-[150%] text-gray-700 md:text-base text-sm mt-2">
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>
    )
}