import clsx from 'clsx'
import React from 'react'

type ButtonRadioOption = {
  value: string
  label: string
}

interface ButtonRadioGroupProps {
  name: string
  value: string
  options: ButtonRadioOption[]
  onChange: (value: string) => void
  columns?: 1 | 2
}

const ButtonRadioGroup: React.FC<ButtonRadioGroupProps> = ({
  name,
  value,
  options,
  onChange,
  columns = 2,
}) => {
  const gridClass = columns === 1 ? 'grid-cols-1' : 'grid-cols-2'

  return (
    <div className={clsx('grid gap-3 font-geist w-full', gridClass)}>
      {options.map((option) => {
        const isChecked = value === option.value

        return (
          <label
            key={option.value}
            className={clsx(
              'group w-full min-w-0 rounded-lg border md:px-4 px-2 md:py-3 py-2 flex items-center gap-2 cursor-pointer transition-colors',
              isChecked
                ? 'bg-[rgba(138,223,83,0.15)] border-[#8adf53] hover:bg-[rgba(138,223,83,0.22)]'
                : 'bg-white border-gray-200 hover:border-[#8adf53]'
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={isChecked}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            <span
              aria-hidden="true"
              className={`transition-colors duration-300 ${isChecked ? 'text-[#57AC20]' : 'text-gray-300'}`}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M0 9.75C0 4.365 4.365 0 9.75 0C15.135 0 19.5 4.365 19.5 9.75C19.5 15.135 15.135 19.5 9.75 19.5C4.365 19.5 0 15.135 0 9.75ZM13.36 7.936C13.42 7.85605 13.4634 7.76492 13.4877 7.66795C13.512 7.57098 13.5166 7.47014 13.5014 7.37135C13.4861 7.27257 13.4512 7.17782 13.3989 7.0927C13.3465 7.00757 13.2776 6.93378 13.1963 6.87565C13.1149 6.81753 13.0228 6.77624 12.9253 6.75423C12.8278 6.73221 12.7269 6.72991 12.6285 6.74746C12.5301 6.76501 12.4362 6.80205 12.3523 6.85641C12.2684 6.91077 12.1962 6.98135 12.14 7.064L8.904 11.594L7.28 9.97C7.13783 9.83752 6.94978 9.7654 6.75548 9.76882C6.56118 9.77225 6.37579 9.85097 6.23838 9.98838C6.10097 10.1258 6.02225 10.3112 6.01882 10.5055C6.0154 10.6998 6.08752 10.8878 6.22 11.03L8.47 13.28C8.54699 13.3569 8.6398 13.4162 8.74199 13.4536C8.84418 13.4911 8.95329 13.5059 9.06176 13.4969C9.17023 13.488 9.27546 13.4555 9.37013 13.4019C9.4648 13.3482 9.54665 13.2745 9.61 13.186L13.36 7.936Z" fill="currentColor"/>
              </svg>
            </span>
            <span className="md:text-base text-sm leading-normal font-geist font-medium text-gray-950">{option.label}</span>
          </label>
        )
      })}
    </div>
  )
}

export default ButtonRadioGroup
