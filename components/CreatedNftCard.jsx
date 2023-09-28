/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { ethers } from 'ethers';
import {useState,useEffect, Fragment} from 'react';
import NFT from '../engine/NFT.json';
import axios from 'axios';
import { useStateContext } from '../context/StateContext';
import { cipherEth, simpleCrypto } from '../engine/configuration';
import uniqid from 'uniqid';
import { DataContext } from '../store/GlobalState';
import { useContext } from 'react';
import { AiFillHeart } from 'react-icons/ai';
import { BiCommentDetail } from 'react-icons/bi';
import { MdVerified  } from 'react-icons/md';
import AudioPlayer from '../components/AudioPlayer'
import Media from 'react-media';
import Link from 'next/link';
import TimeAgo from './TimeAgo';
import { AiOutlineHeart } from 'react-icons/ai';
import { SiOpensea } from 'react-icons/si'

const CreatedNftCard = ({datas,param}) => {
  const {user,getUser,connectUser,
    nfts,
    setNfts,
    setContAddr,
    contAdr,
    bscChain,
    polyChain,
    ethChain,
    hardChain,
    bscTest,
    ethTest,
    polyTest,
    getChain,
    getOwners,
    setNftResell,
    setNftCustom,
    setTokenCol,
    setNftCol,
    setRpc,
    chain,
    getChainName,
    cipher,
    rpc,
    auction,
    getRpc,
    marketcol,
    getMarket,
    setMarket,
    nftcol, getNftCol,
    cri,setTokenCri,
    nftcustom, getNftCustom,
    nftresell, getNftResell, } = useStateContext();
  const [uid,setUid] = useState(null);
  const [count,setCount] = useState(15)
  const [created,getCreated] = useState([]);

  const {state,dispatch} = useContext(DataContext)
  const {auth} = state

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
            <div className='grid grid-cols-1 gap-y-4'>
              {datas.filter(u => u.username == param && !u.duration /*&& u.seller == user*/).map((nft) => (
                <div key={nft.id} className="w-[300px] sm:w-[232px] border-slate-800 relative hover:bottom-2 border-2 bg-gradient-to-tr to-slate-600 from-slate-900 border-r-slate-700 rounded-xl overflow-hidden ">
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
                  ? <><Link href={`/details/${nft._id}`}><video src={nft.images} className="w-full h-[296px] sm:h-[170px] object-cover rounded-t-lg" autoPlay muted loop/></Link></>
                  : nft.fileType == 'image/png' || nft.fileType == 'image/jpeg'  || nft.fileType == 'image/jpg' || nft.fileType == 'image/webp' ? <><Link href={`/details/${nft._id}`}><img src={nft.images} className="w-full h-[296px] sm:h-[170px] rounded-t-lg object-cover" /></Link></>
                  : nft.fileType == 'audio/mp3' || nft.fileType == 'audio/wav' || nft.fileType == 'audio/ogg' || 'audio/mpeg' ? <AudioPlayer nft={nft.images} nftcover={nft.cover} nftname={nft.name} nftid={nft._id}/> : null
                  }
                  
                  <div className='flex-col px-3'>
                          <div className='flex justify-between items-center w-full my-3'>
                            <div className="flex justify-start items-center w-full">
                              <div className='justify-between items-center w-full'>
                                <Link href={`/${nft.username}`}>
                                  <div className="text-md font-medium cursor-pointer text-purple-500 flex items-center gap-x-1">
                                    {nft.avatar ? <img src={nft.avatar} className="rounded-full w-3 mr-1"/>:null}
                                    <span className="truncate max-w-xs">{!nft.username == "" ? nft?.username : user.slice(0,11) + '...'}</span> 
                                    {nft.role == 'verified' ? <MdVerified size={18}/> : null}
                                  </div>
                                </Link>
                              </div>
                            </div>
            
                          </div>
                          
                          <div className="flex items-center w-full">
                          <h1 className='font-bold text-sm text-slate-400 truncate w-32'>{nft.name}</h1>
                          </div>
            
                          <div className='flex justify-between my-5 items-center gap-x-2 border-[1px] border-slate-600 rounded'>
                        <div className='w-full '>
                        <h1 className='font-bold text-sm flex items-center gap-x-2 py-2 px-3  text-slate-500'>Price : &nbsp;{nft.price}</h1>
                        </div>
                        <div className='px-3'>
                          <img src='https://etherscan.io/token/images/cosmeta_32.png' className='object-cover w-6' title='Crypto International (CRI)' />
                        </div>
                          </div>
            
                          <div className='flex justify-between items-center w-full mb-3 gap-x-4'>
                          <div className='flex justify-start items-center gap-x-2'>
                            <AiOutlineHeart size={20} className='cursor-pointer hover:text-red-500'/>
                            <div className='flex  justify-start items-center gap-x-2 text-sm'>
                            <strong>{nft.likes.length}</strong>
                            </div>
                            </div>
            
                            <div className='flex justify-start items-center gap-x-2 text-sm'>
                              <div>
                              <Link href={`/details/${nft._id}`}><BiCommentDetail size={20} className='cursor-pointer'/></Link>
                              </div>
                              <div className='text-sm flex items-center gap-x-2'>
                              <strong>{nft.comments.length}</strong>
                              </div>
                              </div>
            
                              <div className="flex justify-end text-slate-400 w-full">
                              <TimeAgo timestamp={nft.createdAt}/>
                            </div>
            
                            </div>
                            <div className='flex justify-center items-center gap-x-2 pb-3 w-full'>
                              <button className='bg-gradient-to-tr z-30 border-[1px] border-slate-700 rounded-lg to-slate-800 from-slate-800 hover:to-purple-600 hover:from-blue-700 relative w-full h-12 text-white' onClick={() => buyNewMum(nft.price,nft.tokenId)}>Buy</button>
                            </div>
                          </div>
                </div>
                ))}
            </div>
            </Fragment>
          }
          {matches.medium &&
            <Fragment>
            <div className='grid grid-cols-4 gap-4'>
              {datas.filter(u => u.username == param && !u.duration /*&& u.seller == user*/).map((nft) => (
                <div key={nft.id} className="w-[300px] sm:w-[232px] border-slate-800 relative hover:bottom-2 border-2 bg-gradient-to-tr to-slate-600 from-slate-900 border-r-slate-700 rounded-xl overflow-hidden ">
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
                  ? <><Link href={`/details/${nft._id}`}><video src={nft.images} className="w-full h-[296px] sm:h-[170px] object-cover rounded-t-lg" autoPlay muted loop/></Link></>
                  : nft.fileType == 'image/png' || nft.fileType == 'image/jpeg'  || nft.fileType == 'image/jpg' || nft.fileType == 'image/webp' ? <><Link href={`/details/${nft._id}`}><img src={nft.images} className="w-full h-[296px] sm:h-[170px] rounded-t-lg object-cover" /></Link></>
                  : nft.fileType == 'audio/mp3' || nft.fileType == 'audio/wav' || nft.fileType == 'audio/ogg' || 'audio/mpeg' ? <AudioPlayer nft={nft.images} nftcover={nft.cover} nftname={nft.name} nftid={nft._id}/> : null
                  }
                  
                  <div className='flex-col px-3'>
                          <div className='flex justify-between items-center w-full my-3'>
                            <div className="flex justify-start items-center w-full">
                              <div className='justify-between items-center w-full'>
                                <Link href={`/${nft.username}`}>
                                  <div className="text-md font-medium cursor-pointer text-purple-500 flex items-center gap-x-1">
                                    {nft.avatar ? <img src={nft.avatar} className="rounded-full w-3 mr-1"/>:null}
                                    <span className="truncate max-w-xs">{!nft.username == "" ? nft?.username : user.slice(0,11) + '...'}</span> 
                                    {nft.role == 'verified' ? <MdVerified size={18}/> : null}
                                  </div>
                                </Link>
                              </div>
                            </div>
            
                          </div>
                          
                          <div className="flex items-center w-full">
                          <h1 className='font-bold text-sm text-slate-400 truncate w-32'>{nft.name}</h1>
                          </div>
            
                          <div className='flex justify-between my-5 items-center gap-x-2 border-[1px] border-slate-600 rounded'>
                        <div className='w-full '>
                        <h1 className='font-bold text-sm flex items-center gap-x-2 py-2 px-3  text-slate-500'>Price : &nbsp;{nft.price}</h1>
                        </div>
                        <div className='px-3'>
                          <img src='https://etherscan.io/token/images/cosmeta_32.png' className='object-cover w-6' title='Crypto International (CRI)' />
                        </div>
                          </div>
            
                          <div className='flex justify-between items-center w-full mb-3 gap-x-4'>
                          <div className='flex justify-start items-center gap-x-2'>
                            <AiOutlineHeart size={20} className='cursor-pointer hover:text-red-500'/>
                            <div className='flex  justify-start items-center gap-x-2 text-sm'>
                            <strong>{nft.likes.length}</strong>
                            </div>
                            </div>
            
                            <div className='flex justify-start items-center gap-x-2 text-sm'>
                              <div>
                              <Link href={`/details/${nft._id}`}><BiCommentDetail size={20} className='cursor-pointer'/></Link>
                              </div>
                              <div className='text-sm flex items-center gap-x-2'>
                              <strong>{nft.comments.length}</strong>
                              </div>
                              </div>
            
                              <div className="flex justify-end text-slate-400 w-full">
                              <TimeAgo timestamp={nft.createdAt}/>
                            </div>
            
                            </div>
                            <div className='flex justify-center items-center gap-x-2 pb-3 w-full'>
                              <button className='bg-gradient-to-tr z-30 border-[1px] border-slate-700 rounded-lg to-slate-800 from-slate-800 hover:to-purple-600 hover:from-blue-700 relative w-full h-12 text-white' onClick={() => buyNewMum(nft.price,nft.tokenId)}>Buy</button>
                            </div>
                          </div>
                </div>
                ))}
            </div>
            </Fragment>
          }
          {matches.large &&
            <Fragment>
            <div className='grid grid-cols-5 gap-4'>
              {datas.filter(u => u.username == param && !u.duration /*&& u.seller == user*/).map((nft) => (
                <div key={nft.id} className="w-[300px] sm:w-[232px] border-slate-800 relative hover:bottom-2 border-2 bg-gradient-to-tr to-slate-600 from-slate-900 border-r-slate-700 rounded-xl overflow-hidden ">
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
                  ? <><Link href={`/details/${nft._id}`}><video src={nft.images} className="w-full h-[296px] sm:h-[170px] object-cover rounded-t-lg" autoPlay muted loop/></Link></>
                  : nft.fileType == 'image/png' || nft.fileType == 'image/jpeg'  || nft.fileType == 'image/jpg' || nft.fileType == 'image/webp' ? <><Link href={`/details/${nft._id}`}><img src={nft.images} className="w-full h-[296px] sm:h-[170px] rounded-t-lg object-cover" /></Link></>
                  : nft.fileType == 'audio/mp3' || nft.fileType == 'audio/wav' || nft.fileType == 'audio/ogg' || 'audio/mpeg' ? <AudioPlayer nft={nft.images} nftcover={nft.cover} nftname={nft.name} nftid={nft._id}/> : null
                  }
                  
                  <div className='flex-col px-3'>
                          <div className='flex justify-between items-center w-full my-3'>
                            <div className="flex justify-start items-center w-full">
                              <div className='justify-between items-center w-full'>
                                <Link href={`/${nft.username}`}>
                                  <div className="text-md font-medium cursor-pointer text-purple-500 flex items-center gap-x-1">
                                    {nft.avatar ? <img src={nft.avatar} className="rounded-full w-3 mr-1"/>:null}
                                    <span className="truncate max-w-xs">{!nft.username == "" ? nft?.username : user.slice(0,11) + '...'}</span> 
                                    {nft.role == 'verified' ? <MdVerified size={18}/> : null}
                                  </div>
                                </Link>
                              </div>
                            </div>
            
                          </div>
                          
                          <div className="flex items-center w-full">
                          <h1 className='font-bold text-sm text-slate-400 truncate w-32'>{nft.name}</h1>
                          </div>
            
                          <div className='flex justify-between my-5 items-center gap-x-2 border-[1px] border-slate-600 rounded'>
                        <div className='w-full '>
                        <h1 className='font-bold text-sm flex items-center gap-x-2 py-2 px-3  text-slate-500'>Price : &nbsp;{nft.price}</h1>
                        </div>
                        <div className='px-3'>
                          <img src='https://etherscan.io/token/images/cosmeta_32.png' className='object-cover w-6' title='Crypto International (CRI)' />
                        </div>
                          </div>
            
                          <div className='flex justify-between items-center w-full mb-3 gap-x-4'>
                          <div className='flex justify-start items-center gap-x-2'>
                            <AiOutlineHeart size={20} className='cursor-pointer hover:text-red-500'/>
                            <div className='flex  justify-start items-center gap-x-2 text-sm'>
                            <strong>{nft.likes.length}</strong>
                            </div>
                            </div>
            
                            <div className='flex justify-start items-center gap-x-2 text-sm'>
                              <div>
                              <Link href={`/details/${nft._id}`}><BiCommentDetail size={20} className='cursor-pointer'/></Link>
                              </div>
                              <div className='text-sm flex items-center gap-x-2'>
                              <strong>{nft.comments.length}</strong>
                              </div>
                              </div>
            
                              <div className="flex justify-end text-slate-400 w-full">
                              <TimeAgo timestamp={nft.createdAt}/>
                            </div>
            
                            </div>
                            <div className='flex justify-center items-center gap-x-2 pb-3 w-full'>
                              <button className='bg-gradient-to-tr z-30 border-[1px] border-slate-700 rounded-lg to-slate-800 from-slate-800 hover:to-purple-600 hover:from-blue-700 relative w-full h-12 text-white' onClick={() => buyNewMum(nft.price,nft.tokenId)}>Buy</button>
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

export default CreatedNftCard;
