import { useRef } from 'react'
import {MdRefresh} from "react-icons/md"

const RestartButton = ({
    onRestart: handelRestart ,
    className =   "",
} : {
    onRestart: () => void,
    className?: string
}) => {

  const buttonRef = useRef<HTMLButtonElement>(null);  
  const handelClick = () => {
      buttonRef?.current?.blur();
      handelRestart();
  }
  return (
      <div className='flex w-full item-center justify-center'>
        <button
          onClick={handelClick}
          ref={buttonRef}
          className={`block rounded text-slate-500 ${className}`} >
         <MdRefresh className='w-6 h-6' />
            </button>
      </div>
  )
}

export default RestartButton