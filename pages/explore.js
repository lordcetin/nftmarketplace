/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-key */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import { Fragment,useEffect, useState} from "react";
import Media from "react-media";
import { useStateContext } from "../context/StateContext";
import { ethers } from 'ethers';
import axios from 'axios';
import Web3Modal from "web3modal";
import { useRouter } from 'next/router';
import NFT from '../engine/NFT.json';
import Market from '../engine/Market.json';
import Auction from '../engine/Auction.json';
import Token from '../engine/Token.json';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loading from '../components/Loading';
import { cipherEth, simpleCrypto, cipherMM} from '../engine/configuration';
import { motion } from "framer-motion";
import {AreaChart,Area,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,LineChart,Legend,Line} from "recharts";
import Head from 'next/head';
const explore = () => {
  const [sepnfts, MumsetNfts] = useState([])
  const [mumliveauction,MumLiveAuction] = useState([])
  const [count,setCount] = useState(6)
  const [au,setA] = useState(false)
  const [nf,setN] = useState(true)
  const [content,setContent] = useState([])

  const {
    user,
    getUser,
    connectUser,
    auction,
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
    owners,setOwners,
    readData} = useStateContext();

  useEffect(() => {
    getNFTs()
    getChain()
    setNftCustom()
    setTokenCol()
    setMarket()
    setRpc()
    loadMumSaleNFTs()
    loadLiveAuction()
  }, [sepnfts,getChain,MumsetNfts,getNftCustom,getRpc,getChainName,]);
  

  const getNFTs = async () => {
    await fetch('http://localhost:3000/api/setnft').then(res => {
      if(!res.ok){
        throw new Error("HTTP ERROR",res.status)
      }
      return res
    }).then(res => res.json()).then(data => {
      setContent(data)
    })
  }

  const data = [
    {
      name: new Date().getHours(),
      uv: 0.4700,
      price: 2400,
      amt: 2400
    },
    {
      name: new Date().getHours(),
      uv: 3000,
      price: 1398,
      amt: 2210
    },
    {
      name: new Date().getHours(),
      uv: -1000,
      price: 9800,
      amt: 2290
    },
    {
      name: new Date().getHours(),
      uv: 500,
      price: 3908,
      amt: 2000
    },
    {
      name: new Date().getHours(),
      uv: -2000,
      price: 4800,
      amt: 2181
    },
    {
      name: new Date().getHours(),
      uv: -250,
      price: 3800,
      amt: 2500
    },
    {
      name: new Date().getHours(),
      uv: 3490,
      price: 4300,
      amt: 2100
    }
  ];
  const gradientOffset = () => {
    const dataMax = Math.max(...data.map((i) => i ));
    const dataMin = Math.min(...data.map((i) => i ));

    if (dataMax <= 1) {
      
      return 0;
    }
    if (dataMin >= 0) {
      return 1;
    }
  
    return dataMax / (dataMax - dataMin);
  };
  
  const off = gradientOffset();

  async function loadMumSaleNFTs() {
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
        type: meta.data.fileType,
        verified:meta.data.role,
        username:meta.data.username,
        avatar:meta.data.avatar,
        wichNet:meta.data.wichNet
      }
      return item
    }))
    MumsetNfts(items.slice(0,`${count}`))
  }
  async function loadLiveAuction() {
    let network = rpc
    const key = simpleCrypto.decrypt(cipherMM)
    const provider = new ethers.providers.JsonRpcProvider(network)
    const wallet = new ethers.Wallet(key, provider);
    let auctioncontract = new ethers.Contract(auction, Auction, wallet)
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
        image: meta.data.image,
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
    MumLiveAuction(items.slice(0,`${count}`))
  }
  const toolstyle ={
    'padding':'0px',
    'margin':'0px',
    'width':'120px',
    'height':'20px',
    'color':'#000',
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
          <title>Explore • Cosmeta NFT Marketplace</title>
          </Head>
          <div className="flex-col justify-center items-center w-full h-full px-3 pt-20 pb-40 overflow-hidden">

            <div className="flex-col justify-center items-center w-full">
              <h1 className="flex justify-center items-center w-full z-10">Top NFT's</h1>
              <div className="grid grid-cols-1 grid-rows-6 gap-y-2 py-5">

                  {content.map((nft) => (
                  <div className="flex w-full justify-between items-center bg-slate-900 px-3 py-2 rounded-lg">
                  <div className="flex w-full object-cover">
                  {nft.fileType == 'video/mp4'
                  ? <video src={nft.images} className="w-20 h-20 bg-transparent rounded-lg" autoPlay muted loop/>
                  : nft.fileType == 'image/png' || nft.fileType == 'image/jpeg'  || nft.fileType == 'image/jpg' || nft.fileType == 'image/webp' ? <img src={nft.images} className="w-20 h-20 rounded-lg object-cover bg-transparent" />
                  : nft.fileType == 'audio/mp3' || nft.fileType == 'audio/wav' || nft.fileType == 'audio/ogg' || 'audio/mpeg' ? <div className="flex-col justify-between items-center welcomebg w-20 h-20 rounded-lg"><div className="text-[10px] relative top-1/3 flex justify-center items-center text-center">{nft.name}</div></div> : null
                  }
                  </div>

                  <div className="flex-col items-center w-full ">
                    <h1 className="text-sm font-bold">{nft.name.slice(0,7)}</h1>
                    <p className="text-[10px] font-light overflow-hidden">{nft.description.slice(0,15)}</p>
                    <p className="text-[10px]">{nft.username.slice(0,7)}</p>
                    <p className="text-[10px]">Price : {nft.price}</p>
                  </div>

                  <div className="flex items-center w-full">
                  <AreaChart width={120} height={70} data={data}
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#00000" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#00000" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="uv" stroke="#82ca9d" fillOpacity={1} fill="url(#colorUv)" />
                </AreaChart> 
                  </div>

                  </div>
                  ))
                  }
                  <div onClick={() => setCount(count + 6)} className="flex justify-center items-center text-center w-full mt-5"><button className="px-5 py-1 bg-slate-800 rounded-md">Load More</button></div>

                </div>
            </div>

          </div>
          </Fragment>
        }

        {matches.medium &&
          <Fragment>
          <Head>
          <title>Explore • Cosmeta NFT Marketplace</title>
          </Head>
          <div className="flex-col justify-center items-center w-full h-full px-3 pt-20 pb-40 overflow-hidden">
            <div className="flex justify-center items-center gap-x-5 w-full py-5 my-5 bg-gradient-to-t to-slate-900 from-transparent rounded-t-lg text-slate-400">
              <h1 className={nf ? "flex justify-center items-center z-10 text-2xl text-blue-500 border-b-2 border-b-blue-500 cursor-pointer" : "flex justify-center items-center z-10 text-2xl hover:border-b-2 hover:border-b-slate-400 cursor-pointer"} onClick={() => {setN(true),setA(false)}}>Top NFT's</h1><span className="text-3xl font-thin">|</span><h1 className={au ? "flex justify-center items-center z-10 text-2xl border-b-2 border-b-blue-500 text-blue-500 cursor-pointer" : "flex justify-center items-center z-10 text-2xl hover:border-b-2 hover:border-b-slate-400 cursor-pointer"} onClick={() => {setA(true),setN(false)}}>Top Auction's</h1>
            </div>
            {nf &&
            <div className="flex-col justify-center items-center w-full">
              <div className="grid grid-cols-2 gap-4">

                  {content.map((nft) => (
                  <div className="flex justify-center items-center bg-slate-900 py-3 px-3 rounded-lg w-full">
                    <div className="flex items-center object-cover gap-x-3">
                    <div className="w-full flex justify-between items-center object-cover border-[1px] bg-[#00051a] border-slate-700 rounded-xl p-1">
                    <div className="w-full cursor-pointer">
                    {nft.fileType == 'video/mp4'
                    ? <video src={nft.images} className="w-40 h-40 bg-transparent rounded-lg" autoPlay muted loop/>
                    : nft.fileType == 'image/png' || nft.fileType == 'image/jpeg'  || nft.fileType == 'image/jpg' || nft.fileType == 'image/webp' ? <img src={nft.images} className="w-40 h-40 rounded-lg object-cover bg-transparent" />
                    : nft.fileType == 'audio/mp3' || nft.fileType == 'audio/wav' || nft.fileType == 'audio/ogg' || 'audio/mpeg' ? <div className="flex-col justify-between items-center welcomebg w-20 h-20 rounded-lg"><div className="text-[10px] relative top-1/3 flex justify-center items-center text-center">{nft.name}</div></div> : null
                    }
                    </div>
                    <div className="flex-col items-center w-full px-3">
                      <h1 className="text-md font-bold">{nft.name}</h1>
                      <p className="text-sm font-light overflow-hidden">{nft.description}</p>
                      <p className="text-sm">{nft.username}</p>
                      <p className="text-sm">Price : {nft.price}</p>
                    </div>
                    </div>

                  <div className="flex justify-start items-center bg-[#00051a] border-[1px] border-slate-700 rounded-xl p-2">
                  <AreaChart width={300} height={150} data={data}
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#00000" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#00000" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="uv" stroke="#82ca9d" fillOpacity={1} fill="url(#colorUv)" />
                </AreaChart> 
                  </div>
                  </div>
                  </div>
                  ))
                  }
                </div>
                <div onClick={() => setCount(count + 6)} className="flex justify-center items-center text-center w-full mt-5"><button className="px-5 py-1 bg-slate-800 rounded-md">Load More</button></div>
            </div>
                }
          {au &&
            <div className="flex-col justify-center items-center w-full my-20">
              <div className="grid grid-cols-2 gap-4 px-5">

                  {mumliveauction.slice(0,9).filter(i => i.sold == false && i.live == true).map((nft) => (
                  <div className="flex justify-center items-center bg-slate-900 py-3 px-3 rounded-lg w-full">
                    <div className="flex items-center object-cover gap-x-3">
                    <div className="w-full flex justify-between items-center object-cover border-[1px] bg-[#00051a] border-slate-700 rounded-xl p-1">
                    <div className="w-full cursor-pointer">
                    {nft.fileType == 'video/mp4'
                    ? <video src={nft.images} className="w-40 h-40 bg-transparent rounded-lg" autoPlay muted loop/>
                    : nft.fileType == 'image/png' || nft.fileType == 'image/jpeg'  || nft.fileType == 'image/jpg' || nft.fileType == 'image/webp' ? <img src={nft.images} className="w-40 h-40 rounded-lg object-cover bg-transparent" />
                    : nft.fileType == 'audio/mp3' || nft.fileType == 'audio/wav' || nft.fileType == 'audio/ogg' || 'audio/mpeg' ? <div className="flex-col justify-between items-center welcomebg w-20 h-20 rounded-lg"><div className="text-[10px] relative top-1/3 flex justify-center items-center text-center">{nft.name}</div></div> : null
                    }
                    </div>
                    <div className="flex-col items-center w-full px-3">
                      <h1 className="text-xl font-bold">{nft.name}</h1>
                      <p className="text-lg font-light overflow-hidden">{nft.description}</p>
                      <p className="text-md">{nft.username}</p>
                      <p className="text-md">Price : {nft.price}</p>
                    </div>
                    </div>

                  <div className="flex justify-start items-center bg-[#00051a] border-[1px] border-slate-700 rounded-xl p-2">
                  <AreaChart width={300} height={150} data={data}
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#00000" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#00000" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="uv" stroke="#82ca9d" fillOpacity={1} fill="url(#colorUv)" />
                </AreaChart> 
                  </div>

                  </div>

                  </div>
                  ))
                  }
                </div>
                <div onClick={() => setCount(count + 6)} className="flex justify-center items-center text-center w-full mt-5"><button className="px-5 py-1 bg-slate-800 rounded-md">Load More</button></div>
            </div>
            }

          </div>
          </Fragment>
        }

        {matches.large &&
          <Fragment>
          <Head>
          <title>Explore • Cosmeta NFT Marketplace</title>
          </Head>
          <div className="flex-col justify-center items-center w-full h-full px-3 pt-20 pb-40 overflow-hidden">
            <div className="flex justify-center items-center gap-x-5 w-full py-5 my-5 bg-gradient-to-t to-slate-900 from-transparent rounded-t-lg text-slate-400">
              <h1 className={nf ? "flex justify-center items-center z-10 text-2xl text-blue-500 border-b-2 border-b-blue-500 cursor-pointer" : "flex justify-center items-center z-10 text-2xl hover:border-b-2 hover:border-b-slate-400 cursor-pointer"} onClick={() => {setN(true),setA(false)}}>Top NFT's</h1><span className="text-3xl font-thin">|</span><h1 className={au ? "flex justify-center items-center z-10 text-2xl border-b-2 border-b-blue-500 text-blue-500 cursor-pointer" : "flex justify-center items-center z-10 text-2xl hover:border-b-2 hover:border-b-slate-400 cursor-pointer"} onClick={() => {setA(true),setN(false)}}>Top Auction's</h1>
            </div>
            {nf &&
            <div className="flex-col justify-center items-center w-full">
              <div className="grid grid-cols-2 gap-4">

                  {content.map((nft) => (
                  <div className="flex justify-center items-center bg-slate-900 py-3 px-3 rounded-lg w-[700px]">
                    <div className="flex items-center object-cover gap-x-3">
                    <div className="w-full flex justify-between items-center object-cover border-[1px] bg-[#00051a] border-slate-700 rounded-xl p-1">
                    <div className="w-full cursor-pointer">
                    {nft.fileType == 'video/mp4'
                    ? <video src={nft.images} className="w-40 h-40 bg-transparent rounded-lg" autoPlay muted loop/>
                    : nft.fileType == 'image/png' || nft.fileType == 'image/jpeg'  || nft.fileType == 'image/jpg' || nft.fileType == 'image/webp' ? <img src={nft.images} className="w-40 h-40 rounded-lg object-cover bg-transparent" />
                    : nft.fileType == 'audio/mp3' || nft.fileType == 'audio/wav' || nft.fileType == 'audio/ogg' || 'audio/mpeg' ? <div className="flex-col justify-between items-center welcomebg w-20 h-20 rounded-lg"><div className="text-[10px] relative top-1/3 flex justify-center items-center text-center">{nft.name}</div></div> : null
                    }
                    </div>
                    <div className="flex-col items-center w-full px-3">
                      <h1 className="text-xl font-bold">{nft.name}</h1>
                      <p className="text-lg font-light overflow-hidden">{nft.description}</p>
                      <p className="text-md">{nft.username}</p>
                      <p className="text-md">Price : {nft.price}</p>
                    </div>
                    </div>

                  <div className="flex justify-start items-center bg-[#00051a] border-[1px] border-slate-700 rounded-xl p-2">
                  <AreaChart width={300} height={150} data={data}
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#00000" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#00000" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="uv" stroke="#82ca9d" fillOpacity={1} fill="url(#colorUv)" />
                </AreaChart> 
                  </div>
                  </div>
                  </div>
                  ))
                  }
                </div>
                <div onClick={() => setCount(count + 6)} className="flex justify-center items-center text-center w-full mt-5"><button className="px-5 py-1 bg-slate-800 rounded-md">Load More</button></div>
            </div>
                }
          {au &&
            <div className="flex-col justify-center items-center w-full my-20">
              <div className="grid grid-cols-2 gap-4 px-5">

                  {mumliveauction.slice(0,9).filter(i => i.sold == false && i.live == true).map((nft) => (
                  <div className="flex justify-center items-center bg-slate-900 py-3 px-3 rounded-lg w-[700px]">
                    <div className="flex items-center object-cover gap-x-3">
                    <div className="w-full flex justify-between items-center object-cover border-[1px] bg-[#00051a] border-slate-700 rounded-xl p-1">
                    <div className="w-full cursor-pointer">
                    {nft.fileType == 'video/mp4'
                    ? <video src={nft.images} className="w-40 h-40 bg-transparent rounded-lg" autoPlay muted loop/>
                    : nft.fileType == 'image/png' || nft.fileType == 'image/jpeg'  || nft.fileType == 'image/jpg' || nft.fileType == 'image/webp' ? <img src={nft.images} className="w-40 h-40 rounded-lg object-cover bg-transparent" />
                    : nft.fileType == 'audio/mp3' || nft.fileType == 'audio/wav' || nft.fileType == 'audio/ogg' || 'audio/mpeg' ? <div className="flex-col justify-between items-center welcomebg w-20 h-20 rounded-lg"><div className="text-[10px] relative top-1/3 flex justify-center items-center text-center">{nft.name}</div></div> : null
                    }
                    </div>
                    <div className="flex-col items-center w-full px-3">
                      <h1 className="text-xl font-bold">{nft.name}</h1>
                      <p className="text-lg font-light overflow-hidden">{nft.description}</p>
                      <p className="text-md">{nft.username}</p>
                      <p className="text-md">Price : {nft.price}</p>
                    </div>
                    </div>

                  <div className="flex justify-start items-center bg-[#00051a] border-[1px] border-slate-700 rounded-xl p-2">
                  <AreaChart width={300} height={150} data={data}
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#00000" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#00000" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="uv" stroke="#82ca9d" fillOpacity={1} fill="url(#colorUv)" />
                </AreaChart> 
                  </div>

                  </div>

                  </div>
                  ))
                  }
                </div>
                <div onClick={() => setCount(count + 6)} className="flex justify-center items-center text-center w-full mt-5"><button className="px-5 py-1 bg-slate-800 rounded-md">Load More</button></div>
            </div>
            }

          </div>
          </Fragment>
        }

      </Fragment>  
    )}
    </Media>
    </div>
  );
};

export default explore;
