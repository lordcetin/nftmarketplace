import React from "react";
import { useState,Fragment } from "react";
import Media from "react-media";
import Image from "next/image";
import preloader from '@/images/preloader.gif'
import logo from '@/images/logo.png'
const PreLoader = () => {
  return (
    <div>
    <div className="fixed top-0 left-0 z-[9999] bg-[#00051a] w-full h-full flex justify-center items-center">
    <div className="flex justify-center items-center w-full text-center">
    <div className="flex-col justify-center items-center text-center">
    <Image src={logo} width={300} height={80} alt="Cosmeta" className="justify-center items-center flex w-full relative top-24" />
    <Image src={preloader} className="w-full h-full flex justify-center" alt="Loading" />
{/*      <div className="w-12 h-12 border-t-2 border-b-0 border-l-0 border-r-0 border-purple-500 rounded-full shadow-xl shadow-purple-400 animate-spin">
        &nbsp;
      </div>*/}
    </div>
    </div>
    </div>
    </div>
    );
};

export default PreLoader;
