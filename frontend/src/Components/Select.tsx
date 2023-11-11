import { FC } from 'react';

interface SelectProps extends React.HtmlHTMLAttributes<HTMLSelectElement> {
  required: boolean,
  title: string,
  options: {
    value: string,
    text: string
  }[]
}

const Select: FC<SelectProps> = ({ required, options, title, ...props }) => {
  return (
    <div className='mt-4 w-72'>
      <label className={`font-semibold pl-2`}>
        {title}&ensp;{required && <span className='text-red-600 font-bold'>*</span>}
      </label>
      <select
        {...props}
        required
        className={`
          w-full
          rounded-md
          px-3 
          py-1.5 
          font-sans 
          text-base 
          transition-all 
          focus:text-black
          focus:border-[#542C06]
          border 
          border-[#542C06]
        `}>
        {options.map(({ value, text }, index) => (
          <option value={value} key={index}>{text}</option>
        ))}
      </select>
    </div>
  )
}

export default Select