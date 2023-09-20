import React,{useState} from "react";
import {AiOutlineLoading} from 'react-icons/ai'
const Loading = () => {
  const [show,setShow] = useState(true)
  setTimeout(() => {
    setShow(false)
  }, 2000);
  return <div>{show ? <div className="fixed w-screen h-screen top-0 left-0 flex text-center justify-center items-center">{show ? <span className="flex justify-center items-center"><AiOutlineLoading size={80} className="animate-spin"/></span> : null}</div>:null}</div>;
};

export default Loading;
