import SpeakerIcon from '~/resources/assets/reactiveAssets/SoundIcon'

interface CreaterInfoProps {
  creater?: any
  duration?: string
  className?: string
}

const CreaterInfo = ({ creater, duration }: CreaterInfoProps) => {
  if (!creater.length) {
    return null
  }

  return (
    <div className="flex gap-6 text-zinc-500 text-sm lg:text-base font-medium">
      {creater.map((item, index) => (
        <div key={index}>{`by ${item.name}`}</div>
      ))}
      <div className="flex gap-2 items-center">
        <SpeakerIcon className="hidden md:block" />
        <span className="shrink-0">{duration}</span>
      </div>
    </div>
  )
}

export default CreaterInfo
