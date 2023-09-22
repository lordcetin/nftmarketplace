/* eslint-disable @next/next/no-img-element */
import React from 'react';
import next from 'next';
import { ethers } from 'ethers';
import {useState,useEffect, Fragment} from 'react';
import { useRouter } from 'next/router';
import Resell from '../engine/Resell.json';
import NFTCollection from '../engine/NFTCollection.json';
import NFT from '../engine/NFT.json';
import Token from '../engine/Token.json';
import Market from '../engine/Market.json';
import { Card, Button, Input, Dropdown, useSSR} from '@nextui-org/react';
import ConnectChain from '../engine/connectchain';
import axios from 'axios';
import detectEthereumProvider from '@metamask/detect-provider';
import { hhnft, hhresell, hhrpc,hhmarket,hhtoken, cipherHH ,nftContract,displayAmount,key, cipherMM} from '../engine/configuration';
import { sepnft,sepresell,seprpc,septoken,sepmarket,cipherSep } from '../engine/configuration';
//import { goenft,goeresell,goenftcol,goerpc,goetoken,goemarket } from '../engine/configuration';
//import { bsctnft,bsctnftcol,bsctresell,bsctrpc,bsctmarket,bsctoken } from '../engine/configuration';
import { useStateContext } from '../context/StateContext';
import { cipherEth, simpleCrypto } from '../engine/configuration';
import uniqid from 'uniqid';
import {CreatedNfCard} from '../components';
import {AuctionNftCard} from '../components';
import {BuyedNfCard} from '../components';
import {BiRefresh,BiImageAdd} from 'react-icons/bi'
import jwt from 'jsonwebtoken';
import { motion } from 'framer-motion'
import { DataContext } from '../store/GlobalState';
import { useContext } from 'react';
import {MdVerified} from 'react-icons/md';
import {TbMessageCircle2} from 'react-icons/tb';
import {BsInstagram,BsTwitter} from 'react-icons/bs'
import AudioPlayer from '../components/AudioPlayer'
import InfiniteScroll from 'react-infinite-scroll-component';
import Loading from '../components/Loading';
import {create as ipfsHttpClient} from 'ipfs-http-client';
const { Buffer } = require("buffer");
import Auction from '../engine/Auction.json';
import Media from 'react-media';
import Link from 'next/link';
import Web3Modal from "web3modal";
import Countdown from '../components/Countdown';

const PersonalLiveAuction = ({param}) => {
  const {user,getUser,connectUser,auction,cri,rpc} = useStateContext();
  const [openModal,setOpenModal] = useState(false)
  const [openBidModal,setBidModal] = useState(false)
  const [period, setPeriod] = useState('')
  const [biddable, setBiddable] = useState('')
  const [timeline, setTimeline] = useState('')
  const [formInput, updateFormInput] = useState({ bidprice: '',})
  const [liveauction,setLiveAuction] = useState([]);
  const [count,setCount] = useState(15);
  const [wonbidder,setWonBidder] = useState({});
  const [refundedbidder,setRefundedBidder] = useState({});

  const [second,setSec] = useState(0);
  const [minute,setMin] = useState(0);
  const [hours,setHour] = useState(0);
  const [days,setDay] = useState(0);

  const getNFTs = async () => {
    await fetch('http://localhost:3000http://localhost:3000/setnft').then(res => {
      if(!res.ok){
        throw new Error("HTTP ERROR",res.status)
      }
      return res
    }).then(res => res.json()).then(data => {
      setLiveAuction(data.slice(0,`${count}`))
    })
  }
  
  async function loadLiveAuction() {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    let auctioncontract = new ethers.Contract(auction, Auction, signer)
    const data = await auctioncontract.getLiveAuctions()
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await auctioncontract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)

      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        id: meta.data.id,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        winner: i.winner,
        sold:i.sold,
        live:i.live,
        biddable:i.biddable,
        bids:i.bids.toNumber(),
        duration:i.duration.toNumber(),
        image: meta.data.images,
        name: meta.data.name,
        description: meta.data.description,
        type: meta.data.fileType,
        verified:meta.data.role,
        username:meta.data.username,
        avatar:meta.data.avatar,
        wichNet:meta.data.wichNet
      }
      return item
    }))
    setLiveAuction(items.slice(0,`${count}`))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!period || !biddable || !timeline) return

    const params = {
      biddable: biddable == 'true',
    }

    if (timeline == 'sec') {
      params.sec = Number(period)
      setSec(second + Number(period))
      params.min = 0
      params.hour = 0
      params.day = 0
    } else if (timeline == 'min') {
      params.sec = 0
      params.min = Number(period)
      setMin(minute + Number(period))
      params.hour = 0
      params.day = 0
    } else if (timeline == 'hour') {
      params.sec = 0
      params.min = 0
      params.hour = Number(period)
      setHour(hours + Number(period))
      params.day = 0
    } else {
      params.sec = 0
      params.min = 0
      params.hour = 0
      params.day = Number(period)
      setDay(days + Number(period))
    }

    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    // let cosmeta = new ethers.Contract(cri,Token,signer);
    // await cosmeta.approve(user,price)
    // await cosmeta.approve(auction,price);

    const contract = new ethers.Contract(auction, Auction, signer)
    const transaction = await contract.offerAuction(tokenId, biddable, second, minute, hours, days)
    await transaction.wait()
    setOpenModal(false)
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

  useEffect(() => {
    connectUser()
    // loadLiveAuction()
    getNFTs()
  },[])

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
          <div className='grid grid-cols-1 gap-y-2'>
            {liveauction.filter(u => u.duration < Date.now() && u.username == param).map((i,k) =>
              <div key={k} className="w-[300px] text-slate-400 bg-gradient-to-tr to-slate-600 from-slate-900 cursor-pointer rounded-t-xl pb-3 rounded-b-xl">

              <Link href={`/auctiondetails/${i.id}`}>{i.fileType == "video/mp4"
              ? <video src={i.images} autoPlay loop muted/>
              : i.fileType == "image/png" || i.fileType == "image/jpeg" || i.fileType == "image/jpg" || i.fileType == "image/svg" || i.fileType == "image/webp"
              ? <img className='rounded-t-xl object-cover w-[300px] h-[300px]' src={i.images} alt={i.name}/>
              : i.fileType == "audio/mp3" ||  i.fileType == "audio/ogg" || i.fileType == "audio/wav" || i.fileType == "audio/mpeg"
              ? <AudioPlayer nft={i.images} nftname={i.name}/> : null
              }</Link>
                <div className='flex-col px-5 '>
                <div className='flex justify-between items-center w-full my-3'>
                  <div className="flex justify-start items-center w-full">
                    <h3 className="text-md font-medium text-purple-500">{i.createdWallet == user ? 'Created by You' : `${i.username}`}</h3>
                  </div>
                  <div className='justify-end items-center w-16 animate-pulse'>
                  <h3 className={i.live == true ? 'font-bold text-sm text-center bg-red-600 text-slate-50 py-1 px-3 rounded-md' : 'font-bold text-sm text-center bg-slate-700 text-slate-50 py-1 px-3 rounded-md'}>{i.live == true ? "LIVE" : "Auction Expired"}</h3>
                  </div>
                  </div>
                  <h5 className='flex gap-x-2 text-lg font-bold my-3'>{i.name}</h5>
                  <h5 className='flex gap-x-2 text-sm my-3'>{i.description.slice(0,38)}</h5>
        
                  <h5 className='flex gap-x-2 text-sm my-3'><strong>Price : </strong><span>{i.price}</span></h5>
                  <h5 className='flex gap-x-2 text-sm my-3'><strong>Owner : </strong><span>{i.owner.slice(0,5) + '...' + i.owner.slice(38)}</span></h5>
                  <div className="my-3">
                    <Countdown timestamp={i.duration + '000'} />
                  </div>
                  <div className='flex justify-center items-center'>
                  <div className='w-full'>
                  {i.live == true && i.biddable == true ? 
                    <Link href={`/placebid/${i.id}`} className='flex justify-center bg-gradient-to-tr to-slate-900 z-30 border-[1px] border-slate-700 rounded-lg from-slate-900 hover:to-purple-600 hover:from-blue-700 relative w-full h-10 text-slate-400'>Place Bid</Link>
                   :<button className='bg-gradient-to-tr to-slate-900 z-30 border-[1px] border-slate-700 rounded-lg from-slate-900 hover:to-purple-600 hover:from-blue-700 relative w-full h-10 text-slate-400' onClick={() => setOpenModal(true)}>Start Offer</button> 
                  }
                  </div>
                  </div>
                
                </div>
            </div>
            )}
          </div>
          </Fragment>
        }
        {matches.medium &&
          <Fragment>
            <div className='grid grid-cols-3 gap-4'>
            {liveauction.filter(u => u.duration < Date.now() && u.username == param).map((i,k) =>
              <div key={k} className="w-[300px] text-slate-400 bg-gradient-to-tr to-slate-600 from-slate-900 cursor-pointer rounded-t-xl pb-3 rounded-b-xl">

              <Link href={`/auctiondetails/${i.id}`}>{i.fileType == "video/mp4"
              ? <video src={i.images} autoPlay loop muted/>
              : i.fileType == "image/png" || i.fileType == "image/jpeg" || i.fileType == "image/jpg" || i.fileType == "image/svg" || i.fileType == "image/webp"
              ? <img className='rounded-t-xl object-cover w-[300px] h-[300px]' src={i.images} alt={i.name}/>
              : i.fileType == "audio/mp3" ||  i.fileType == "audio/ogg" || i.fileType == "audio/wav" || i.fileType == "audio/mpeg"
              ? <AudioPlayer nft={i.images} nftname={i.name}/> : null
              }</Link>
                <div className='flex-col px-5 '>
                <div className='flex justify-between items-center w-full my-3'>
                  <div className="flex justify-start items-center w-full">
                    <h3 className="text-md font-medium text-purple-500">{i.createdWallet == user ? 'Created by You' : `${i.username}`}</h3>
                  </div>
                  <div className='justify-end items-center w-16 animate-pulse'>
                  <h3 className={i.live == true ? 'font-bold text-sm text-center bg-red-600 text-slate-50 py-1 px-3 rounded-md' : 'font-bold text-sm text-center bg-slate-700 text-slate-50 py-1 px-3 rounded-md'}>{i.live == true ? "LIVE" : "Auction Expired"}</h3>
                  </div>
                  </div>
                  <h5 className='flex gap-x-2 text-lg font-bold my-3'>{i.name}</h5>
                  <h5 className='flex gap-x-2 text-sm my-3'>{i.description.slice(0,38)}</h5>
        
                  <h5 className='flex gap-x-2 text-sm my-3'><strong>Price : </strong><span>{i.price}</span></h5>
                  <h5 className='flex gap-x-2 text-sm my-3'><strong>Owner : </strong><span>{i.owner.slice(0,5) + '...' + i.owner.slice(38)}</span></h5>
                  <div className="my-3">
                    <Countdown timestamp={i.duration + '000'} />
                  </div>
                  <div className='flex justify-center items-center'>
                  <div className='w-full'>
                  {i.live == true && i.biddable == true ? 
                    <Link href={`/placebid/${i.id}`} className='flex justify-center bg-gradient-to-tr to-slate-900 z-30 border-[1px] border-slate-700 rounded-lg from-slate-900 hover:to-purple-600 hover:from-blue-700 relative w-full h-10 text-slate-400'>Place Bid</Link>
                   :<button className='bg-gradient-to-tr to-slate-900 z-30 border-[1px] border-slate-700 rounded-lg from-slate-900 hover:to-purple-600 hover:from-blue-700 relative w-full h-10 text-slate-400' onClick={() => setOpenModal(true)}>Start Offer</button> 
                  }
                  </div>
                  </div>
                
                </div>
            </div>
            )}
            </div>
          </Fragment>
        }
        {matches.large &&
          <Fragment>
          <div className='grid grid-cols-5 gap-5'>
            {liveauction.filter(u => u.duration < Date.now() && u.username == param && u.live == true).map((i,k) =>
              <div key={k} className="w-[300px] text-slate-400 bg-gradient-to-tr to-slate-600 from-slate-900 cursor-pointer rounded-t-xl pb-3 rounded-b-xl">

              <Link href={`/auctiondetails/${i.id}`}>{i.fileType == "video/mp4"
              ? <video src={i.images} autoPlay loop muted/>
              : i.fileType == "image/png" || i.fileType == "image/jpeg" || i.fileType == "image/jpg" || i.fileType == "image/svg" || i.fileType == "image/webp"
              ? <img className='rounded-t-xl object-cover w-[300px] h-[300px]' src={i.images} alt={i.name}/>
              : i.fileType == "audio/mp3" ||  i.fileType == "audio/ogg" || i.fileType == "audio/wav" || i.fileType == "audio/mpeg"
              ? <AudioPlayer nft={i.images} nftname={i.name}/> : null
              }</Link>
                <div className='flex-col px-5 '>
                <div className='flex justify-between items-center w-full my-3'>
                  <div className="flex justify-start items-center w-full">
                    <h3 className="text-md font-medium text-purple-500">{i.createdWallet == user ? 'Created by You' : `${i.username}`}</h3>
                  </div>
                  <div className='justify-end items-center w-16 animate-pulse'>
                  <h3 className={i.live == true ? 'font-bold text-sm text-center bg-red-600 text-slate-50 py-1 px-3 rounded-md' : 'font-bold text-sm text-center bg-slate-700 text-slate-50 py-1 px-3 rounded-md'}>{i.live == true ? "LIVE" : "Auction Expired"}</h3>
                  </div>
                  </div>
                  <h5 className='flex gap-x-2 text-lg font-bold my-3'>{i.name}</h5>
                  <h5 className='flex gap-x-2 text-sm my-3'>{i.description.slice(0,38)}</h5>
        
                  <h5 className='flex gap-x-2 text-sm my-3'><strong>Price : </strong><span>{i.bidprice}</span></h5>
                  <h5 className='flex gap-x-2 text-sm my-3'><strong>Owner : </strong><span>{i.owner.slice(0,5) + '...' + i.owner.slice(38)}</span></h5>
                  <div className="my-3">
                    <Countdown timestamp={i.duration + '000'} />
                  </div>
                  <div className='flex justify-center items-center'>
                  <div className='w-full'>
                  {i.live == true && i.biddable == true ? 
                    <Link href={`/placebid/${i.id}`} className='flex justify-center bg-gradient-to-tr to-slate-900 z-30 border-[1px] border-slate-700 rounded-lg from-slate-900 hover:to-purple-600 hover:from-blue-700 relative w-full h-10 text-slate-400'>Place Bid</Link>
                   :<button className='bg-gradient-to-tr to-slate-900 z-30 border-[1px] border-slate-700 rounded-lg from-slate-900 hover:to-purple-600 hover:from-blue-700 relative w-full h-10 text-slate-400' onClick={() => setOpenModal(true)}>Start Offer</button> 
                  }
                  </div>
                  </div>
                
                </div>
            </div>
            )}
          </div>
          </Fragment>
        }
      </Fragment>
    )}
</Media>
</div>
    );
};

export default PersonalLiveAuction;
