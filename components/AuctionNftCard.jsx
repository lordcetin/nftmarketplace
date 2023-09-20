/* eslint-disable @next/next/no-img-element */
import React from "react";
import {useState,useEffect,Fragment} from "react";
import { motion } from "framer-motion";
import Auction from '../engine/Auction.json';
import { cipherEth, cipherMM, simpleCrypto } from '../engine/configuration';
import Web3Modal from "web3modal";
import { ethers } from 'ethers';
import Token from '../engine/Token.json';
import AudioPlayer from './AudioPlayer'
import { useStateContext } from '../context/StateContext';
import Link from "next/link";
import Countdown from "./Countdown";
import {MdClose} from 'react-icons/md';
import AllBidders from "./AllBidders";
import { useRouter } from "next/router";
import Media from "react-media";
const AuctionNftCard = ({id,username,dbWallet,img,name,tokenId,desc,type,blockchain,price,createdWallet,ownerW,duration,live,biddablity,bidcount,sold}) => {

  const {user,getUser,connectUser,auction,cri,rpc,cipher} = useStateContext();
  const [openModal,setOpenModal] = useState(false)
  const [openBidModal,setBidModal] = useState(false)
  const [period, setPeriod] = useState('')
  const [biddable, setBiddable] = useState('')
  const [timeline, setTimeline] = useState('')
  const [formInput, updateFormInput] = useState({ bidprice: '',})
  const [mumbidders,mumsetbidders] = useState(null);
  const [count,setCount] = useState(15);

  const [sec,setSec] = useState(0);
  const [min,setMin] = useState(0);
  const [hour,setHour] = useState(0);
  const [day,setDay] = useState(0);
  
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault()

    const params = {
      biddable: biddable == 'true',
    }

    if (timeline == 'sec') {
      params.sec = Number(period)
      params.min = 0
      params.hour = 0
      params.day = 0
    } else if (timeline == 'min') {
      params.sec = 0
      params.min = Number(period)
      params.hour = 0
      params.day = 0
    } else if (timeline == 'hour') {
      params.sec = 0
      params.min = 0
      params.hour = Number(period)
      params.day = 0
    } else {
      params.sec = 0
      params.min = 0
      params.hour = 0
      params.day = Number(period)
    }

    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    // let cosmeta = new ethers.Contract(cri,Token,signer);
    // await cosmeta.approve(user,price)
    // await cosmeta.approve(auction,price);

    const contract = new ethers.Contract(auction, Auction, signer)
    const transaction = await contract.offerAuction(tokenId, params.biddable, params.sec, params.min, params.hour, params.day)
    await transaction.wait()
    setOpenModal(false)
    router.reload(window.location.pathname)
  }

const handleBidSubmit = async (e) => {
  e.preventDefault()
  const web3Modal = new Web3Modal()
  const connection = await web3Modal.connect()
  const provider = new ethers.providers.Web3Provider(connection)
  const signer = provider.getSigner()
  let bidprice = ethers.utils.parseUnits(formInput.bidprice, 'ether')
  bidprice = bidprice.toString()
  let cosmeta = new ethers.Contract(cri,Token,signer);
  let gasPrice = new ethers.utils.parseUnits('20','gwei')
  // await cosmeta.approve(user,bidprice)
  // await cosmeta.approve(auction,bidprice);
  const contract = new ethers.Contract(auction, Auction, signer)
  await cosmeta.increaseAllowance(auction, bidprice)//ethers.utils.parseEther(price.toString())
  const transaction = await contract.placeBid(tokenId,{gasPrice:gasPrice,value: bidprice})
  await transaction.wait()
  setBidModal(false)
}

const handleBuy = async () => {

  const web3Modal = new Web3Modal()
  const connection = await web3Modal.connect()
  const provider = new ethers.providers.Web3Provider(connection)
  const signer = provider.getSigner()
  let nftprice = ethers.utils.parseUnits(price, 'ether')
  nftprice = nftprice.toString()
  let cosmeta = new ethers.Contract(cri,Token,signer);
  await cosmeta.approve(user,nftprice)
  await cosmeta.approve(auction,nftprice);
  const auctions = new ethers.Contract(auction, Auction, signer)
  //await cosmeta.increaseAllowance(auction, nftprice)//ethers.utils.parseEther(price.toString())
  const transaction = await auctions.buyAuctionedItem(tokenId, {value: nftprice})
  await transaction.wait()
  router.push('/')
}

  if(openModal == true) {
    return (
      <div className="fixed top-0 left-0 bg-slate-800 w-screen h-screen z-[100000]">
      <MdClose size={30} className="text-slate-400 z-50 cursor-pointer m-7 hover:opacity-50" onClick={() => setOpenModal(false)}/>
        <div className="flex-cols justify-center items-center w-full text-slate-900 px-7">
        <div className="my-3 border-[1px] border-slate-400 rounded-xl overflow-hidden">
        <a>{type == "video/mp4"
        ? <video src={img} autoPlay loop muted/>
        : type == "image/png" || type == "image/jpeg" || type == "image/jpg" || type == "image/svg" || type == "image/webp"
        ? <img className='rounded-t-xl object-cover' src={img} alt={name}/>
        : type == "audio/mp3" ||  type == "audio/ogg" || type == "audio/wav" || type == "audio/mpeg"
        ? <AudioPlayer nft={img} nftname={name}/> : null
        }</a>
      </div>

    <form onSubmit={handleSubmit} className="grid gap-y-2">

    <div>
      <input
      className="w-full bg-slate-800 hover:bg-slate-900 py-2 px-3 rounded-lg border-2 border-slate-700 hover:border-blue-500 text-slate-400"
      type="number"
      name="period"
      min={1}
      placeholder="Days E.g 7"
      onChange={(e) => setPeriod(e.target.value)}
      value={period}
      required
      />
      </div>
      <div>
      <select
      className="w-full bg-slate-800 hover:bg-slate-900 py-2 px-3 rounded-lg border-2 border-slate-700 hover:border-blue-500 text-slate-400"
      name="duration"
      onChange={(e) => setTimeline(e.target.value)}
      value={timeline}
      required
      >
      <option value="" hidden>
        Select Duration
      </option>
      <option value="sec">Seconds</option>
      <option value="min">Minutes</option>
      <option value="hour">Hours</option>
      <option value="day">Days</option>
      </select>
      </div>
      <div>
      <select
      className="w-full bg-slate-800 hover:bg-slate-900 py-2 px-3 rounded-lg border-2 border-slate-700 hover:border-blue-500 text-slate-400"
      name="biddable"
      onChange={(e) => setBiddable(e.target.value)}
      value={biddable}
      required
      >
      <option value="" hidden>
        Select Biddability
      </option>
      <option value={true}>Yes</option>
      <option value={false}>No</option>
      </select>
      </div>
      <div>
      <button className='bg-gradient-to-tr to-slate-900 z-30 border-[1px] border-slate-700 rounded-lg from-slate-900 hover:to-purple-600 hover:from-blue-700 relative w-full h-10 text-slate-400' type="submit">Offer Item</button> 
      </div>
    </form>

      </div>
      </div>
    )
  }

  if(openBidModal == true){
    return (
      <div className="fixed top-0 left-0 bg-slate-800 w-screen h-screen z-[100000]">
      <MdClose size={30} className="text-slate-400 z-50 cursor-pointer m-7 hover:opacity-50" onClick={() => setBidModal(false)}/>
        <div className="flex-cols justify-center items-center w-full text-slate-900 px-7">
        <div className="my-3 border-[1px] border-slate-400 rounded-xl overflow-hidden">
        <a>{type == "video/mp4"
        ? <video src={img} autoPlay loop muted/>
        : type == "image/png" || type == "image/jpeg" || type == "image/jpg" || type == "image/svg" || type == "image/webp"
        ? <img className='rounded-t-xl object-cover' src={img} alt={name}/>
        : type == "audio/mp3" ||  type == "audio/ogg" || type == "audio/wav" || type == "audio/mpeg"
        ? <AudioPlayer nft={img} nftname={name}/> : null
        }</a>
      </div>

      <form onSubmit={handleBidSubmit} className="grid gap-y-2">
      <div>
      <input
      className="w-full bg-slate-800 hover:bg-slate-900 py-2 px-3 rounded-lg border-2 border-slate-700 hover:border-blue-500 text-slate-400"
      type="number"
      name="bidprice"
      step={0.01}
      min={0.01}
      placeholder="Price (CRI)"
      onChange={e => updateFormInput({ ...formInput, bidprice: e.target.value })}
      value={formInput.bidprice}
      required
    />
      </div>
      <div>
      <button className='bg-gradient-to-tr to-slate-900 z-30 border-[1px] border-slate-700 rounded-lg from-slate-900 hover:to-purple-600 hover:from-blue-700 relative w-full h-10 text-slate-400' type="submit">Place Bid</button> 
      </div>

      </form>
          <AllBidders tokenId={tokenId} winner={winner} duration={duration}/>
      </div>
      </div>
    )
  }

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
    
      <div className="w-[300px] text-slate-400 block">
    
        <a>
          <div className='cursor-pointer pb-3 border-slate-800 border-r-slate-700 rounded-xl bg-gradient-to-tr to-slate-600 from-slate-900 overflow-hidden border-2 hover:shadow-2xl hover:shadow-blue-900 '>
          <Link href={`/details/${id}`}>{type == "video/mp4"
          ? <video src={img} autoPlay loop muted/>
          : type == "image/png" || type == "image/jpeg" || type == "image/jpg" || type == "image/svg" || type == "image/webp"
          ? <img className='rounded-t-xl object-cover' src={img} alt={name}/>
          : type == "audio/mp3" ||  type == "audio/ogg" || type == "audio/wav" || type == "audio/mpeg"
          ? <AudioPlayer nft={img} nftname={name}/> : null
          }</Link>
              
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
              <h5 className='flex gap-x-2 text-sm my-3'><strong>Price : </strong><span>{price}</span></h5>
              <h5 className='flex gap-x-2 text-sm my-3'><strong>Owner : </strong><span>{ownerW.slice(0,5) + '...' + ownerW.slice(38)}</span></h5>
              <div className="my-3">
                <Countdown timestamp={duration + '000'} />
              </div>
              <div className='flex justify-center items-center'>
              <div className='w-full'>
              {biddablity == true ? (
                  <div>
                  {winner == user && Date.now > duration ? <button className='bg-gradient-to-tr to-slate-900 z-30 border-[1px] border-slate-700 rounded-lg from-slate-900 hover:to-purple-600 hover:from-blue-700 relative w-full h-10 text-slate-400' onClick={() => setBidModal(true)}>Claim</button> : null}
                  {sold == true ? null : <button className='bg-gradient-to-tr to-slate-900 z-30 border-[1px] border-slate-700 rounded-lg from-slate-900 hover:to-purple-600 hover:from-blue-700 relative w-full h-10 text-slate-400' onClick={() => setBidModal(true)}>Place Bid</button>}
                  </div>
                  )
              : <button className='bg-gradient-to-tr to-slate-900 z-30 border-[1px] border-slate-700 rounded-lg from-slate-900 hover:to-purple-600 hover:from-blue-700 relative w-full h-10 text-slate-400' onClick={() => setOpenModal(true)}>Start Offer</button>
              }
              </div>
              </div>
            
            </div>
          </div>
        </a>
      </div>
      
            </Fragment>
          }
          {matches.medium &&
            <Fragment>
    
      <div className="w-[300px] text-slate-400 block">
    
        <a>
          <div className='cursor-pointer pb-3 border-slate-800 border-r-slate-700 rounded-xl bg-gradient-to-tr to-slate-600 from-slate-900 overflow-hidden border-2 hover:shadow-2xl hover:shadow-blue-900 '>
          <Link href={`/details/${id}`}>{type == "video/mp4"
          ? <video src={img} autoPlay loop muted/>
          : type == "image/png" || type == "image/jpeg" || type == "image/jpg" || type == "image/svg" || type == "image/webp"
          ? <img className='rounded-t-xl object-cover' src={img} alt={name}/>
          : type == "audio/mp3" ||  type == "audio/ogg" || type == "audio/wav" || type == "audio/mpeg"
          ? <AudioPlayer nft={img} nftname={name}/> : null
          }</Link>
              
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
              <h5 className='flex gap-x-2 text-sm my-3'><strong>Price : </strong><span>{price}</span></h5>
              <h5 className='flex gap-x-2 text-sm my-3'><strong>Owner : </strong><span>{ownerW.slice(0,5) + '...' + ownerW.slice(38)}</span></h5>
              <div className="my-3">
                <Countdown timestamp={duration + '000'} />
              </div>
              <div className='flex justify-center items-center'>
              <div className='w-full'>
              {biddablity == true ? (
                  <div>
                  {winner == user && Date.now > duration ? <button className='bg-gradient-to-tr to-slate-900 z-30 border-[1px] border-slate-700 rounded-lg from-slate-900 hover:to-purple-600 hover:from-blue-700 relative w-full h-10 text-slate-400' onClick={() => setBidModal(true)}>Claim</button> : null}
                  {sold == true ? null : <button className='bg-gradient-to-tr to-slate-900 z-30 border-[1px] border-slate-700 rounded-lg from-slate-900 hover:to-purple-600 hover:from-blue-700 relative w-full h-10 text-slate-400' onClick={() => setBidModal(true)}>Place Bid</button>}
                  </div>
                  )
              : <button className='bg-gradient-to-tr to-slate-900 z-30 border-[1px] border-slate-700 rounded-lg from-slate-900 hover:to-purple-600 hover:from-blue-700 relative w-full h-10 text-slate-400' onClick={() => setOpenModal(true)}>Start Offer</button>
              }
              </div>
              </div>
            
            </div>
          </div>
        </a>
      </div>
      
            </Fragment>
          }
          {matches.large &&
            <Fragment>
    
      <div className="w-[300px] text-slate-400">
    
          <div className='cursor-pointer h-[550px] pb-3 border-slate-800 border-r-slate-700 rounded-xl bg-gradient-to-tr to-slate-600 from-slate-900 overflow-hidden border-2'>
          <div className="flex justify-center items-center">{type == "video/mp4"
          ? <video src={img} autoPlay loop muted className="h-[300px] flex justify-center items-center object-cover overflow-hidden"/>
          : type == "image/png" || type == "image/jpeg" || type == "image/jpg" || type == "image/svg" || type == "image/webp"
          ? <img className='rounded-t-xl w-[300px] h-[300px] flex justify-center items-center object-cover overflow-hidden' src={img} alt={name}/>
          : type == "audio/mp3" ||  type == "audio/ogg" || type == "audio/wav" || type == "audio/mpeg"
          ? <AudioPlayer nft={img} nftname={name}/> : null
          }</div>
              
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
              <h5 className='flex gap-x-2 text-sm my-3'>{desc.slice(0,38)}</h5>
              <h5 className='flex gap-x-2 text-sm my-3'><strong>Price : </strong><span>{price}</span></h5>
              <h5 className='flex gap-x-2 text-sm my-3'><strong>Owner : </strong><span>{ownerW.slice(0,5) + '...' + ownerW.slice(38)}</span></h5>
              <div className="my-3">
                <Countdown timestamp={duration + '000'} />
              </div>
              {duration +'000' < Date.now() ? "Auction bitti" : "Auction devam ediyor"}
            </div>
          </div>
          <div className='flex justify-center items-center'>
          <div className='w-full'>
          {biddablity == true ? (
              <div>
              {winner == user && Date.now > duration ? <button className='relative bottom-3 bg-gradient-to-tr to-slate-900 z-30 border-[1px] border-slate-700 rounded-lg from-slate-900 hover:to-purple-600 hover:from-blue-700 w-full h-10 text-slate-400' onClick={() => setBidModal(true)}>Claim</button> : null}
              {sold == false 
                ? <button className='relative bottom-3 bg-gradient-to-tr to-slate-900 z-30 border-[1px] border-slate-700 rounded-b-lg from-slate-900 hover:to-purple-600 hover:from-blue-700 w-full h-10 text-slate-400' onClick={() => setBidModal(true)}>Place Bid</button> 
                : <button className='relative bottom-3 bg-gradient-to-tr to-slate-900 z-30 border-[1px] border-slate-700 rounded-b-lg from-slate-900 hover:to-purple-600 hover:from-blue-700 w-full h-10 text-slate-400' onClick={handleBuy}>Buy</button>
              }
    
              </div>
              )
          : <button className='relative bottom-3 bg-gradient-to-tr to-slate-900 z-30 border-[1px] border-slate-700 rounded-b-lg from-slate-900 hover:to-purple-600 hover:from-blue-700 w-full h-10 text-slate-400' onClick={() => setOpenModal(true)}>Start Offer</button>
          }
          </div>
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

export default AuctionNftCard;
