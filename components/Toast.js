import React,{useState} from 'react';
import { ToastContainer } from 'react-toastify';
import {AiOutlineCloseCircle} from 'react-icons/ai'
const Toast = ({msg,handleShow,bgColor}) => {
    const [show,setShow] = useState(true);
    setTimeout(() => {
        setShow(false)
    }, 5000);
    return(
        <>
        {show &&
        <div className='flex justify-center items-center w-full z-50 py-2 px-3'>
        <div className={`items-center z-50 w-80 p-2 ${bgColor} bg-gradient-to-tr to-slate-500 from-slate-900 rounded-lg`}>
         <div className='flex justify-between items-center'>

            <div className='flex justify-start items-center w-full'>
                <div className='flex-col'>
                    <h1 className={`${bgColor}`}>{msg.title}</h1>
                </div>
                <span className='px-1 text-3xl font-extralight'>|</span>
                <div className='text-md font-medium mr-3 overflow-hidden'>
                {msg.msg}
                </div>
            </div>

            <div className='flex justify-end items-center w-30'>
                <button className='cursor-pointer' onClick={() => setShow(false)}><AiOutlineCloseCircle size={22} className="text-slate-400 hover:text-white"/></button>
            </div>

         </div>
        </div>
        </div>
        }
        </>
    )
}

export default Toast