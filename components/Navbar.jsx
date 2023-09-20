import React,{useState,useEffect,useContext, Fragment} from "react";
import Image from "next/image";
import Link from "next/link";
import logo from '@/images/logo.png';
import { useRouter } from "next/router";
import {Button,Grid,Input,Dropdown, Text, User} from '@nextui-org/react';
import { useStateContext } from "../context/StateContext";
import {BiSearch,BiUserCircle,BiMenu,BiBell} from 'react-icons/bi';
import {MdClose,MdContentCopy} from 'react-icons/md';
import {AiOutlineUserAdd} from 'react-icons/ai';
import { DataContext } from '../store/GlobalState'
import NFT from '../engine/NFT.json';
import Market from '../engine/Market.json';
import Token from '../engine/Token.json';
import { ethers } from 'ethers';
import Web3Modal from "web3modal";
import { cipherHH, cipherEth, simpleCrypto,client,seprpc,sepmarket,sepnft,sepauction } from '../engine/configuration';
import axios from "axios";
import Media from 'react-media';
import { CopyToClipboard } from 'react-copy-to-clipboard'
import Auction from '../engine/Auction.json';
import { Web3Button, Web3NetworkSwitch } from "@web3modal/react";
import CustomButton from "./CustomButton";
import { AudioPlayer } from "./AudioPlayer";
import { logout } from "@/utils/firebase";
import {FiMessageSquare} from 'react-icons/fi'
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import { initializeApp } from "firebase/app";
import { getFirestore,collection,getDocs } from "firebase/firestore";
import { getUserInfo } from "@/utils/firebase";
const Navbar = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyBxizDXLmmI-0Ihf98w2_aPj6dp6cvUrw0",
    authDomain: "cosmeta-44d4b.firebaseapp.com",
    projectId: "cosmeta-44d4b",
    storageBucket: "cosmeta-44d4b.appspot.com",
    messagingSenderId: "623130640106",
    appId: "1:623130640106:web:4658af8dd0dc2961fee193"
  };
  
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app)

  const account = useSelector(state => state.auth.user)

  const router = useRouter()

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
    owners,setOwners} = useStateContext();


  const {state,dispatch} = useContext(DataContext)
  const {auth} = state


  const [nav,setNav] = useState(false);
  const [searchmodal,setSearchModal] = useState(false);
  const [detoken,setToken] = useState(false);
  const [search,setSearch] = useState([]);
  const [val,setVal] = useState(false);
  const [openMenu,setOpenMenu] = useState(false)
  const [value,setValue] = useState('');
  const [copied,setCopied] = useState(false);
  const [users,setUsers] = useState(false);
  
  const [homenfts,setNFTs] = useState([]);
  const [liveauction,setLiveAuction] = useState([]);
  const [allauction,setAllAuction] = useState([]);
  const [lewcontent,setLewContent] = useState([]);
  const [content,setContent] = useState([]);
  const [loading,setLoading] = useState(false);
  const [notifydata,setNotifyData] = useState([])
  const [CRIBalance,setCRIBalance] = useState("0");
  const [showprofile,setShowProfile] = useState(false)
  const [activeMessage,setActiveMessage] = useState(false);
  const [read,setAllRead] = useState(false);


  useEffect(() => {
      allread()
  }, []);

  const allread = async () => {
    await fetch('https://testmarket.cos-in.com/api/notifications').then(res => {
      if(!res.ok){
        throw new Error("HTTP ERROR",res.status)
      }
      return res
    }).then(res => res.json()).then(data => {
      const token = Cookies.get('refreshtoken');
      const decodedToken = jwt.decode(token);
  
      let notifauy = data.filter(u => u.recipient == decodedToken?.id ).map(i => i.read)
      let controlread = notifauy.includes(false)

      if(controlread){
        setAllRead(true)
      }else{
        setAllRead(false)
      }
    })


    // if(){
    //   setAllRead(true)
    // }
  }

  useEffect(() => {
    // fetch('/api/session').then(res => {
    //   if(!res.ok){
    //     throw new Error("HTTP ERROR")
    //   }
    //   return res
    // }).then(res => res.json()).then(data => {
    //   setContent(data)
    // })
    getSearchNFT()
    // getCRIBalance()
  },[]);

  useEffect(() => {
    const token = Cookies.get('refreshtoken');
    const decodedToken = jwt.decode(token);

    setUsers(decodedToken)
  }, [auth.user])


  const getCRIBalance = async () => {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    let cosmeta = new ethers.Contract(cri,Token,signer)
    let balance = await cosmeta.balanceOf(signer.getAddress());
    balance = balance.toString()
    setCRIBalance(balance.slice(0,5));
  }

  const getSearchNFT = async () => {
    await fetch('https://testmarket.cos-in.com/api/setnft').then(res => {
      if(!res.ok){
        throw new Error("HTTP ERROR",res.status)
      }
      return res
    }).then(res => res.json()).then(data => {
      setContent(data)
    })
  }

{/*  const loadAllAuction = async () => {
    let network = rpc
    const key = simpleCrypto.decrypt(cipherEth)
    const provider = new ethers.providers.JsonRpcProvider(network)
    const wallet = new ethers.Wallet(key, provider);
    let auctioncontract = new ethers.Contract(auction, Auction, wallet)
    const data = await auctioncontract.getAllAuctions()
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
    setAllAuction(items)
  }
  const loadLiveAuction = async () => {
    let network = rpc
    const key = simpleCrypto.decrypt(cipherEth)
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
    setLiveAuction(items)
  }
  const loadMumSaleNFTs = async () => {
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
    setNFTs(items)
  }*/}

  const changeScroll = () => {
    if(scrollY >= 80){
      setNav(true)
    }else{
      setNav(false)
    }
  }

  const handleLogout = () => {
    logout()
    Cookies.remove('refreshtoken', {path:'api/accessToken'})
    Cookies.remove('session')
    Cookies.remove('session.sig')
    localStorage.removeItem('firstLogin')
    dispatch({type: 'AUTH', payload:{}})
    // dispatch({type: 'NOTIFY', payload:{success: 'Logged out!'}})
    router.push('/login')
  }

  useEffect(()=>{
    window.addEventListener('scroll',changeScroll)
    const token = localStorage.getItem('firstLogin')
    if(token){
      setToken(token)
    }
  },[])

  useEffect(() => {
    const token = Cookies.get('refreshtoken');
    const decodedToken = jwt.decode(token);

    const ref = collection(db,"chats");
    getDocs(ref).then(snaphot => {
     const chatsdata = snaphot.docs.map((doc) => ({
        id:doc.id,
        ...doc.data(),
      }))
      let confread = chatsdata.filter(u => u.users[0] == decodedToken?.email).map(i => i.read)
      let confuser = chatsdata.filter(u => u.users[0] == decodedToken?.email).map(i => i.users[0])
      let msgsender = confuser[0]
      let isread = confread.includes(true)

      if(isread == false && msgsender == decodedToken?.email){
        setActiveMessage(true)
      }else{
        setActiveMessage(false)
      }
    })
  

  },[])


  const handleSearch = async (e) => {
    e.preventDefault();
    let val = e.target.value;
    setVal(val)
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const tokenContract = new ethers.Contract(nftcustom, NFT, signer)
    const marketContract = new ethers.Contract(marketcol, Market, signer)
    let auctioncontract = new ethers.Contract(auction, Auction, signer)
    const nfts = await marketContract.getAvailableNft()
    const auctionnfts = await auctioncontract.getAllAuctions()
    const nftitems = await Promise.all(nfts.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let nftitem = {
        image: meta.data.image,
        name: meta.data.name,
      }
      return nftitem
    }))
    const auctionitems = await Promise.all(auctionnfts.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let auctionitem = {
        image: i.images,
        name: i.name,
      }
      return auctionitem
    }))
    setSearch(content)
  }
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
  }
  const loggedRouter = () => {
    return (
    <div>
    <Media queries={{
      small: "(max-width: 599px)", // < 600px
      medium: "(min-width: 1024px) and (max-width: 1366px)", // < 1366px
      large: "(min-width: 1400px)" // >= 1400px
    }}>
    {matches => (
      <Fragment>
      {matches.medium && 
        <Fragment>
      <Grid.Container justify="flex-center" gap={2}>
      <Grid>
        <Dropdown placement="bottom-center" >
          <Dropdown.Trigger>
          <div className='w-8 h-8 rounded-full overflow-hidden border-2 border-purple-600 flex justify-center items-center cursor-pointer'>
          <img src={users && auth?.user?.avatar} alt='profile' className='w-8 h-8 rounded-full' />
          </div>
          </Dropdown.Trigger>
          <Dropdown.Menu color="secondary" aria-label="Avatar Actions" className="bg-slate-900">
            <Dropdown.Item key="profile" css={{ height: "$18" }}>
            <Link href={`/${users && auth?.user?.username}`}>
            <span className="hidden">```</span>
              <Text b color='inherit' css={{ d: 'flex' }}>
                {users && auth?.user?.username}
              </Text>
              <Text color="inherit" css={{ d: "flex" }} className="text-sm">
                {users && auth?.user?.email}
              </Text></Link>
            </Dropdown.Item>
            <Dropdown.Item key="wallet" withDivider>
            <button className="flex" onClick={!user.length ? connectUser : null} auto>{!user.length ? "Connect Wallet" : `Wallet : ${user.slice(0,5) + '...' + user.slice(38)}`}</button>
            </Dropdown.Item>
            <Dropdown.Item key="settings" withDivider>
              Settings
            </Dropdown.Item>
            <Dropdown.Item key="system">Earn</Dropdown.Item>
            <Dropdown.Item key="help_and_feedback" withDivider>
              <Link href="https://help.cos-in.com">Help & Feedback</Link>
            </Dropdown.Item>
            <Dropdown.Item key="logout" color="error" withDivider >
              <span onClick={handleLogout}>Log Out</span>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Grid>
    </Grid.Container>
      </Fragment>
      }
      {matches.large && 
        <Fragment>
      <Grid.Container justify="flex-center" gap={2}>
      <Grid>
        <Dropdown placement="bottom-center" >
          <Dropdown.Trigger>
          <div className="rounded-full overflow-hidden p-1 border-2 border-purple-600 flex justify-center items-center cursor-pointer">
          <img src={users ? auth?.user?.avatar : null} alt="" className="w-7 h-7 rounded-full" />
          </div>
          </Dropdown.Trigger>
          <Dropdown.Menu color="secondary" aria-label="Avatar Actions" className="bg-slate-900">
            <Dropdown.Item key="profile" css={{ height: "$18" }}>
            <Link href={`/${users ? users.username : null}`}>
              <Text b color="inherit" css={{ d: "flex" }}>
              <span className="hidden">```</span>
                {users ? users.username : null}
              </Text>
              <Text color="inherit" css={{ d: "flex" }} className="text-sm">
                {users && auth?.user?.email}
              </Text></Link>
            </Dropdown.Item>
            <Dropdown.Item key="settings" withDivider>
              Settings
            </Dropdown.Item>
            <Dropdown.Item key="system">Earn</Dropdown.Item>
            <Dropdown.Item key="help_and_feedback" withDivider>
              <Link href="https://help.cos-in.com">Help & Feedback</Link>
            </Dropdown.Item>
            <Dropdown.Item key="logout" color="error" withDivider >
              <span onClick={handleLogout}>Log Out</span>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Grid>
    </Grid.Container>
      </Fragment>
      }
    </Fragment>
    )}
    </Media>
    </div>
    )
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
//********************** SMALL *******************************
    <Fragment>
      <div className={nav ? "flex justify-between items-center w-full h-[50px] bg-gradient-to-tr to-slate-600 from-slate-900 fixed z-40 transition-all" : "flex justify-between items-center w-full h-[80px] fixed z-40 transition-all"}>
        
      <div className="w-full py-1 px-2">
        <a href="/"><Image src={logo} alt="Cosmeta INC" className={nav ? "scale-75 object-cover w-full": "object-cover"}/></a>
      </div>
      <div className="w-full px-2">
        <div className={nav ? 'flex justify-center items-center w-full' : 'flex justify-center items-center w-full'}>
          <input type="search" onChange={handleSearch} onClick={() => setSearchModal(true)} onMouseLeave={() => setSearchModal(false)} name="search" id="search" placeholder="Search" className={nav ? " bg-slate-900 placeholder:text-slate-400 outline-none py-[6px] px-3 w-36 rounded-l-lg text-slate-400" : " bg-slate-500 opacity-40 placeholder:text-sm placeholder:text-slate-900 outline-none py-[6px] px-3 w-36 h-7 rounded-l-lg text-slate-900"} /><button type="submit" onClick={handleSearchSubmit} className={nav ? "outline-none py-[9px] px-2 rounded-r-lg bg-slate-900" : "opacity-40 outline-none h-7 px-2 rounded-r-lg bg-slate-500"}><BiSearch size={18} className={nav ? "text-slate-400" : "text-slate-900"}/></button></div>
      </div>
      <div className="w-30 justify-end items-center text-right px-3">
      <BiMenu size={30} className="inline-block cursor-pointer hover:opacity-50" onClick={() => setOpenMenu(!openMenu)}/>
      </div>

      </div>
      {openMenu &&
        <div className="fixed top-0 left-0 bg-slate-900 w-screen h-screen z-50">
        <div className="w-full text-slate-400 z-50">
        <MdClose size={30} className="text-slate-400 z-50 cursor-pointer m-7 hover:opacity-50" onClick={() => setOpenMenu(false)}/>
        <div className="flex-col justify-center items-center text-center z-50 w-full">
        <div className="my-3"><Link href='/' className="text-3xl hover:opacity-50 z-50" onClick={() => setOpenMenu(false)}>Home</Link></div>
        {/*<div className="my-3"><Link href='/explore' className="text-3xl hover:opacity-50 z-50" onClick={() => setOpenMenu(false)}>Explore</Link></div>*/}

        {/*<Link href='/profile'><BiUserCircle size={22}/></Link>*/}
        {account && users && users !== undefined
           ? <div className="my-3">
           <div className="my-3"><Link href='/create' className="text-3xl hover:opacity-50 z-50" onClick={() => setOpenMenu(false)}>Create</Link></div>
           <div className="flex justify-center items-center my-3 py-2 bg-slate-800 w-full"><span className="text-slate-400 text-xl flex items-center gap-x-2" >CRI Balance : {CRIBalance}</span></div>
           {/*<div className="flex justify-center items-center my-3 py-2 bg-slate-800 w-full gap-x-2">{!user.length ? "Connect Wallet" : `Wallet : ${user.slice(0,5) + '...' + user.slice(38)}`}</span>{user.length && <CopyToClipboard text={user} onCopy={() => setCopied(true)}><button><MdContentCopy/></button></CopyToClipboard>}</div>*/}
           <div className="my-3"><Link href='/inbox' className=" z-50 text-3xl hover:opacity-50" onClick={() => setOpenMenu(false)}>Messages</Link></div>
           <div className="my-3"><Link href='/notifications' className=" z-50 text-3xl hover:opacity-50" onClick={() => setOpenMenu(false)}>Notifications</Link></div>
           <div className="my-3"><Link href='/earn' className=" z-50 text-3xl hover:opacity-50" onClick={() => setOpenMenu(false)}>Earn</Link></div>
           <div className="my-3"><Link href='https://help.cos-in.com' className="text-3xl hover:opacity-50 z-50" onClick={() => setOpenMenu(false)}>Help & Feedback</Link></div>
           <div className="mt-6" onClick={handleLogout}><span className="text-3xl hover:opacity-50 bg-red-300 rounded-md border-2 border-red-900 px-5 py-2 text-red-900" onClick={() => setOpenMenu(false)}>Log Out</span></div>
           <div className="fixed bottom-0 w-full overflow-hidden flex justify-center items-center cursor-pointer gap-x-2 bg-purple-300 border-2 border-purple-600 py-3 rounded-lg">

             <img src={users && auth?.user?.avatar} alt="profile" className="w-12 h-12 rounded-full border-2 border-purple-600" /><Link href={`/${users ? auth?.user?.username : null}`} className="text-3xl hover:opacity-50 text-purple-700 z-50" onClick={() => setOpenMenu(false)}>{auth?.user?.username}</Link>
            <span className='hidden'>```</span>
           </div>

         </div>
          : <div className="my-3"><Link href='/login' className="text-3xl hover:opacity-50 z-50" onClick={() => setOpenMenu(false)}>Login</Link></div>
        }
        <br/>
        <CustomButton />
        </div>
      </div>
      </div>
      }
      {searchmodal ? (

        <div className={nav ? "fixed z-50 top-12 mt-1 bg-slate-900 w-full h-18 rounded-xl py-3 px-5 gap-y-2" : "fixed z-50 top-16 bg-slate-900 w-full h-18 rounded-xl py-3 px-5 gap-y-2"}>
        {!val
        ? 
          <span className="flex w-full justify-center items-center text-center my-5">Search NFTs</span>
        :<div>
        <div className="text-slate-400 h-60 overflow-hidden">
        <ul>
        {
          content.filter(u => u.name.toLowerCase().includes(val)).map((i,k) =>
          <li key={k}  className="border-[0.5px] border-slate-800 py-2 px-3 my-2 rounded cursor-pointer hover:bg-slate-800">
          <Link href={`/details/${i._id}`} className="z-[9999]">
              <div className="flex items-center gap-x-2">
              <div className="w-12 h-12 object-cover">
              {i.fileType == 'video/mp4'
              ? <video src={i.images} className="w-12 h-12 rounded-lg object-cover" autoPlay muted loop/>
              : i.fileType == 'image/png' || i.fileType == 'image/jpeg' || i.fileType == 'image/jpg' || i.fileType == 'image/webp' ? <img src={i.images} className="w-12 h-12 rounded-lg object-cover" />
              : i.fileType == 'audio/mp3' || i.fileType == 'audio/wav' || i.fileType == 'audio/ogg' || 'audio/mpeg' ? <img src="https://bafkreifdqokmzap5e5hjb7oz32mfg32lctsq4kizbzqzzv4xlpzyiuujsm.ipfs.nftstorage.link/" className="w-12 h-12 rounded-lg object-cover"/> : null
              }</div>
                <span>{i.name}</span>
              </div>
              </Link>
            </li>
          )
            
        }
          
        </ul>
        </div>
        </div>
        }
        </div>
        ) : null}
    </Fragment>
//******************* END SMALL ******************************
      }
      
      {matches.medium &&
//********************** MEDIUM *******************************
    <Fragment>
    {/*chain == 'Mumbai Testnet' ? <div className="fixed w-full flex justify-center items-center bottom-0 left-0 z-50 bg-orange-500 h-10"><center className="text-sm antialiased">Your wallet is connected to the testnet ({chain}). Please switch to ethereum mainnet.</center></div> : null*/}
      <div className={nav ? "flex justify-center items-center p-7 w-full h-[50px] bg-gradient-to-tr to-slate-600 from-slate-900 fixed z-[999] transition-all" : "flex justify-center items-center p-7 w-full h-[80px] rounded-t-xl fixed z-[999] transition-all"}>
        <div className="flex justify-between items-center w-full">

          <div className="flex justify-start items-center w-full px-3">
            <a href="/"><Image src={logo} alt="Cosmeta INC" width={150} height={15} className={nav ? "scale-75 object-cover": "scale-100 object-cover"}/></a>
            <div className={nav ? 'ml-12 flex justify-center items-center' : 'ml-12 flex justify-center items-center'}><input type="search" onChange={handleSearch} onClick={() => setSearchModal(true)} onBlur={() => setSearchModal(false)} name="search" id="search" placeholder="Search" className={nav ? "bg-slate-900 placeholder:text-slate-400 outline-none py-[6px] px-3 w-52 rounded-l-lg text-slate-400" : "bg-slate-500 opacity-40 placeholder:text-slate-900 outline-none py-[6px] px-3 w-52 rounded-l-lg text-slate-900"} /><button type="submit" onClick={handleSearchSubmit} className={nav ? "outline-none py-[8px] px-2 rounded-r-lg bg-slate-900" : "opacity-40 outline-none py-[8px] px-2 rounded-r-lg bg-slate-500"}><BiSearch size={20} className={nav ? "text-slate-400" : "text-slate-900"}/></button></div>
          </div>

          <div className={nav ? "flex justify-end items-center text-xs text-slate-100 gap-x-4 px-5":"flex justify-end items-center text-slate-100 gap-x-4 px-5"}>
          <Link href='/' className={router.pathname == '/' && "px-5 py-1 bg-slate-800 rounded-lg border-[1px] border-slate-400"}>Home</Link>       
          {account && users && users !== undefined
            ? <>
            <Link href='/create' className={router.pathname == '/create' && "px-5 py-1 bg-slate-800 rounded-lg border-[1px] border-slate-400"}>Create</Link>
            <Link href='/inbox' className={router.pathname == '/inbox' || router.pathname == '/inbox/chat' || router.pathname == '/inbox/chat/[conversationId]' ? "px-5 py-1 bg-slate-800 rounded-lg border-[1px] border-slate-400 relative" : "relative"}>
              {activeMessage ? <span className={router.pathname == '/inbox' || router.pathname == '/inbox/chat' || router.pathname == '/inbox/chat/[conversationId]' ? "w-3 h-3 text-[11px] right-4 bottom-4 bg-red-500 rounded-full p-1 absolute flex justify-center items-center animate-pulse" : "w-3 h-3 text-[11px] left-3 bottom-3 bg-red-500 rounded-full p-1 absolute flex justify-center items-center animate-pulse"}>&nbsp;</span> : null}
              <FiMessageSquare size={22}/>
              </Link>
            <Link href='/notifications' className={router.pathname == '/notifications'  ? "px-5 py-1 bg-slate-800 rounded-lg border-[1px] border-slate-400 relative" : "relative"}>
              {read == true ? <span className={router.pathname == '/notifications'  ? "w-3 h-3 text-[11px] right-5 bottom-4 bg-red-500 rounded-full p-1 absolute flex justify-center items-center animate-pulse" : "w-3 h-3 text-[11px] left-3 bottom-3 bg-red-500 rounded-full p-1 absolute flex justify-center items-center animate-pulse"}>&nbsp;</span> : null}
              <BiBell size={22}/>
            </Link>
            {loggedRouter()}
              </>
           : <Link href='/login'>Login</Link>
         }
            {/*<Web3Button icon="show" label="Connect Wallet" balance="show" />*/}
            {/*<Web3NetworkSwitch />*/}
            <CustomButton />
{/*            <button className="flex" onClick={!user.length ? connectUser : null} auto>{!user.length ? "Connect Wallet" : `Wallet : ${user.slice(0,5) + '...' + user.slice(38)}`}</button>*/}

          </div>

        </div>
      </div>
      {searchmodal ? (
        <div className="fixed z-50 top-16 left-32 bg-slate-900 w-96 rounded-xl py-3 px-5 gap-y-2">
        {!val
        ? 
        <div className="grid gap-y-2">
        <div className="border-[1px] border-slate-800 py-2 px-5 text-slate-400 hover:bg-slate-800 cursor-pointer hover:text-slate-50 rounded-full">Explore</div>
          <div className="border-[1px] border-slate-800 py-2 px-5 text-slate-400 hover:bg-slate-800 cursor-pointer hover:text-slate-50 rounded-full">Top NFT's</div>
          <div className="border-[1px] border-slate-800 py-2 px-5 text-slate-400 hover:bg-slate-800 cursor-pointer hover:text-slate-50 rounded-full">Top Artists</div>
          <div className="border-[1px] border-slate-800 py-2 px-5 text-slate-400 hover:bg-slate-800 cursor-pointer hover:text-slate-50 rounded-full">Top Collections</div>
        </div>

        :<div>
        <div className="text-slate-400 h-60 overflow-hidden">

        <ul>
        {
          content.filter(u => u.name.toLowerCase().includes(val)).map((i,k) =>
          <Link  href={`/details/${i._id}`} className="z-[9999]">
            <li key={k}  className="border-[0.5px] border-slate-800 py-2 px-3 my-2 rounded cursor-pointer hover:bg-slate-800">
              <div className="flex items-center gap-x-2">
              <div className="w-12 h-12 object-cover">
              {i.fileType == 'video/mp4'
              ? <video src={i.images} className="w-12 h-12 rounded-lg object-cover" autoPlay muted loop/>
              : i.fileType == 'image/png' || i.fileType == 'image/jpeg' || i.fileType == 'image/jpg' || i.fileType == 'image/webp' ? <img src={i.images} className="w-12 h-12 rounded-lg object-cover" />
              : i.fileType == 'audio/mp3' || i.fileType == 'audio/wav' || i.fileType == 'audio/ogg' || 'audio/mpeg' ? <img src="https://bafkreifdqokmzap5e5hjb7oz32mfg32lctsq4kizbzqzzv4xlpzyiuujsm.ipfs.nftstorage.link/" className="w-12 h-12 rounded-lg object-cover"/> : null
              }</div>
                <span>{i.name}</span>
              </div>
            </li>
          </Link>
          )
        }
          
        </ul>
        </div>
        </div>
        }
        </div>
        ) : null}
    </Fragment>
//******************* END MEDIUM ******************************
      }
      
      {matches.large &&
//********************** LARGE *******************************
    <Fragment>
    {/*chain == 'Mumbai Testnet' ? <div className="fixed w-full flex justify-center items-center bottom-0 left-0 z-50 bg-orange-500 h-10"><center className="text-sm antialiased">Your wallet is connected to the testnet ({chain}). Please switch to ethereum mainnet.</center></div> : null*/}
      <div className={nav ? "flex justify-center items-center p-7 w-full h-[50px] bg-gradient-to-tr to-slate-600 from-slate-900 fixed z-[999] transition-all" : "flex justify-center items-center p-7 w-full h-[80px] rounded-t-xl fixed z-[999] transition-all"}>
        <div className="flex justify-between items-center w-full">

          <div className="flex gap-x-2 justify-start items-center w-full px-10">
            <a href="/"><Image src={logo} alt="Cosmeta INC" width={250} height={25} className={nav ? "scale-75 object-cover": "scale-100 object-cover"}/></a>{chain == 'Sepolia' && <span className="text-xs rounded-lg px-3 py-1.5 border border-slate-600 text-slate-600">Testnet</span>}
            <div className={nav ? 'ml-12 flex justify-center items-center' : 'ml-12 flex justify-center items-center'}><input type="search" onChange={handleSearch} onClick={() => setSearchModal(true)} onBlur={() => setSearchModal(false)} name="search" id="search" placeholder="Search" className={nav ? "bg-slate-900 placeholder:text-slate-400 outline-none py-[6px] px-3 w-72 rounded-l-lg text-slate-400" : "bg-slate-500 opacity-40 placeholder:text-slate-900 outline-none py-[6px] px-3 w-72 rounded-l-lg text-slate-900"} /><button type="submit" onClick={handleSearchSubmit} className={nav ? "outline-none py-[8px] px-2 rounded-r-lg bg-slate-900" : "opacity-40 outline-none py-[8px] px-2 rounded-r-lg bg-slate-500"}><BiSearch size={20} className={nav ? "text-slate-400" : "text-slate-900"}/></button></div>
          </div>

          <div className={nav ? "flex justify-end items-center w-full text-sm text-slate-100 gap-x-10 px-10":"flex justify-end items-center w-full text-slate-100 gap-x-10 px-10"}>
            <Link href='/' className={router.pathname == '/' && "px-5 py-1 bg-slate-800 rounded-lg border-[1px] border-slate-400"}>Home</Link>       
            {account && users && users !== undefined
              ? <>
              <Link href='/create' className={router.pathname == '/create' && "px-5 py-1 bg-slate-800 rounded-lg border-[1px] border-slate-400"}>Create</Link>
              <Link href='/inbox' className={router.pathname == '/inbox' || router.pathname == '/inbox/chat' || router.pathname == '/inbox/chat/[conversationId]' ? "px-5 py-1 bg-slate-800 rounded-lg border-[1px] border-slate-400 relative" : "relative"}>
                {activeMessage ? <span className={router.pathname == '/inbox' || router.pathname == '/inbox/chat' || router.pathname == '/inbox/chat/[conversationId]' ? "w-3 h-3 text-[11px] right-4 bottom-4 bg-red-500 rounded-full p-1 absolute flex justify-center items-center animate-pulse" : "w-3 h-3 text-[11px] left-3 bottom-3 bg-red-500 rounded-full p-1 absolute flex justify-center items-center animate-pulse"}>&nbsp;</span> : null}
                <FiMessageSquare size={22}/>
                </Link>
              <Link href='/notifications' className={router.pathname == '/notifications'  ? "px-5 py-1 bg-slate-800 rounded-lg border-[1px] border-slate-400 relative" : "relative"}>
                {read == true ? <span className={router.pathname == '/notifications'  ? "w-3 h-3 text-[11px] right-5 bottom-4 bg-red-500 rounded-full p-1 absolute flex justify-center items-center animate-pulse" : "w-3 h-3 text-[11px] left-3 bottom-3 bg-red-500 rounded-full p-1 absolute flex justify-center items-center animate-pulse"}>&nbsp;</span> : null}
                <BiBell size={22}/>
              </Link>
              {loggedRouter()}
                </>
             : <Link href='/login'>Login</Link>
           }

            <CustomButton />
          </div>

        </div>
      </div>
      {searchmodal ? (
        <div className="fixed z-50 top-16 left-80 bg-slate-900 w-96 rounded-xl py-3 px-5 gap-y-2">
        {!val
        ? 
        <div className="grid gap-y-2">
        <div className="border-[1px] border-slate-800 py-2 px-5 text-slate-400 hover:bg-slate-800 cursor-pointer hover:text-slate-50 rounded-full">Explore</div>
          <div className="border-[1px] border-slate-800 py-2 px-5 text-slate-400 hover:bg-slate-800 cursor-pointer hover:text-slate-50 rounded-full">Top NFT's</div>
          <div className="border-[1px] border-slate-800 py-2 px-5 text-slate-400 hover:bg-slate-800 cursor-pointer hover:text-slate-50 rounded-full">Top Artists</div>
          <div className="border-[1px] border-slate-800 py-2 px-5 text-slate-400 hover:bg-slate-800 cursor-pointer hover:text-slate-50 rounded-full">Top Collections</div>
        </div>

        :<div>
        <div className="text-slate-400 h-60 overflow-hidden">
        <ul>
        {
          content.filter(u => u.name.toLowerCase().includes(val)).map((i,k) =>
          <Link  href={`/details/${i._id}`} className="z-[9999]">
            <li key={k}  className="border-[0.5px] border-slate-800 py-2 px-3 my-2 rounded cursor-pointer hover:bg-slate-800">
              <div className="flex items-center gap-x-2">
              <div className="w-12 h-12 object-cover">
              {i.fileType == 'video/mp4'
              ? <video src={i.images} className="w-12 h-12 rounded-lg object-cover" autoPlay muted loop/>
              : i.fileType == 'image/png' || i.fileType == 'image/jpeg' || i.fileType == 'image/jpg' || i.fileType == 'image/webp' || i.fileType == 'image/avif' || i.fileType == 'image/svg' ? <img src={i.images} className="w-12 h-12 rounded-lg object-cover" />
              : i.fileType == 'audio/mp3' || i.fileType == 'audio/wav' || i.fileType == 'audio/ogg' || 'audio/mpeg' ? <img src="https://bafkreifdqokmzap5e5hjb7oz32mfg32lctsq4kizbzqzzv4xlpzyiuujsm.ipfs.nftstorage.link/" className="w-12 h-12 rounded-lg object-cover"/> : null
              }</div>
                <span>{i.name}</span>
              </div>
            </li>
          </Link>
          )
            
        }
          
        </ul>
        </div>
        </div>
        }
        </div>
        ) : null}
    </Fragment>
//******************* END LARGE ******************************
      }

    </Fragment>
    )}
    </Media>
    </div>
    );
};

export default Navbar;
Navbar.getInitialProps = async (ctx) => {

}