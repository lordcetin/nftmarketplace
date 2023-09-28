import React from 'react';
import next from 'next';
import { ethers } from 'ethers';
import {useState,useEffect, Fragment,useContext} from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useStateContext } from '../../context/StateContext';
import { cipherEth, simpleCrypto } from '../../engine/configuration';
import { DataContext } from '../../store/GlobalState';
import AudioPlayer from '../../components/AudioPlayer'
import InfiniteScroll from 'react-infinite-scroll-component';
import {create as ipfsHttpClient} from 'ipfs-http-client';
const { Buffer } = require("buffer");
import Auction from '../../engine/Auction.json';
import Media from 'react-media';
import Link from 'next/link';
import Web3Modal from "web3modal";
import Countdown from '../../components/Countdown';
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';
import Head from 'next/head';
import { PreLoader } from '@/components';
import { CgDetailsMore } from 'react-icons/cg'
import { MdVerified  } from 'react-icons/md'
import { BiDetail  } from 'react-icons/bi'
import { BsInstagram , BsTwitter } from 'react-icons/bs'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import {LiaFileContractSolid} from 'react-icons/lia';
import TimeAgo from '@/components/TimeAgo';

const AuctionNFTPage = ({param}) => {
  
  const {user,getUser,connectUser,auction,nftcustom,cri,rpc,cipherSep} = useStateContext();
  const [rooted,setRooted] = useState(false);
  const [allauction,MumAllAuction] = useState([]);
  const [openModal,setOpenModal] = useState(false)
  const [openBidModal,setBidModal] = useState(false)
  const [period, setPeriod] = useState('')
  const [biddable, setBiddable] = useState('')
  const [timeline, setTimeline] = useState('')
  const [formInput, updateFormInput] = useState({ bidprice: '',})
  const [mumbidders,mumsetbidders] = useState(null);
  const [count,setCount] = useState(15);
  const [bidder,setBidder] = useState([]);
  const [dbauction,setDBAuction] = useState([]);
  const [about,setOpenAbout] = useState();
  const [contract,setOpenContract] = useState();
  const [users,setUsers] = useState([])

  const [uid,setUid] = useState(null);

  const {state,dispatch} = useContext(DataContext)
  const {auth} = state

  const [sec,setSec] = useState(0);
  const [min,setMin] = useState(0);
  const [hour,setHour] = useState(0);
  const [day,setDay] = useState(0);
  
  const router = useRouter();

  useEffect(() => {
    getNFTs()
    getUsers()
  },[])

  useEffect(() => {
    connectUser()
    // allAuction()
  },[getUser])

  useEffect(() => {

    const token = Cookies.get('refreshtoken');
    const decodedToken = jwt.decode(token);
    const expr = decodedToken?.exp * 1000 > Date.now();
    const acc = Boolean(decodedToken?.username == auth?.user?.username)
    
    if (!token && !expr && !acc ) {
      router.push('/login');
    }
  }, [auth.user, router]);

  const getNFTs = async () => {
    await fetch('https://testnet.cos-in.com/api/setnft').then(res => {
      if(!res.ok){
        throw new Error("HTTP ERROR",res.status)
      }
      return res
    }).then(res => res.json()).then(data => {
      MumAllAuction(data.filter(u => u.id == param))
    })
  }

  const getUsers = async () => {
    await fetch('https://testnet.cos-in.com/api/users').then(res => {
      if(!res.ok){
        throw new Error("HTTP ERROR",res.status)
      }
      return res
    }).then(res => res.json()).then(data => {
      setUsers(data)
    })
  }
  const allAuction = async () => {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    let auctioncontract = new ethers.Contract(auction, Auction, signer)
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
        wichNet:meta.data.wichNet,
        website:meta.data.website
      }
      return item
    }))
    MumAllAuction(items.filter(u => u.id == param))
    setDBAuction(items.find(u => u.id == param))
  }

  const handleSubmit = async (e,tokenId) => {
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

    let transaction = await contract.offerAuction(tokenId,nftcustom, true, params.sec, params.min, params.hour, params.day)
    let tx = await transaction.wait()

      const totalSeconds = parseInt(params.sec) + parseInt(params.min) * 60 + parseInt(params.hour) * 60 * 60 + parseInt(params.day) * 60 * 60 * 24;
      const currentTime = Math.floor(new Date().getTime() / 1000);
      const timestamp = currentTime + totalSeconds;

    const id = allauction[0]._id;
    const nftdata = {
      id:id,
      sold:false,
      live:true,
      biddable:true,
      bids:0,
      duration:timestamp,
    }

    const res = await fetch("https://testnet.cos-in.com/api/setnft", {
      method: "PUT", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nftdata),
    });
    if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err} })
    dispatch({ type: 'NOTIFY', payload: {success: res.msg} })

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
          <Head>
          <title>Auction Details • Cosmeta NFT Marketplace</title>
          </Head>

          <div className="flex justify-center items-center w-full">
          {!allauction.length ? <PreLoader/> : null}
        {allauction.map(nft => (
          
        /***  DETAILS ***/
        <div className="flex flex-col justify-center gap-x-4">
            {/*** MEDIA ***/}
            <div className="flex-col justify-center w-[300px] rounded-xl flex">
            
            {nft.fileType == 'video/mp4' || nft.fileType == 'video/mov'
                ? <video src={nft.images} className="rounded-xl w-[450px]" autoPlay muted loop/>
                : nft.fileType == 'image/png' || nft.fileType == 'image/jpeg'  || nft.fileType == 'image/jpg' || nft.fileType == 'image/webp'   ? <img className='rounded-xl object-cover w-[300px]' src={nft.images} />
                : nft.fileType == 'audio/mp3' || nft.fileType == 'audio/wav' || nft.fileType == 'audio/ogg' || nft.fileType == 'audio/mpeg' ? <AudioPlayer nft={nft.images} nftcover={nft.cover} nftname={nft.name} nftid={nft.id} detailpage={true}/> : null
            }
            <div className='w-[300px] flex items-center'></div>
            </div>
    
          <div className="flex-col justify-center items-center w-full">
            <div className="px-3 flex w-full my-2 items-center">
              <div>
                <span className='w-60 flex truncate items-center gap-x-1 text-indigo-500 font-medium'>{nft.name} {nft.role == 'verified' ? <MdVerified size={18}/> : null}</span>
              </div>
            </div>
            <div className="px-3 flex w-60 items-center mt-4">
              <div>
                <strong className='w-60 flex truncate text-slate-400'>{nft.description}</strong>
              </div>
            </div>
            <div className="rounded-md px-3 flex w-full items-center my-1">
              <div className='flex items-center gap-x-1'>
                <span className='text-sm font-thin'>Owned by</span><Link href={`/${nft.username}`} className='text-sm text-indigo-500'>{nft.owner.slice(0,5) + '...' + nft.owner.slice(38)} | {nft.username}</Link>
              </div>
            </div>
          
            <div className='border border-indigo-500 rounded-md w-[300px] p-5 my-5'>
              <p className='text-xl antialiased font-light'>Set the offer time</p>
              <form onSubmit={(e) => handleSubmit(e,nft.tokenId)} className="grid gap-y-2 my-3">
              <div>
                <input
                className="w-full bg-indigo-950 hover:bg-indigo-900 py-2 px-3 rounded-lg border-2 border-indigo-500 hover:border-indigo-400 text-slate-50 placeholder:text-indigo-500"
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
                className="w-full bg-indigo-950 hover:bg-indigo-900 py-2 px-3 rounded-lg border-2 border-indigo-500 hover:border-indigo-400 text-indigo-500"
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
                <button className='bg-indigo-950 py-3 px-7 rounded-md hover:bg-indigo-600 w-full border-2 border-indigo-500' type="submit">Offer Item</button> 
              </div>
              </form>
            </div>

            <div className='flex-col w-[300px] border border-indigo-500 rounded-md mt-5'>
            <div className='w-full bg-indigo-950 rounded-t-md border-b border-indigo-500 py-2 px-3'>
            <h1 className='flex items-center gap-x-2 text-sm font-semibold antialiased'><CgDetailsMore size={18}/>Details</h1>
            </div>
            <div className='flex items-center w-full mt-3 p-3'>
              <div className='flex items-center gap-x-2'>
                By <Link href={`/${nft.username}`}><span className='w-96 flex truncate items-center gap-x-1 text-indigo-500 font-medium'>{nft.username} {nft.role == 'verified' ? <MdVerified size={18}/> : null}</span></Link>
              </div>
            </div>
            <div className='flex items-center w-full mb-3'>
              <div className='flex items-center px-3'>
                <p className='text-slate-400 text-sm'>{nft.description}</p>
              </div>
            </div>
            <div className='w-full bg-indigo-950 border border-indigo-500 py-2 px-3' onClick={() => setOpenAbout(!about)}>
              <h1 className='flex items-center gap-x-2 text-sm font-semibold antialiased relative'><BiDetail size={18}/>About {nft.username} {about ? <FiChevronUp size={18} className='flex items-center absolute right-0'/> : <FiChevronDown size={18} className='flex items-center absolute right-0'/>}</h1>
            </div>
            {about ? <div className='flex-col items-center w-full p-3'>
              <div className='flex items-center w-full gap-x-4'>
                <img src={users.filter(u => u.username == nft.username).map((user) => user.avatar)}
                alt={users.filter(u => u.username == nft.username).map((user) => user.username)}
                className='flex w-6 h-6 rounded-full self-start mt-3' />
                <p>{users.filter(u => u.username == nft.username).map((user) => user.description)}</p>
              </div>
              <div className='flex items-center w-full gap-x-3 mt-3 self-end justify-end'>
                <Link href={`${users.filter(u => u.username == nft.username).map((user) => user.instagram)}`}><BsInstagram size={18}/></Link>
                <Link href={`${users.filter(u => u.username == nft.username).map((user) => user.twitter)}`}><BsTwitter size={18}/></Link>
              </div>
            </div> : null}
            <div className='w-full bg-indigo-950 border border-indigo-500 py-2 px-3' onClick={() => setOpenContract(!contract)}>
              <h1 className='flex items-center gap-x-2 text-sm font-semibold antialiased relative'><LiaFileContractSolid size={18}/>Contract Details {contract ? <FiChevronUp size={18} className='flex items-center absolute right-0'/> : <FiChevronDown size={18} className='flex items-center absolute right-0'/>}</h1>
            </div>
            {contract ? <div className='flex-col items-center w-full p-3'>
            <div className='flex-col grid items-center w-full gap-y-3'>
              <div className='flex items-center w-full'>
                <span className='flex justify-start self-start items-center w-full'>Contract Address</span>
                <Link href={`https://etherscan.io/address/${nftcustom}`}><span className='flex justify-end self-end items-center font-semibold text-indigo-400'>{nftcustom.slice(0,5) + '...' + nftcustom.slice(38)}</span></Link>
              </div>
              <div className='flex items-center w-full'>
                <span className='flex justify-start self-start items-center w-full'>Token ID</span>
                <span className='flex justify-end self-end items-center font-semibold text-indigo-400 w-full'>{nft.tokenId}</span>
              </div>
              <div className='flex items-center w-full'>
                <span className='flex justify-start self-start items-center w-full'>Token Standard</span>
                <span className='flex justify-end self-end items-center font-semibold text-indigo-400 w-full'>ERC-721</span>
              </div>
              <div className='flex items-center w-full'>
                <span className='flex justify-start self-start items-center w-full'>Last Updated</span>
                <div className='flex justify-end self-end items-center font-semibold text-indigo-400 w-full'><TimeAgo timestamp={nft.createdAt}/></div>
              </div>
              <div className='flex items-center w-full'>
                <span className='flex justify-start self-start items-center w-full'>Creator Earnings</span>
                <div className='flex justify-end self-end items-center font-semibold text-indigo-400 w-full'>10%</div>
              </div>
            </div>
          </div> : null}
          </div>

          </div>
    
        </div>
    
        ))}
  
  
          </div>
          </Fragment>
        }
        {matches.medium &&
          <Fragment>
          <Head>
          <title>Auction Details • Cosmeta NFT Marketplace</title>
          </Head>

          <div className="flex justify-center items-center w-full">
          {!allauction.length ? <PreLoader/> : null}
        {allauction.map(nft => (
          
        /***  DETAILS ***/
        <div className="flex justify-between gap-x-4">
            {/*** MEDIA ***/}
            <div className="flex-col justify-start w-[450px] rounded-xl flex self-start">
            
            {nft.fileType == 'video/mp4' || nft.fileType == 'video/mov'
                ? <video src={nft.images} className="rounded-xl w-[450px]" autoPlay muted loop/>
                : nft.fileType == 'image/png' || nft.fileType == 'image/jpeg'  || nft.fileType == 'image/jpg' || nft.fileType == 'image/webp'   ? <img className='rounded-xl object-cover w-[450px]' src={nft.images} />
                : nft.fileType == 'audio/mp3' || nft.fileType == 'audio/wav' || nft.fileType == 'audio/ogg' || nft.fileType == 'audio/mpeg' ? <AudioPlayer nft={nft.images} nftcover={nft.cover} nftname={nft.name} nftid={nft.id} detailpage={true}/> : null
            }
            <div className='w-[450px] flex items-center'></div>
            </div>
    
          <div className="flex-col justify-center items-center w-full">
            <div className="px-3 flex w-full my-2 items-center">
              <div>
                <span className='w-96 flex truncate items-center gap-x-1 text-indigo-500 font-medium'>{nft.name} {nft.role == 'verified' ? <MdVerified size={18}/> : null}</span>
              </div>
            </div>
            <div className="px-3 flex w-60 items-center mt-4">
              <div>
                <strong className='w-96 flex truncate text-slate-400'>{nft.description}</strong>
              </div>
            </div>
            <div className="rounded-md px-3 flex w-full items-center my-1">
              <div className='flex items-center gap-x-1'>
                <span className='text-sm font-thin'>Owned by</span><Link href={`/${nft.username}`} className='text-sm text-indigo-500'>{nft.owner.slice(0,5) + '...' + nft.owner.slice(38)} | {nft.username}</Link>
              </div>
            </div>
          
            <div className='border border-indigo-500 rounded-md w-[450px] p-5 my-5'>
              <p className='text-xl antialiased font-light'>Set the offer time</p>
              <form onSubmit={(e) => handleSubmit(e,nft.tokenId)} className="grid gap-y-2 my-3">
              <div>
                <input
                className="w-full bg-indigo-950 hover:bg-indigo-900 py-2 px-3 rounded-lg border-2 border-indigo-500 hover:border-indigo-400 text-slate-50 placeholder:text-indigo-500"
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
                className="w-full bg-indigo-950 hover:bg-indigo-900 py-2 px-3 rounded-lg border-2 border-indigo-500 hover:border-indigo-400 text-indigo-500"
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
                <button className='bg-indigo-950 py-3 px-7 rounded-md hover:bg-indigo-600 w-full border-2 border-indigo-500' type="submit">Offer Item</button> 
              </div>
              </form>
            </div>

            <div className='flex-col w-[450px] border border-indigo-500 rounded-md mt-5'>
            <div className='w-full bg-indigo-950 rounded-t-md border-b border-indigo-500 py-2 px-3'>
            <h1 className='flex items-center gap-x-2 text-sm font-semibold antialiased'><CgDetailsMore size={18}/>Details</h1>
            </div>
            <div className='flex items-center w-full mt-3 p-3'>
              <div className='flex items-center gap-x-2'>
                By <Link href={`/${nft.username}`}><span className='w-96 flex truncate items-center gap-x-1 text-indigo-500 font-medium'>{nft.username} {nft.role == 'verified' ? <MdVerified size={18}/> : null}</span></Link>
              </div>
            </div>
            <div className='flex items-center w-full mb-3'>
              <div className='flex items-center px-3'>
                <p className='text-slate-400 text-sm'>{nft.description}</p>
              </div>
            </div>
            <div className='w-full bg-indigo-950 border border-indigo-500 py-2 px-3' onClick={() => setOpenAbout(!about)}>
              <h1 className='flex items-center gap-x-2 text-sm font-semibold antialiased relative'><BiDetail size={18}/>About {nft.username} {about ? <FiChevronUp size={18} className='flex items-center absolute right-0'/> : <FiChevronDown size={18} className='flex items-center absolute right-0'/>}</h1>
            </div>
            {about ? <div className='flex-col items-center w-full p-3'>
              <div className='flex items-center w-full gap-x-4'>
                <img src={users.filter(u => u.username == nft.username).map((user) => user.avatar)}
                alt={users.filter(u => u.username == nft.username).map((user) => user.username)}
                className='flex w-6 h-6 rounded-full self-start mt-3' />
                <p>{users.filter(u => u.username == nft.username).map((user) => user.description)}</p>
              </div>
              <div className='flex items-center w-full gap-x-3 mt-3 self-end justify-end'>
                <Link href={`${users.filter(u => u.username == nft.username).map((user) => user.instagram)}`}><BsInstagram size={18}/></Link>
                <Link href={`${users.filter(u => u.username == nft.username).map((user) => user.twitter)}`}><BsTwitter size={18}/></Link>
              </div>
            </div> : null}
            <div className='w-full bg-indigo-950 border border-indigo-500 py-2 px-3' onClick={() => setOpenContract(!contract)}>
              <h1 className='flex items-center gap-x-2 text-sm font-semibold antialiased relative'><LiaFileContractSolid size={18}/>Contract Details {contract ? <FiChevronUp size={18} className='flex items-center absolute right-0'/> : <FiChevronDown size={18} className='flex items-center absolute right-0'/>}</h1>
            </div>
            {contract ? <div className='flex-col items-center w-full p-3'>
            <div className='flex-col grid items-center w-full gap-y-3'>
              <div className='flex items-center w-full'>
                <span className='flex justify-start self-start items-center w-full'>Contract Address</span>
                <Link href={`https://etherscan.io/address/${nftcustom}`}><span className='flex justify-end self-end items-center font-semibold text-indigo-400'>{nftcustom.slice(0,5) + '...' + nftcustom.slice(38)}</span></Link>
              </div>
              <div className='flex items-center w-full'>
                <span className='flex justify-start self-start items-center w-full'>Token ID</span>
                <span className='flex justify-end self-end items-center font-semibold text-indigo-400 w-full'>{nft.tokenId}</span>
              </div>
              <div className='flex items-center w-full'>
                <span className='flex justify-start self-start items-center w-full'>Token Standard</span>
                <span className='flex justify-end self-end items-center font-semibold text-indigo-400 w-full'>ERC-721</span>
              </div>
              <div className='flex items-center w-full'>
                <span className='flex justify-start self-start items-center w-full'>Last Updated</span>
                <div className='flex justify-end self-end items-center font-semibold text-indigo-400 w-full'><TimeAgo timestamp={nft.createdAt}/></div>
              </div>
              <div className='flex items-center w-full'>
                <span className='flex justify-start self-start items-center w-full'>Creator Earnings</span>
                <div className='flex justify-end self-end items-center font-semibold text-indigo-400 w-full'>10%</div>
              </div>
            </div>
          </div> : null}
          </div>

          </div>
    
        </div>
    
        ))}
  
  
          </div>
          </Fragment>
        }          
        {matches.large &&
          <Fragment>
          <Head>
          <title>Auction Details • Cosmeta NFT Marketplace</title>
          </Head>

          <div className="flex justify-center items-center w-full">
          {!allauction.length ? <PreLoader/> : null}
        {allauction.map(nft => (
          
        /***  DETAILS ***/
        <div className="flex justify-between gap-x-4">
            {/*** MEDIA ***/}
            <div className="flex-col justify-start w-[600px] rounded-xl flex self-start">
            
            {nft.fileType == 'video/mp4' || nft.fileType == 'video/mov'
                ? <video src={nft.images} className="rounded-xl w-[600px]" autoPlay muted loop/>
                : nft.fileType == 'image/png' || nft.fileType == 'image/jpeg'  || nft.fileType == 'image/jpg' || nft.fileType == 'image/webp'   ? <img className='rounded-xl object-cover w-[600px]' src={nft.images} />
                : nft.fileType == 'audio/mp3' || nft.fileType == 'audio/wav' || nft.fileType == 'audio/ogg' || nft.fileType == 'audio/mpeg' ? <AudioPlayer nft={nft.images} nftcover={nft.cover} nftname={nft.name} nftid={nft.id} detailpage={true}/> : null
            }
            <div className='w-[600px] flex items-center'></div>
            </div>
    
          <div className="flex-col justify-center items-center w-full">
            <div className="px-3 flex w-full my-2 items-center">
              <div>
                <span className='w-96 flex truncate items-center gap-x-1 text-indigo-500 font-medium'>{nft.name} {nft.role == 'verified' ? <MdVerified size={18}/> : null}</span>
              </div>
            </div>
            <div className="px-3 flex w-60 items-center mt-4">
              <div>
                <strong className='w-96 flex truncate text-slate-400'>{nft.description}</strong>
              </div>
            </div>
            <div className="rounded-md px-3 flex w-full items-center my-1">
              <div className='flex items-center gap-x-1'>
                <span className='text-sm font-thin'>Owned by</span><Link href={`/${nft.username}`} className='text-sm text-indigo-500'>{nft.owner.slice(0,5) + '...' + nft.owner.slice(38)} | {nft.username}</Link>
              </div>
            </div>
          
            <div className='border border-indigo-500 rounded-md w-[600px] p-5 my-5'>
              <p className='text-xl antialiased font-light'>Set the offer time</p>
              <form onSubmit={(e) => handleSubmit(e,nft.tokenId)} className="grid gap-y-2 my-3">
              <div>
                <input
                className="w-full bg-indigo-950 hover:bg-indigo-900 py-2 px-3 rounded-lg border-2 border-indigo-500 hover:border-indigo-400 text-slate-50 placeholder:text-indigo-500"
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
                className="w-full bg-indigo-950 hover:bg-indigo-900 py-2 px-3 rounded-lg border-2 border-indigo-500 hover:border-indigo-400 text-indigo-500"
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
                <button className='bg-indigo-950 py-3 px-7 rounded-md hover:bg-indigo-600 w-full border-2 border-indigo-500' type="submit">Offer Item</button> 
              </div>
              </form>
            </div>

            <div className='flex-col w-[600px] border border-indigo-500 rounded-md mt-5'>
            <div className='w-full bg-indigo-950 rounded-t-md border-b border-indigo-500 py-2 px-3'>
            <h1 className='flex items-center gap-x-2 text-sm font-semibold antialiased'><CgDetailsMore size={18}/>Details</h1>
            </div>
            <div className='flex items-center w-full mt-3 p-3'>
              <div className='flex items-center gap-x-2'>
                By <Link href={`/${nft.username}`}><span className='w-96 flex truncate items-center gap-x-1 text-indigo-500 font-medium'>{nft.username} {nft.role == 'verified' ? <MdVerified size={18}/> : null}</span></Link>
              </div>
            </div>
            <div className='flex items-center w-full mb-3'>
              <div className='flex items-center px-3'>
                <p className='text-slate-400 text-sm'>{nft.description}</p>
              </div>
            </div>
            <div className='w-full bg-indigo-950 border border-indigo-500 py-2 px-3' onClick={() => setOpenAbout(!about)}>
              <h1 className='flex items-center gap-x-2 text-sm font-semibold antialiased relative'><BiDetail size={18}/>About {nft.username} {about ? <FiChevronUp size={18} className='flex items-center absolute right-0'/> : <FiChevronDown size={18} className='flex items-center absolute right-0'/>}</h1>
            </div>
            {about ? <div className='flex-col items-center w-full p-3'>
              <div className='flex items-center w-full gap-x-4'>
                <img src={users.filter(u => u.username == nft.username).map((user) => user.avatar)}
                alt={users.filter(u => u.username == nft.username).map((user) => user.username)}
                className='flex w-6 h-6 rounded-full self-start mt-3' />
                <p>{users.filter(u => u.username == nft.username).map((user) => user.description)}</p>
              </div>
              <div className='flex items-center w-full gap-x-3 mt-3 self-end justify-end'>
                <Link href={`${users.filter(u => u.username == nft.username).map((user) => user.instagram)}`}><BsInstagram size={18}/></Link>
                <Link href={`${users.filter(u => u.username == nft.username).map((user) => user.twitter)}`}><BsTwitter size={18}/></Link>
              </div>
            </div> : null}
            <div className='w-full bg-indigo-950 border border-indigo-500 py-2 px-3' onClick={() => setOpenContract(!contract)}>
              <h1 className='flex items-center gap-x-2 text-sm font-semibold antialiased relative'><LiaFileContractSolid size={18}/>Contract Details {contract ? <FiChevronUp size={18} className='flex items-center absolute right-0'/> : <FiChevronDown size={18} className='flex items-center absolute right-0'/>}</h1>
            </div>
            {contract ? <div className='flex-col items-center w-full p-3'>
            <div className='flex-col grid items-center w-full gap-y-3'>
              <div className='flex items-center w-full'>
                <span className='flex justify-start self-start items-center w-full'>Contract Address</span>
                <Link href={`https://etherscan.io/address/${nftcustom}`}><span className='flex justify-end self-end items-center font-semibold text-indigo-400'>{nftcustom.slice(0,5) + '...' + nftcustom.slice(38)}</span></Link>
              </div>
              <div className='flex items-center w-full'>
                <span className='flex justify-start self-start items-center w-full'>Token ID</span>
                <span className='flex justify-end self-end items-center font-semibold text-indigo-400 w-full'>{nft.tokenId}</span>
              </div>
              <div className='flex items-center w-full'>
                <span className='flex justify-start self-start items-center w-full'>Token Standard</span>
                <span className='flex justify-end self-end items-center font-semibold text-indigo-400 w-full'>ERC-721</span>
              </div>
              <div className='flex items-center w-full'>
                <span className='flex justify-start self-start items-center w-full'>Last Updated</span>
                <div className='flex justify-end self-end items-center font-semibold text-indigo-400 w-full'><TimeAgo timestamp={nft.createdAt}/></div>
              </div>
              <div className='flex items-center w-full'>
                <span className='flex justify-start self-start items-center w-full'>Creator Earnings</span>
                <div className='flex justify-end self-end items-center font-semibold text-indigo-400 w-full'>10%</div>
              </div>
            </div>
          </div> : null}
          </div>

          </div>
    
        </div>
    
        ))}
  
  
          </div>
          </Fragment>
        }
      </Fragment>
    )}
    </Media>
    </div>
    );
};


export default AuctionNFTPage;
export const getServerSideProps = async (context) => {

  const param = context.params.auctionft

  return{
      props:{
          param
      }
  }
}