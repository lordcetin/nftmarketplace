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
    <div className='grid grid-cols-1 sm:grid-cols-4 md:grid-cols-3 gap-5'>
    {datas.filter(u => u.sold == true && u.resell == false && u.username == param && u.owner == user.toLowerCase()).map((i,k) =>
      <div key={k} className="w-[300px] text-slate-400  border-slate-800 border-r-slate-700 rounded-xl bg-gradient-to-tr to-slate-600 from-slate-900 overflow-hidden border-2 ">
      <div>
        <div className='cursor-pointer pb-5'>
        {i.fileType == 'video/mp4'
        ? <><Link href={`/details/${i._id}`}><video src={i.images} className="w-full h-[296px] object-cover rounded-t-lg" autoPlay muted loop/></Link></>
        : i.fileType == 'image/png' || i.fileType == 'image/jpeg'  || i.fileType == 'image/jpg' || i.fileType == 'image/webp' ? <><Link href={`/details/${i._id}`}><img src={i.images} className="w-full h-[296px] rounded-t-lg object-cover" /></Link></>
        : i.fileType == 'audio/mp3' || i.fileType == 'audio/wav' || i.fileType == 'audio/ogg' || 'audio/mpeg' ? <AudioPlayer nft={i.images} nftname={i.name} nftid={i._id}/> : null
        }
      
          <div className='flex-col px-5'>
          <div className='flex justify-between items-center w-full my-3'>
            <div className="flex justify-start items-center w-full">
              <h3 className="text-md font-medium text-purple-500">{i?.createdWallet == user ? 'Created by You' : `${i.username}`}</h3>
            </div>
            <div className='justify-end items-center w-full'>
            <h3 className='font-medium text-sm text-center bg-slate-800 text-slate-500 py-1 px-3 rounded-md'>Token ID : {i.tokenId}</h3>
            </div>
            </div>
            <h5 className='flex gap-x-2 text-lg font-bold my-3'>{i.name}</h5>
            <h5 className='flex gap-x-2 text-sm my-3'>{i.description}</h5>
            <div className='flex justify-between my-5 items-center gap-x-2 border-[1px] border-slate-600 rounded'>
            <div className='w-full '>
            <h1 className='font-bold text-lg flex items-center gap-x-2 py-2 px-3  text-slate-500'>Price : &nbsp;{i?.price}</h1>
            </div>
            <div className='px-3'>
              <img src='https://etherscan.io/token/images/cosmeta_32.png' className='object-cover w-10' title='Crypto International (CRI)' />
            </div>
              </div>
          </div>
          
          <div className='flex gap-x-2 justify-center items-center w-fulll px-3'>
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
      </div>
    )}
    </div>
    </div>

    );
};

export default BuyedNftCard;
