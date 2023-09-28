/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
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
import {MdVerified} from 'react-icons/md'
import jwt from 'jsonwebtoken';
import { motion } from 'framer-motion'
import { DataContext } from '../store/GlobalState';
import { useContext } from 'react';
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
import Head from 'next/head';
import { useSelector } from 'react-redux';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'
import { getFirestore, doc, updateDoc, arrayRemove, arrayUnion,getDoc,onSnapshot, collection,addDoc } from 'firebase/firestore';
import { firebaseConfig } from '@/utils/firebase';
import { RiSettings5Fill } from 'react-icons/ri'
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { AiOutlineClose } from 'react-icons/ai';
import Link from 'next/link';

 const Sell = ({userData,param,nftData}) => {

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
  const [uids,setUid] = useState(null);
  const [created, getCreated] = useState([]);
  const [resalePrice, updateresalePrice] = useState({ price: ''});
  const [loadingState, setLoadingState] = useState('not-loaded');
  const [tokId,setTokenId] = useState([]);
  const [show,setShow] = useState(false);
  const [createdNFTs,setCreatedNFTs] = useState(true);
  const [buyedNFTs,setBuyedNFTs] = useState(false);
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
  const [loading,setLoading] = useState(true);
  const [users,setUser] = useState(null);
  const [isFollow,setFollow] = useState(false);
  const [openModal,setOpenModal] = useState(false)
  const [snapshots,setSnapshot] = useState(null)
  const [isFollowing, setIsFollowing] = useState(false);
  const [isroot,setRoot] = useState(false);
  const [datas,setNftData] = useState([]);
  const [openSettings,setOpenSettings] = useState(false);
  const [ppdata,setPPData] = useState(false);
  const [buyednft,getBuyed] = useState([]);
  const [userdatas,setUsersDatas] = useState([]);
  const [msgdata,setMsg] = useState(false);
  const [addrs, setAddrs] = useState(null);
  const [isclick,isButtonClickable] = useState(true)
  const [updateSocial,setUpdateSocial] = useState(false)
  const [instalink,setInstagramLink] = useState("")
  const [twitterlink,setTwitterLink] = useState("")

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
  const profiledetail = userData.find(u => u.username == param)
  //let username = profiledetail.username
  const application = initializeApp(firebaseConfig);
  const authorization = getAuth(application);
  const db = getFirestore(application);

  // useEffect(() => {
  //   if(!account){
  //     router.push('/login');
  //   }
  // }, []);

  useEffect(() => {
    connectUser()
    if (window.ethereum && window?.ethereum?.selectedAddress && user) {
      setAddrs(user);
    }
  },[getUser])

  
  useEffect(() => {
    getUsers()
  },[])

  useEffect(() => {
    const unsubscribe = authorization.onAuthStateChanged((accounts) => {
      setUsers(accounts);
    });

    return () => unsubscribe();
  }, []);
  

  useEffect(() => {
    getUserInfo(username)
    .then(usero => {
        setUser(usero)
    })
    .catch(err => {
      if(err){
        setUser(false)
      }
    })
    totalPrice();
    totalNFTs();
    totalOwners();
    refreshNFTs();
    getChain();
    setRpc();
    setUid(uniqid());
    setMarket();
    getNFTs()
    const token = localStorage.getItem('token')
    if(token){
      const usertoken = jwt.decode(token)
      setToken(usertoken.email)
      if(!usertoken){
        localStorage.removeItem('token')
        router.push('/login')
      }
    }
  }, [])


  useEffect(() => {
    if (accounts) {
      const userRef = doc(db, 'users', accounts.uid);
      getDoc(userRef).then((doc) => {
        if (doc.exists()) {
          setUserDatas(doc.data());
          setIsFollowing(doc.data().following.includes(account.uid));
        } else {
          console.log('No such document!');
        }
      });
    }
  }, [accounts]); 

    // async function getWalletNFTs() {
    //   var address = hhnftcol
    //   var network = hhrpc
    //   const provider = new ethers.providers.JsonRpcProvider(network)
    //   const key = simpleCrypto.decrypt(cipherHH)//cipherEth
    //   const wallet = new ethers.Wallet(key, provider);
    //   const contract = new ethers.Contract(address, NFTCollection, wallet);
    //   const itemArray = [];
    //   contract.totalSupply().then(result => {
    //     for (let i = 0; i < result; i++) {
    //       var token = i + 1                         
    //       const owner = contract.ownerOf(token).catch(function (error) {
    //           //console.log("tokens filtered");
    //         });
    //       const rawUri = contract.tokenURI(token).catch(function (error) {
    //           //console.log("tokens filtered");
    //         });
    //       const Uri = Promise.resolve(rawUri)
    //       const getUri = Uri.then(value => {
    //         var cleanUri = value.replace('ipfs://', 'https://ipfs.io/ipfs/')
    //         let metadata = axios.get(cleanUri).catch(function (error) {
    //           //console.log(error.toJSON());
    //         });
    //         return metadata;
    //       })
    //       getUri.then(value => {
    //         let rawImg = value.data.image
    //         var name = value.data.name
    //         var desc = value.data.description
    //         let image = rawImg.replace('ipfs://', 'https://ipfs.io/ipfs/')
    //         Promise.resolve(owner).then(value => {
    //           let ownerW = value;
    //           let meta = {
    //             name: name,
    //             img: image,
    //             tokenId: token,
    //             wallet: ownerW,
    //             desc,
    //           }
    //           itemArray.push(meta)
    //         })
    //       })
    //     }
    //   })
    //   await new Promise(r => setTimeout(r, 2000));
    //   setNfts(itemArray)
    //   setLoadingState('loaded');
    // }

  async function getAuctionNFT() {
      let network = rpc
      const key = simpleCrypto.decrypt(cipherMM)
      const provider = new ethers.providers.JsonRpcProvider(network)
      const wallet = new ethers.Wallet(key, provider);
      let auctioncontract = new ethers.Contract(auction, Auction, wallet)
      let i ;
      for(i = 1; i > i.length;i++){
      const data = await auctioncontract.getAuction(i)
      
      const items = await Promise.all(data.map(async i => {
        const tokenUri = await auctioncontract.tokenURI(i.tokenId)
        const meta = await axios.get(tokenUri)
        //const fdata = await axios.get(meta.data.image);
        //const ftype = fdata.headers.get('content-type')
        setFileType(meta.data.fileType)
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
      MumGetAuction(items.slice(0,`${count}`))
    }}

    async function refreshNFTs(){
      getChain();
      setRpc();
    }

    const getMore = () => {
      created.slice(0,9).map(nft => nft)
    }

  const totalPrice = async () => {
    const arr = datas.filter(u => u.username == param && u.sold == false).map(i => i.price)
    let total = 0;
    for(let i = 0; i < arr.length; i++){
      total += Number(arr[i])
      if(total > 0){
        setTotalPrice(total)
      }else{
        setTotalPrice(0)
      }
    }
  }

  const totalNFTs = async () => {
    const auctions = datas.filter(u => u.username == param)
    const total = auctions.length 
    setTotalNFTs(total)
  }

  const totalOwners = async () => {
    let count = datas.filter(u => u.username == param && u.sold == true).map(i => i.owner).length
    // console.log("count",count)
  }

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

    const onChangeBanner = async (e) => {
      setLoading(true);
      const file = e.target.files[0]
      const subdomain = "https://cosmeta.infura-ipfs.io";
      try {
          const added = await client.add(
              file,
              {
                  progress: (prog) => console.log("",/*received: ${prog}*/)
              }
          )
          const url = `${subdomain}/ipfs/${added.path}`;
         setBannerFile(url)
         
      } catch (error) {
          //console.log('Error uploading file: ', error)
      }
      setLoading(false);
    }

    
    const onChangeProfile = async (e) => {
      setLoading(true);
      const file = e.target.files[0]
      const subdomain = "https://cosmeta.infura-ipfs.io";
      try {
          const added = await client.add(
              file,
              {
                  progress: (prog) => console.log("",/*received: ${prog}*/)
              }
          )
          const url = `${subdomain}/ipfs/${added.path}`;
         setProfileFile(url)
         
      } catch (error) {
          //console.log('Error uploading file: ', error)
      }
      setLoading(false);
    }

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
         method:'PUT',
         body:JSON.stringify(contentData),
         headers:{ "Content-Type":"aplication/json" }
       }).then(res => {
         if(!res.ok){
           throw new Error("HTTP ERROR",res.status)
         }
         return res;
       }).then((res) => res.json()).then((data) => {
         setPPData(data)
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
      method:'PUT',
      body:JSON.stringify(contentData),
      headers:{ "Content-Type":"aplication/json" }
    }).then(res => {
      if(!res.ok){
        throw new Error("HTTP ERROR",res.status)
      }
      return res;
    })
  }

     const updateInstagram = async () => {
      let insta = instalink
      const contentData = {insta,username}
      await fetch('https://testnet.cos-in.com/api/update',{
      method:'PUT',
      body:JSON.stringify(contentData),
      headers:{ "Content-Type":"aplication/json" }
    }).then(res => {
      if(!res.ok){
        throw new Error("HTTP ERROR",res.status)
      }
      return res;
    })
  }
     const updateTwitter = async () => {
      let twitter = twitterlink
      const contentData = {twitter,username}
      await fetch('https://testnet.cos-in.com/api/update',{
      method:'PUT',
      body:JSON.stringify(contentData),
      headers:{ "Content-Type":"aplication/json" }
    }).then(res => {
      if(!res.ok){
        throw new Error("HTTP ERROR",res.status)
      }
      return res;
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
                  progress: (prog) => console.log(""/*received: ${prog}*/)
              }
          )
          const avatarurl = `${subdomain}/ipfs/${added.path}`;
         setProfileFile(avatarurl)
         const contentData = {avatarurl,username}
         await fetch('https://testnet.cos-in.com/api/update',{
         method:'PUT',
         body:JSON.stringify(contentData),
         headers:{ "Content-Type":"aplication/json" }
       }).then(res => {
         if(!res.ok){
           throw new Error("HTTP ERROR",res.status)
         }
         return res;
       }).then((res) => res.json()).then((data) => {
        //  console.log("Update",data)
         setPPData(data)
       })
      } catch (error) {
          //console.log('Error uploading file: ', error)
      }
      setLoading(false);
  }

  const handleFollow = () => {
    if(isclick){

      // Tıklamayı engelleyin
      isButtonClickable(false);

      // Belirli bir süre sonra tıklamayı tekrar etkinleştirin
      setTimeout(() => {
        isButtonClickable(true);
      }, 4000); // Örneğin, 4 saniye
    }
    if (!accounts) {
      router.push('/login');
      return;
    }
    const currentUserRef = doc(db, 'users', accounts.uid);
    const followedUserRef = doc(db, 'users', users.uid);
    
    // If the user is already following the followed user, unfollow them
    if (isFollowing) {
      toast("Unfollowed!");
      updateDoc(currentUserRef, {
        following: arrayRemove(users.uid),
      });
      updateDoc(followedUserRef, {
        followers: arrayRemove(accounts.uid),
      });
      setIsFollowing(false);
    }
    // If the user is not already following the followed user, follow them
    else {
      toast("Followed!");
      updateDoc(currentUserRef, {
        following: arrayUnion(users.uid),
      });
      updateDoc(followedUserRef, {
        followers: arrayUnion(accounts.uid),
      });
      setIsFollowing(true);
    }
  };

  const getNFTs = async () => {
    await fetch('https://testnet.cos-in.com/api/setnft').then(res => {
      if(!res.ok){
        throw new Error("HTTP ERROR",res.status)
      }
      return res
    }).then(res => res.json()).then(data => {
      setNftData(data)
    })
  }
  const getUsers = async () => {
    await fetch('https://testnet.cos-in.com/api/users').then(res => {
      if(!res.ok){
        throw new Error("HTTP ERROR",res.status)
      }
      return res
    }).then(res => res.json()).then(data => {
      setUsersDatas(data)
    })
  }

  useEffect(() => {
    const token = Cookies.get('refreshtoken');
    const decodedToken = jwt.decode(token);
    const msgref = collection(db,"chats");
    const mesg = onSnapshot(msgref, (snapshot) => {
      const chatfetch = snapshot?.docs.map(doc => ({
          id:doc.id,
          ...doc.data()
      }));
      const setsa = chatfetch.filter(u => u.users.includes(decodedToken.email))
      setMsg(setsa)
  },(error) => {
    console.log(error);
})
  }, []);

  const handleMessage = async (e) => {
    e.preventDefault()
    if(isclick){

      // Tıklamayı engelleyin
      isButtonClickable(false);

      // Belirli bir süre sonra tıklamayı tekrar etkinleştirin
      setTimeout(() => {
        isButtonClickable(true);
      }, 4000); // Örneğin, 4 saniye
    }
    const currentUserRef = doc(db, 'users', accounts.email); //profile giren kullanıcı
    const messagedUserRef = doc(db, 'users', users.email);//mesaj atılacak kullanıcı

    const token = Cookies.get('refreshtoken');
    const decodedToken = jwt.decode(token);

    const execttoemail = msgdata.filter(u => u.users.includes(users.email)).map(i => i.users)
    const msgid = msgdata.filter(u => u.users.includes(users.email)).map(i => i.id)

    if(execttoemail == false){
      await msgadd()
    }else{
      router.push(`/inbox/chat/${msgid[0]}`)
    }
}

const msgadd = async () => {
  const token = Cookies.get('refreshtoken');
  const decodedToken = jwt.decode(token);
  const msgref = collection(db,"chats");
  let addmsg = addDoc(msgref, { read:false, users: [decodedToken.email, users.email] }).then((data) => {

      router.push(`/inbox/chat/${data.id}`)

  })

}


  const usData = userdatas.filter(u => u.username == param )


if(!usData){
  router.push('/')
}

if(users == false){
  setTimeout(() => {
    router.push('/')
  },2000)

return (
  <div className='flex justify-center py-40 pb-60 h-screen'>
    <div className='flex justify-center items-center text-center text-3xl text-slate-400'>
      User Not Found!
    </div>
  </div>
  );

}

if(users == null){
  return (
      <PreLoader/>
    )
}

console.log(profiledetail)

return account && (
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
        <title>@{users.username} • Cosmeta NFT Marketplace</title>
      </Head>
  <div className='flex-col overflow-hidden pb-40'>

  <div className='flex w-full justify-center items-center cursor-pointer'>
  <img src={profiledetail?.banner} className={changeImage ? "w-full flex justify-center items-center h-[330px] object-cover cursor-pointer opacity-50 rounded-md" : "w-full h-[330px] rounded-md object-cover cursor-pointer"}  alt="Banner"/>   
  </div>

  <div className='flex-col justify-between items-center'>

    <div className='relative bottom-16 flex justify-center items-center w-full'>
    <div className='flex justify-center items-center w-24 h-24 border-2 border-purple-600 rounded-full cursor-pointer bg-transparent'>
    <img src={profiledetail?.avatar} alt="Profile" className='rounded-full z-30 w-20 h-20'/>
    </div>


    </div>
    </div>
    
    <div className='relative bottom-16 flex justify-center items-center w-full'>
    <div className={profiledetail?.root == true
      ? 'flex items-center gap-x-2 left-36 bottom-10 py-2 px-3 text-yellow-500 text-xl font-bold'
      : 'flex items-center gap-x-2 left-36 bottom-10 py-2 px-3 text-slate-400 text-xl font-bold'}
      >{profiledetail.username} {profiledetail?.role == "verified" ? 
      <MdVerified size={22} title="Verified" className={profiledetail.root == true 
        ? "cursor-pointer text-yellow-500" 
        : "cursor-pointer text-purple-600"}/> : null}
    </div>

  </div>

    <div className='relative bottom-12 flex justify-center items-center w-full px-7'>
        <p className='truncate'>{profiledetail?.description}</p>
    </div>
    <div className='relative bottom-10 flex justify-center items-center text-center gap-x-4'>
      <span><Link href={`${profiledetail?.instagram}`}><BsInstagram size={22} className="hover:text-white cursor-pointer" /></Link></span>
      <span><Link href={`${profiledetail?.twitter}`}><BsTwitter size={22} className="hover:text-white cursor-pointer" /></Link></span>
    </div>
  
    <div className='flex justify-center items-center antialiased w-full mb-8'>
    <div className='flex-col'>
    <div className='flex gap-x-2'>
    <span className='font-semibold items-center px-2 cursor-pointer' onClick={() => setOpenModal(true)}>{users.followers.length}</span><span className='font-light'>followers</span>
    <span className='font-semibold items-center px-2 '>{users.following.length}</span><span className='font-light'>following</span>
    </div>
    {account?.username == param ? null :
      <div className='flex gap-x-2 justify-center items-center my-2'>
      <button onClick={handleFollow} className='text-lg text-slate-50 bg-blue-500 px-5 py-1 rounded-md'>{isFollowing ? "Unfollow":"Follow"}</button>
      <button className='text-lg bg-slate-800 text-slate-400 px-5 py-1 rounded-md' onClick={handleMessage}>Message</button>
      <button className='text-lg bg-slate-800 text-slate-400 px-2 py-1 rounded-md absolute right-6' onClick={() => setOpenSettings(!openSettings)}><RiSettings5Fill size={26}/></button>
      </div>
    }

    </div>
  
    </div>

    <div className='flex px-3 pb-20'>

    <div className='grid grid-cols-3 gap-x-3 justify-start items-center antialiased w-full'>
    <div className='flex-col text-center justify-center w-full items-center rounded-lg bg-gradient-to-t to-slate-900 from-transparent hover:opacity-70 px-7 text-slate-400 cursor-pointer'>
    <h1 className='text-sm font-bold pt-2 w-full'>Volume</h1>
    <p className='text-xs'>{totalP} CRI</p>
    </div>
    <div className='flex-col text-center justify-center w-full items-center rounded-lg bg-gradient-to-t to-slate-900 from-transparent hover:opacity-70 px-7 text-slate-400 cursor-pointer'>
    <h1 className='text-sm font-bold pt-2 w-full'>NFTs</h1>
    <p className='text-xs'>{totalN}</p>
    </div>
    <div className='flex-col text-center justify-center w-full items-center rounded-lg bg-gradient-to-t to-slate-900 from-transparent hover:opacity-70 px-7 text-slate-400 cursor-pointer'>
    <h1 className='text-sm font-bold pt-2 w-full'>Owners</h1>
    <p className='text-xs'>100%</p>
    </div>
    </div>

    </div>


  <div className='flex-col justify-between items-center px-3'>
  <div className='flex-col justify-between items-center'>

    <div className='flex justify-between items-center py-3 px-3 bg-gradient-to-t to-slate-900 from-transparent rounded-xl w-full'>
      <div className='flex-col justify-center w-full'>
      <div className='flex gap-x-2'>
      <button onClick={() => {setPersonalNfts(true),setWalletNfts(false),setAuctionNfts(false)}} className={personal ? 'transition-all text-sm font-medium text-slate-50 my-3 cursor-pointer bg-slate-900 px-3 py-2 w-48 text-center rounded-lg border-[1px] border-purple-500' : 'transition-all text-sm font-medium text-slate-50 my-3 cursor-pointer bg-slate-900 px-3 py-2 w-48 text-center rounded-lg border-[1px] border-slate-800'}>Created</button>
      <button onClick={() => {setAuctionNfts(true),setPersonalNfts(false),setWalletNfts(false)}} className={auctionnfts ? 'transition-all text-sm font-medium text-slate-50 my-3 cursor-pointer bg-slate-900 px-3 py-2 w-48 text-center rounded-lg border-[1px] border-purple-500' : 'transition-all text-sm font-medium text-slate-50 my-3 cursor-pointer bg-slate-900 px-3 py-2 w-48 text-center rounded-lg border-[1px] border-slate-800'}>Auction NFTs</button>
      </div>
        
      <div className='flex justify-center items-center gap-x-2 my-3 transition-all'>
          <div className='flex justify-center bg-slate-900 px-2 py-1 rounded-lg text-slate-500'><BiRefresh onClick={refreshNFTs} size={28} className="active:animate-spin"/></div>
        {/*<ConnectChain/>*/}
      </div> 

      </div>

    </div>

    </div>
{personal ? (
<div className='flex-col justify-between items-center '>
{personal && <div className='flex justify-center items-center'><h1 className='text-3xl font-light my-3 text-slate-400'>Created NFT's</h1></div>}
<div className='p-7 grid grid-cols-1'>


    <div className='grid grid-cols-1'>
    <CreatedNfCard param={param} datas={datas}/>
    </div>


  </div>
    </div>
) : null}

{auctionnfts ? (
  <div className='px-7 justify-center items-center w-full pb-40'>
  <div className='w-full my-7 justify-center items-center text-center'>
  <h5 className='text-2xl font-light text-slate-400'>Auction NFTs</h5>
  </div>

<div className='flex justify-center items-center gap-x-5'><span className={offerAuction == true ? 'bg-gradient-to-t to-slate-900 from-transparent rounded-md px-5 py-2 text-purple-500 border-t-[1px] border-purple-500 hover:text-white cursor-pointer relative bottom-1' : 'bg-gradient-to-t to-slate-900 from-transparent rounded-md px-5 py-2 text-slate-400 hover:text-white cursor-pointer relative hover:bottom-1'} onClick={() => {setOfferAuction(true),setLivedAuction(false),setContinueAuction(false)}}>Offer Auction</span><span className={liveAuction == true ? 'bg-gradient-to-t to-slate-900 from-transparent rounded-md px-5 py-2 text-purple-500 border-t-[1px] border-purple-500 hover:text-white cursor-pointer relative bottom-1' : 'bg-gradient-to-t to-slate-900 from-transparent rounded-md px-5 py-2 text-slate-400 hover:text-white cursor-pointer relative hover:bottom-1'} onClick={() => {setOfferAuction(false),setLivedAuction(true),setContinueAuction(false)}}>Live Auction</span><span className={continueAuction == true ? 'bg-gradient-to-t to-slate-900 from-transparent rounded-md px-5 py-2 text-purple-500 border-t-[1px] border-purple-500 hover:text-white cursor-pointer relative bottom-1' : 'bg-gradient-to-t to-slate-900 from-transparent rounded-md px-5 py-2 text-slate-400 hover:text-white cursor-pointer relative hover:bottom-1'} onClick={() => {setOfferAuction(false),setLivedAuction(false),setContinueAuction(true)}}>Continue Auction</span></div>
{offerAuction == true ? (
  <div className='mt-10'>
    <PersonalAuctions param={param}/>
  </div>
  )
  :null}

{liveAuction == true ? (
  <div className='mt-10'>
    <PersonalLiveAuction param={param}/>
  </div>
)
:null}

{continueAuction == true ? (
  <div className='mt-10'>
    <PersonalContunieAuction param={param}/>
  </div>
)
:null}

  </div>
  ) : null}
</div>
</div>
        </Fragment>
      }

      {matches.medium &&
        <Fragment>
        <Head>
          <title>@{users.username} • Cosmeta NFT Marketplace</title>
        </Head>
        <div className='flex-col justify-center pb-20 items-center h-full w-full'>

        <div className='w-full flex justify-center items-center overflow-hidden'>
        <div className='flex-col justify-between items-center'>
        <div className='justify-center items-center cursor-pointer'>
          <img src={profiledetail?.banner} className="w-[1000px] h-[350px] object-cover rounded-xl"/>
        </div>

          <div className='flex-col justify-between items-center'>
          <div className='flex justify-start items-center'>
          <div className='flex justify-center items-center border-2 border-purple-600 rounded-full relative left-20 bottom-20 cursor-pointer p-3'>
          <img src={profiledetail.avatar} alt="Profile" className='object-cover rounded-full z-30 w-28 h-28 ' />
          </div>
          <div className='flex items-center antialiased'>

          <div className={profiledetail?.root == true ? 'relative flex items-center gap-x-2 left-20 bottom-10 py-2 px-3 text-yellow-500 text-xl font-bold' : 'relative flex items-center gap-x-2 left-20 bottom-10 py-2 px-3 text-slate-400 text-xl font-bold'}>{users.username} {profiledetail?.role == "verified" ? <MdVerified size={22} title="Verified" className={profiledetail.root == true ? "cursor-pointer text-yellow-500" : "cursor-pointer text-purple-600"}/>:null}
           {account?.username == param ? null :
            <Fragment>
          <div className='flex justify-center items-center bg-blue-500 hover:bg-blue-800 rounded-lg py-1 px-3 text-sm cursor-pointer ml-6'>
            <button onClick={handleFollow} disabled={!isclick} className='text-lg text-slate-50'>{isFollowing ? "Unfollow" : "Follow"}</button>
            </div>
          
            <div className='flex justify-center items-center bg-slate-900 hover:bg-slate-800 rounded-lg py-1 px-3 text-sm cursor-pointer'>
            <button className='flex justify-center items-center gap-x-1 text-lg text-slate-400' onClick={handleMessage} disabled={!isclick}>Message</button>
            </div>
            </Fragment>
           }
            <div className='flex ml-2'>
              <div className='flex white-glassmorphism py-2 gap-x-2 pl-2 pr-4'>
                <div>
                  <span className='font-semibold items-center px-2 cursor-pointer'>{users.followers.length}</span><span className='font-light'>followers</span>
                </div>
                <div>
                  <span className='font-semibold items-center px-2 cursor-pointer'>{users.following.length}</span><span className='font-light'>following</span>
                </div>
              </div>
            </div>

            <Link href='/settings'>
              <div className='flex items-center gap-x-2 white-glassmorphism p-2 group cursor-pointer hover:border hover:border-indigo-600'>
                <RiSettings5Fill size={28} className='group-hover:animate-spin group-hover:text-indigo-600'/>
                <span className='text-sm font-semibold text-slate-400 hidden group-hover:block group-hover:pr-2'>Settings</span>
              </div>
            </Link>
          
          </div>
          </div>
          </div>

          <div className='flex justify-between items-center w-full pb-10 px-7 z-30'>
          <div className='flex w-[400px] h-[100px] mr-10'>
          <div className='text-lg antialiased w-[421px] truncate'>{profiledetail?.description}</div>

          </div>
          <div className='flex justify-center items-center antialiased w-full'>
            <div className='flex gap-x-3 justify-between items-center w-full'>
            <div className='flex-col text-center justify-center w-full items-center rounded-lg bg-gradient-to-t to-slate-900 from-transparent hover:opacity-70 px-7 text-slate-400 cursor-pointer'>
            <h1 className='text-xl font-bold pt-2 w-full'>Volume</h1>
            <p>{totalP.toFixed(2)}</p>
            </div>
            <div className='flex-col text-center justify-center w-full items-center rounded-lg bg-gradient-to-t to-slate-900 from-transparent hover:opacity-70 px-7 text-slate-400 cursor-pointer'>
            <h1 className='text-xl font-bold pt-2 w-full'>NFTs</h1>
            <p>{totalN}</p>
            </div>
            <div className='flex-col text-center justify-center w-full items-center rounded-lg bg-gradient-to-t to-slate-900 from-transparent hover:opacity-70 px-7 text-slate-400 cursor-pointer'>
            <h1 className='text-xl font-bold pt-2 w-full'>Owners</h1>
            <p>100 %</p>
            </div>
            </div>
          </div>

          <div className='flex justify-center items-start text-slate-400 w-full'>
          <div className='grid grid-row-2 justify-center items-center'>
          <h1 className='text-center font-bold text-lg py-3'>Social Media</h1>
          <div className='flex justify-center items-center text-center gap-x-4'>
            <span>
              <a href={`${profiledetail?.instagram ? profiledetail?.instagram : null}`}><BsInstagram size={22} className="hover:text-white cursor-pointer" /></a>
            </span>
            <span>
            <a href={`${profiledetail?.twitter ? profiledetail?.twitter : null}`}><BsTwitter size={22} className="hover:text-white cursor-pointer" /></a>
            </span>
          </div>
          </div>
          </div>

          </div>

          </div>

          </div>
        </div>

  <div className='flex-col justify-between items-center px-12'>
  <div className='flex-col justify-between items-center'>

    <div className='flex justify-between items-start gap-6 py-3 lg:px-10 md:px-7 sm:px-3 bg-gradient-to-t to-slate-900 from-transparent rounded-xl lg:w-full md:w-screen sm:w-full'>
      <div className='flex-col justify-start w-full'>
      <div className='flex gap-x-3'>
      <button onClick={() => {setPersonalNfts(true),setWalletNfts(false),setAuctionNfts(false)}} className={personal ? 'transition-all text-sm font-medium text-slate-50 my-3 cursor-pointer bg-slate-900 px-3 py-2 w-48 text-center rounded-lg border-[1px] border-purple-500' : 'transition-all text-sm font-medium text-slate-50 my-3 cursor-pointer bg-slate-900 px-3 py-2 w-48 text-center rounded-lg border-[1px] border-slate-800 hover:border-purple-500'}>Created</button>
      <button onClick={() => {setAuctionNfts(true),setPersonalNfts(false),setWalletNfts(false)}} className={auctionnfts ? 'transition-all text-sm font-medium text-slate-50 my-3 cursor-pointer bg-slate-900 px-3 py-2 w-48 text-center rounded-lg border-[1px] border-purple-500' : 'transition-all text-sm font-medium text-slate-50 my-3 cursor-pointer bg-slate-900 px-3 py-2 w-48 text-center rounded-lg border-[1px] border-slate-800 hover:border-purple-500'}>Auction NFTs</button>
      </div>
        
      <div className='flex gap-x-2 my-3 transition-all'>
        <button onClick={refreshNFTs} className="outline-none bg-slate-800 text-sm font-bold py-1 px-3 rounded-lg text-slate-600 z-10 hover:before:content-['Refresh'] hover:before:absolute hover:before:py-1 hover:w-32 hover:before:block hover:before:ml-10 "><BiRefresh size={28} className="active:animate-spin"/></button>
      </div> 
      
      </div>

    </div>

{auctionnfts ? (
  <div className='px-7 justify-center items-center w-full pb-40'>
  <div className='w-full my-7 justify-center items-center text-center'>
  <h5 className='text-2xl font-light text-slate-400'>Auction NFTs</h5>
  </div>

<div className='flex justify-center items-center gap-x-5'><span className={offerAuction == true ? 'bg-gradient-to-t to-slate-900 from-transparent rounded-md px-5 py-2 text-purple-500 border-t-[1px] border-purple-500 hover:text-white cursor-pointer relative bottom-1' : 'bg-gradient-to-t to-slate-900 from-transparent rounded-md px-5 py-2 text-slate-400 hover:text-white cursor-pointer relative hover:bottom-1'} onClick={() => {setOfferAuction(true),setLivedAuction(false),setContinueAuction(false)}}>Offer Auction</span><span className={liveAuction == true ? 'bg-gradient-to-t to-slate-900 from-transparent rounded-md px-5 py-2 text-purple-500 border-t-[1px] border-purple-500 hover:text-white cursor-pointer relative bottom-1' : 'bg-gradient-to-t to-slate-900 from-transparent rounded-md px-5 py-2 text-slate-400 hover:text-white cursor-pointer relative hover:bottom-1'} onClick={() => {setOfferAuction(false),setLivedAuction(true),setContinueAuction(false)}}>Live Auction</span><span className={continueAuction == true ? 'bg-gradient-to-t to-slate-900 from-transparent rounded-md px-5 py-2 text-purple-500 border-t-[1px] border-purple-500 hover:text-white cursor-pointer relative bottom-1' : 'bg-gradient-to-t to-slate-900 from-transparent rounded-md px-5 py-2 text-slate-400 hover:text-white cursor-pointer relative hover:bottom-1'} onClick={() => {setOfferAuction(false),setLivedAuction(false),setContinueAuction(true)}}>Continue Auction</span></div>
{offerAuction == true ? (
  <div className='mt-10'>
    <PersonalAuctions param={param}/>
  </div>
  )
  :null}

{liveAuction == true ? (
  <div className='mt-10'>
    <PersonalLiveAuction param={param}/>
  </div>
)
:null}

{continueAuction == true ? (
  <div className='mt-10'>
    <PersonalContunieAuction param={param}/>
  </div>
)
:null}

  </div>
  ) : null}

  </div>
{personal ? (
<div className='flex-col justify-between items-center pb-40'>
{personal && <div className='flex justify-center items-center'><h1 className='text-3xl font-light my-3 text-slate-400'>Created NFT's</h1></div>}
<div className='flex justify-center items-center gap-x-5 mt-5'>
<span className={createdNFTs ? 'bg-gradient-to-t to-slate-900 from-transparent text-purple-500 border-t-[1px] border-purple-500 rounded-md px-5 py-2 hover:text-white cursor-pointer relative bottom-1' : 'bg-gradient-to-t to-slate-900 from-transparent rounded-md px-5 py-2 text-slate-400 hover:text-white cursor-pointer relative hover:bottom-1'} onClick={() => {setCreatedNFTs(true),setBuyedNFTs(false)}}>Created NFTs</span>
<span className={buyedNFTs ? 'bg-gradient-to-t to-slate-900 from-transparent rounded-md px-5 py-2 text-purple-500 border-t-[1px] border-purple-500 hover:text-white cursor-pointer relative bottom-1' : 'bg-gradient-to-t to-slate-900 from-transparent rounded-md px-5 py-2 text-slate-400 hover:text-white cursor-pointer relative hover:bottom-1'} onClick={() => {setCreatedNFTs(false),setBuyedNFTs(true)}}>Buyed NFTs</span></div>

{createdNFTs ? (
<div className='mt-10'>
  <CreatedNfCard param={param} datas={nftData}/>
</div>
): null}

{buyedNFTs ? 
<div className='mt-10'>
  {!addrs ? <Loading/> : null}
  <BuyedNfCard addrs={addrs} param={param} datas={nftData}/>
</div>
: null}

</div>
) : null}

</div>
</div>
        </Fragment>
      }

      {matches.large &&
        <Fragment>
        <Head>
          <title>@{users.username} • Cosmeta NFT Marketplace</title>
        </Head>
        <div className='flex-col justify-center pb-20 items-center h-full w-full'>

        <div className='w-full flex justify-center items-center overflow-hidden'>
        <div className='flex-col justify-between items-center'>
        <div className='justify-center items-center cursor-pointer'>
          <img src={profiledetail?.banner} className="w-[1300px] h-[400px] object-cover rounded-xl"/>
        </div>

          <div className='flex-col justify-between items-center'>
          <div className='flex justify-start items-center'>
          <div className='flex justify-center items-center border-2 border-purple-600 rounded-full relative left-20 bottom-20 cursor-pointer p-3'>
          <img src={profiledetail.avatar} alt="Profile" className='object-cover rounded-full z-30 w-28 h-28 ' />
          </div>
          <div className='flex items-center antialiased'>

          <div className={profiledetail?.root == true ? 'relative flex items-center gap-x-2 left-20 bottom-10 py-2 px-3 text-yellow-500 text-xl font-bold' : 'relative flex items-center gap-x-2 left-20 bottom-10 py-2 px-3 text-slate-400 text-xl font-bold'}>{users.username} {profiledetail?.role == "verified" ? <MdVerified size={22} title="Verified" className={profiledetail.root == true ? "cursor-pointer text-yellow-500" : "cursor-pointer text-purple-600"}/>:null}
           {account?.username == param ? null :
            <Fragment>
          <div className='flex justify-center items-center bg-blue-500 hover:bg-blue-800 rounded-lg py-1 px-3 text-sm cursor-pointer ml-6'>
            <button onClick={handleFollow} disabled={!isclick} className='text-lg text-slate-50'>{isFollowing ? "Unfollow" : "Follow"}</button>
            </div>
          
            <div className='flex justify-center items-center bg-slate-900 hover:bg-slate-800 rounded-lg py-1 px-3 text-sm cursor-pointer'>
            <button className='flex justify-center items-center gap-x-1 text-lg text-slate-400' onClick={handleMessage} disabled={!isclick}>Message</button>
            </div>
            </Fragment>
           }
            <div className='flex ml-2'>
              <div className='flex white-glassmorphism py-2 gap-x-2 pl-2 pr-4'>
                <div>
                  <span className='font-semibold items-center px-2 cursor-pointer'>{users.followers.length}</span><span className='font-light'>followers</span>
                </div>
                <div>
                  <span className='font-semibold items-center px-2 cursor-pointer'>{users.following.length}</span><span className='font-light'>following</span>
                </div>
              </div>
            </div>

            <Link href='/settings'>
              <div className='flex items-center gap-x-2 white-glassmorphism p-2 group cursor-pointer hover:border hover:border-indigo-600'>
                <RiSettings5Fill size={28} className='group-hover:animate-spin group-hover:text-indigo-600'/>
                <span className='text-sm font-semibold text-slate-400 hidden group-hover:block group-hover:pr-2'>Settings</span>
              </div>
            </Link>
          
          </div>
          </div>
          </div>

          <div className='flex justify-between items-center w-full pb-10 px-7 z-30'>
          <div className='flex w-[400px] h-[100px] mr-10'>
          <div className='text-lg antialiased w-[421px] truncate'>{profiledetail?.description}</div>

          </div>
          <div className='flex justify-center items-center antialiased w-full'>
            <div className='flex gap-x-3 justify-between items-center w-full'>
            <div className='flex-col text-center justify-center w-full items-center rounded-lg bg-gradient-to-t to-slate-900 from-transparent hover:opacity-70 px-7 text-slate-400 cursor-pointer'>
            <h1 className='text-xl font-bold pt-2 w-full'>Volume</h1>
            <p>{totalP.toFixed(2)}</p>
            </div>
            <div className='flex-col text-center justify-center w-full items-center rounded-lg bg-gradient-to-t to-slate-900 from-transparent hover:opacity-70 px-7 text-slate-400 cursor-pointer'>
            <h1 className='text-xl font-bold pt-2 w-full'>NFTs</h1>
            <p>{totalN}</p>
            </div>
            <div className='flex-col text-center justify-center w-full items-center rounded-lg bg-gradient-to-t to-slate-900 from-transparent hover:opacity-70 px-7 text-slate-400 cursor-pointer'>
            <h1 className='text-xl font-bold pt-2 w-full'>Owners</h1>
            <p>100 %</p>
            </div>
            </div>
          </div>

          <div className='flex justify-center items-start text-slate-400 w-full'>
          <div className='grid grid-row-2 justify-center items-center'>
          <h1 className='text-center font-bold text-lg py-3'>Social Media</h1>
          <div className='flex justify-center items-center text-center gap-x-4'>
            <span>
              <a href={`${profiledetail?.instagram ? profiledetail?.instagram : null}`}><BsInstagram size={22} className="hover:text-white cursor-pointer" /></a>
            </span>
            <span>
            <a href={`${profiledetail?.twitter ? profiledetail?.twitter : null}`}><BsTwitter size={22} className="hover:text-white cursor-pointer" /></a>
            </span>
          </div>
          </div>
          </div>

          </div>

          </div>

          </div>
        </div>

  <div className='flex-col justify-between items-center px-12'>
  <div className='flex-col justify-between items-center'>

    <div className='flex justify-between items-start gap-6 py-3 lg:px-10 md:px-7 sm:px-3 bg-gradient-to-t to-slate-900 from-transparent rounded-xl lg:w-full md:w-screen sm:w-full'>
      <div className='flex-col justify-start w-full'>
      <div className='flex gap-x-3'>
      <button onClick={() => {setPersonalNfts(true),setWalletNfts(false),setAuctionNfts(false)}} className={personal ? 'transition-all text-sm font-medium text-slate-50 my-3 cursor-pointer bg-slate-900 px-3 py-2 w-48 text-center rounded-lg border-[1px] border-purple-500' : 'transition-all text-sm font-medium text-slate-50 my-3 cursor-pointer bg-slate-900 px-3 py-2 w-48 text-center rounded-lg border-[1px] border-slate-800 hover:border-purple-500'}>Created</button>
      <button onClick={() => {setAuctionNfts(true),setPersonalNfts(false),setWalletNfts(false)}} className={auctionnfts ? 'transition-all text-sm font-medium text-slate-50 my-3 cursor-pointer bg-slate-900 px-3 py-2 w-48 text-center rounded-lg border-[1px] border-purple-500' : 'transition-all text-sm font-medium text-slate-50 my-3 cursor-pointer bg-slate-900 px-3 py-2 w-48 text-center rounded-lg border-[1px] border-slate-800 hover:border-purple-500'}>Auction NFTs</button>
      </div>
        
      <div className='flex gap-x-2 my-3 transition-all'>
        <button onClick={refreshNFTs} className="outline-none bg-slate-800 text-sm font-bold py-1 px-3 rounded-lg text-slate-600 z-10 hover:before:content-['Refresh'] hover:before:absolute hover:before:py-1 hover:w-32 hover:before:block hover:before:ml-10 "><BiRefresh size={28} className="active:animate-spin"/></button>
      </div> 
      
      </div>
      <div className='z-10'>
      {/*<ConnectChain/>*/}
      </div>
    </div>

{auctionnfts ? (
  <div className='px-7 justify-center items-center w-full pb-40'>
  <div className='w-full my-7 justify-center items-center text-center'>
  <h5 className='text-2xl font-light text-slate-400'>Auction NFTs</h5>
  </div>

<div className='flex justify-center items-center gap-x-5'><span className={offerAuction == true ? 'bg-gradient-to-t to-slate-900 from-transparent rounded-md px-5 py-2 text-purple-500 border-t-[1px] border-purple-500 hover:text-white cursor-pointer relative bottom-1' : 'bg-gradient-to-t to-slate-900 from-transparent rounded-md px-5 py-2 text-slate-400 hover:text-white cursor-pointer relative hover:bottom-1'} onClick={() => {setOfferAuction(true),setLivedAuction(false),setContinueAuction(false)}}>Offer Auction</span><span className={liveAuction == true ? 'bg-gradient-to-t to-slate-900 from-transparent rounded-md px-5 py-2 text-purple-500 border-t-[1px] border-purple-500 hover:text-white cursor-pointer relative bottom-1' : 'bg-gradient-to-t to-slate-900 from-transparent rounded-md px-5 py-2 text-slate-400 hover:text-white cursor-pointer relative hover:bottom-1'} onClick={() => {setOfferAuction(false),setLivedAuction(true),setContinueAuction(false)}}>Live Auction</span><span className={continueAuction == true ? 'bg-gradient-to-t to-slate-900 from-transparent rounded-md px-5 py-2 text-purple-500 border-t-[1px] border-purple-500 hover:text-white cursor-pointer relative bottom-1' : 'bg-gradient-to-t to-slate-900 from-transparent rounded-md px-5 py-2 text-slate-400 hover:text-white cursor-pointer relative hover:bottom-1'} onClick={() => {setOfferAuction(false),setLivedAuction(false),setContinueAuction(true)}}>Continue Auction</span></div>
{offerAuction == true ? (
  <div className='mt-10'>
    <PersonalAuctions param={param}/>
  </div>
  )
  :null}

{liveAuction == true ? (
  <div className='mt-10'>
    <PersonalLiveAuction param={param}/>
  </div>
)
:null}

{continueAuction == true ? (
  <div className='mt-10'>
    <PersonalContunieAuction param={param}/>
  </div>
)
:null}

  </div>
  ) : null}

  </div>
{personal ? (
<div className='flex-col justify-between items-center pb-40'>
{personal && <div className='flex justify-center items-center'><h1 className='text-3xl font-light my-3 text-slate-400'>Created NFT's</h1></div>}
<div className='flex justify-center items-center gap-x-5 mt-5'>
<span className={createdNFTs ? 'bg-gradient-to-t to-slate-900 from-transparent text-purple-500 border-t-[1px] border-purple-500 rounded-md px-5 py-2 hover:text-white cursor-pointer relative bottom-1' : 'bg-gradient-to-t to-slate-900 from-transparent rounded-md px-5 py-2 text-slate-400 hover:text-white cursor-pointer relative hover:bottom-1'} onClick={() => {setCreatedNFTs(true),setBuyedNFTs(false)}}>Created NFTs</span>
<span className={buyedNFTs ? 'bg-gradient-to-t to-slate-900 from-transparent rounded-md px-5 py-2 text-purple-500 border-t-[1px] border-purple-500 hover:text-white cursor-pointer relative bottom-1' : 'bg-gradient-to-t to-slate-900 from-transparent rounded-md px-5 py-2 text-slate-400 hover:text-white cursor-pointer relative hover:bottom-1'} onClick={() => {setCreatedNFTs(false),setBuyedNFTs(true)}}>Buyed NFTs</span></div>

{createdNFTs ? (
<div className='mt-10'>
  <CreatedNfCard param={param} datas={nftData}/>
</div>
): null}

{buyedNFTs ? 
<div className='mt-10'>
  {!addrs ? <Loading/> : null}
  <BuyedNfCard addrs={addrs} param={param} datas={nftData}/>
</div>
: null}

</div>
) : null}

</div>
</div>
        </Fragment>
      }

    </Fragment>
  )}
  </Media>
  </div>
)
}
export default Sell
export const getServerSideProps = async (context) => {
  const res = await fetch(`https://testnet.cos-in.com/api/users`)
  const resnft = await fetch(`https://testnet.cos-in.com/api/setnft`)
  const userData = await res.json();
  let nftData = await resnft.json();
  nftData = nftData.reverse()
  const param = context.params.profile

  return{
      props:{
          userData,
          nftData,
          param,
      }
  }
}
