import React, { useState,useEffect } from "react";
import { MdVisibilityOff, MdVisibility } from 'react-icons/md'

const Input = ({label,type = "text",name = "",id = "",...props}) => {

    const [show,setShow] = useState(false);
    const [inputType,setType] = useState(type)

    useEffect(() => {
        if(show) {
            setType('text')
        }else if(type == "password"){
            setType('password')
        }

    }, [show]);
    

  return (
    <>
    <label htmlFor={label} className="block relative w-full">
    <input required={true} type={inputType} name={name} id={id} className="peer valid:pt-4 transition-all ease-linear w-full bg-slate-800 my-2 py-2 px-4 rounded-lg text-slate-400 placeholder:text-slate-600 outline-none active:border-2 active:border-blue-500 focus:border-blue-500 border-2 border-transparent hover:border-2 hover:border-blue-500 " {...props}/>
    <small className="absolute left-4 top-1/2 -translate-y-1/2 text-lg cursor-text pointer pointer-events-none text-slate-600 antialiased peer-valid:text-sm peer-valid:top-1/3 transition-all ease-linear">{label}</small>
    {type == 'password' && props?.value && (
        <div onClick={() => setShow(!show)} className="absolute top-0 right-3 h-full flex items-center select-none">
             {show ? <MdVisibilityOff size={20} className="cursor-pointer"/>
             : <MdVisibility size={20} className="cursor-pointer"/>}
        </div>    
    )}
    </label>
    </>
    );
};

export default Input;
