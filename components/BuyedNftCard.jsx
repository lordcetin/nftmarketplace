/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { ethers } from 'ethers';
import {useState,useEffect, Fragment} from 'react';
import axios from 'axios';
import { useStateContext } from '../context/StateContext';
import { cipherEth, simpleCrypto,cipherSep } from '../engine/configuration';
import uniqid from 'uniqid';
import { DataContext } from '../store/GlobalState';
import { useContext } from 'react';
import AudioPlayer from '../components/AudioPlayer'
import Media from 'react-media';
import Web3Modal from "web3modal";
import Market from '../engine/Market.json';
import NFT from '../engine/NFT.json';
import Token from '../engine/Token.json';
import { useRouter } from 'next/router';
import Link from 'next/link';
import TimeAgo from './TimeAgo';
import { AiOutlineHeart } from 'react-icons/ai';
import { SiOpensea } from 'react-icons/si'
import { AiFillHeart } from 'react-icons/ai';
import { BiCommentDetail } from 'react-icons/bi';
import { MdVerified  } from 'react-icons/md';

const BuyedNftCard = ({param,datas,addrs}) => {

  const {user,getUser,connectUser,marketcol,nftcustom,cri} = useStateContext();

  const [uid,setUid] = useState(null);
  const [count,setCount] = useState(15);
  const [loadingState,setLoadingState] = useState(false);
  const [buyed,getBuyed] = useState([])
  const [process,setProcess] = useState(false);
  const [formInput, updateFormInput] = useState({ price: ''})

  const {state,dispatch} = useContext(DataContext)
  const {auth} = state
  const router = useRouter()

  useEffect(() => {
    connectUser()
    setUid(uniqid());
  },[getUser])

  useEffect(() => {
    // buyedNFTs()
  }, [])


  const resellNFT = async (e,tokenId,dbid) => {
    e.preventDefault()
    try{
      if(!addrs){
        connectUser()
      }else if(addrs){

      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()

      let cosmeta = new ethers.Contract(cri,Token,signer)
      const nft = new ethers.Contract(nftcustom, NFT, signer)
      const marketcontract = new ethers.Contract(marketcol, Market, signer)

      let price = new ethers.utils.parseUnits(formInput.price, 'ether')
      price = price.toString()
      let listingFee = await marketcontract.getListingFee()
      listingFee = listingFee.toString()

      let approve = await cosmeta.approve(marketcol,listingFee)
      let txapprove = await approve.wait()
      // let eventapprove = txapprove.events[0]
      // console.log("txapprove",txapprove);
      // console.log("eventapprove",eventapprove);

      let gasPrice = new ethers.utils.parseUnits('20', 'gwei')

      const itemids = datas.find(u => u.tokenId == tokenId);
      const nftitem = itemids.itemId;

      await cosmeta.increaseAllowance(marketcol, ethers.utils.parseEther(listingFee.toString()))//ethers.utils.parseEther(listingFee.toString())
      let transaction = await marketcontract.listSale(nftcustom, nftitem, price, {gasPrice:gasPrice,value: listingFee })
      let tx = await transaction.wait()
      // let event = tx.events[0]
      // let value = event.args[2]
      // let tokenId = event.args.tokenId.toNumber()
      // console.log("tx",tx);
      // console.log("event",event);
      // console.log("value",value);
      // console.log("tokenId",tokenId);

      const nftdata = {
        id:String(dbid),
        price:formInput.price,
        resell:true,
        sold:false,
        seller:marketcol,
        owner:user,
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

      setProcess(false);
      router.push('/')
    }else{
      router.push('/connectwallet')
    }
    }catch(err){
      setProcess(false)
      console.log(err);
    }
    }
  //  const filt = datas.filter(u => u.sold == true && u.username == param)
  //  filt.map(i => console.log("filt",i.owner.match(/addrs/i)))
  //  console.log("user",String(window.ethereum.selectedAddress))
  // console.log("Filtered Data:", datas.filter(u => u.sold == true && u.username == param && u.owner.trim() === addrs.toLowerCase().trim()));

  return (
    <div>
    <div className='grid grid-cols-1 sm:grid-cols-4 gap-4'>
    {datas.filter(u => u.sold == true && u.resell == false && u.username == param && u.owner == user.toLowerCase()).map((nft) =>
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
                  <div className='flex gap-x-2 justify-center items-center w-fulll px-3 pb-3'>
                  <input
                  type="number"
                  className='w-full bg-slate-800 hover:bg-slate-900 border-2 border-slate-700 hover:border-blue-500 h-12 px-3 rounded-lg'
                  placeholder="Price"
                  onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
                  />
                  <button className='bg-gradient-to-tr z-30 border-[1px] border-slate-700 rounded-lg to-slate-800 from-slate-800 hover:to-purple-600 hover:from-blue-700 relative px-4 h-12 text-white' onClick={(e) => resellNFT(e,i.tokenId,i._id)} >Resell</button>
                  </div>

                </div>
      </div>
    )}
    </div>
    </div>

    );
};

{/*

*/}

export default BuyedNftCard;
