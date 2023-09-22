import React from 'react';
import next from 'next';
import { ethers } from 'ethers';
import {useState,useEffect, Fragment} from 'react';
import { useRouter } from 'next/router';
import Resell from '../engine/Resell.json';
import NFTCollection from '../engine/NFTCollection.json';
import NFT from '../engine/NFT.json';
import Token from '../engine/Token.json';
import Market from '../engine/Market.json';
import { Card, Button, Input, Dropdown, useSSR} from '@nextui-org/react';
import ConnectChain from '../engine/connectchain';
import axios from 'axios';
import detectEthereumProvider from '@metamask/detect-provider';
import { hhnft, hhresell, hhrpc,hhmarket,hhtoken, cipherHH ,nftContract,displayAmount,key, cipherMM, sepauction} from '../engine/configuration';
import { sepnft,sepresell,seprpc,septoken,sepmarket } from '../engine/configuration';
//import { goenft,goeresell,goenftcol,goerpc,goetoken,goemarket } from '../engine/configuration';
//import { bsctnft,bsctnftcol,bsctresell,bsctrpc,bsctmarket,bsctoken } from '../engine/configuration';
import { useStateContext } from '../context/StateContext';
import { cipherEth, simpleCrypto } from '../engine/configuration';
import uniqid from 'uniqid';
import {CreatedNfCard, PreLoader} from '../components';
import {AuctionNftCard} from '../components';
import {BuyedNfCard} from '../components';
import {BiRefresh,BiImageAdd} from 'react-icons/bi'
import jwt from 'jsonwebtoken';
import { motion } from 'framer-motion'
import { DataContext } from '../store/GlobalState';
import { useContext } from 'react';
import {MdVerified} from 'react-icons/md';
import {TbMessageCircle2} from 'react-icons/tb';
import {BsInstagram,BsTwitter} from 'react-icons/bs'
import AudioPlayer from '../components/AudioPlayer'
import InfiniteScroll from 'react-infinite-scroll-component';
import Loading from '../components/Loading';
import {create as ipfsHttpClient} from 'ipfs-http-client';
const { Buffer } = require("buffer");
import Auction from '../engine/Auction.json';
import Media from 'react-media';
import Web3Modal from "web3modal";
import {GetAuctionNftCard} from '../components';
import {AllAuctionNftCard} from '../components';
import {LiveAuctionNftCard} from '../components';
import PersonalAuctions from '../components/PersonalAuctions';
import PersonalLiveAuction from '../components/PersonalLiveAuction';
import PersonalContunieAuction from '../components/PersonalContunieAuction';
import { getUserInfo} from '@/utils/firebase';
import { useSelector } from 'react-redux';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'
import { getFirestore, doc, updateDoc, arrayRemove, arrayUnion,getDoc,onSnapshot, collection,addDoc } from 'firebase/firestore';
import { firebaseConfig } from '@/utils/firebase';
import { AiOutlineCloseCircle } from 'react-icons/ai'
import Head from 'next/head';
const Settings = ({profiledetail,param,setOpenSettings}) => {

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
    getNfts,
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
  const [uids,setUid] = useState(null);
  const [created, getCreated] = useState([]);
  const [resalePrice, updateresalePrice] = useState({ price: ''});
  const [loadingState, setLoadingState] = useState('not-loaded');
  const [tokId,setTokenId] = useState([]);
  const [show,setShow] = useState(false);
  const [showWallet,setWalletShow] = useState(false);
  const [showCont,setContShow] = useState(false);
  const [walletNft,setWalletNfts] = useState(false);
  const [personal,setPersonalNfts] = useState(true);
  const [auctionnfts,setAuctionNfts] = useState(false);
  const [personalactive,setPersonalActive] = useState(false);
  const [walletactive,setWalletActive] = useState(false);
  const [detoken,setToken] = useState(null);
  const [changeImage,setChangeImage] = useState(false)
  const [changePP,setChangePP] = useState(false)
  const [bannerfileUrl,setBannerFile] = useState(false);
  const [profilefileUrl,setProfileFile] = useState(false);
  const [refresh,setRefresh] = useState(false)
  const [mumauction,MumsetAuction] = useState([]);
  const [liveauction,setLiveAuction] = useState([]);
  const [getmumauction,MumGetAuction] = useState([]);
  const [count,setCount] = useState(15)
  const [type,setFileType] = useState(null);
  const [continueAuction,setContinueAuction] = useState(false);
  const [liveAuction,setLivedAuction] = useState(false);
  const [offerAuction,setOfferAuction] = useState(true);
  const [createdNFTs,setCreatedNFTs] = useState(true);
  const [buyedNFTs,setBuyedNFTs] = useState(false);
  const [loading,setLoading] = useState(true);
  const [users,setUser] = useState(null);
  const [isFollow,setFollow] = useState(false);
  const [openModal,setOpenModal] = useState(false)
  const [snapshots,setSnapshot] = useState(null)
  const [isFollowing, setIsFollowing] = useState(false);
  const [isroot,setRoot] = useState(false);
  const [datas,setNftData] = useState([]);

  
  const [totalP,setTotalPrice] = useState(0);
  const [totalN,setTotalNFTs] = useState(0);

  const router = useRouter()  
  const username = router.query.profile

  const [allauction,MumAllAuction] = useState([]);

  const [accounts, setUsers] = useState(null);
  const [userDatas, setUserDatas] = useState(null);

  const {state,dispatch} = useContext(DataContext)
  const {auth} = state

  const account = useSelector(state => state.auth.user)

  // console.log(auth)
  //console.log(userData.find(u => u.username == param))

  //let username = profiledetail.username
  const application = initializeApp(firebaseConfig);
  const authorization = getAuth(application);
  const db = getFirestore(application);

  useEffect(() => {
    if(!account){
      router.push('/login');
    }
  }, []);

  const projectId = "2FraJroGw9rXeeUTFgGRO7P7sFy";
  const projectSecretKey = "0a5ffc989190cb176f8729872bfbf76d";
  const autho = `Basic ${Buffer.from(`${projectId}:${projectSecretKey}`).toString(
    "base64"
    )}`;
    const client = ipfsHttpClient({
      host: "infura-ipfs.io",
      port: 5001,
      protocol: "https",
      headers: {
        authorization: autho,
      },
    });
  const updateBannerContent = async (e) => {
    e.preventDefault();
    setLoading(true);
    const file = e.target.files[0]
    const subdomain = "https://cosmeta.infura-ipfs.io";
    try {
        const added = await client.add(
            file,
            {
                progress: (prog) => console.log(""/*received: ${prog}*/)
            }
        )
        const bannerurl = `${subdomain}/ipfs/${added.path}`;
       setBannerFile(bannerurl)
       const contentData = {bannerurl,username}
       await fetch('https://testnet.cos-in.com/api/update',{
       method:'POST',
       body:JSON.stringify(contentData),
       headers:{ "Content-Type":"aplication/json" }
     }).then(res => {
       if(!res.ok){
         throw new Error("HTTP ERROR",res.status)
       }
       return res;
     }).then((res) => res.json()).then((data) => {
      //  console.log("Update",data)
     })
    } catch (error) {
        //console.log('Error uploading file: ', error)
    }
    setLoading(false);
}
   const updateContent = async (e) => {
    e.preventDefault();
    let desc = e.target.value
    const contentData = {desc,username}
    await fetch('https://testnet.cos-in.com/api/update',{
    method:'POST',
    body:JSON.stringify(contentData),
    headers:{ "Content-Type":"aplication/json" }
  }).then(res => {
    if(!res.ok){
      throw new Error("HTTP ERROR",res.status)
    }
    return res;
  }).then((res) => res.json()).then((data) => {
    // console.log("Update",data)
  })

}
   const updatePPContent = async (e) => {
    e.preventDefault();
    setLoading(true);
    const file = e.target.files[0]
    const subdomain = "https://cosmeta.infura-ipfs.io";
    try {
        const added = await client.add(
            file,
            {
                progress: (prog) => console.log(`received: ${prog}`)
            }
        )
        const avatarurl = `${subdomain}/ipfs/${added.path}`;
       setProfileFile(avatarurl)
       const contentData = {avatarurl,username}
       await fetch('https://testnet.cos-in.com/api/update',{
       method:'POST',
       body:JSON.stringify(contentData),
       headers:{ "Content-Type":"aplication/json" }
     }).then(res => {
       if(!res.ok){
         throw new Error("HTTP ERROR",res.status)
       }
       return res;
     }).then((res) => res.json()).then((data) => {
      //  console.log("Update",data)
     })
    } catch (error) {
        //console.log('Error uploading file: ', error)
    }
    setLoading(false);
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
            <title>Settings • Cosmeta NFT Marketplace</title>
            </Head>
            <div className="flex-col justify-center items-center w-full h-screen fixed top-0 left-0 bg-slate-900 z-[999] px-4 py-10">
            <div className='flex justify-center items-center w-full mb-5'>
              <div className='flex justify-start items-center w-full'><AiOutlineCloseCircle size={28} onClick={() => setOpenSettings(false)}/></div>
              <div className='flex justify-center items-center w-full text-2xl font-bold'>Settings</div>
              <div className='flex justify-end items-center w-full'></div>
            </div>
              <div className="flex justify-between items-center w-full relative">
                <form onSubmit={updatePPContent} className='flex gap-x-6'>
                <div className="">
                <img src={profilefileUrl ? profilefileUrl : profiledetail.avatar} alt="Profile" className='object-cover rounded-full z-40 w-28 h-28 cursor-pointer'/>
                </div>
                <div className='grid gap-y-2 relative'>
                  <h1 className='text-xl font-semibold'>Change Avatar</h1>
                  <input
                  className='absolute top-12'
                  type="file"
                  name="Asset"
                  onChange={updatePPContent}
                />
                  </div>
                  </form>
              </div>
              <div className="flex justify-between items-center w-full mt-10 relative">
              <form onSubmit={updateBannerContent} className='flex gap-x-2'>
                <div className="w-52 h-32">
                <img src={bannerfileUrl ? bannerfileUrl : profiledetail.banner} className={changeImage ? "w-52 flex justify-center items-center h-32 object-cover cursor-pointer opacity-50 rounded-md" : "w-52 h-32 rounded-md object-cover cursor-pointer"}  alt="Banner"/>
                </div>
                <div className='grid gap-y-2 relative'>
                  <h1 className='text-xl font-semibold'>Change Banner</h1>
                  <input
                  className='absolute top-12'
                  type="file"
                  name="Asset"
                  onChange={updateBannerContent}
                />
                </div>
                </form>
              </div>
              <div className="flex justify-between items-center w-full mt-10">
              <form onSubmit={updateContent} className='flex justify-center items-center gap-x-2'>
                <div className="w-56">
                <textarea className='text-lg block antialiased w-56 h-[100px] bg-transparent hover:border-[1px] hover:border-purple-600 focus:border-2 focus:border-purple-600 px-3 py-2 rounded-lg' onChange={updateContent} placeholder={profiledetail.description}/>
                </div>
                <div className='grid gap-y-2'>
                  <button className='px-3 py-1 bg-slate-800 rounded-md'>Change</button>
                </div>
                </form>
              </div>
            </div>
            </Fragment>
            }

            {matches.medium && 
            <Fragment>
            <Head>
            <title>Settings • Cosmeta NFT Marketplace</title>
            </Head>
            <div className="flex justify-center items-center w-full h-screen">
            <h1 className="flex justify-center items-center text-center text-xl">COMING SOON</h1>
            </div>
            </Fragment>
            }

            {matches.large && 
            <Fragment>
            <Head>
            <title>Settings • Cosmeta NFT Marketplace</title>
            </Head>
            <div className="flex justify-center items-center w-full h-screen">
            <h1 className="flex justify-center items-center text-center text-3xl">COMING SOON</h1>
            </div>
            </Fragment>
            }

        </Fragment>
        )}
      </Media>
    </div>
    );
};

export default Settings;
export const getServerSideProps = async (context) => {
  const res = await fetch(`https://testnet.cos-in.com/api/users`)
  const userData = await res.json();

  return{
      props:{
          userData,
      }
  }
}