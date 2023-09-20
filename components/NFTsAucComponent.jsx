import React from "react";
import Link from "next/link";
import { AiFillHeart,AiOutlineHeart } from 'react-icons/ai';
import {BiCommentDetail} from 'react-icons/bi';
import Countdown from "./Countdown";
import { useState,useEffect,useContext } from "react";
import { DataContext } from "@/store/GlobalState";
import TimeAgo from "./TimeAgo";
import { useRouter } from 'next/router';
import { AudioPlayer } from ".";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { useStateContext } from '../context/StateContext';
import Auction from '@/engine/Auction.json'

const NFTsAucComponent = ({auth,nft,buyNewMum,duration}) => {

  const {state,dispatch} = useContext(DataContext)
  const router = useRouter()
  const [likeon,setLikeOn] = useState(false)
  const [isLiked,setLiked] = useState(false)
  const [users,setUsers] = useState([])
  const [content,setContent] = useState([])
  const [isclick,isButtonClickable] = useState(true)
  const {auction,nftcustom} = useStateContext();
  const [addr,setAddr] = useState("")

  // const handleLikesSSE = () => {
  //   const likesSSE = new EventSource("/api/sse");
  //   likesSSE.onmessage = (event) => {
  //     const data = JSON.parse(event.data);
  //     // SSE'den gelen verileri kullanarak sayfadaki like sayısını güncelleyebilirsiniz.
  //     // console.log(data);
  //   };
  // };

  
  useEffect(() => {
    getNFTs();
    getUsers();
    setAddr(window?.ethereum?.selectedAddress)
  },[])

  const getUsers = async () => {
    await fetch('https://testmarket.cos-in.com/api/users').then(res => {
      if(!res.ok){
        throw new Error("HTTP ERROR",res.status)
      }
      return res
    }).then(res => res.json()).then(data => {
      setUsers(data)
    })
  }
  const getNFTs = async () => {
    await fetch('https://testmarket.cos-in.com/api/setnft').then(res => {
      if(!res.ok){
        throw new Error("HTTP ERROR",res.status)
      }
      return res
    }).then(res => res.json()).then(data => {
      setContent(data)
    })
  }

  const setLiker = async (e,nftId) => {
    e.preventDefault()
    // console.log("nftID",nftId)
    if(isclick){

      // Tıklamayı engelleyin
      isButtonClickable(false);

      // Belirli bir süre sonra tıklamayı tekrar etkinleştirin
      setTimeout(() => {
        isButtonClickable(true);
      }, 4000); // Örneğin, 4 saniye
    }
    const likerdata = {
      liker:auth?.user?.id,
      likeravatar: auth?.user?.avatar,
      nftId:nftId
    }
    const exectuser = users.filter(u => u.username == auth?.user?.username)
    const userid = exectuser._id
    const contentnft = content.filter(u => u._id == nftid)
    const exectlike = contentnft.filter(u => u.liker == userid)
    // console.log("nftId",nftId)
    if(!exectlike.includes(userid)){
      const res = await fetch("https://testmarket.cos-in.com/api/likes", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(likerdata),
      });
      setLiked(true)
      if(isLiked == true){
        // const das = datas.filter(u => u._id == nftId).map(nft => nft.likes.length)
        // setLikeOn(das)
      }
      if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err} })
        dispatch({ type: 'NOTIFY', payload: {success: res.msg} })
      router.reload(window.location.pathname)
    }else{
      await deleteLiker(nftId,e)
    }

  }

  const deleteLiker = async (nftid,e) => {
    e.preventDefault()
    const deletedata = {
      liker:auth?.user?.id,
      nftId:nftid
    }
    const res = await fetch("https://testmarket.cos-in.com/api/likes", {
    method: "DELETE", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(deletedata),
  });
    setLiked(false)
    // const das = datas.map(nft => nft.likes.length)
    // setLikeOn(das)
    if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err} })
      dispatch({ type: 'NOTIFY', payload: {success: res.msg} })
      router.reload(window.location.pathname)
  }

  const handleClaim = async (e,tokenid,winner) => {
    try {
      
    e.preventDefault()

    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(auction, Auction, signer)
    let transaction = await contract.claimPrize(tokenid,winner,0)
    let tx = await transaction.wait()
    console.log("tx",tx);
  } catch (error) {
      alert(error.reason.substr(20))
  }
  }

  return (
    <div key={nft.id} className="w-[300px] border-slate-800 relative hover:bottom-2 border-2 bg-gradient-to-tr to-slate-600 from-slate-900 border-r-slate-700 rounded-lg overflow-hidden ">
    <div className='flex items-center w-full absolute top-0'>
      <div className='items-center w-full'>
        <img src={nft.wichNet == 'Ethereum' ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/480px-Ethereum-icon-purple.svg.png' : nft.wichNet == 'Polygon' ? 'https://cryptologos.cc/logos/polygon-matic-logo.png' : nft.wichNet == 'Binance' ? 'https://seeklogo.com/images/B/binance-coin-bnb-logo-97F9D55608-seeklogo.com.png' : null} className="z-30 object-cover w-5 absolute top-2 left-2"/>
      </div>
      <div>
      </div>
      </div>
      {nft.fileType == 'video/mp4'
      ? <><Link href={`/details/${nft._id}`}><video src={nft.images} className="w-full h-[296px] object-cover rounded-t-lg" autoPlay muted loop/></Link></>
      : nft.fileType == 'image/png' || nft.fileType == 'image/jpeg'  || nft.fileType == 'image/jpg' || nft.fileType == 'image/webp' ? <><Link href={`/details/${nft._id}`}><img src={nft.images} className="w-full h-[296px] rounded-t-lg object-cover" /></Link></>
      : nft.fileType == 'audio/mp3' || nft.fileType == 'audio/wav' || nft.fileType == 'audio/ogg' || 'audio/mpeg' ? <AudioPlayer nft={nft.images} nftname={nft.name} nftid={nft._id}/> : null
      }
      <div className='flex-col px-5'>
              <div className='flex justify-between items-center w-full my-3'>
              <div className="flex justify-between items-center w-full">
              <div className='justify-start items-center'>
                <Link href={`/${nft.username}`}><div className="text-md font-medium cursor-pointer text-purple-500 flex items-center gap-x-1">{nft.avatar ? <img src={nft.avatar} className="rounded-full w-3 mr-1"/>:null}{!nft.username == "" ? nft.username : user.slice(0,11) + '...'} {nft.role == 'verified' ? <MdVerified size={18}/>: null}</div></Link>
              </div>
              </div>

                <div className='justify-end items-center w-16 animate-pulse'>
                <h3 className={nft.live == true ? 'font-bold text-sm text-center bg-red-600 text-slate-50 py-1 px-3 rounded-md' : 'font-bold text-sm text-center bg-slate-700 text-slate-50 py-1 px-3 rounded-md'}>{nft.live == true ? "LIVE" : "Auction Expired"}</h3>
                </div>
              
              </div>
              
              <div className="flex justify-between items-center w-full">
              <h1 className='font-medium text-lg text-slate-400'>{nft.name}</h1>
              <TimeAgo timestamp={nft.createdAt} />
              </div>
            <div className="my-3">
            <p className="text-slate-400 text-sm">{nft.description}</p>
            {nft.bids == 0 ?
              <div className="flex items-center gap-x-1.5 my-3 text-slate-400"><strong title="No have bid yet">Price : &nbsp;{nft.price}</strong><img src='https://etherscan.io/token/images/cosmeta_32.png' className='object-cover w-5' title='Crypto International (CRI)' /></div>
              :<div className="flex items-center gap-x-1.5 my-3 text-orange-400 animate-pulse"><strong>Last Bid : &nbsp;{nft.bidprice}</strong><img src='https://etherscan.io/token/images/cosmeta_32.png' className='object-cover w-5' title='Crypto International (CRI)' /></div>
            }
            
            {nft.winner != "0x0000000000000000000000000000000000000000" ? <div className="text-sm flex gap-x-2 text-slate-400 my-3"><strong>Winner : </strong><span>{nft.winner.slice(0,5) + '...' + nft.winner.slice(38)}</span></div> : <span className="text-slate-400">Not have a winner</span>}
            <Countdown timestamp={duration + "000"}/>
            </div>

              <div className='flex justify-between items-center w-full mb-3'>
              <div className='flex items-center gap-x-2'>
              <div>


              {auth?.user ? 
                auth?.user?.liked.find(u => u.includes(nft._id)) ? 
                <button onClick={() => setLiked(false)}><AiFillHeart size={20} className='cursor-pointer text-red-500 hover:text-white' onClick={() => deleteLiker(nft._id)} /></button> : 
                <button disabled={!isclick} onClick={(e) => setLiker(e,nft._id)}><AiOutlineHeart size={20} className=' cursor-pointer hover:text-red-500' /></button> :
                <Link href="/login"><AiOutlineHeart size={20} className=' cursor-pointer hover:text-red-500'/></Link>
              }

              
              </div>
                <div className='flex items-center mb-1.5 gap-x-2 text-sm'>
                <strong>{nft.likes.length}</strong><span>Like</span>
                </div>
              </div>
              <div className='flex items-center gap-x-2 text-sm'>
                <div>
                <Link href={`/details/${nft._id}`}><BiCommentDetail size={20} className='cursor-pointer'/></Link>
                </div>
                <div className='text-sm flex items-center gap-x-2'>
                <strong>{nft.comments.length}</strong><span>Comments</span>
                </div>
              </div>
            </div>
              </div>
              <div className='flex justify-between items-center mx-2 gap-x-2 pb-3'>
              <div className='w-full'>

              {nft.duration + "000" > Date.now() ? <Link href={`/placebid/${nft.id}`} className='flex justify-center bg-gradient-to-tr to-slate-900 z-30 border-[1px] border-slate-700 rounded-lg from-slate-900 hover:to-purple-600 hover:from-blue-700 relative w-full h-10 text-slate-400'>Place Bid</Link>
               : <>{nft.winner == addr ? <button type="button" className="w-full py-2 bg-orange-500 hover:bg-orange-600 rounded-lg antialiased" onClick={(e) => handleClaim(e,nft.itemId,nft.winner)}>Claim</button> : null}</>
              }
              </div>
              </div>
    </div>
    );
};

export default NFTsAucComponent;
