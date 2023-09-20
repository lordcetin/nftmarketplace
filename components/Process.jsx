import React from 'react'
import {AiOutlineLoading3Quarters} from 'react-icons/ai'
const Process = () => {
  return (
    <div className='bg-black fixed top-0 left-0 w-screen h-screen z-[9999] opacity-80'>
    <div className='flex justify-center items-center w-full'>
    <div className='flex justify-center items-center'>
    <div className='flex-col relative top-52 justify-center items-center'>
    <div className="flex justify-center items-center w-fulll my-10">
    <AiOutlineLoading3Quarters size={80} className="animate-spin"/>
    </div>
    <h1 className='text-5xl font-black w-80'>Please do not leave or close this page!<span className='w-10 h-10 border-tb-2 rounded-full animate-spin'>&nbsp;</span></h1>
    <p className='w-80 text-2xl my-3'>When the metamask signature process is finished,we will direct you to the home page.</p>
    </div>
    </div>
    </div>
    </div>
  )
}

export default Process