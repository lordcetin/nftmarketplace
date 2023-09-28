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
import TimeAgo from './TimeAgo';
import { BiCommentDetail  } from 'react-icons/bi';
import { AiOutlineHeart } from 'react-icons/ai'


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
    await fetch('https://testnet.cos-in.com/api/setnft').then(res => {
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
        <div className='grid grid-cols-1 gap-y-6'>
        
        {myauction.reverse().filter(u => u.duration + "000" > Date.now() && u.biddable == true && u.username == param).map((nft) =>
        <div key={nft.id} className="w-[300px] sm:w-[262px] border-slate-800 relative hover:bottom-2 border-2 bg-gradient-to-tr to-slate-600 from-slate-900 border-r-slate-700 rounded-lg overflow-hidden ">
        <div className='flex items-center w-full absolute top-0'>
          <div className='items-center w-full'>
            <img src={nft.wichNet == 'Ethereum' ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/480px-Ethereum-icon-purple.svg.png' : nft.wichNet == 'Polygon' ? 'https://cryptologos.cc/logos/polygon-matic-logo.png' : nft.wichNet == 'Binance' ? 'https://seeklogo.com/images/B/binance-coin-bnb-logo-97F9D55608-seeklogo.com.png' : null} className="z-30 object-cover w-5 absolute top-2 left-2"/>
          </div>
          <div>
          </div>
          </div>
          {nft.fileType == 'video/mp4'
          ? <><Link href={`/details/${nft._id}`}><video src={nft.images} className="w-full h-[296px] sm:h-[170px] object-cover rounded-t-lg" autoPlay muted loop/></Link></>
          : nft.fileType == 'image/png' || nft.fileType == 'image/jpeg'  || nft.fileType == 'image/jpg' || nft.fileType == 'image/webp' ? <><Link href={`/details/${nft._id}`}><img src={nft.images} className="w-full h-[296px] sm:h-[170px] rounded-t-lg object-cover" /></Link></>
          : nft.fileType == 'audio/mp3' || nft.fileType == 'audio/wav' || nft.fileType == 'audio/ogg' || 'audio/mpeg' ? <AudioPlayer nft={nft.images} nftcover={nft.cover} nftname={nft.name} nftid={nft._id}/> : null
          }
          <div className='flex-col px-5'>
            <div className='flex justify-between items-center w-full my-3'>
            <div className="flex justify-between items-center w-full">
            <div className='justify-start items-center'>
              <Link href={`/${nft.username}`}>
                <div className="text-md font-medium cursor-pointer text-purple-500 flex items-center gap-x-1">{nft.avatar ? 
                  <img src={nft.avatar} className="rounded-full w-3 mr-1"/>:null}
                  {!nft.username == "" ? nft.username : user.slice(0,11) + '...'} 
                  {nft.role == 'verified' ? <MdVerified size={18}/>: null}
                </div>
              </Link>
            </div>
            </div>

              <div className='justify-end items-center w-16 animate-pulse'>
              <h3 className={nft.live == true || parseInt(nft.duration + "000") > Date.now() ? 'font-bold text-sm text-center bg-red-600 text-slate-50 py-1 px-3 rounded-md' : 'font-bold text-sm text-center bg-slate-700 text-slate-50 py-1 px-3 rounded-md'}>{parseInt(nft.duration + "000") > Date.now() ? "LIVE" : "Auction Expired"}</h3>
              </div>
            
            </div>
            
            <div className="flex justify-between items-center w-full">
            <h1 className='font-medium text-lg text-slate-400'>{nft.name}</h1>
            </div>

          <div className="my-3">
          <p className="text-slate-400 text-sm truncate">{nft.description}</p>

          {nft.bids == 0 ?
            <div className="flex items-center gap-x-1.5 my-3 text-slate-400"><strong title="No have bid yet">Price : &nbsp;{nft.price}</strong><img src='https://etherscan.io/token/images/cosmeta_32.png' className='object-cover w-5' title='Crypto International (CRI)' /></div>
            :<div className="flex items-center gap-x-1.5 my-3 text-orange-400 animate-pulse"><strong>Last Bid : &nbsp;{nft.bidprice}</strong><img src='https://etherscan.io/token/images/cosmeta_32.png' className='object-cover w-5' title='Crypto International (CRI)' /></div>
          }
          
          {nft.winner != "0x0000000000000000000000000000000000000000" ? <div className="text-sm flex gap-x-2 text-slate-400 my-3"><strong>Winner : </strong><span>{nft?.winner?.slice(0,5) + '...' + nft?.winner?.slice(38)}</span></div> : <span className="text-slate-400">Not have a winner</span>}
          <div className="text-xs mt-3">
            <Countdown timestamp={nft.duration + "000"}/>
          </div>
          </div>

            <div className='flex justify-between items-center w-full mb-3'>
            <div className='flex justify-start items-center gap-x-4'>
              <div className='flex items-center gap-x-2 text-sm'>
              <AiOutlineHeart size={20} className=' cursor-pointer hover:text-red-500' />
              <strong>{nft.likes.length}</strong>
              </div>
              <div className='flex items-center gap-x-2 text-sm'>
              <div>
              <Link href={`/details/${nft._id}`}><BiCommentDetail size={20} className='cursor-pointer'/></Link>
              </div>
              <div className='text-sm flex items-center gap-x-2'>
              <strong>{nft.comments.length}</strong>
              </div>
            </div>
            </div>
            <div className='flex justify-end items-center'>
            <TimeAgo timestamp={nft.createdAt} />
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
        <div className='grid grid-cols-3 gap-y-6'>
        
        {myauction.reverse().filter(u => u.duration + "000" > Date.now() && u.biddable == true && u.username == param).map((nft) =>
        <div key={nft.id} className="w-[300px] sm:w-[262px] border-slate-800 relative hover:bottom-2 border-2 bg-gradient-to-tr to-slate-600 from-slate-900 border-r-slate-700 rounded-lg overflow-hidden ">
        <div className='flex items-center w-full absolute top-0'>
          <div className='items-center w-full'>
            <img src={nft.wichNet == 'Ethereum' ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/480px-Ethereum-icon-purple.svg.png' : nft.wichNet == 'Polygon' ? 'https://cryptologos.cc/logos/polygon-matic-logo.png' : nft.wichNet == 'Binance' ? 'https://seeklogo.com/images/B/binance-coin-bnb-logo-97F9D55608-seeklogo.com.png' : null} className="z-30 object-cover w-5 absolute top-2 left-2"/>
          </div>
          <div>
          </div>
          </div>
          {nft.fileType == 'video/mp4'
          ? <><Link href={`/details/${nft._id}`}><video src={nft.images} className="w-full h-[296px] sm:h-[170px] object-cover rounded-t-lg" autoPlay muted loop/></Link></>
          : nft.fileType == 'image/png' || nft.fileType == 'image/jpeg'  || nft.fileType == 'image/jpg' || nft.fileType == 'image/webp' ? <><Link href={`/details/${nft._id}`}><img src={nft.images} className="w-full h-[296px] sm:h-[170px] rounded-t-lg object-cover" /></Link></>
          : nft.fileType == 'audio/mp3' || nft.fileType == 'audio/wav' || nft.fileType == 'audio/ogg' || 'audio/mpeg' ? <AudioPlayer nft={nft.images} nftcover={nft.cover} nftname={nft.name} nftid={nft._id}/> : null
          }
          <div className='flex-col px-5'>
            <div className='flex justify-between items-center w-full my-3'>
            <div className="flex justify-between items-center w-full">
            <div className='justify-start items-center'>
              <Link href={`/${nft.username}`}>
                <div className="text-md font-medium cursor-pointer text-purple-500 flex items-center gap-x-1">{nft.avatar ? 
                  <img src={nft.avatar} className="rounded-full w-3 mr-1"/>:null}
                  {!nft.username == "" ? nft.username : user.slice(0,11) + '...'} 
                  {nft.role == 'verified' ? <MdVerified size={18}/>: null}
                </div>
              </Link>
            </div>
            </div>

              <div className='justify-end items-center w-16 animate-pulse'>
              <h3 className={nft.live == true || parseInt(nft.duration + "000") > Date.now() ? 'font-bold text-sm text-center bg-red-600 text-slate-50 py-1 px-3 rounded-md' : 'font-bold text-sm text-center bg-slate-700 text-slate-50 py-1 px-3 rounded-md'}>{parseInt(nft.duration + "000") > Date.now() ? "LIVE" : "Auction Expired"}</h3>
              </div>
            
            </div>
            
            <div className="flex justify-between items-center w-full">
            <h1 className='font-medium text-lg text-slate-400'>{nft.name}</h1>
            </div>

          <div className="my-3">
          <p className="text-slate-400 text-sm truncate">{nft.description}</p>

          {nft.bids == 0 ?
            <div className="flex items-center gap-x-1.5 my-3 text-slate-400"><strong title="No have bid yet">Price : &nbsp;{nft.price}</strong><img src='https://etherscan.io/token/images/cosmeta_32.png' className='object-cover w-5' title='Crypto International (CRI)' /></div>
            :<div className="flex items-center gap-x-1.5 my-3 text-orange-400 animate-pulse"><strong>Last Bid : &nbsp;{nft.bidprice}</strong><img src='https://etherscan.io/token/images/cosmeta_32.png' className='object-cover w-5' title='Crypto International (CRI)' /></div>
          }
          
          {nft.winner != "0x0000000000000000000000000000000000000000" ? <div className="text-sm flex gap-x-2 text-slate-400 my-3"><strong>Winner : </strong><span>{nft?.winner?.slice(0,5) + '...' + nft?.winner?.slice(38)}</span></div> : <span className="text-slate-400">Not have a winner</span>}
          <div className="text-xs mt-3">
            <Countdown timestamp={nft.duration + "000"}/>
          </div>
          </div>

            <div className='flex justify-between items-center w-full mb-3'>
            <div className='flex justify-start items-center gap-x-4'>
              <div className='flex items-center gap-x-2 text-sm'>
              <AiOutlineHeart size={20} className=' cursor-pointer hover:text-red-500' />
              <strong>{nft.likes.length}</strong>
              </div>
              <div className='flex items-center gap-x-2 text-sm'>
              <div>
              <Link href={`/details/${nft._id}`}><BiCommentDetail size={20} className='cursor-pointer'/></Link>
              </div>
              <div className='text-sm flex items-center gap-x-2'>
              <strong>{nft.comments.length}</strong>
              </div>
            </div>
            </div>
            <div className='flex justify-end items-center'>
            <TimeAgo timestamp={nft.createdAt} />
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
        <div className='grid grid-cols-4 gap-4'>
        
        {myauction.reverse().filter(u => u.duration + "000" > Date.now() && u.biddable == true && u.username == param).map((nft) =>
        <div key={nft.id} className="w-[300px] sm:w-[262px] border-slate-800 relative hover:bottom-2 border-2 bg-gradient-to-tr to-slate-600 from-slate-900 border-r-slate-700 rounded-lg overflow-hidden ">
        <div className='flex items-center w-full absolute top-0'>
          <div className='items-center w-full'>
            <img src={nft.wichNet == 'Ethereum' ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/480px-Ethereum-icon-purple.svg.png' : nft.wichNet == 'Polygon' ? 'https://cryptologos.cc/logos/polygon-matic-logo.png' : nft.wichNet == 'Binance' ? 'https://seeklogo.com/images/B/binance-coin-bnb-logo-97F9D55608-seeklogo.com.png' : null} className="z-30 object-cover w-5 absolute top-2 left-2"/>
          </div>
          <div>
          </div>
          </div>
          {nft.fileType == 'video/mp4'
          ? <><Link href={`/details/${nft._id}`}><video src={nft.images} className="w-full h-[296px] sm:h-[170px] object-cover rounded-t-lg" autoPlay muted loop/></Link></>
          : nft.fileType == 'image/png' || nft.fileType == 'image/jpeg'  || nft.fileType == 'image/jpg' || nft.fileType == 'image/webp' ? <><Link href={`/details/${nft._id}`}><img src={nft.images} className="w-full h-[296px] sm:h-[170px] rounded-t-lg object-cover" /></Link></>
          : nft.fileType == 'audio/mp3' || nft.fileType == 'audio/wav' || nft.fileType == 'audio/ogg' || 'audio/mpeg' ? <AudioPlayer nft={nft.images} nftcover={nft.cover} nftname={nft.name} nftid={nft._id}/> : null
          }
          <div className='flex-col px-5'>
            <div className='flex justify-between items-center w-full my-3'>
            <div className="flex justify-between items-center w-full">
            <div className='justify-start items-center'>
              <Link href={`/${nft.username}`}>
                <div className="text-md font-medium cursor-pointer text-purple-500 flex items-center gap-x-1">{nft.avatar ? 
                  <img src={nft.avatar} className="rounded-full w-3 mr-1"/>:null}
                  {!nft.username == "" ? nft.username : user.slice(0,11) + '...'} 
                  {nft.role == 'verified' ? <MdVerified size={18}/>: null}
                </div>
              </Link>
            </div>
            </div>

              <div className='justify-end items-center w-16 animate-pulse'>
              <h3 className={nft.live == true || parseInt(nft.duration + "000") > Date.now() ? 'font-bold text-sm text-center bg-red-600 text-slate-50 py-1 px-3 rounded-md' : 'font-bold text-sm text-center bg-slate-700 text-slate-50 py-1 px-3 rounded-md'}>{parseInt(nft.duration + "000") > Date.now() ? "LIVE" : "Auction Expired"}</h3>
              </div>
            
            </div>
            
            <div className="flex justify-between items-center w-full">
            <h1 className='font-medium text-lg text-slate-400'>{nft.name}</h1>
            </div>

          <div className="my-3">
          <p className="text-slate-400 text-sm truncate">{nft.description}</p>

          {nft.bids == 0 ?
            <div className="flex items-center gap-x-1.5 my-3 text-slate-400"><strong title="No have bid yet">Price : &nbsp;{nft.price}</strong><img src='https://etherscan.io/token/images/cosmeta_32.png' className='object-cover w-5' title='Crypto International (CRI)' /></div>
            :<div className="flex items-center gap-x-1.5 my-3 text-orange-400 animate-pulse"><strong>Last Bid : &nbsp;{nft.bidprice}</strong><img src='https://etherscan.io/token/images/cosmeta_32.png' className='object-cover w-5' title='Crypto International (CRI)' /></div>
          }
          
          {nft.winner != "0x0000000000000000000000000000000000000000" ? <div className="text-sm flex gap-x-2 text-slate-400 my-3"><strong>Winner : </strong><span>{nft?.winner?.slice(0,5) + '...' + nft?.winner?.slice(38)}</span></div> : <span className="text-slate-400">Not have a winner</span>}
          <div className="text-xs mt-3">
            <Countdown timestamp={nft.duration + "000"}/>
          </div>
          </div>

            <div className='flex justify-between items-center w-full mb-3'>
            <div className='flex justify-start items-center gap-x-4'>
              <div className='flex items-center gap-x-2 text-sm'>
              <AiOutlineHeart size={20} className=' cursor-pointer hover:text-red-500' />
              <strong>{nft.likes.length}</strong>
              </div>
              <div className='flex items-center gap-x-2 text-sm'>
              <div>
              <Link href={`/details/${nft._id}`}><BiCommentDetail size={20} className='cursor-pointer'/></Link>
              </div>
              <div className='text-sm flex items-center gap-x-2'>
              <strong>{nft.comments.length}</strong>
              </div>
            </div>
            </div>
            <div className='flex justify-end items-center'>
            <TimeAgo timestamp={nft.createdAt} />
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

export default PersonalContunieAuction;
