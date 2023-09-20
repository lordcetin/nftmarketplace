import React from "react";
import notfound from '../images/notfound.gif'
import Image from "next/image";
import { Fragment } from "ethers/lib/utils";
import Head from 'next/head';
const NotFound = () => {
  return (
    <Fragment>
    <Head>
    <title>404 • Cosmeta NFT Marketplace</title>
    </Head>
    <div className="flex justify-center items-center bg-[#040204] w-full h-screen overflow-hidden">
    <div className="">
    <Image src={notfound} alt="" className="" />
    </div>
    </div>
    </Fragment>
    );
};

export default NotFound;
