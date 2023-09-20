import Link from 'next/link'
import React from 'react'
import af from '@/images/af.jpg';
import Image from 'next/image';

const Loginmodal = ({setLoginModal}) => {
    
  return (
    <div className='flex justify-center items-center w-full h-screen fixed z-[999] backdrop-blur-sm transition-all duration-300 ease-in-out text-slate-950'>
    
    <div className='flex-col grid  items-center w-[500px] bg-white z-50 rounded-xl shadow-2xl shadow-slate-950'>
    <div className='flex justify-between items-center w-full border-b border-slate-300'>
    <div className='flex justify-start items-center p-3 w-full'>
    <span className='bg-red-500 w-4 h-4 flex justify-center items-center font-semibold antialiased rounded-full cursor-pointer' title='Close' onClick={() => setLoginModal(false)}>&nbsp;</span>
    </div>
    <div className='flex justify-end items-center p-3 w-full'>
    Login & Register
    </div>
    </div>

    <div className='flex-col grid p-7 justify-center items-center w-full'>
    <div className='mb-5'>
    <Image src={af} className='object-cover rounded-xl'/>
    </div>
    <div className='text-center'>
    <h1 className='text-5xl font-bold antialiased text-slate-500'>The Art Royalty</h1>
    <h1 className='text-8xl font-black antialiased text-orange-500'>10%</h1>
    </div>
    <div className='mt-10'>
        <div className=''>If you don't have a Cosmeta account yet, <Link href='/register' className='underline hover:no-underline hover:text-brand-orange'>Register!</Link></div>
        <div>Or <Link href='/login' className='underline hover:no-underline hover:text-brand-orange'>Sign In</Link> if you already have an account!</div>
    </div>
    </div>

    </div>

    </div>
  )
}

export default Loginmodal