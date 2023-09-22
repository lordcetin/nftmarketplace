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
          <title>NFT Details • Cosmeta NFT Marketplace</title>
          </Head>
            {allauction.map((i,k) => 
              <div key={k} className="flex justify-center items-center w-full h-full px-7">
              <div className="flex-col justify-between items-center w-full text-slate-900">
              <div className="w-full justify-center items-center">
              <a>{i.fileType == "video/mp4"
              ? <video src={i.images} autoPlay loop muted className='rounded-xl object-cover w-[700px] h-[700px] border-[1px] border-slate-400'/>
              : i.fileType == "image/png" || i.fileType == "image/jpeg" || i.fileType == "image/jpg" || i.fileType == "image/svg" || i.fileType == "image/webp"
              ? <img className='rounded-xl object-cover w-[700px] h-[700px] border-[1px] border-slate-400' src={i.images} alt={i.name}/>
              : i.fileType == "audio/mp3" ||  i.fileType == "audio/ogg" || i.fileType == "audio/wav" || i.fileType == "audio/mpeg"
              ? <AudioPlayer nft={i.images} nftname={i.name}/> : null
              }</a>
            </div>

          <div className='w-full h-[700px] justify-center items-center mt-5'>
					<div className='flex-col text-slate-400 grid gap-y-1 pb-10'>
							<div className='flex items-center'><span>Name :&nbsp;</span><h1 className='font-sans font-extrabold text-3xl'>{i.name}</h1></div>
							<div className='flex items-center'><span>Description :&nbsp;</span><p className='font-sans font-semibold text-lg'>{i.description}</p></div>
							{i.website ? <div className='flex items-center'><span>Website :</span><p className='font-sans font-semibold text-lg'>{i.website}</p> </div>: null}
							<div className='flex items-center'><span>Username :&nbsp;</span><p className='font-sans font-semibold text-lg'>{i.username}</p></div>
							<div className='flex items-center'><span>Owner :&nbsp;</span><p className='font-sans font-semibold text-lg'>{i.owner.slice(0,5) + '...' + i.owner.slice(38)}</p></div>
							<div className='flex items-center'><span>Network :&nbsp;</span><p className='font-sans font-semibold text-lg'>{i.wichNet}</p></div>
							<div className='flex items-center'><span>Price :&nbsp;</span><p className='font-sans font-semibold text-lg'>{i.price}&nbsp;CRI</p></div>
					</div>
          <form onSubmit={(e) => handleSubmit(e,i.tokenId)} className="grid gap-y-2">
          <div>
            <input
            className="w-96 bg-slate-800 hover:bg-slate-900 py-2 px-3 rounded-lg border-2 border-slate-700 hover:border-blue-500 text-slate-400"
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
            className="w-96 bg-slate-800 hover:bg-slate-900 py-2 px-3 rounded-lg border-2 border-slate-700 hover:border-blue-500 text-slate-400"
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
            <button className='bg-gradient-to-tr to-slate-900 z-30 border-[1px] border-slate-700 rounded-lg from-slate-900 hover:to-purple-600 hover:from-blue-700 relative w-96 h-10 text-slate-400' type="submit">Offer Item</button> 
          </div>
          </form>
          </div>
            </div>
            </div>
            )}
          </Fragment>
        }
        {matches.medium &&
          <Fragment>
          <Head>
          <title>NFT Details • Cosmeta NFT Marketplace</title>
          </Head>
            {allauction.map((i,k) => 
              <div key={k} className="flex justify-center items-center w-full h-full py-40 px-7">
              <div className="flex justify-between items-center w-full text-slate-900 gap-x-5">
              <div className="w-full justify-center items-center">
              <a>{i.fileType == "video/mp4"
              ? <video src={i.images} autoPlay loop muted className='rounded-xl object-cover w-[700px] h-[700px] border-[1px] border-slate-400'/>
              : i.fileType == "image/png" || i.fileType == "image/jpeg" || i.fileType == "image/jpg" || i.fileType == "image/svg" || i.fileType == "image/webp"
              ? <img className='rounded-xl object-cover w-[700px] h-[700px] border-[1px] border-slate-400' src={i.images} alt={i.name}/>
              : i.fileType == "audio/mp3" ||  i.fileType == "audio/ogg" || i.fileType == "audio/wav" || i.fileType == "audio/mpeg"
              ? <AudioPlayer nft={i.images} nftname={i.name}/> : null
              }</a>
            </div>

          <div className='w-full h-[700px] justify-center items-center'>
					<div className='flex-col text-slate-400 grid gap-y-1 pb-10'>
							<div className='flex items-center'><span>Name :&nbsp;</span><h1 className='font-sans font-extrabold text-3xl'>{i.name}</h1></div>
							<div className='flex items-center'><span>Description :&nbsp;</span><p className='font-sans font-semibold text-lg'>{i.description}</p></div>
							{i.website ? <div className='flex items-center'><span>Website :</span><p className='font-sans font-semibold text-lg'>{i.website}</p> </div>: null}
							<div className='flex items-center'><span>Username :&nbsp;</span><p className='font-sans font-semibold text-lg'>{i.username}</p></div>
							<div className='flex items-center'><span>Owner :&nbsp;</span><p className='font-sans font-semibold text-lg'>{i.owner.slice(0,5) + '...' + i.owner.slice(38)}</p></div>
							<div className='flex items-center'><span>Network :&nbsp;</span><p className='font-sans font-semibold text-lg'>{i.wichNet}</p></div>
							<div className='flex items-center'><span>Price :&nbsp;</span><p className='font-sans font-semibold text-lg'>{i.price}&nbsp;CRI</p></div>
					</div>
          <form onSubmit={(e) => handleSubmit(e,i.tokenId)} className="grid gap-y-2">
          <div>
            <input
            className="w-96 bg-slate-800 hover:bg-slate-900 py-2 px-3 rounded-lg border-2 border-slate-700 hover:border-blue-500 text-slate-400"
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
            className="w-96 bg-slate-800 hover:bg-slate-900 py-2 px-3 rounded-lg border-2 border-slate-700 hover:border-blue-500 text-slate-400"
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
            <button className='bg-gradient-to-tr to-slate-900 z-30 border-[1px] border-slate-700 rounded-lg from-slate-900 hover:to-purple-600 hover:from-blue-700 relative w-96 h-10 text-slate-400' type="submit">Offer Item</button> 
          </div>
          </form>
          </div>
            </div>
            </div>
            )}
          </Fragment>
        }          
        {matches.large &&
          <Fragment>
          <Head>
          <title>NFT Details • Cosmeta NFT Marketplace</title>
          </Head>
            {allauction.map((i,k) => 
              <div key={k} className="flex justify-center items-center w-full h-full pt-10 pb-40 px-7">
              <div className="flex justify-between items-center w-full text-slate-900 gap-x-5">
              <div className="w-full justify-center items-center">
              <a>{i.fileType == "video/mp4"
              ? <video src={i.images} autoPlay loop muted className='rounded-xl object-cover w-[700px] h-[700px] border-[1px] border-slate-400'/>
              : i.fileType == "image/png" || i.fileType == "image/jpeg" || i.fileType == "image/jpg" || i.fileType == "image/svg" || i.fileType == "image/webp"
              ? <img className='rounded-xl object-cover w-[700px] h-[700px] border-[1px] border-slate-400' src={i.images} alt={i.name}/>
              : i.fileType == "audio/mp3" ||  i.fileType == "audio/ogg" || i.fileType == "audio/wav" || i.fileType == "audio/mpeg"
              ? <AudioPlayer nft={i.images} nftname={i.name}/> : null
              }</a>
            </div>

          <div className='w-full h-[700px] justify-center items-center'>
					<div className='flex-col text-slate-400 grid gap-y-1 pb-10'>
							<div className='flex items-center'><span>Name :&nbsp;</span><h1 className='font-sans font-extrabold text-3xl'>{i.name}</h1></div>
							<div className='flex items-center'><span>Description :&nbsp;</span><p className='font-sans font-semibold text-lg'>{i.description}</p></div>
							{i.website ? <div className='flex items-center'><span>Website :</span><p className='font-sans font-semibold text-lg'>{i.website}</p> </div>: null}
							<div className='flex items-center'><span>Username :&nbsp;</span><p className='font-sans font-semibold text-lg'>{i.username}</p></div>
							<div className='flex items-center'><span>Owner :&nbsp;</span><p className='font-sans font-semibold text-lg'>{i.owner.slice(0,5) + '...' + i.owner.slice(38)}</p></div>
							<div className='flex items-center'><span>Network :&nbsp;</span><p className='font-sans font-semibold text-lg'>{i.wichNet}</p></div>
							<div className='flex items-center'><span>Price :&nbsp;</span><p className='font-sans font-semibold text-lg'>{i.price}&nbsp;CRI</p></div>

					</div>
          <form onSubmit={(e) => handleSubmit(e,i.tokenId)} className="grid gap-y-2">
          <div>
            <input
            className="w-96 bg-slate-800 hover:bg-slate-900 py-2 px-3 rounded-lg border-2 border-slate-700 hover:border-blue-500 text-slate-400"
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
            className="w-96 bg-slate-800 hover:bg-slate-900 py-2 px-3 rounded-lg border-2 border-slate-700 hover:border-blue-500 text-slate-400"
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
            <button className='bg-gradient-to-tr to-slate-900 z-30 border-[1px] border-slate-700 rounded-lg from-slate-900 hover:to-purple-600 hover:from-blue-700 relative w-96 h-10 text-slate-400' type="submit">Offer Item</button> 
          </div>
          </form>
          </div>
            </div>
            </div>
            )}
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