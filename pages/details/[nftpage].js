import React from 'react';
import{useState,useReducer,useCallback,useMemo,useEffect,useContext, Fragment} from "react";
import { useRouter } from "next/router";
import AudioPlayer from '../../components/AudioPlayer';
import { motion } from "framer-motion"
import {MdVerified} from 'react-icons/md';
import {CgDetailsMore} from 'react-icons/cg';
import Link from 'next/link';
import { cipherHH, cipherEth, simpleCrypto,client } from '../../engine/configuration';
import NFT from '../../engine/NFT.json';
import Market from '../../engine/Market.json';
import Token from '../../engine/Token.json';
import axios from 'axios';
import Web3Modal from "web3modal";
import { useStateContext } from "../../context/StateContext";
import { ethers } from 'ethers';
import {BsEyeFill,BsFillHeartFill, BsInstagram, BsTwitter} from 'react-icons/bs';
import {LiaFileContractSolid} from 'react-icons/lia';
import { DataContext } from "../../store/GlobalState";
import Media from "react-media";
import { BiCommentDetail,BiDetail } from 'react-icons/bi';
import {AiOutlineHeart,AiFillHeart,AiOutlineLineChart} from 'react-icons/ai'
import TimeAgo from '@/components/TimeAgo';
import { toast } from 'react-toastify';
import Head from 'next/head';
import {AreaChart,Area,XAxis,YAxis,CartesianGrid,Tooltip} from "recharts";
import { LineChart, Line } from "recharts";
import { PreLoader } from '@/components';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const Nftpage = () => {

  const {state,dispatch} = useContext(DataContext)
  const {auth} = state

  const router = useRouter();
  const uniqid = router.query.nftpage;

  const [coin, setCoin] = useState();
  const [chartdata,setChartData] = useState();
  const [about,setOpenAbout] = useState();
  const [contract,setOpenContract] = useState();

  const data = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100
    }
  ];

  useEffect(() => {
    fetchCRItoUSD()
    dayone()
  },[])
  
  const fetchCRItoUSD = async () => {
    await fetch('https://api.coingecko.com/api/v3/coins/crypto-international/market_chart?vs_currency=usd&days=1').then(res => {
      if(!res.ok){
        throw new Error("HTTP ERROR",res.status)
      }
      return res
    }).then(res => res.json()).then(data => {
      setCoin(data.prices[0][1])
    })
}

const dayone = async () => {
  await axios.get(`https://api.coingecko.com/api/v3/coins/crypto-international/market_chart?vs_currency=usd&days=max`) //%2C14%2C30%2Cmax
    .then(res => {
      const cdata = res.data.prices.map((price) => {
        const [timestamp,p] = price;
        const date = new Date(timestamp).toLocaleDateString('en-us');
        return {Date:date,Price:p.toFixed(4)}
      })
      setChartData(cdata);
      // console.log("chartdata",chartdata);
    })
} 

const toolstyle ={
  backgroundColor: "#0f172a",
  color: "#80D0C7",
  borderRadius:10,
  WebkitBorderRadius:10,
  MozBorderRadius:10,
  MsBorderRadius:10,
  OBorderRadius:10,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  gap:5,
  fontWeight: "bold",
}

const labelstyle ={
  display: "none",
}

const contstyle={
  backgroundColor: "#0f172a",
  border:"none",
  outline:"none",
  width:160,
  margin:0,
  paddingLeft:20,
  paddingRight:20,
  paddingTop:10,
  paddingBottom:10,
  borderRadius:10,
  WebkitBorderRadius:10,
  MozBorderRadius:10,
  MsBorderRadius:10,
  OBorderRadius:10,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  boxShadow:'0px 5px 30px #0f0e13',
}

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
        <div className="flex justify-center items-center w-full">
        {!content.length ? <PreLoader/> : null}
      {content.filter(u => u._id == nftpage).map(nft => (
        
      /***  DETAILS ***/
      <div className="flex-col grid justify-center w-full">
          {/*** MEDIA ***/}
          <div className="flex-col justify-start w-[300px] rounded-xl flex self-start">
          
          {nft.fileType == 'video/mp4' || nft.fileType == 'video/mov'
              ? <video src={nft.images} className="rounded-xl w-[300px]" autoPlay muted loop/>
              : nft.fileType == 'image/png' || nft.fileType == 'image/jpeg'  || nft.fileType == 'image/jpg' || nft.fileType == 'image/webp'   ? <img className='rounded-xl object-cover w-[300px]' src={nft.images} />
              : nft.fileType == 'audio/mp3' || nft.fileType == 'audio/wav' || nft.fileType == 'audio/ogg' || nft.fileType == 'audio/mpeg' ? <AudioPlayer nft={nft.images} nftcover={nft.cover} nftname={nft.name} nftid={nft.id} detailpage={true}/> : null
          }        
          </div>
  
        <div className="flex-col justify-end items-center self-start w-full mt-3">
          <div className="px-3 flex w-full my-2 items-center">
            <div>
              <span className='w-72 flex truncate items-center gap-x-1 text-indigo-500 font-medium'>{nft.name} {nft.role == 'verified' ? <MdVerified size={18}/> : null}</span>
            </div>
          </div>
          <div className="px-3 flex w-60 items-center mt-4">
            <div>
              <strong className='w-96 flex truncate text-slate-400'>{nft.description}</strong>
            </div>
          </div>
          <div className="rounded-md px-3 flex w-full items-center my-1">
            <div className='flex items-center gap-x-1'>
              <span className='text-sm font-thin'>Owned by</span><Link href={`/${nft.username}`} className='text-sm text-indigo-500'>{nft?.owner?.slice(0,5) + '...' + nft?.owner?.slice(38)} | {nft.username}</Link>
            </div>
          </div>
          <div className="p-3 flex w-60 my-2 items-center">
            <div className='flex items-center w-full gap-x-6'>
              <div className='flex items-center gap-x-2'>
                {auth?.user ? 
                  auth?.user?.liked.find(u => u.includes(nft._id)) ? 
                  <button onClick={() => setLiked(false)}><AiFillHeart size={20} className='cursor-pointer text-red-500 hover:text-white' onClick={() => deleteLiker(nft._id)} /></button> : 
                  <button disabled={!isclick} onClick={() => setLiker(nft._id)}><AiOutlineHeart size={20} className=' cursor-pointer hover:text-red-500' /></button> :
                  <Link href="/login"><AiOutlineHeart size={20} className=' cursor-pointer hover:text-red-500'/></Link>
                }
                <strong>{nft.likes.length}</strong>
              </div>

              <div className='flex items-center gap-x-2'>
                <BiCommentDetail size={20} className='cursor-pointer'/>
                <strong>{nft.comments.length}</strong>
              </div>
            </div>
          </div>
        
          <div className='border border-indigo-500 rounded-md w-[300px] p-5'>
            <p className='text-xl antialiased font-light'>Current Price</p>
            <div className='flex items-center gap-x-2'>
              <span className='text-4xl font-bold'>{nft.price} CRI</span>
              <span className='self-end'>${(coin * nft.price).toFixed(2)}</span>
            </div>
            <div className='w-full flex items-center mt-3'>
              {nft?.transactionHash ?
                <Link href={`/placebid/${nft.id}`} className="bg-indigo-950 py-3 px-7 rounded-md hover:bg-indigo-600 w-full">Place Bid</Link>
                :<button type="submit" onClick={() => buyNewMum(nft.price,nft.tokenId)} className="bg-indigo-950 py-3 px-7 rounded-md hover:bg-indigo-600 w-full">Buy Now</button>
              }
            </div>
          </div>

          {/*** CHART ***/}
          <div className='border flex-col justify-center items-center border-indigo-500 rounded-md w-[300px] my-5'>
          <div className='flex justify-between items-center bg-indigo-950 w-full border-b border-indigo-500 rounded-t-md'>
              <div className='flex justify-start items-center w-full'>
                <span className='rounded-md  px-4 py-2 text-sm font-bold antialiased leading-6 flex items-center gap-x-2'><AiOutlineLineChart size={18}/> Price History</span>
              </div>
              <div className='flex justify-end items-center w-full'>
                <span className='rounded-md  px-4 py-2 text-sm font-bold antialiased leading-6'>{parseFloat(coin).toFixed(2)} USD</span>
              </div>
          </div>
          <div className='flex justify-center items-center w-full p-5'>
           <AreaChart width={300} height={200} data={chartdata}
              margin={{ top: 10, right: 0, left: 0, bottom: 10 }}>
                <defs>
                  <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              <Tooltip cursor={false} itemStyle={toolstyle} labelStyle={labelstyle} contentStyle={contstyle}/>

              <Area type="monotone" dataKey="Price" stroke="#8884d8" fillOpacity={0.5} fill="url(#colorPv)" />

              </AreaChart>
          </div>
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
              className='flex w-6 h-6 rounded-full' />
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
  
        <div className='flex items-center w-[300px] rounded-md mt-5'>
          <form onSubmit={handleSubmit} className='flex items-center gap-x-2' method='POST'>
            <textarea value={input} onChange={e => setInput(e.target.value)} autoComplete={false} name="comment" id="comment" className='border border-indigo-500 w-[300px] h-[50px] rounded-md bg-transparent py-2 px-2 text-slate-400' placeholder='Comment...'></textarea>
            {input &&
              <button type='submit' className='bg-slate-900 py-3 px-7 rounded-md text-slate-400 border border-slate-800 hover:bg-slate-800 hover:border-slate-900' onClick={(e) => handleSubmit(nft._id,e)}>Send</button>
            }
          </form>
        </div>  

      {/**** COMMENTS ****/}
      <div className='border border-indigo-500 rounded-md px-7 py-3 w-[300px] mt-3'>
        <h1 className='text-xl font-bold antialiased text-slate-400'>Comments</h1>
      <div className='flex-col mt-5'>
      {commentdatas.length == 0 &&
        <div>
          No comments yet
        </div>
      }
      {commentdatas.filter(u => u.nftId == nftpage).map((comment,k) =>
        <div className='my-2'>
        <div key={k} className='bg-indigo-950 rounded-md py-3 px-3 w-full'>
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
  
      ))}


        </div>
  
        </Fragment>
        }

      {matches.medium &&
        <Fragment>
        <Head>
        <title>NFT Details • Cosmeta NFT Marketplace</title>
        </Head>
        <div className="flex justify-center items-center w-full">
        {!content.length ? <PreLoader/> : null}
      {content.filter(u => u._id == nftpage).map(nft => (
        
      /***  DETAILS ***/
      <div className="flex justify-between gap-x-4">
          {/*** MEDIA ***/}
          <div className="flex-col justify-start w-[450px] rounded-xl flex self-start">
          
          {nft.fileType == 'video/mp4' || nft.fileType == 'video/mov'
              ? <video src={nft.images} className="rounded-xl w-[450px]" autoPlay muted loop/>
              : nft.fileType == 'image/png' || nft.fileType == 'image/jpeg'  || nft.fileType == 'image/jpg' || nft.fileType == 'image/webp'   ? <img className='rounded-xl object-cover w-[450px]' src={nft.images} />
              : nft.fileType == 'audio/mp3' || nft.fileType == 'audio/wav' || nft.fileType == 'audio/ogg' || nft.fileType == 'audio/mpeg' ? <AudioPlayer nft={nft.images} nftcover={nft.cover} nftname={nft.name} nftid={nft.id} detailpage={true}/> : null
          }

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
                className='flex w-6 h-6 rounded-full' />
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
  
        <div className="flex-col justify-end items-center self-start w-full">
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
          <div className="p-3 flex w-60 my-2 items-center">
            <div className='flex items-center w-full gap-x-6'>
              <div className='flex items-center gap-x-2'>
                {auth?.user ? 
                  auth?.user?.liked.find(u => u.includes(nft._id)) ? 
                  <button onClick={() => setLiked(false)}><AiFillHeart size={20} className='cursor-pointer text-red-500 hover:text-white' onClick={() => deleteLiker(nft._id)} /></button> : 
                  <button disabled={!isclick} onClick={() => setLiker(nft._id)}><AiOutlineHeart size={20} className=' cursor-pointer hover:text-red-500' /></button> :
                  <Link href="/login"><AiOutlineHeart size={20} className=' cursor-pointer hover:text-red-500'/></Link>
                }
                <strong>{nft.likes.length}</strong>
              </div>

              <div className='flex items-center gap-x-2'>
                <BiCommentDetail size={20} className='cursor-pointer'/>
                <strong>{nft.comments.length}</strong>
              </div>
            </div>
          </div>
        
          <div className='border border-indigo-500 rounded-md w-[450px] p-5'>
            <p className='text-xl antialiased font-light'>Current Price</p>
            <div className='flex items-center gap-x-2'>
              <span className='text-4xl font-bold'>{nft.price} CRI</span>
              <span className='self-end'>${(coin * nft.price).toFixed(2)}</span>
            </div>
            <div className='w-full flex items-center mt-3'>
              {nft?.transactionHash ?
                <Link href={`/placebid/${nft.id}`} className="bg-indigo-950 py-3 px-7 rounded-md hover:bg-indigo-600 w-full">Place Bid</Link>
                :<button type="submit" onClick={() => buyNewMum(nft.price,nft.tokenId)} className="bg-indigo-950 py-3 px-7 rounded-md hover:bg-indigo-600 w-full">Buy Now</button>
              }
            </div>
          </div>

          {/*** CHART ***/}
          <div className='border flex-col justify-center items-center border-indigo-500 rounded-md w-[450px] my-5'>
          <div className='flex justify-between items-center bg-indigo-950 w-full border-b border-indigo-500 rounded-t-md'>
              <div className='flex justify-start items-center w-full'>
                <span className='rounded-md  px-4 py-2 text-sm font-bold antialiased leading-6 flex items-center gap-x-2'><AiOutlineLineChart size={18}/> Price History</span>
              </div>
              <div className='flex justify-end items-center w-full'>
                <span className='rounded-md  px-4 py-2 text-sm font-bold antialiased leading-6'>{parseFloat(coin).toFixed(2)} USD</span>
              </div>
          </div>
          <div className='flex justify-center items-center w-full p-5'>
           <AreaChart width={450} height={200} data={chartdata}
              margin={{ top: 10, right: 0, left: 0, bottom: 10 }}>
                <defs>
                  <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              <Tooltip cursor={false} itemStyle={toolstyle} labelStyle={labelstyle} contentStyle={contstyle}/>

              <Area type="monotone" dataKey="Price" stroke="#8884d8" fillOpacity={0.5} fill="url(#colorPv)" />

              </AreaChart>
          </div>
          </div>
  
        <div className='flex items-center w-[450px] rounded-md'>
          <form onSubmit={handleSubmit} className='flex items-center gap-x-2' method='POST'>
            <textarea value={input} onChange={e => setInput(e.target.value)} autoComplete={false} name="comment" id="comment" className='border border-indigo-500 w-[450px] h-[50px] rounded-md bg-transparent py-2 px-2 text-slate-400' placeholder='Comment...'></textarea>
            {input &&
              <button type='submit' className='bg-slate-900 py-3 px-7 rounded-md text-slate-400 border border-slate-800 hover:bg-slate-800 hover:border-slate-900' onClick={(e) => handleSubmit(nft._id,e)}>Send</button>
            }
          </form>
        </div>  

      {/**** COMMENTS ****/}
      <div className='border border-indigo-500 rounded-md px-7 py-3 w-[450px] mt-3'>
        <h1 className='text-xl font-bold antialiased text-slate-400'>Comments</h1>
      <div className='flex-col mt-5'>
      {commentdatas.length == 0 &&
        <div>
          No comments yet
        </div>
      }
      {commentdatas.filter(u => u.nftId == nftpage).map((comment,k) =>
        <div className='my-2'>
        <div key={k} className='bg-indigo-950 rounded-md py-3 px-3 w-full'>
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
  
      ))}


        </div>
  
        </Fragment>
      }

      {matches.large &&
        <Fragment>
        <Head>
        <title>NFT Details • Cosmeta NFT Marketplace</title>
        </Head>
        <div className="flex justify-center items-center w-full">
        {!content.length ? <PreLoader/> : null}
      {content.filter(u => u._id == nftpage).map(nft => (
        
      /***  DETAILS ***/
      <div className="flex justify-between gap-x-4">
          {/*** MEDIA ***/}
          <div className="flex-col justify-start w-[600px] rounded-xl flex self-start">
          
          {nft.fileType == 'video/mp4' || nft.fileType == 'video/mov'
              ? <video src={nft.images} className="rounded-xl w-[600px]" autoPlay muted loop/>
              : nft.fileType == 'image/png' || nft.fileType == 'image/jpeg'  || nft.fileType == 'image/jpg' || nft.fileType == 'image/webp'   ? <img className='rounded-xl object-cover w-[600px]' src={nft.images} />
              : nft.fileType == 'audio/mp3' || nft.fileType == 'audio/wav' || nft.fileType == 'audio/ogg' || nft.fileType == 'audio/mpeg' ? <AudioPlayer nft={nft.images} nftcover={nft.cover} nftname={nft.name} nftid={nft.id} detailpage={true}/> : null
          }

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
                className='flex w-6 h-6 rounded-full' />
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
  
        <div className="flex-col justify-end items-center self-start w-full">
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
          <div className="p-3 flex w-60 my-2 items-center">
            <div className='flex items-center w-full gap-x-6'>
              <div className='flex items-center gap-x-2'>
                {auth?.user ? 
                  auth?.user?.liked.find(u => u.includes(nft._id)) ? 
                  <button onClick={() => setLiked(false)}><AiFillHeart size={20} className='cursor-pointer text-red-500 hover:text-white' onClick={() => deleteLiker(nft._id)} /></button> : 
                  <button disabled={!isclick} onClick={() => setLiker(nft._id)}><AiOutlineHeart size={20} className=' cursor-pointer hover:text-red-500' /></button> :
                  <Link href="/login"><AiOutlineHeart size={20} className=' cursor-pointer hover:text-red-500'/></Link>
                }
                <strong>{nft.likes.length}</strong>
              </div>

              <div className='flex items-center gap-x-2'>
                <BiCommentDetail size={20} className='cursor-pointer'/>
                <strong>{nft.comments.length}</strong>
              </div>
            </div>
          </div>
        
          <div className='border border-indigo-500 rounded-md w-[600px] p-5'>
            <p className='text-xl antialiased font-light'>Current Price</p>
            <div className='flex items-center gap-x-2'>
              <span className='text-4xl font-bold'>{nft.price} CRI</span>
              <span className='self-end'>${(coin * nft.price).toFixed(2)}</span>
            </div>
            <div className='w-full flex items-center mt-3'>
              {nft?.transactionHash ?
                <Link href={`/placebid/${nft.id}`} className="bg-indigo-950 py-3 px-7 rounded-md hover:bg-indigo-600 w-full">Place Bid</Link>
                :<button type="submit" onClick={() => buyNewMum(nft.price,nft.tokenId)} className="bg-indigo-950 py-3 px-7 rounded-md hover:bg-indigo-600 w-full">Buy Now</button>
              }
            </div>
          </div>

          {/*** CHART ***/}
          <div className='border flex-col justify-center items-center border-indigo-500 rounded-md w-[600px] my-5'>
          <div className='flex justify-between items-center bg-indigo-950 w-full border-b border-indigo-500 rounded-t-md'>
              <div className='flex justify-start items-center w-full'>
                <span className='rounded-md  px-4 py-2 text-sm font-bold antialiased leading-6 flex items-center gap-x-2'><AiOutlineLineChart size={18}/> Price History</span>
              </div>
              <div className='flex justify-end items-center w-full'>
                <span className='rounded-md  px-4 py-2 text-sm font-bold antialiased leading-6'>{parseFloat(coin).toFixed(2)} USD</span>
              </div>
          </div>
          <div className='flex justify-center items-center w-full p-5'>
           <AreaChart width={600} height={200} data={chartdata}
              margin={{ top: 10, right: 0, left: 0, bottom: 10 }}>
                <defs>
                  <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              <Tooltip cursor={false} itemStyle={toolstyle} labelStyle={labelstyle} contentStyle={contstyle}/>

              <Area type="monotone" dataKey="Price" stroke="#8884d8" fillOpacity={0.5} fill="url(#colorPv)" />

              </AreaChart>
          </div>
          </div>
  
        <div className='flex items-center w-[600px] rounded-md'>
          <form onSubmit={handleSubmit} className='flex items-center gap-x-2' method='POST'>
            <textarea value={input} onChange={e => setInput(e.target.value)} autoComplete={false} name="comment" id="comment" className='border border-indigo-500 w-[600px] h-[50px] rounded-md bg-transparent py-2 px-2 text-slate-400' placeholder='Comment...'></textarea>
            {input &&
              <button type='submit' className='bg-slate-900 py-3 px-7 rounded-md text-slate-400 border border-slate-800 hover:bg-slate-800 hover:border-slate-900' onClick={(e) => handleSubmit(nft._id,e)}>Send</button>
            }
          </form>
        </div>  

      {/**** COMMENTS ****/}
      <div className='border border-indigo-500 rounded-md px-7 py-3 w-[600px] mt-3'>
        <h1 className='text-xl font-bold antialiased text-slate-400'>Comments</h1>
      <div className='flex-col mt-5'>
      {commentdatas.length == 0 &&
        <div>
          No comments yet
        </div>
      }
      {commentdatas.filter(u => u.nftId == nftpage).map((comment,k) =>
        <div className='my-2'>
        <div key={k} className='bg-indigo-950 rounded-md py-3 px-3 w-full'>
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

export default Nftpage;
