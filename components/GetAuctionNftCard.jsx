/* eslint-disable @next/next/no-img-element */
import {useState,useEffect} from "react";
import { motion } from "framer-motion";
import Auction from '../engine/Auction.json';
import Web3Modal from "web3modal";
import { ethers } from 'ethers';
import Token from '../engine/Token.json';
import AudioPlayer from './AudioPlayer'
import { useStateContext } from '../context/StateContext';
import Link from "next/link";
import Countdown from "./Countdown";
import {MdClose} from 'react-icons/md';
import { cipherMM} from '../engine/configuration';

const GetAuctionNftCard = ({id,username,dbWallet,img,name,tokenId,desc,type,blockchain,price,createdWallet,ownerW,duration,live,biddablity,bids,sold}) => {
  const {user,getUser,connectUser,auction,cri,rpc} = useStateContext();

  return (

    <div className="w-[300px] text-slate-400">

    <a>
      <div className='cursor-pointer'>
      <Link href={`/details/${id}`}><a>{type == "video/mp4"
      ? <video src={img} autoPlay loop muted/>
      : type == "image/png" || type == "image/jpeg" || type == "image/jpg" || type == "image/svg" || type == "image/webp"
      ? <img className='rounded-t-xl object-cover' src={img} alt={name}/>
      : type == "audio/mp3" ||  type == "audio/ogg" || type == "audio/wav" || type == "audio/mpeg"
      ? <AudioPlayer nft={img} nftname={name}/> : null
      }</a></Link>
          
        <div className='flex-col px-5'>
        <div className='flex justify-between items-center w-full my-3'>
          <div className="flex justify-start items-center w-full">
            <h3 className="text-md font-medium text-purple-500">{createdWallet == user ? 'Created by You' : `${username}`}</h3>
          </div>
          <div className='justify-end items-center w-full'>
          <h3 className='font-medium text-sm text-center bg-slate-800 text-slate-500 py-1 px-3 rounded-md'>Token ID : {tokenId}</h3>
          </div>
          </div>
          <h5 className='flex gap-x-2 text-lg font-bold my-3'>{name}</h5>
          <h5 className='flex gap-x-2 text-sm my-3'>{desc}</h5>
          {live == true && duration > Date.now() ? (
            <Countdown timestamp={duration} />
          ) : (
            '00:00:00'
          )}
          <h5 className='flex gap-x-2 text-sm my-3'><strong>Price : </strong><span>{price}</span></h5>
          <h5 className='flex gap-x-2 text-sm my-3'><strong>Owner : </strong><span>{ownerW.slice(0,5) + '...' + ownerW.slice(38)}</span></h5>
        
          <div className='flex justify-center items-center'>
          <div className='w-full'>
            
          </div>
          </div>
        
        </div>
      </div>
    </a>
  </div>

    );
};

export default GetAuctionNftCard;
