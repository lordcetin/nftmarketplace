import React from "react";
import Link from "next/link";
import { AiFillHeart,AiOutlineHeart } from 'react-icons/ai';
import {BiCommentDetail} from 'react-icons/bi';
import {SiOpensea} from 'react-icons/si';
import Countdown from "./Countdown";
import { useState,useEffect,useContext } from "react";
import { DataContext } from "@/store/GlobalState";
import TimeAgo from "./TimeAgo";
import { useRouter } from "next/router";
// import { io } from 'socket.io-client';
import { useStateContext } from "../context/StateContext";
import { AudioPlayer } from "./";

const NFTsComponent = ({auth,nft,buyNewMum}) => {
// let socket = io();
const {nftcustom,user} = useStateContext();
  const {state,dispatch} = useContext(DataContext)

  const [likeon,setLikeOn] = useState(false)
  const [isLiked,setLiked] = useState(false)
  const [nftID,setNFTID] = useState("");
  const [likeCount, setLikeCount] = useState(0);
  const [users,setUsers] = useState([])
  const [content,setContent] = useState([])
  const [isclick,isButtonClickable] = useState(true)
  const router = useRouter()

  useEffect(() => {
    getNFTs();
    getUsers();
  },[])
  // useEffect(() => {

  //   fetch('http://localhost:3000http://localhost:3000/socketio')
  //   socket.on("connect", () => {
  //     console.log("Socket connected");
  //   });

  //   socket.on("likeUpdated", (nftId) => {
  //     console.log("NFT with id " + nftId + " is updated!");
  //     // Burada gerekli state güncellemeleri yapılır
  //   });

  //   socket.on("disconnect", () => {
  //     console.log("Socket disconnected");
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, [socket]);
 
  const getUsers = async () => {
    await fetch('http://localhost:3000http://localhost:3000/users').then(res => {
      if(!res.ok){
        throw new Error("HTTP ERROR",res.status)
      }
      return res
    }).then(res => res.json()).then(data => {
      setUsers(data)
    })
  }
  const getNFTs = async () => {
    await fetch('http://localhost:3000http://localhost:3000/setnft').then(res => {
      if(!res.ok){
        throw new Error("HTTP ERROR",res.status)
      }
      return res
    }).then(res => res.json()).then(data => {
      setContent(data)
    })
  }

  const setLiker = async (nftid,e) => {
    e.preventDefault()
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
      nftId:nftid
    }
    const exectuser = users.filter(u => u.username == auth?.user?.username)
    const userid = exectuser._id
    const contentnft = content.filter(u => u._id == nftid)
    const exectlike = contentnft.filter(u => u.liker == userid)

    if(!exectlike.includes(userid)){
              
        const res = await fetch("http://localhost:3000http://localhost:3000/likes", {
          method: "POST", // or 'PUT'
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(likerdata),
        });
        // socket.emit('likeUpdate', nftid);
        if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err} })
          dispatch({ type: 'NOTIFY', payload: {success: res.msg} })
        router.reload(window.location.pathname)
      
    }else{
      await deleteLiker(nftid,e)
    }
  }

  const deleteLiker = async (nft,e) => {
    e.preventDefault()
    const deletedata = {
      liker:auth?.user?.id,
      nftId:nft
    }
    const res = await fetch("http://localhost:3000http://localhost:3000/likes", {
    method: "DELETE", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(deletedata),
  });
    setNFTID("")
    setLiked(false)
    // const das = datas.map(nft => nft.likes.length)
    // setLikeOn(das)
    if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err} })
    dispatch({ type: 'NOTIFY', payload: {success: res.msg} })
    router.reload(window.location.pathname)
  }


  return (
    <div key={nft.id} className="w-[300px] border-slate-800 relative hover:bottom-2 border-2 bg-gradient-to-tr to-slate-600 from-slate-900 border-r-slate-700 rounded-xl overflow-hidden ">
    <div className='flex justify-between items-center w-full absolute top-0'>
      <div className='items-center w-full'>
        <img src={nft.wichNet == 'Ethereum' ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/480px-Ethereum-icon-purple.svg.png' : nft.wichNet == 'Polygon' ? 'https://cryptologos.cc/logos/polygon-matic-logo.png' : nft.wichNet == 'Binance' ? 'https://seeklogo.com/images/B/binance-coin-bnb-logo-97F9D55608-seeklogo.com.png' : null} className="z-30 object-cover w-5 absolute top-2 left-2"/>
      </div>

      <div className="flex gap-2 mt-1 mr-1 border border-slate-600 px-2 py-1.5 rounded-lg w-fit">
      <a href={`https://testnets.opensea.io/assets/sepolia/${nftcustom}/${nft.tokenId}`} target="_blank" className="block"><SiOpensea size={22} className="hover:opacity-30 transition-opacity ease-in-out duration-300 border border-slate-500 rounded-xl"/></a>
      <a href={`https://sepolia.etherscan.io/nft/${nftcustom}/${nft.tokenId}`} target="_blank" className="block"><img src="https://sepolia.etherscan.io/images/favicon3-light.ico" className="w-10 hover:opacity-30 transition-opacity ease-in-out duration-300 border border-slate-500 rounded-xl"/></a>
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
                <Link href={`/${nft.username}`}><div className="text-md font-medium cursor-pointer text-purple-500 flex items-center gap-x-1">{nft.avatar ? <img src={nft.avatar} className="rounded-full w-3 mr-1"/>:null}{!nft.username == "" ? nft?.username : user.slice(0,11) + '...'} {nft.role == 'verified' ? <MdVerified size={18}/>: null}</div></Link>
              </div>
              </div>

                <div className='flex justify-end items-center w-full'>
                <h3 className='font-medium text-sm text-center bg-slate-800 text-slate-500 py-1 px-3 rounded-md'>Token ID : {nft.tokenId}</h3>
                </div>

              </div>
              
              <div className="flex justify-between items-center w-full">
              <h1 className='font-medium text-lg text-slate-400'>{nft.name}</h1>
              <TimeAgo timestamp={nft.createdAt} />
              </div>

              <div className='flex justify-between my-5 items-center gap-x-2 border-[1px] border-slate-600 rounded'>
            <div className='w-full '>
            <h1 className='font-bold text-lg flex items-center gap-x-2 py-2 px-3  text-slate-500'>Price : &nbsp;{nft.price}</h1>
            </div>
            <div className='px-3'>
              <img src='https://etherscan.io/token/images/cosmeta_32.png' className='object-cover w-10' title='Crypto International (CRI)' />
            </div>
              </div>

              <div className='flex justify-between items-center w-full mb-3'>
              <div className='flex items-center gap-x-2'>
              <div>

                
                  {auth?.user ? auth?.user?.liked.find(u => u.includes(nft._id)) ? 
                    <button onClick={(e) => deleteLiker(nft._id,e)}><AiFillHeart size={20} className='cursor-pointer text-red-500 hover:text-white' /></button> 
                    : <button disabled={!isclick} onClick={(e) => setLiker(nft._id,e)}><AiOutlineHeart size={20} className='cursor-pointer hover:text-red-500'/></button> 
                    : <Link href="/login"><AiOutlineHeart size={20} className='cursor-pointer hover:text-red-500'/></Link>}
                

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

                <button className='bg-gradient-to-tr z-30 border-[1px] border-slate-700 rounded-lg to-slate-800 from-slate-800 hover:to-purple-600 hover:from-blue-700 relative w-full h-12 text-white' onClick={() => buyNewMum(nft.price,nft.tokenId)}>Buy</button>

              
              </div>
              </div>
    </div>
    );
};

export default NFTsComponent;
