import React, { useState, useEffect } from 'react';

const Countdown = ({ timestamp }) => {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [hide,setHide] = useState(false)
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Calculate the remaining time
      const now = new Date().getTime();
      const distance = timestamp - now;
      if (distance < 0) {
        setHide(true)
        clearInterval(intervalId);
        return;
      }

      // Update the countdown state
      setCountdown({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timestamp]);


  return hide == true ? (
    null
    ):(
      <div className='flex justify-center items-center w-full'>
 
      <div className='flex justify-between items-center w-full border-[1px] border-slate-600 px-8 rounded-md bg-gradient-to-tl to-slate-800 from-slate-700'>
        <div className='flex justify-center items-center border-l-[1px] border-r-[1px] border-slate-600 py-1 w-full'>{countdown.days} d</div>
        <div className='flex justify-center items-center border-l-[1px] border-r-[1px] border-slate-600 py-1 w-full'>{countdown.hours} h</div>
        <div className='flex justify-center items-center border-l-[1px] border-r-[1px] border-slate-600 py-1 w-full'>{countdown.minutes} m</div>
        <div className='flex justify-center items-center border-l-[1px] border-r-[1px] border-slate-600 py-1 w-full'>{countdown.seconds} s</div>
      </div>
  
      </div>
      )
};

export default Countdown;