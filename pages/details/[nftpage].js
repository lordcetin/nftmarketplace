import React from 'react';
import{useState,useReducer,useCallback,useMemo,useEffect,useContext, Fragment} from "react";
import { useRouter } from "next/router";
import AudioPlayer from '../../components/AudioPlayer';
import { motion } from "framer-motion"
import {MdVerified} from 'react-icons/md';
import Link from 'next/link';
import { cipherHH, cipherEth, simpleCrypto,client } from '../../engine/configuration';
import NFT from '../../engine/NFT.json';
import Market from '../../engine/Market.json';
import Token from '../../engine/Token.json';
import axios from 'axios';
import Web3Modal from "web3modal";
import { useStateContext } from "../../context/StateContext";
import { ethers } from 'ethers';
import {BsEyeFill,BsFillHeartFill} from 'react-icons/bs';
import { DataContext } from "../../store/GlobalState";
import Media from "react-media";
import { BiCommentDetail } from 'react-icons/bi';
import {AiOutlineHeart,AiFillHeart} from 'react-icons/ai'
import TimeAgo from '@/components/TimeAgo';
import { toast } from 'react-toastify';
import Head from 'next/head';

const Nftpage = () => {

  const {state,dispatch} = useContext(DataContext)
  const {auth} = state

  const router = useRouter();
  const uniqid = router.query.nftpage;


  const [hhnfts, hhsetNfts] = useState([])
  const [sepnfts, MumsetNfts] = useState([])
  const [process,setProcess] = useState(false);
  const [content,setContent] = useState([])
  const [datas,setNftData] = useState([]);
  const [isLiked,setLiked] = useState(false)
  const [likeon,setLikeOn] = useState(0)
  const [opencomment,setOpenComment] = useState(false)
  const [input,setInput] = useState('');
  const [common,setCommentOn] = useState(0);
  const [load,setLoad] = useState(false);
  const [commentdatas,setCommentDatas] = useState([])
  const [users,setUsers] = useState([])
  const [isclick,isButtonClickable] = useState(true)
  const { nftpage } = router.query;

  useEffect(() => {
    getNFTs();
    getUsers();
    getComments()
  },[])

 
  const getNFTs = async () => {
    await fetch('https://testnet.cos-in.com/api/setnft').then(res => {
      if(!res.ok){
        throw new Error("HTTP ERROR",res.status)
      }
      return res
    }).then(res => res.json()).then(data => {
      setContent(data)
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

  const getComments = async () => {
    await fetch('https://testnet.cos-in.com/api/getComments').then(res => {
      if(!res.ok){
        throw new Error("HTTP ERROR",res.status)
      }
      return res
    }).then(res => res.json()).then(data => {
      setCommentDatas(data.reverse())
    })
  }

  const {
    user,
    getUser,
    connectUser,
    bscChain,
    polyChain,
    ethChain,
    hardChain,
    bscTest,
    ethTest,
    polyTest,
    nfts,
    setNfts,
    setContAddr,
    contAdr,
    getNfts,
    getChain,
    getOwners,
    setNftResell,
    setNftCustom,
    setTokenCol,
    setNftCol,
    setMarket,
    setRpc,
    chain,
    getChainName,
    rpc,
    getRpc,
    marketcol,
    getMarket,
    nftcol, getNftCol,
    cri,setTokenCri,
    nftcustom, getNftCustom,
    nftresell, getNftResell,
    owners,setOwners,
    readData} = useStateContext();

  useEffect(() => {
    getChain()
    setNftCustom()
    setTokenCol()
    setMarket()
    setRpc()

    const token = localStorage.getItem('token')
    if(token){
      const usertoken = jwt.decode(token)

      if(!usertoken){
        localStorage.removeItem('token')
        router.push('/login')
      }else{
        //populateQuate()
        console.log('Error')
      }
    }
    //loadHardHatResell()
    //loadHHSaleNFTs()
    //loadGoerliResell()
    //loadBsctResell()
    //loadMumResell()
    // loadMumSaleNFTs()
  }, [getUser,sepnfts,getChain,MumsetNfts,getNftCustom,getNftResell,getRpc,getChainName,
    //hhnfts, hhsetNfts,hhResellNfts, hhsetNfts,goeResellNfts,MumsetNfts,goesetNfts,bsctResellNfts, bsctsetNfts,MumsetNfts
  ])

  async function loadMumSaleNFTs() {
    try {
      const network = rpc
      const key = simpleCrypto.decrypt(cipherEth)
      const provider = new ethers.providers.JsonRpcProvider(network)
      const wallet = new ethers.Wallet(key, provider);
      let marketContract = new ethers.Contract(marketcol, Market, wallet)
      let tokenContract = new ethers.Contract(nftcustom, NFT, wallet)
      const data = await marketContract.getAvailableNft()
      const items = await Promise.all(data.map(async i => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId)
        const meta = await axios.get(tokenUri)
        //const fdata = await axios.get(meta.data.image);
        //const ftype = fdata.headers.get('content-type')
        //console.log("META",meta.data)
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        let item = {
          price,
          id: meta.data.id,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
          type: meta.data.type,
          verified:meta.data.role,
          username:meta.data.username,
          avatar:meta.data.avatar,
          wichNet:meta.data.wichNet
        }
        return item
      }))
      MumsetNfts(items.find(u => u.id == uniqid))
      setProcess(false)
    } catch (err) {
      setProcess(false)
      console.log(err)
    }
  }
  
  async function buyNewMum(nftprice,nfttokenId) {
    try {
      setProcess(true)
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()
      nftprice = nftprice.toString();
      let price = ethers.utils.parseUnits(nftprice, 'ether')
      price = price.toString()
      let cosmeta = new ethers.Contract(cri,Token,signer);
      await cosmeta.approve(user,price)
      await cosmeta.approve(nftcustom,price);
      await cosmeta.approve(marketcol,price);
      const contract = new ethers.Contract(marketcol, Market, signer)
      await cosmeta.increaseAllowance(marketcol, price)//ethers.utils.parseEther(price.toString())
      const transaction = await contract.CosmetaMarketSale(nftcustom, nfttokenId, {value: price})
      await transaction.wait()
      loadMumSaleNFTs()
    } catch (err) {
      setProcess(false)
      console.log(err)
    }

  }

  const likehandler = (e) => {
    e.preventDefault()
    setLiker()
  }

  const setLiker = async (nftId) => {
    toast.success("Liked!")
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
      nftId
    }
    const exectuser = users.filter(u => u.username == auth?.user?.username)
    const userid = exectuser._id
    const contentnft = content.filter(u => u._id == nftId)
    const exectlike = contentnft.filter(u => u.liker == userid)
    if(!exectlike.includes(userid)){
      const res = await fetch("https://testnet.cos-in.com/api/likes", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(likerdata),
      });
        setLiked(true)
        const das = content.map(nft => nft.likes.length)
        setLikeOn(das)
        if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err} })
          dispatch({ type: 'NOTIFY', payload: {success: res.msg} })
          router.reload(window.location.pathname)
    }else{
      await deleteLiker(nftId)
    }
  }

  const deleteLiker = async (nftId) => {
    toast.error("Unliked!")
    const deletedata = {
      liker:auth?.user?.id,
      nftId
    }
    const res = await fetch("https://testnet.cos-in.com/api/likes", {
    method: "DELETE", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(deletedata),
  });
    setLiked(false)
    const das = content.map(nft => nft.likes.length)
    setLikeOn(das)
    if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err} })
      dispatch({ type: 'NOTIFY', payload: {success: res.msg} })
    router.reload(window.location.pathname)
  }

  const handleSubmit = async (nftId,e) => {
    toast("Commended!")
    e.preventDefault()
    setLoad(true)
    const commentdata = {
      author:auth?.user?.id,
      username:auth?.user?.username,
      nftId:nftId,
      authoravatar: auth?.user?.avatar,
      comtext:input
    }
    const res = await fetch("https://testnet.cos-in.com/api/comment", {
    method: "POST", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commentdata),
  });
    setInput("");
    const das = content.map(com => com.comments.length)
    setCommentOn(das)
    setLoad(false)
    router.reload(window.location.pathname)
    if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err} })
      dispatch({ type: 'NOTIFY', payload: {success: res.msg} })
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
        <div className="pt-20 flex-cols w-full h-full">
        {content.filter(u => u._id == nftpage).map(nft => (
        <div className="container mx-auto justify-center items-center w-full px-3">
        <div className='flex-col px-3 justify-center items-center'>
        <div className="p-3 bg-slate-900 w-[350px] rounded-xl">
        {nft.fileType == 'video/mp4'
        ? <video src={nft.images} className="w-[500px] rounded-lg" autoPlay muted loop/>
        : nft.fileType == 'image/png' || nft.fileType == 'image/jpeg'  || nft.fileType == 'image/jpg' || nft.fileType == 'image/webp' ? <img src={nft.images} className="w-[500px] rounded-lg" />
        : nft.fileType == 'audio/mp3' || nft.fileType == 'audio/wav' || nft.fileType == 'audio/ogg' || 'audio/mpeg' ? <AudioPlayer nft={nft.images} nftname={nft.name} nftid={uniqid}/> : null
        }
        </div>
  
        <div className="flex-col px-3 pb-20">
        <div className="rounded-md bg-slate-900 p-3 flex w-32 my-2 items-center">
        <div><strong>Token ID :</strong><span> {nft.tokenId}</span></div>
        </div>
        <div className="rounded-md bg-slate-900 p-3 flex w-60 items-center my-1">
        <div><strong>NFT Name :</strong><span> {nft.name}</span></div>
        </div>
        <div className="rounded-md bg-slate-900 p-3 flex w-80 my-2 items-center">
        <div><strong>Description :</strong><span> {nft.description}</span></div>
        </div>
        <div className="rounded-md bg-slate-900 p-3 flex w-60 my-2 items-center">
        <div className="flex items-center gap-x-1"><strong>Owned by :</strong><span> <Link href={`/${nft.username}`} legacyBehavior><a className="hover:text-blue-500 flex items-center gap-x-1">{nft.username} {nft.verified == 'verified' ? <MdVerified size={15}/> : null}</a></Link></span></div>
        </div>
        <div className='flex justify-between items-center w-[220px] mb-3'>
        <div className='flex items-center gap-x-2'>
        <div>
          <form onSubmit={e => likehandler(e)}>
          {auth?.user ? 
            auth?.user?.liked.find(u => u.includes(nft._id)) ? 
            <button onClick={() => setLiked(false)}><AiFillHeart size={20} className='cursor-pointer text-red-500 hover:text-white' onClick={() => deleteLiker(nft._id)} /></button> : 
            <button disabled={!isclick} onClick={() => setLiker(nft._id)}><AiOutlineHeart size={20} className=' cursor-pointer hover:text-red-500' /></button> :
            <Link href="/login"><AiOutlineHeart size={20} className=' cursor-pointer hover:text-red-500'/></Link>
          }
          </form>
        </div>
          <div className='flex items-center mb-1.5 gap-x-2 text-sm'>
          <strong>{nft.likes.length}</strong><span>Like</span>
          </div>
        </div>
        <div className='flex items-center gap-x-2 text-sm'>
          <div>
          <BiCommentDetail size={20} className='cursor-pointer'/>
          </div>
          <div className='text-sm flex items-center gap-x-2'>
          <strong>{nft.comments.length}</strong><span>Comments</span>
          </div>
        </div>
      </div>
  
        <div className='flex items-center '>
          <form onSubmit={handleSubmit} className='flex items-center gap-x-2' method='POST'>
            <textarea value={input} onChange={e => setInput(e.target.value)} autoComplete={false} name="comment" id="comment" className='border border-slate-800 w-[230px] h-[50px] mx-auto rounded-md bg-transparent py-2 px-2 text-slate-400' placeholder='Comment...'></textarea>
            {input &&
              <button type='submit' className='bg-slate-900 py-3 px-7 rounded-md text-slate-400 border border-slate-800 hover:bg-slate-800 hover:border-slate-900' onClick={(e) => handleSubmit(nft._id,e)}>Send</button>
            }
          </form>
        </div>  
        <div className="rounded-md bg-slate-900 p-3 flex w-52 my-2 items-center">
        <div className="flex-col items-center">
        <div className="flex items-center gap-x-2 text-xl"><strong>Price :</strong><span>{nft.price}</span><div className="flex items-center gap-x-2"><span className="text-sm ml-3">CRI</span><img src='https://etherscan.io/token/images/cosmeta_32.png' className='object-cover w-6' /></div></div>
        </div>
        </div>
        <div className=" py-7 flex w-64 my-2 items-center">
          <div className="flex gap-x-3">
          {nft?.transactionHash ?
            <Link href={`/placebid/${nft.id}`} className="bg-blue-500 py-3 px-7 rounded-md hover:bg-blue-600">Place Bid</Link>
            :<button type="submit" onClick={() => buyNewMum(nft.price,nft.tokenId)} className="bg-blue-500 py-3 px-7 rounded-md hover:bg-blue-600">Buy Now</button>
          }
          </div>
        </div>
  
        </div>
        </div>
        </div>
        ))}
        <div className='px-3 pb-20'>
        <div className='container mx-auto border border-slate-900 rounded-md px-7 py-3 w-full'>
        <h1 className='text-xl font-bold antialiased text-slate-400'>Comments</h1>
      <div className='flex-col mt-5'>
      {commentdatas.length == 0 &&
        <div>
          No comments yet
        </div>
      }
      {commentdatas.filter(u => u.nftId == nftpage).map((comment,k) =>
        <div className='my-2'>
        <div key={k} className='bg-slate-900 rounded-md py-3 px-3 w-full'>
        <div className='flex items-center gap-x-2 max-h-24'>
          <img src={comment.authoravatar} alt="" className='w-7 h-7 rounded-full' />
          <strong>{comment.username}</strong>
          <div className='flex justify-between items-center w-full px-2'>
            <p>{comment.comtext}</p>
            <TimeAgo timestamp={comment.createdAt}/>
          </div>
        </div>
        </div>
        </div>
      )}
      </div>
      </div>
      </div>
        </div>
  
        </Fragment>
        }

      {matches.medium &&
        <Fragment>
        <Head>
        <title>NFT Details • Cosmeta NFT Marketplace</title>
        </Head>
        <div className="pb-40 px-7 flex-col grid justify-between">
      {content.filter(u => u._id == nftpage).map(nft => (
  
      <div className="flex justify-between gap-2">
      <div className="p-3 bg-slate-900 w-[500px] rounded-xl flex">
          
        {nft.fileType == 'video/mp4' || nft.fileType == 'video/mov'
            ? <video src={nft.images} className="rounded-t-xl w-full h-[296px]" autoPlay muted loop/>
            : nft.fileType == 'image/png' || nft.fileType == 'image/jpeg'  || nft.fileType == 'image/jpg' || nft.fileType == 'image/webp'   ? <img className='rounded-t-xl object-cover w-full' src={nft.images} />
            : nft.fileType == 'audio/mp3' || nft.fileType == 'audio/wav' || nft.fileType == 'audio/ogg' || nft.fileType == 'audio/mpeg' ? <AudioPlayer nft={nft.images} nftname={nft.name} nftid={nft.id}/> : null
        }
        </div>
  
        <div className="flex-col">
        <div className="rounded-md bg-slate-900 p-3 flex w-32 my-2 items-center">
        <div><strong>Token ID :</strong><span> {nft.tokenId}</span></div>
        </div>
        <div className="rounded-md bg-slate-900 p-3 flex w-60 items-center my-1">
        <div><strong>NFT Name :</strong><span> {nft.name}</span></div>
        </div>
        <div className="rounded-md bg-slate-900 p-3 flex w-96 my-2 items-center">
        <div><strong>Description :</strong><span> {nft.description}</span></div>
        </div>
        <div className="rounded-md bg-slate-900 p-3 flex w-60 my-2 items-center">
        <div className="flex items-center gap-x-1"><strong>Owned by :</strong><span> <Link href={`/${nft.username}`} legacyBehavior><a className="hover:text-blue-500 flex items-center gap-x-1">{nft.username} {nft.verified == 'verified' ? <MdVerified size={15}/> : null}</a></Link></span></div>
        </div>
        
        <div className='flex justify-between items-center w-[220px] mb-3'>
        <div className='flex items-center gap-x-2'>
        <div>
          <form onSubmit={e => likehandler(e)}>
          {auth?.user ? 
            auth?.user?.liked.find(u => u.includes(nft._id)) ? 
            <button onClick={() => setLiked(false)}><AiFillHeart size={20} className='cursor-pointer text-red-500 hover:text-white' onClick={() => deleteLiker(nft._id)} /></button> : 
            <button disabled={!isclick} onClick={() => setLiker(nft._id)}><AiOutlineHeart size={20} className=' cursor-pointer hover:text-red-500' /></button> :
            <Link href="/login"><AiOutlineHeart size={20} className=' cursor-pointer hover:text-red-500'/></Link>
          }
          </form>
        </div>
          <div className='flex items-center mb-1.5 gap-x-2 text-sm'>
          <strong>{nft.likes.length}</strong><span>Like</span>
          </div>
        </div>
        <div className='flex items-center gap-x-2 text-sm'>
          <div>
          <BiCommentDetail size={20} className='cursor-pointer'/>
          </div>
          <div className='text-sm flex items-center gap-x-2'>
          <strong>{nft.comments.length}</strong><span>Comments</span>
          </div>
        </div>
      </div>
  
        <div className='flex items-center '>
          <form onSubmit={handleSubmit} className='flex items-center gap-x-2' method='POST'>
            <textarea value={input} onChange={e => setInput(e.target.value)} autoComplete={false} name="comment" id="comment" className='border border-slate-800 w-[280px] h-[50px] rounded-md bg-transparent py-2 px-2 text-slate-400' placeholder='Comment...'></textarea>
            {input &&
              <button type='submit' className='bg-slate-900 py-3 px-7 rounded-md text-slate-400 border border-slate-800 hover:bg-slate-800 hover:border-slate-900' onClick={(e) => handleSubmit(nft._id,e)}>Send</button>
            }
          </form>
        </div>  
  
        <div className="rounded-md bg-slate-900 p-3 flex w-52 my-2 items-center">
        <div className="flex-col items-center">
        <div className="flex items-center gap-x-2 text-xl"><strong>Price :</strong><span>{nft.price}</span><div className="flex items-center gap-x-2"><span className="text-sm ml-3">CRI</span><img src='https://etherscan.io/token/images/cosmeta_32.png' className='object-cover w-6' /></div></div>
        </div>
        </div>
        <div className=" py-7 flex w-64 my-2 items-center">
          <div className="flex gap-x-3">
          {nft?.transactionHash ?
            <Link href={`/placebid/${nft.id}`} className="bg-blue-500 py-3 px-7 rounded-md hover:bg-blue-600">Place Bid</Link>
            :<button type="submit" onClick={() => buyNewMum(nft.price,nft.tokenId)} className="bg-blue-500 py-3 px-7 rounded-md hover:bg-blue-600">Buy Now</button>
          }
          </div>
        </div>
  
        </div>
  
      </div>
  
      ))}
      <div className='border border-slate-900 rounded-md px-7 py-3 w-full mx-7 mt-10'>
      <h1 className='text-xl font-bold antialiased text-slate-400'>Comments</h1>
    <div className='flex-col mt-5'>
    {commentdatas.length == 0 &&
      <div>
        No comments yet
      </div>
    }
    {commentdatas.filter(u => u.nftId == nftpage).map((comment,k) =>
      <div className='my-2'>
      <div key={k} className='bg-slate-900 rounded-md py-3 px-3 w-full'>
      <div className='flex items-center gap-x-2 max-h-24'>
        <img src={comment.authoravatar} alt="" className='w-7 h-7 rounded-full' />
        <strong>{comment.username}</strong>
        <div className='flex justify-between items-center w-full px-2'>
          <p>{comment.comtext}</p>
          <TimeAgo timestamp={comment.createdAt}/>
        </div>
      </div>
      </div>
      </div>
    )}
    </div>
    </div>
        </div>
  
        </Fragment>
      }

      {matches.large &&
        <Fragment>
        <Head>
        <title>NFT Details • Cosmeta NFT Marketplace</title>
        </Head>
        <div className="p-40 flex justify-between">
      {content.filter(u => u._id == nftpage).map(nft => (
  
      <div className="flex justify-between gap-2">
          <div className="p-3 bg-slate-900 w-[500px] rounded-xl flex">
          
          {nft.fileType == 'video/mp4' || nft.fileType == 'video/mov'
              ? <video src={nft.images} className="rounded-t-xl w-full h-[296px]" autoPlay muted loop/>
              : nft.fileType == 'image/png' || nft.fileType == 'image/jpeg'  || nft.fileType == 'image/jpg' || nft.fileType == 'image/webp'   ? <img className='rounded-t-xl object-cover w-full' src={nft.images} />
              : nft.fileType == 'audio/mp3' || nft.fileType == 'audio/wav' || nft.fileType == 'audio/ogg' || nft.fileType == 'audio/mpeg' ? <AudioPlayer nft={nft.images} nftname={nft.name} nftid={nft.id}/> : null
          }
          </div>
  
        <div className="flex-col">
        <div className="rounded-md bg-slate-900 p-3 flex w-32 my-2 items-center">
        <div><strong>Token ID :</strong><span> {nft.tokenId}</span></div>
        </div>
        <div className="rounded-md bg-slate-900 p-3 flex w-60 items-center my-1">
        <div><strong>NFT Name :</strong><span> {nft.name}</span></div>
        </div>
        <div className="rounded-md bg-slate-900 p-3 flex w-96 my-2 items-center">
        <div><strong>Description :</strong><span> {nft.description}</span></div>
        </div>
        <div className="rounded-md bg-slate-900 p-3 flex w-60 my-2 items-center">
        <div className="flex items-center gap-x-1"><strong>Owned by :</strong><span> <Link href={`/${nft.username}`} legacyBehavior><a className="hover:text-blue-500 flex items-center gap-x-1">{nft.username} {nft.verified == 'verified' ? <MdVerified size={15}/> : null}</a></Link></span></div>
        </div>
        
        <div className='flex justify-between items-center w-[220px] mb-3'>
        <div className='flex items-center gap-x-2'>
        <div>

            {auth?.user ? 
              auth?.user?.liked.find(u => u.includes(nft._id)) ? 
              <button onClick={() => setLiked(false)}><AiFillHeart size={20} className='cursor-pointer text-red-500 hover:text-white' onClick={() => deleteLiker(nft._id)} /></button> : 
              <button disabled={!isclick} onClick={() => setLiker(nft._id)}><AiOutlineHeart size={20} className=' cursor-pointer hover:text-red-500' /></button> :
              <Link href="/login"><AiOutlineHeart size={20} className=' cursor-pointer hover:text-red-500'/></Link>
            }

        </div>
          <div className='flex items-center mb-1.5 gap-x-2 text-sm'>
          <strong>{nft.likes.length}</strong><span>Like</span>
          </div>
        </div>
        <div className='flex items-center gap-x-2 text-sm'>
          <div>
          <BiCommentDetail size={20} className='cursor-pointer'/>
          </div>
          <div className='text-sm flex items-center gap-x-2'>
          <strong>{nft.comments.length}</strong><span>Comments</span>
          </div>
        </div>
      </div>
  
        <div className='flex items-center '>
          <form onSubmit={handleSubmit} className='flex items-center gap-x-2' method='POST'>
            <textarea value={input} onChange={e => setInput(e.target.value)} autoComplete={false} name="comment" id="comment" className='border border-slate-800 w-[280px] h-[50px] rounded-md bg-transparent py-2 px-2 text-slate-400' placeholder='Comment...'></textarea>
            {input &&
              <button type='submit' className='bg-slate-900 py-3 px-7 rounded-md text-slate-400 border border-slate-800 hover:bg-slate-800 hover:border-slate-900' onClick={(e) => handleSubmit(nft._id,e)}>Send</button>
            }
          </form>
        </div>  
  
        <div className="rounded-md bg-slate-900 p-3 flex w-52 my-2 items-center">
        <div className="flex-col items-center">
        <div className="flex items-center gap-x-2 text-xl"><strong>Price :</strong><span>{nft.price}</span><div className="flex items-center gap-x-2"><span className="text-sm ml-3">CRI</span><img src='https://etherscan.io/token/images/cosmeta_32.png' className='object-cover w-6' /></div></div>
        </div>
        </div>
        <div className=" py-7 flex w-64 my-2 items-center">
          <div className="flex gap-x-3">
          {nft?.transactionHash ?
            <Link href={`/placebid/${nft.id}`} className="bg-blue-500 py-3 px-7 rounded-md hover:bg-blue-600">Place Bid</Link>
            :<button type="submit" onClick={() => buyNewMum(nft.price,nft.tokenId)} className="bg-blue-500 py-3 px-7 rounded-md hover:bg-blue-600">Buy Now</button>
          }
          </div>
        </div>
  
        </div>
  
      </div>
  
      ))}
    <div className='border border-slate-900 rounded-md px-7 py-3 w-[50vh] mx-7'>
      <h1 className='text-xl font-bold antialiased text-slate-400'>Comments</h1>
    <div className='flex-col mt-5'>
    {commentdatas.length == 0 &&
      <div>
        No comments yet
      </div>
    }
    {commentdatas.filter(u => u.nftId == nftpage).map((comment,k) =>
      <div className='my-2'>
      <div key={k} className='bg-slate-900 rounded-md py-3 px-3 w-full'>
      <div className='flex items-center gap-x-2 max-h-24'>
        <img src={comment.authoravatar} alt="" className='w-7 h-7 rounded-full' />
        <strong>{comment.username}</strong>
        <div className='flex justify-between items-center w-full px-2'>
          <p>{comment.comtext}</p>
          <TimeAgo timestamp={comment.createdAt}/>
        </div>
      </div>
      </div>
      </div>
    )}
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

export default Nftpage;
