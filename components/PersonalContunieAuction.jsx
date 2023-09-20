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
import { sepnft,sepresell,seprpc,septoken,sepmarket } from '../engine/configuration';
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

const PersonalContunieAuction = ({param}) => {

  const {user,getUser,connectUser,auction,cri,rpc,cipher} = useStateContext();
  const [openModal,setOpenModal] = useState(false)
  const [openBidModal,setBidModal] = useState(false)
  const [period, setPeriod] = useState('')
  const [biddable, setBiddable] = useState('')
  const [timeline, setTimeline] = useState('')
  const [formInput, updateFormInput] = useState({ bidprice: '',})
  const [mumbidders,mumsetbidders] = useState(null);
  const [count,setCount] = useState(15);
  const [myauction,MumAllAuction] = useState([]);
  const [bidder,setBidder] = useState([]);  
  const [uid,setUid] = useState(null);

  const [sec,setSec] = useState(0);
  const [min,setMin] = useState(0);
  const [hour,setHour] = useState(0);
  const [day,setDay] = useState(0);
  
  const router = useRouter();
  useEffect(() => {
    getNFTs()
  },[])

  useEffect(() => {
    connectUser()
    setUid(uniqid());
    // loadAllAuction()
  },[getUser])

  const getNFTs = async () => {
    await fetch('http://localhost:3000/api/setnft').then(res => {
      if(!res.ok){
        throw new Error("HTTP ERROR",res.status)
      }
      return res
    }).then(res => res.json()).then(data => {
      MumAllAuction(data)
    })
  }

  const loadAllAuction = async () => {
    let network = rpc
    const key = simpleCrypto.decrypt(cipherEth)
    const provider = new ethers.providers.JsonRpcProvider(network)
    const wallet = new ethers.Wallet(key, provider);
    let auctioncontract = new ethers.Contract(auction, Auction, wallet)
    const data = await auctioncontract.getAllAuctions()
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
    MumAllAuction(items)
}


const handleBuy = async (tokenId) => {

  const web3Modal = new Web3Modal()
  const connection = await web3Modal.connect()
  const provider = new ethers.providers.Web3Provider(connection)
  const signer = provider.getSigner()
  const contract = new ethers.Contract(auction, Auction, signer)
  let cosmeta = new ethers.Contract(cri,Token,signer)

  let nftprice = ethers.utils.parseUnits(price, 'ether')
  nftprice = nftprice.toString()


  await cosmeta.approve(user,nftprice)
  await cosmeta.approve(auction,nftprice)

  await cosmeta.increaseAllowance(auction, nftprice)
  const transaction = await contract.buyAuctionedItem(tokenId, {value: nftprice})
  await transaction.wait()
  router.push('/')
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
        <div className='grid grid-cols-1 gap-y-2'>
        
        {myauction.filter(u => u.duration + "000" < Date.now() && u.biddable == true && u.username == param).map((i,k) =>
          <div key={k} className="w-[300px] text-slate-400">
            <div className='cursor-pointer h-[550px] pb-3 border-slate-800 border-r-slate-700 rounded-xl bg-gradient-to-tr to-slate-600 from-slate-900 overflow-hidden border-2'>
            <div className="flex justify-center items-center">{i.fileType == "video/mp4"
            ? <video src={i.images} autoPlay loop muted className="h-[300px] flex justify-center items-center object-cover overflow-hidden"/>
            : i.fileType == "image/png" || i.fileType == "image/jpeg" || i.fileType == "image/jpg" || i.fileType == "image/svg" || i.fileType == "image/webp"
            ? <img className='rounded-t-xl w-[300px] h-[300px] flex justify-center items-center object-cover overflow-hidden' src={i.images} alt={i.name}/>
            : i.fileType == "audio/mp3" ||  i.fileType == "audio/ogg" || i.fileType == "audio/wav" || i.fileType == "audio/mpeg"
            ? <AudioPlayer nft={i.images} nftname={i.name}/> : null
            }</div>
                
              <div className='flex-col px-5'>
              <div className='flex justify-between items-center w-full my-3'>
                <div className="flex justify-start items-center w-full">
                  <h3 className="text-md font-medium text-purple-500">{i.createdWallet == user ? 'Created by You' : `${i.username}`}</h3>
                </div>
                <div className='justify-end items-center w-full'>
                <h3 className='font-medium text-sm text-center bg-slate-800 text-slate-500 py-1 px-3 rounded-md'>Token ID : {i.tokenId}</h3>
                </div>
                </div>
                <h5 className='flex gap-x-2 text-lg font-bold my-3'>{i.name}</h5>
                <h5 className='flex gap-x-2 text-sm my-3'>{i.description.slice(0,38)}</h5>
                <h5 className='flex gap-x-2 text-sm my-3'><strong>Price : </strong><span>{i.price}</span></h5>
                <h5 className='flex gap-x-2 text-sm my-3'><strong>Owner : </strong><span>{i.owner.slice(0,5) + '...' + i.owner.slice(38)}</span></h5>
                <div className="my-3">
                  <Countdown timestamp={i.duration + '000'} />
                </div>
              </div>
            </div>
            <div className='flex justify-center items-center'>
            <div className='w-full'>
            {i.biddable == true ? (
                <div>
                {i.winner == user && Date.now > i.duration ? <button className='relative bottom-3 bg-gradient-to-tr to-slate-900 z-30 border-[1px] border-slate-700 rounded-lg from-slate-900 hover:to-purple-600 hover:from-blue-700 w-full h-10 text-slate-400' onClick={() => setBidModal(true)}>Claim</button> : null}
                {i.sold == false 
                  ? <button className='relative bottom-3 bg-gradient-to-tr to-slate-900 z-30 border-[1px] border-slate-700 rounded-b-lg from-slate-900 hover:to-purple-600 hover:from-blue-700 w-full h-10 text-slate-400' onClick={() => setBidModal(true)}>Place Bid</button> 
                  : <button className='relative bottom-3 bg-gradient-to-tr to-slate-900 z-30 border-[1px] border-slate-700 rounded-b-lg from-slate-900 hover:to-purple-600 hover:from-blue-700 w-full h-10 text-slate-400' onClick={handleBuy(i.tokenId)}>Buy</button>
                }

                </div>
                )
            : <Link href={`/auctiondetails/${i.id}`} className='flex justify-center items-center relative bottom-3 bg-gradient-to-tr to-slate-900 z-30 border-[1px] border-slate-700 rounded-b-lg from-slate-900 hover:to-purple-600 hover:from-blue-700 w-full text-center h-10 text-slate-400'>Start Offer</Link>
            }
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
        
        {myauction.filter(u => u.duration + "000" < Date.now() && u.biddable == true && u.username == param).map((i,k) =>
          <div key={k} className="w-[300px] text-slate-400">
            <div className='cursor-pointer h-[550px] pb-3 border-slate-800 border-r-slate-700 rounded-xl bg-gradient-to-tr to-slate-600 from-slate-900 overflow-hidden border-2'>
            <div className="flex justify-center items-center">{i.fileType == "video/mp4"
            ? <video src={i.images} autoPlay loop muted className="h-[300px] flex justify-center items-center object-cover overflow-hidden"/>
            : i.fileType == "image/png" || i.fileType == "image/jpeg" || i.fileType == "image/jpg" || i.fileType == "image/svg" || i.fileType == "image/webp"
            ? <img className='rounded-t-xl w-[300px] h-[300px] flex justify-center items-center object-cover overflow-hidden' src={i.images} alt={i.name}/>
            : i.fileType == "audio/mp3" ||  i.fileType == "audio/ogg" || i.fileType == "audio/wav" || i.fileType == "audio/mpeg"
            ? <AudioPlayer nft={i.images} nftname={i.name}/> : null
            }</div>
                
              <div className='flex-col px-5'>
              <div className='flex justify-between items-center w-full my-3'>
                <div className="flex justify-start items-center w-full">
                  <h3 className="text-md font-medium text-purple-500">{i.createdWallet == user ? 'Created by You' : `${i.username}`}</h3>
                </div>
                <div className='justify-end items-center w-full'>
                <h3 className='font-medium text-sm text-center bg-slate-800 text-slate-500 py-1 px-3 rounded-md'>Token ID : {i.tokenId}</h3>
                </div>
                </div>
                <h5 className='flex gap-x-2 text-lg font-bold my-3'>{i.name}</h5>
                <h5 className='flex gap-x-2 text-sm my-3'>{i.description.slice(0,38)}</h5>
                <h5 className='flex gap-x-2 text-sm my-3'><strong>Price : </strong><span>{i.price}</span></h5>
                <h5 className='flex gap-x-2 text-sm my-3'><strong>Owner : </strong><span>{i.owner.slice(0,5) + '...' + i.owner.slice(38)}</span></h5>
                <div className="my-3">
                  <Countdown timestamp={i.duration + '000'} />
                </div>
              </div>
            </div>
            <div className='flex justify-center items-center'>
            <div className='w-full'>
            {i.biddable == true ? (
                <div>
                {i.winner == user && Date.now > i.duration ? <button className='relative bottom-3 bg-gradient-to-tr to-slate-900 z-30 border-[1px] border-slate-700 rounded-lg from-slate-900 hover:to-purple-600 hover:from-blue-700 w-full h-10 text-slate-400' onClick={() => setBidModal(true)}>Claim</button> : null}
                {i.sold == false 
                  ? <button className='relative bottom-3 bg-gradient-to-tr to-slate-900 z-30 border-[1px] border-slate-700 rounded-b-lg from-slate-900 hover:to-purple-600 hover:from-blue-700 w-full h-10 text-slate-400' onClick={() => setBidModal(true)}>Place Bid</button> 
                  : <button className='relative bottom-3 bg-gradient-to-tr to-slate-900 z-30 border-[1px] border-slate-700 rounded-b-lg from-slate-900 hover:to-purple-600 hover:from-blue-700 w-full h-10 text-slate-400' onClick={handleBuy(i.tokenId)}>Buy</button>
                }

                </div>
                )
            : <Link href={`/auctiondetails/${i.id}`} className='flex justify-center items-center relative bottom-3 bg-gradient-to-tr to-slate-900 z-30 border-[1px] border-slate-700 rounded-b-lg from-slate-900 hover:to-purple-600 hover:from-blue-700 w-full text-center h-10 text-slate-400'>Start Offer</Link>
            }
            </div>
            </div>
          </div>  
        )}

        </div>
        </Fragment>
      }
      {matches.large &&
        <Fragment>
        <div className='grid grid-cols-3 gap-4'>
        
        {myauction.filter(u => u.duration + "000" < Date.now() && u.biddable == true && u.username == param).map((i,k) =>
          <div key={k} className="w-[300px] text-slate-400">
            <div className='cursor-pointer h-[550px] pb-3 border-slate-800 border-r-slate-700 rounded-xl bg-gradient-to-tr to-slate-600 from-slate-900 overflow-hidden border-2'>
            <div className="flex justify-center items-center">{i.fileType == "video/mp4"
            ? <video src={i.images} autoPlay loop muted className="h-[300px] flex justify-center items-center object-cover overflow-hidden"/>
            : i.fileType == "image/png" || i.fileType == "image/jpeg" || i.fileType == "image/jpg" || i.fileType == "image/svg" || i.fileType == "image/webp"
            ? <img className='rounded-t-xl w-[300px] h-[300px] flex justify-center items-center object-cover overflow-hidden' src={i.images} alt={i.name}/>
            : i.fileType == "audio/mp3" ||  i.fileType == "audio/ogg" || i.fileType == "audio/wav" || i.fileType == "audio/mpeg"
            ? <AudioPlayer nft={i.images} nftname={i.name}/> : null
            }</div>
                
              <div className='flex-col px-5'>
              <div className='flex justify-between items-center w-full my-3'>
                <div className="flex justify-start items-center w-full">
                  <h3 className="text-md font-medium text-purple-500">{i.createdWallet == user ? 'Created by You' : `${i.username}`}</h3>
                </div>
                <div className='justify-end items-center w-full'>
                <h3 className='font-medium text-sm text-center bg-slate-800 text-slate-500 py-1 px-3 rounded-md'>Token ID : {i.tokenId}</h3>
                </div>
                </div>
                <h5 className='flex gap-x-2 text-lg font-bold my-3'>{i.name}</h5>
                <h5 className='flex gap-x-2 text-sm my-3'>{i.description.slice(0,38)}</h5>
                <h5 className='flex gap-x-2 text-sm my-3'><strong>Price : </strong><span>{i.price}</span></h5>
                <h5 className='flex gap-x-2 text-sm my-3'><strong>Owner : </strong><span>{i.owner.slice(0,5) + '...' + i.owner.slice(38)}</span></h5>
                <div className="my-3">
                  <Countdown timestamp={i.duration + '000'} />
                </div>
              </div>
            </div>
            <div className='flex justify-center items-center'>
            <div className='w-full'>
            {i.biddable == true ? (
                <div>
                {i.winner == user && Date.now > i.duration ? <button className='relative bottom-3 bg-gradient-to-tr to-slate-900 z-30 border-[1px] border-slate-700 rounded-lg from-slate-900 hover:to-purple-600 hover:from-blue-700 w-full h-10 text-slate-400' onClick={() => setBidModal(true)}>Claim</button> : null}
                {i.sold == false 
                  ? <button className='relative bottom-3 bg-gradient-to-tr to-slate-900 z-30 border-[1px] border-slate-700 rounded-b-lg from-slate-900 hover:to-purple-600 hover:from-blue-700 w-full h-10 text-slate-400' onClick={() => setBidModal(true)}>Place Bid</button> 
                  : <button className='relative bottom-3 bg-gradient-to-tr to-slate-900 z-30 border-[1px] border-slate-700 rounded-b-lg from-slate-900 hover:to-purple-600 hover:from-blue-700 w-full h-10 text-slate-400' onClick={handleBuy(i.tokenId)}>Buy</button>
                }

                </div>
                )
            : <Link href={`/auctiondetails/${i.id}`} className='flex justify-center items-center relative bottom-3 bg-gradient-to-tr to-slate-900 z-30 border-[1px] border-slate-700 rounded-b-lg from-slate-900 hover:to-purple-600 hover:from-blue-700 w-full text-center h-10 text-slate-400'>Start Offer</Link>
            }
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

export default PersonalContunieAuction;
