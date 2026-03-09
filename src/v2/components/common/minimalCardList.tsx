import Link from 'next/link'

const MinimalCardList = ({ data }: { data: any }) => {
  return (
    <div className="flex flex-col gap-3 bg-white md:py-8 py-6 md:px-6 px-6 md:rounded-[24px] rounded-lg">
      <h4 className="md:text-2xl text-xl font-bold text-gray-950 leading-[133.33%] font-manrope">
        {data?.title}
      </h4>
      <p className="md:text-base text-sm font-normal leading-[150%] text-gray-700">
        {data?.description}
      </p>
      {data?.cta && (
        <Link
          href={data.cta.buttonLink}
          className="leading-6 tracking-normal underline decoration-dotted decoration-[10%] underline-offset-[25%] underline-from-font"
          style={{
            textDecorationSkipInk: 'none',
            textDecorationThickness: '10%',
          }}
        >
          {data.cta.buttonText}
        </Link>
      )}
    </div>
  )
}

export default MinimalCardList
