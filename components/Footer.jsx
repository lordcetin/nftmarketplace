import React, { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from '../public/logo.png';
import Media from "react-media";
import {BsTelegram,BsTwitter} from 'react-icons/bs'
const Footer = () => {
  return (
    <div>
    <Media queries={{
      small: "(max-width: 599px)", // < 600px
      medium: "(min-width: 1024px) and (max-width: 1366px)", // < 1366px
      large: "(min-width: 1400px)" // >= 1400px

    }}>
    {matches => (
      <Fragment>

        {matches.small &&
          <Fragment>
      <div className="flex-col justify-center items-center px-7 w-full relative bottom-0 border-t-[1px] border-slate-800 bg-slate-900">
      <div className="flex justify-between items-center w-full py-5">

        <div className="flex-col justify-between items-center w-full">
      
        <div className="flex justify-start items-center w-full">
          <Image src={logo} alt="Cosmeta INC" width={150} height={10} className="object-cover" />
        </div>

        <div className="text-[12px] mt-2 text-slate-500">
          <span>254 Chapman Rd, Ste 208 <br/>#7267
          Newark, DE 19702</span>
        </div>

        </div>

        <div className="flex-col justify-between items-center w-full">

        <div className="flex justify-center items-center w-full py-2">
          <h1 className="text-sm font-bold text-slate-500">NFT Marketplace</h1>
        </div>

        <div className="flex justify-center items-center w-full">
          <div className="flex items-center text-slate-500 gap-x-2">
            <BsTelegram className="hover:text-white"/><BsTwitter className="hover:text-white"/>
          </div>
        </div>

        </div>

      </div>
      <div className="flex justify-center items-center text-center text-sm text-slate-500 border-t-[1px] border-slate-800">
      <div className="py-1"><span>Cosmeta &copy; All rights reserved. Dev. <a href="https://ernestsoft.net/" className="border-b-[1px] border-slate-500 text-[11px]">ERNESTSOFT</a></span></div>
      </div>
      </div>
          </Fragment>
        }

        {matches.medium &&
          <Fragment>
      <div className="flex-col justify-center items-center px-7 w-full relative bottom-0 border-t-[1px] border-slate-800 bg-slate-900">
      <div className="flex justify-between items-center w-full py-5">

        <div className="flex-col justify-between items-center w-full">
      
        <div className="flex justify-start items-center w-full">
          <Image src={logo} alt="Cosmeta INC" width={150} height={10} className="object-cover" />
        </div>

        <div className="text-[12px] mt-2 text-slate-500">
          <span>254 Chapman Rd, Ste 208 <br/>#7267
          Newark, DE 19702</span>
        </div>

        </div>

        <div className="flex-col justify-between items-center w-full">

        <div className="flex justify-center items-center w-full py-2">
          <h1 className="text-sm font-bold text-slate-500">NFT Marketplace</h1>
        </div>

        <div className="flex justify-center items-center w-full">
          <div className="flex items-center text-slate-500 gap-x-2">
            <BsTelegram className="hover:text-white"/><BsTwitter className="hover:text-white"/>
          </div>
        </div>

        </div>

      </div>
      <div className="flex justify-center items-center text-center text-sm text-slate-500 border-t-[1px] border-slate-800">
      <div className="py-1"><span>Cosmeta &copy; All rights reserved. Dev. <a href="https://ernestsoft.net/" className="border-b-[1px] border-slate-500 text-[11px]">ERNESTSOFT</a></span></div>
      </div>
      </div>
          </Fragment>
        }

        {matches.large &&
          <Fragment>
      <div className="flex-col justify-center items-center px-7 w-full relative bottom-0 border-t-[1px] border-slate-800 bg-slate-900">
      <div className="flex justify-between items-center w-full py-5">

        <div className="flex-col justify-between items-center w-full">
      
        <div className="flex justify-start items-center w-full">
          <Image src={logo} alt="Cosmeta INC" width={150} height={10} className="object-cover" />
        </div>

        <div className="text-[12px] mt-2 text-slate-500">
          <span>254 Chapman Rd, Ste 208 <br/>#7267
          Newark, DE 19702</span>
        </div>

        </div>

        <div className="flex-col justify-between items-center w-full">

        <div className="flex justify-center items-center w-full py-2">
          <h1 className="text-sm font-bold text-slate-500">NFT Marketplace</h1>
        </div>

        <div className="flex justify-center items-center w-full">
          <div className="flex items-center text-slate-500 gap-x-6">
            <BsTelegram className="hover:text-white cursor-pointer"/><BsTwitter className="hover:text-white cursor-pointer"/>
          </div>
        </div>

        </div>

      </div>
      <div className="flex justify-center items-center text-center text-sm text-slate-500 border-t-[1px] border-slate-800">
      <div className="py-1"><span>Cosmeta &copy; All rights reserved. Dev. <a href="https://ernestsoft.net/" className="border-b-[1px] border-slate-500 text-[11px]">ERNESTSOFT</a></span></div>
      </div>
      </div>
          </Fragment>
        }

      </Fragment>
      )}
    </Media>
    </div>
    );
};

export default Footer;
