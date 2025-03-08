export const CoundownTimer  = ({timeLeft} : {timeLeft : number}) => {
    return <div className='text-primary-400 font-medium'>
      Time : {timeLeft}
    </div>
  }