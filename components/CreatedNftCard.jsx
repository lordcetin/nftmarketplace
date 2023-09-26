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
import AudioPlayer from '../components/AudioPlayer'
import Media from 'react-media';
import Link from 'next/link';
import TimeAgo from './TimeAgo';
import { AiOutlineHeart } from 'react-icons/ai';

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
            <div className='grid grid-cols-1 gap-y-2'>
              {datas.filter(u => u.username == param && !u.duration).map((nft,k) => (
                <div key={k} className="w-[300px] border-slate-800 relative hover:bottom-2 border-2 bg-gradient-to-tr to-slate-600 from-slate-900 border-r-slate-700 rounded-xl overflow-hidden ">
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
                          {!nft.duration ?
                            <div className='flex justify-end items-center w-full'>
                            <h3 className='font-medium text-sm text-center bg-slate-800 text-slate-500 py-1 px-3 rounded-md'>Token ID : {nft.tokenId}</h3>
                            </div>
                            :
                            <div className='justify-end items-center w-16 animate-pulse'>
                            <h3 className={nft.live == true ? 'font-bold text-sm text-center bg-red-600 text-slate-50 py-1 px-3 rounded-md' : 'font-bold text-sm text-center bg-slate-700 text-slate-50 py-1 px-3 rounded-md'}>{nft.live == true ? "LIVE" : "Auction Expired"}</h3>
                            </div>
                          }
                          </div>
                          
                          <div className="flex justify-between items-center w-full">
                          <h1 className='font-medium text-lg text-slate-400'>{nft.name}</h1>
                          <TimeAgo timestamp={nft.createdAt} />
                          </div>
            {!nft.duration ?
                          <div className='flex justify-between my-5 items-center gap-x-2 border-[1px] border-slate-600 rounded'>
                        <div className='w-full '>
                        <h1 className='font-bold text-lg flex items-center gap-x-2 py-2 px-3  text-slate-500'>Price : &nbsp;{nft.price}</h1>
                        </div>
                        <div className='px-3'>
                          <img src='https://etherscan.io/token/images/cosmeta_32.png' className='object-cover w-10' title='Crypto International (CRI)' />
                        </div>
                          </div>
            :
            <div className="my-3">
            <p className="text-slate-400 text-sm">{nft.description}</p>
            <div className="flex items-center gap-x-1.5 my-3 text-slate-400"><strong>Last Bid : &nbsp;{nft.bidprice}</strong><img src='https://etherscan.io/token/images/cosmeta_32.png' className='object-cover w-5' title='Crypto International (CRI)' /></div>
            <div className="text-sm flex gap-x-2 text-slate-400 my-3"><strong>Owner : </strong><span>{nft.owner.slice(0,5) + '...' + nft.owner.slice(38)}</span></div>
            <Countdown timestamp={duration + "000"}/>
            </div>
            }
                          <div className='flex justify-between items-center w-full mb-3'>
                          <div className='flex items-center gap-x-2'>
                          <div>
                          {!nft.duration ?
                            <form onSubmit={e => likehandler(e)}>
                              {auth.user.liked.find(u => u.includes(nft._id)) ? <button><AiFillHeart size={20} className='cursor-pointer text-red-500 hover:text-white' onClick={() => deleteLiker(nft._id)} /></button> : <button><AiOutlineHeart size={20} className=' cursor-pointer hover:text-red-500' onClick={() => setLiker(nft._id)}/></button>}
                            </form>
                          : 
                          <form onSubmit={e => likehandler(e)}>
                          {auth.user.liked.find(u => u.includes(nft._id)) ? <button><AiFillHeart size={20} className='cursor-pointer text-red-500 hover:text-white' onClick={() => deleteLiker(nft._id)} /></button> : <button><AiOutlineHeart size={20} className=' cursor-pointer hover:text-red-500' onClick={() => setLiker(nft._id)}/></button>}
                          </form>
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

                          </div>
                </div>
                ))}
            </div>
            </Fragment>
          }
          {matches.medium &&
            <Fragment>
            <div className='grid grid-cols-3 gap-3'>
              {datas.filter(u => u.username == param && !u.duration).map((nft,k) => (
                <div key={k} className="w-[300px] border-slate-800 relative hover:bottom-2 border-2 bg-gradient-to-tr to-slate-600 from-slate-900 border-r-slate-700 rounded-xl overflow-hidden ">
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
                          {!nft.duration ?
                            <div className='flex justify-end items-center w-full'>
                            <h3 className='font-medium text-sm text-center bg-slate-800 text-slate-500 py-1 px-3 rounded-md'>Token ID : {nft.tokenId}</h3>
                            </div>
                            :
                            <div className='justify-end items-center w-16 animate-pulse'>
                            <h3 className={nft.live == true ? 'font-bold text-sm text-center bg-red-600 text-slate-50 py-1 px-3 rounded-md' : 'font-bold text-sm text-center bg-slate-700 text-slate-50 py-1 px-3 rounded-md'}>{nft.live == true ? "LIVE" : "Auction Expired"}</h3>
                            </div>
                          }
                          </div>
                          
                          <div className="flex justify-between items-center w-full">
                          <h1 className='font-medium text-lg text-slate-400'>{nft.name}</h1>
                          <TimeAgo timestamp={nft.createdAt} />
                          </div>
            {!nft.duration ?
                          <div className='flex justify-between my-5 items-center gap-x-2 border-[1px] border-slate-600 rounded'>
                        <div className='w-full '>
                        <h1 className='font-bold text-lg flex items-center gap-x-2 py-2 px-3  text-slate-500'>Price : &nbsp;{nft.price}</h1>
                        </div>
                        <div className='px-3'>
                          <img src='https://etherscan.io/token/images/cosmeta_32.png' className='object-cover w-10' title='Crypto International (CRI)' />
                        </div>
                          </div>
            :
            <div className="my-3">
            <p className="text-slate-400 text-sm">{nft.description}</p>
            <div className="flex items-center gap-x-1.5 my-3 text-slate-400"><strong>Last Bid : &nbsp;{nft.bidprice}</strong><img src='https://etherscan.io/token/images/cosmeta_32.png' className='object-cover w-5' title='Crypto International (CRI)' /></div>
            <div className="text-sm flex gap-x-2 text-slate-400 my-3"><strong>Owner : </strong><span>{nft.owner.slice(0,5) + '...' + nft.owner.slice(38)}</span></div>
            <Countdown timestamp={duration + "000"}/>
            </div>
            }
                          <div className='flex justify-between items-center w-full mb-3'>
                          <div className='flex items-center gap-x-2'>
                          <div>
                          {!nft.duration ?
                            <form onSubmit={e => likehandler(e)}>
                              {auth.user.liked.find(u => u.includes(nft._id)) ? <button><AiFillHeart size={20} className='cursor-pointer text-red-500 hover:text-white' onClick={() => deleteLiker(nft._id)} /></button> : <button><AiOutlineHeart size={20} className=' cursor-pointer hover:text-red-500' onClick={() => setLiker(nft._id)}/></button>}
                            </form>
                          : 
                          <form onSubmit={e => likehandler(e)}>
                          {auth.user.liked.find(u => u.includes(nft._id)) ? <button><AiFillHeart size={20} className='cursor-pointer text-red-500 hover:text-white' onClick={() => deleteLiker(nft._id)} /></button> : <button><AiOutlineHeart size={20} className=' cursor-pointer hover:text-red-500' onClick={() => setLiker(nft._id)}/></button>}
                          </form>
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

                          </div>
                </div>
                ))}
            </div>
            </Fragment>
          }
          {matches.large &&
            <Fragment>
            <div className='grid grid-cols-4 gap-4'>
              {datas.filter(u => u.username == param && !u.duration /*&& u.seller == user*/).map((nft,k) => (
                <div key={k} className="w-[300px] border-slate-800 relative hover:bottom-2 border-2 bg-gradient-to-tr to-slate-600 from-slate-900 border-r-slate-700 rounded-xl overflow-hidden ">
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
                          {!nft.duration ?
                            <div className='flex justify-end items-center w-full'>
                            <h3 className='font-medium text-sm text-center bg-slate-800 text-slate-500 py-1 px-3 rounded-md'>Token ID : {nft?.tokenId}</h3>
                            </div>
                            :
                            <div className='justify-end items-center w-16 animate-pulse'>
                            <h3 className={nft?.live == true ? 'font-bold text-sm text-center bg-red-600 text-slate-50 py-1 px-3 rounded-md' : 'font-bold text-sm text-center bg-slate-700 text-slate-50 py-1 px-3 rounded-md'}>{nft?.live == true ? "LIVE" : "Auction Expired"}</h3>
                            </div>
                          }
                          </div>
                          
                          <div className="flex justify-between items-center w-full">
                          <h1 className='font-medium text-lg text-slate-400'>{nft?.name}</h1>
                          <TimeAgo timestamp={nft?.createdAt} />
                          </div>
            {!nft.duration ?
                          <div className='flex justify-between my-5 items-center gap-x-2 border-[1px] border-slate-600 rounded'>
                        <div className='w-full '>
                        <h1 className='font-bold text-lg flex items-center gap-x-2 py-2 px-3  text-slate-500'>Price : &nbsp;{nft?.price}</h1>
                        </div>
                        <div className='px-3'>
                          <img src='https://etherscan.io/token/images/cosmeta_32.png' className='object-cover w-10' title='Crypto International (CRI)' />
                        </div>
                          </div>
            :
            <div className="my-3">
            <p className="text-slate-400 text-sm">{nft?.description}</p>
            <div className="flex items-center gap-x-1.5 my-3 text-slate-400"><strong>Last Bid : &nbsp;{nft?.bidprice}</strong><img src='https://etherscan.io/token/images/cosmeta_32.png' className='object-cover w-5' title='Crypto International (CRI)' /></div>
            <div className="text-sm flex gap-x-2 text-slate-400 my-3"><strong>Owner : </strong><span>{nft?.owner.slice(0,5) + '...' + nft?.owner.slice(38)}</span></div>
            <Countdown timestamp={duration + "000"}/>
            </div>
            }
                          <div className='flex justify-between items-center w-full mb-3'>
                          <div className='flex items-center gap-x-2'>
                          <div>
                          {!nft.duration ?
                            <form onSubmit={e => likehandler(e)}>
                              {auth?.user?.liked.find(u => u.includes(nft._id)) ? <button><AiFillHeart size={20} className='cursor-pointer text-red-500 hover:text-white' onClick={() => deleteLiker(nft._id)} /></button> : <button><AiOutlineHeart size={20} className=' cursor-pointer hover:text-red-500' onClick={() => setLiker(nft._id)}/></button>}
                            </form>
                          : 
                          <form onSubmit={e => likehandler(e)}>
                          {auth?.user?.liked.find(u => u.includes(nft._id)) ? <button><AiFillHeart size={20} className='cursor-pointer text-red-500 hover:text-white' onClick={() => deleteLiker(nft._id)} /></button> : <button><AiOutlineHeart size={20} className=' cursor-pointer hover:text-red-500' onClick={() => setLiker(nft._id)}/></button>}
                          </form>
                          }
                          </div>
                            <div className='flex items-center mb-1.5 gap-x-2 text-sm'>
                            <strong>{nft?.likes?.length}</strong><span>Like</span>
                            </div>
                          </div>
                          <div className='flex items-center gap-x-2 text-sm'>
                            <div>
                            <Link href={`/details/${nft._id}`}><BiCommentDetail size={20} className='cursor-pointer'/></Link>
                            </div>
                            <div className='text-sm flex items-center gap-x-2'>
                            <strong>{nft?.comments?.length}</strong><span>Comments</span>
                            </div>
                          </div>
                        </div>
                          </div>
                          <div className='flex justify-between items-center mx-2 gap-x-2 pb-3'>

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
