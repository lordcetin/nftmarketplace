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
import AllBidders from '../../components/AllBidders';
import Token from '@/engine/Token.json';
import { render } from 'react-dom';
import {FaUser} from 'react-icons/fa'
import TimeAgo from "../../components/TimeAgo";
import Head from 'next/head';

const PlaceBid = ({param}) => {

  const {user,getUser,connectUser,auction,cri,rpc,cipher} = useStateContext();
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
  const [uid,setUid] = useState(null);
  const [loaded,setLoaded] = useState(false);
  const [mmbidders,MumsetBidders] = useState([]);
  const [tokenID,setTokenId] = useState(null);

  const [sec,setSec] = useState(0);
  const [min,setMin] = useState(0);
  const [hour,setHour] = useState(0);
  const [day,setDay] = useState(0);
  
  const router = useRouter();

  useEffect(() => {
    getNFTs()
  },[])

  const getNFTs = async () => {
    await fetch('http://localhost:3000/api/setnft').then(res => {
      if(!res.ok){
        throw new Error("HTTP ERROR",res.status)
      }
      return res
    }).then(res => res.json()).then(data => {
      MumAllAuction(data.filter(u => u.id == param))
    })
  }

  const allAuction = async () => {
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
    MumAllAuction(items.filter(u => u.id == param))
  }

const handleBidSubmit = async (e,tokenId,id) => {
  e.preventDefault()

  const web3Modal = new Web3Modal()
  const connection = await web3Modal.connect()
  const provider = new ethers.providers.Web3Provider(connection)
  const signer = provider.getSigner()

  let bidprice = ethers.utils.parseUnits(formInput.bidprice, 'ether')
  bidprice = bidprice.toString()

  console.log(bidprice)

  let cosmeta = new ethers.Contract(cri,Token,signer);


  // let approve = await cosmeta.approve(auction,bidprice)
  // await approve.wait()

  const contract = new ethers.Contract(auction, Auction, signer)


  // let gasPrice = new ethers.utils.parseUnits('30', 'gwei')

  const tokenids = allauction.find(u => u.tokenId == tokenId);
  const itemId = tokenids.itemId;

  await cosmeta.increaseAllowance(auction, ethers.utils.parseEther(bidprice.toString()))//ethers.utils.parseEther(price.toString())
  const transaction = await contract.placeBid(tokenId,{value: bidprice})
  await transaction.wait()
  const bid = await contract.getAuction(tokenId).then(data => {return data})
  let bidcount = Number(bid.bids);
  const idtoup = allauction[0]._id;
  const updatedata = {
    id:idtoup,
    bids:bidcount,
    bidprice: formInput.bidprice,
    winner:user,
  }
    const res = await fetch("http://localhost:3000/api/setnft", {
    method: "PUT", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedata),
  });

}

useEffect(() => {
  let token = allauction.filter(u => u.id == param).map(i => Number(i.tokenId))
  let tokenid = Number(token)
  setTokenId(tokenid)
})
  
useEffect(() => {
  loadBidders()
})

const loadBidders = async () => {
  try {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
  let auctioncontract = new ethers.Contract(auction, Auction, signer)
  const data = await auctioncontract.getBidders(Number(tokenID))
  const items = await Promise.all(data.map(async i => {
    let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
    let item = {
      price:price,
      bidder:i.bidder,
      bidtime:i.timestamp.toNumber(),
      refunded:i.refunded,
      won:i.won
    }
    return item
  }))
  MumsetBidders(items.reverse().slice(0,`${count}`))
  } catch (error) {
    console.log(error)
  }
  }

const handleClaim = async (x) => {
  const web3Modal = new Web3Modal()
  const connection = await web3Modal.connect()
  const provider = new ethers.providers.Web3Provider(connection)
  const signer = provider.getSigner()
  const gasPrice = ethers.utils.parseUnits('20', 'gwei');
  let cosmeta = new ethers.Contract(cri,Token,signer);

  const contract = new ethers.Contract(auction, Auction, signer)
  //await cosmeta.increaseAllowance(auction, bidprice)//ethers.utils.parseEther(price.toString())
  const transaction = await contract.claimPrize(tokenID,x,{gasPrice:gasPrice})
  await transaction.wait()
}
  useEffect(() => {
    connectUser()
  }, [getUser]);

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
          <title>Place Bid • Cosmeta NFT Marketplace</title>
          </Head>
            {allauction.map((i,k) => 
              <div key={k} className="flex justify-center items-center w-full h-full px-7">
              <div className="flex-col justify-between items-center w-full text-slate-900 gap-x-5">
              <div className="w-ful flex justify-center items-center">
              <a>{i.fileType == "video/mp4"
              ? <video src={i.images} autoPlay loop muted className='rounded-xl object-cover w-[700px] h-[700px] border-[1px] border-slate-400'/>
              : i.fileType == "image/png" || i.fileType == "image/jpeg" || i.fileType == "image/jpg" || i.fileType == "image/svg" || i.fileType == "image/webp"
              ? <img className='rounded-xl object-cover w-[300px] h-[300px] border-[1px] border-slate-400' src={i.images} alt={i.name}/>
              : i.fileType == "audio/mp3" ||  i.fileType == "audio/ogg" || i.fileType == "audio/wav" || i.fileType == "audio/mpeg"
              ? <AudioPlayer nft={i.images} nftname={i.name}/> : null
              }</a>
            </div>

          <div className='flex-col w-full h-[700px] justify-center items-center'>
                <div>
                <div className="flex items-center font-bold text-slate-50 mt-5 mb-1 gap-x-2"><span className="text-2xl">All Bidders</span><span className="bg-slate-700 rounded w-6 h-6 flex justify-center items-center text-center">{mmbidders.length}</span></div>
                <div className="flex-cols items-center w-full text-slate-400 h-[548px] mb-[4px] rounded-b-2xl overflow-y-scroll scroll-m-0 scrollbar-thin scrollbar-track-transparent">
                  {mmbidders.map((z,x) => {
                    return (
                      <div key={x}>
                      {i.winner == user && z.bidder == i.winner && Date.now() > i.duration + '000' ? <button className="border-[1px] border-yellow-300 bg-gradient-to-tl to-orange-400 from-yellow-300 text-yellow-200 text-xl font-bold rounded-md px-3 py-3 my-2 w-full animate-pulse" onClick={() => handleClaim(x)}>Claim Prize</button> : (
                      <div className="border-[1px] border-slate-700 rounded-md px-3 py-3 my-2">
                      <div className="flex justify-between items-center w-full gap-x-3">
                      <div className="justify-start items-center flex gap-x-2"><FaUser size={14}/><span>{z.bidder.slice(0,5) + '...' + z.bidder.slice(38)}</span></div>
                      <div className="flex justify-center items-center gap-x-1"><strong>{z.price}</strong><img src='https://etherscan.io/token/images/cosmeta_32.png' className='object-cover w-5' title='Crypto International (CRI)' /></div>
                      <div className="justify-end flex"><TimeAgo timestamp={z.bidtime + '000'}/></div>
                      </div>
                      </div>)}
                      </div>
                      )
                  })}
                
                </div>
                </div>
              <div className='w-full justify-center items-center'>
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
              <button onClick={(e) => handleBidSubmit(e,i.tokenId)} className='bg-gradient-to-tr to-slate-900 z-30 border-[1px] border-slate-700 rounded-lg from-slate-900 hover:to-purple-600 hover:from-blue-700 relative w-full h-10 text-slate-400' type="submit">Place Bid</button> 
              </div>
          
              </form>
              </div>

          </div>
            </div>
            </div>
            )}
          </Fragment>
        }
        {matches.medium &&
          <Fragment>
          <Head>
          <title>Place Bid • Cosmeta NFT Marketplace</title>
          </Head>
            {allauction.map((i,k) => 
              <div key={k} className="flex justify-center items-center w-full h-full pb-40 px-7">
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

          <div className='flex-col w-full h-[700px] justify-center items-center'>
                <div>
                <div className="flex items-center font-bold text-slate-50 mt-5 mb-1 gap-x-2"><span className="text-2xl">All Bidders</span><span className="bg-slate-700 rounded w-6 h-6 flex justify-center items-center text-center">{mmbidders.length}</span></div>
                <div className="flex-cols items-center w-full text-slate-400 h-[548px] mb-[4px] rounded-b-2xl overflow-y-scroll scroll-m-0 scrollbar-thin scrollbar-track-transparent">
                  {mmbidders.map((z,x) => {
                    return (
                      <div key={x}>
                      {i.winner == user && z.bidder == i.winner && Date.now() > i.duration + '000' ? <button className="border-[1px] border-yellow-300 bg-gradient-to-tl to-orange-400 from-yellow-300 text-yellow-200 text-xl font-bold rounded-md px-3 py-3 my-2 w-full animate-pulse" onClick={() => handleClaim(x)}>Claim Prize</button> : (
                      <div className="border-[1px] border-slate-700 rounded-md px-3 py-3 my-2">
                      <div className="flex justify-between items-center w-full gap-x-3">
                      <div className="justify-start items-center flex gap-x-2"><FaUser size={14}/><span>{z.bidder.slice(0,5) + '...' + z.bidder.slice(38)}</span></div>
                      <div className="flex justify-center items-center gap-x-1"><strong>{z.price}</strong><img src='https://etherscan.io/token/images/cosmeta_32.png' className='object-cover w-5' title='Crypto International (CRI)' /></div>
                      <div className="justify-end flex"><TimeAgo timestamp={z.bidtime + '000'}/></div>
                      </div>
                      </div>)}
                      </div>
                      )
                  })}
                
                </div>
                </div>
              <div className='w-full justify-center items-center'>
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
              <button onClick={(e) => handleBidSubmit(e,i.tokenId)} className='bg-gradient-to-tr to-slate-900 z-30 border-[1px] border-slate-700 rounded-lg from-slate-900 hover:to-purple-600 hover:from-blue-700 relative w-full h-10 text-slate-400' type="submit">Place Bid</button> 
              </div>
          
              </form>
              </div>

          </div>
            </div>
            </div>
            )}
          </Fragment>
        }          
        {matches.large &&
          <Fragment>
          <Head>
          <title>Place Bid • Cosmeta NFT Marketplace</title>
          </Head>
            {allauction.map((i,k) => 
              <div key={k} className="flex justify-center items-center w-full h-full pb-40 px-7">
              <div className="flex justify-between items-center w-full text-slate-900 gap-x-5">
              <div className="w-full flex justify-end items-center">
              <a>{i.fileType == "video/mp4"
              ? <video src={i.images} autoPlay loop muted className='rounded-xl object-cover w-[700px] h-[700px] border-[1px] border-slate-400'/>
              : i.fileType == "image/png" || i.fileType == "image/jpeg" || i.fileType == "image/jpg" || i.fileType == "image/svg" || i.fileType == "image/webp"
              ? <img className='rounded-xl object-cover w-[700px] h-[700px] border-[1px] border-slate-400' src={i.images} alt={i.name}/>
              : i.fileType == "audio/mp3" ||  i.fileType == "audio/ogg" || i.fileType == "audio/wav" || i.fileType == "audio/mpeg"
              ? <AudioPlayer nft={i.images} nftname={i.name}/> : null
              }</a>
            </div>

          <div className='flex-col w-full h-[700px] justify-center items-center'>
                <div>
                <div className="flex items-center font-bold text-slate-50 mt-5 mb-1 gap-x-2"><span className="text-2xl">All Bidders</span><span className="bg-slate-700 rounded w-6 h-6 flex justify-center items-center text-center">{mmbidders.length}</span></div>
                <div className="flex-cols items-center w-full text-slate-400 h-[548px] mb-[4px] rounded-b-2xl overflow-y-scroll scroll-m-0 scrollbar-thin scrollbar-track-transparent">
                  {mmbidders.map((z,x) => {
                    return (
                      <div key={x}>
                      {i.winner == user && z.bidder == i.winner && Date.now() > i.duration + '000' ? <button className="border-[1px] border-yellow-300 bg-gradient-to-tl to-orange-400 from-yellow-300 text-yellow-200 text-xl font-bold rounded-md px-3 py-3 my-2 w-full animate-pulse" onClick={() => handleClaim(x)}>Claim Prize</button> : (
                      <div className="border-[1px] border-slate-700 rounded-md px-3 py-3 my-2">
                      <div className="flex justify-between items-center w-full gap-x-3">
                      <div className="justify-start items-center flex gap-x-2"><FaUser size={14}/><span>{z.bidder.slice(0,5) + '...' + z.bidder.slice(38)}</span></div>
                      <div className="flex justify-center items-center gap-x-1"><strong>{z.price}</strong><img src='https://etherscan.io/token/images/cosmeta_32.png' className='object-cover w-5' title='Crypto International (CRI)' /></div>
                      <div className="justify-end flex"><TimeAgo timestamp={z.bidtime + '000'}/></div>
                      </div>
                      </div>)}
                      </div>
                      )
                  })}
                
                </div>
                </div>
              <div className='w-full justify-center items-center'>
              <form onSubmit={(e) => handleBidSubmit(e,i.tokenId,i.id)} className="grid gap-y-2">
              <div>
              <input
              className="w-full bg-slate-800 hover:bg-slate-900 py-2 px-3 rounded-lg border-2 border-slate-700 hover:border-blue-500 text-slate-400"
              type="text"
              name="bidprice"
              placeholder="Price (CRI)"
              onChange={e => updateFormInput({ ...formInput, bidprice: e.target.value })}
              value={formInput.bidprice}
              required
            />
              </div>
              <div>
              <button type="submit" className='bg-gradient-to-tr to-slate-900 z-30 border-[1px] border-slate-700 rounded-lg from-slate-900 hover:to-purple-600 hover:from-blue-700 relative w-full h-10 text-slate-400' >Place Bid</button> 
              </div>
          
              </form>
              </div>

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

export default PlaceBid;
export const getServerSideProps = async (context) => {

  const param = context.params.placebid

  return{
      props:{
          param
      }
  }
}