/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState,useEffect,useRef,useReducer, Fragment,useContext} from 'react';
import { useStateContext } from "../context/StateContext";
import { ethers } from 'ethers';
import next from 'next';
import axios from 'axios';
import {AiOutlineLoading} from 'react-icons/ai'
import Web3Modal from "web3modal";
import { useRouter } from 'next/router';
import NFTCollection from '../engine/NFTCollection.json'
import Resell from '../engine/Resell.json';
import NFT from '../engine/NFT.json';
import Market from '../engine/Market.json';
import Token from '../engine/Token.json';
import { Text, Button, Container } from '@nextui-org/react';
import { hhnft, hhmarket, hhresell, hhnftcol, hhrpc,hhtoken} from '../engine/configuration';
//import { goenft, goemarket, goeresell, goenftcol, goerpc,goetoken } from '../engine/configuration';
//import { bsctnft, bsctmarket, bsctresell, bsctnftcol, bsctrpc,bsctoken } from '../engine/configuration';
import { sepnft, sepmarket, sepresell, sepnftcol, seprpc,septoken,sepauction,cipherSep } from '../engine/configuration';
import { cipherHH, cipherEth, simpleCrypto,client } from '../engine/configuration';
import Carousel from "react-multi-carousel";
import Link from 'next/link';
import "react-multi-carousel/lib/styles.css";
import {BsChevronLeft,BsChevronRight} from 'react-icons/bs';
import {FaFilter} from 'react-icons/fa'
import {MdVerified,MdClose} from 'react-icons/md';
import ConnectChain from '../engine/connectchain';
import uniqid from 'uniqid';
import detectEthereumProvider from '@metamask/detect-provider';
import { bscChain, polyChain, ethChain, hardChain, bscTest, ethTest, polyTest } from '../engine/chainchange';
import {BiSearch} from 'react-icons/bi'
import {MdKeyboardArrowDown,MdKeyboardArrowUp,MdRadioButtonUnchecked} from 'react-icons/md'
import { motion } from "framer-motion"
import {AiFillCheckCircle,AiOutlineHeart,AiFillHeart} from 'react-icons/ai'
import AudioPlayer from '../components/AudioPlayer';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loading from '../components/Loading';
import Auction from '../engine/Auction.json'
import Media from 'react-media';
import { LiveAuctionNftCard, PreLoader } from '../components';
import { AllAuctionNftCard }  from '../components';
import CountdownWhite from '../components/CountdownWhite';
import Countdown from '../components/Countdown';
import AllBidders from '../components/AllBidders';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import NftCard from '@/components/NftCard';
import { useDispatch,useSelector } from "react-redux";
import { DataContext } from '../store/GlobalState';
import { postData } from '@/utils/fetchData';
import { BiCommentDetail } from 'react-icons/bi';
import NFTsComponent from '@/components/NFTsComponent';
import NFTsAucComponent from '@/components/NFTsAucComponent';
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';
import Process from '@/components/Process';
import discover from '@/images/discover.png'
import createandsell from '@/images/createandsell.png'
import Loginmodal from '@/components/Loginmodal';
import CustomButton from '@/components/CustomButton';
import Head from 'next/head';
import { IoIosArrowDroprightCircle } from 'react-icons/io'
// import { io } from 'socket.io-client';
// let socket
// import EventSource from 'eventsource';
import TypewriterComponent from "typewriter-effect";

const Home = () => {
  const [hhnfts, hhsetNfts] = useState([])
  const [sepnfts, MumsetNfts] = useState([])
  const [mumliveauction, MumLiveAuction] = useState([])
  const [mumallauction, MumAllAuction] = useState([])
  const [cs,bn] = useState(null);
  const [uid,setUid] = useState(null);
  const [type,setFileType] = useState(null);
  const [openPrice,setOpenPrice] = useState(true);
  const [openVerify,setOpenVerify] = useState(false);
  const [openNetwork,setOpenNetwork] = useState(false);
  const [openNft,setOpenNft] = useState(true);
  const [process,setProcess] = useState(false);
  const [usertok,setToken] = useState(null);
  const [lowprice,setLowCheckPrice] = useState(false);
  const [highprice,setHighCheckPrice] = useState(false);
  const [checkImage,setCheckImage] = useState(true);
  const [checkVideo,setCheckVideo] = useState(true);
  const [checkMusic,setCheckMusic] = useState(true);
  const [eth,setEthereum] = useState(false);
  const [poly,setPolygon] = useState(false);
  const [bsc,setBinance] = useState(false);
  const [verifiedartist,setVerifiedArtist] = useState(false);
  const [verifiedseller,setVerifiedSeller] = useState(false);
  const [defaultState,setDefaultState] = useState(false);
  const [openFilter,setOpenFilter] = useState(false)
  const [lanft,setLaNft] = useState(true)
  const [laauc,setLaAuc] = useState(false)
  const [count,setCount] = useState(15)
  const [hoverBid,setHoverBid] = useState(false)
  const [openBidModal,setOpenBid] = useState(false)
  const [formInput,updateFormInput] = useState({bidprice:''})
  const [content,setContent] = useState([]);
  const [datas,setNftData] = useState([]);
  const [isLiked,setLiked] = useState(false)
  const [likeon,setLikeOn] = useState(0)
  const [userliked,setUserLiked] = useState([])
  const [liked,onLiked] = useState(false)
  const [user,setSelectedAddress] = useState("");
  const [loginmodal,setLoginModal] = useState(false);

  const {state,dispatch} = useContext(DataContext)
  const {auth} = state

  const [messages,setMessages] = useState([]);
  const [messageInput,setMessageInput] = useState('');
  const [input,setInput] = useState('');



  const router = useRouter();
  const usersa = useSelector(state => state.auth.user)


    let stylesArray= [ 
      `background-image: url(https://img1.pngindir.com/20180212/yre/kisspng-light-gradient-refraction-purple-gradient-5a818a7aa348e9.7649383915184390346688.jpg)`, 
      `background-size: cover`, 
      `color : darkgray`, 
      `padding : 10px 20px`, 
      `line-height : 35px`, 
      `width : 70px`, 
      `height : 70px`,
      `border : 1px solid darkgray`,
      `border-radius : 15px` ].join(';') 
    console.log('%c Developer Yunus Cetin from Ernestsoft', stylesArray);


  useEffect(() => {

    const token = Cookies.get('refreshtoken');
    const decodedToken = jwt.decode(token);
    const expr = decodedToken?.exp * 1000 > Date.now()


    if (!token || !expr  || token == undefined ) {
      setTimeout(() => {
        setLoginModal(true)
      }, 4000);
    }else{
      setLoginModal(false)
    }

  }, [auth.user, usersa, router]);

  // console.log(usersa)

  // useEffect(() => {
  //   socketbaslatici()
  // },[])

  // const socketbaslatici = async () => {
  //   await fetch('https://testmarket.cos-in.com/api/socketio')
  //   socket = io()

  //   socket.on('connect', () => {
  //     console.log('connected')
  //   })

  //   socket.on('likeUpdated', (msg) => {
  //     console.log("msg",msg)
  //     setInput(msg)
  //   })
  // }
  
  useEffect(() => {

    if(window?.ethereum){
      const acc = window?.ethereum?.selectedAddress;
      setSelectedAddress(acc)
    }
    else{
      console.log("Please download any crypto wallet!")
    }
  },[])

  useEffect(() => {
    getNFTs()
  },[])

  const rad = useRef();

  const {
    connectUser,
    getUser,
    getChain,
    setNftCustom,
    setTokenCol,
    setMarket,
    auction,
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
    setUid(uniqid())

  }, [sepnfts,getChain,MumsetNfts,getNftCustom,getNftResell,getRpc,getChainName,])

  // async function loadMumResell() {
  //   const provider = new ethers.providers.JsonRpcProvider(seprpc)
  //   const key = simpleCrypto.decrypt(cipherEth)
  //   const wallet = new ethers.Wallet(key, provider);
  //   const contract = new ethers.Contract(sepnftcol, NFTCollection, wallet);
  //   const market = new ethers.Contract(sepresell, Resell, wallet);
  //   const itemArray = [];
  //   contract.totalSupply().then(result => {
  //     for (let i = 0; i < result; i++) {
  //       let token = i + 1;     
  //       let owner = contract.ownerOf(token)
  //       let getOwner = Promise.resolve(owner)
  //       getOwner.then(address => {
  //       if (address == sepresell) {
        // const rawUri = contract.tokenURI(token)
        // const Uri = Promise.resolve(rawUri)
        // const getUri = Uri.then(value => {
        //   let str = value
        //   let cleanUri = str.replace('ipfs://', 'https://ipfs.io/ipfs/')
        //   //console.log("CleanUri",cleanUri)
        //   let metadata = axios.get(cleanUri).catch(function (error) {
        //     //console.log(error.toJSON());
        //   });
        //   return metadata;
        // })
        // getUri.then(value => {
        //   let rawImg = value.data.image
        //   var name = value.data.name
        //   var desc = value.data.description
        //   let image = rawImg.replace('ipfs://', 'https://ipfs.io/ipfs/')
        //   const price = market.getPrice(token)
        //   Promise.resolve(price).then(_hex => {
        //   var salePrice = Number(_hex);
        //   var txPrice = salePrice.toString()
        //   Promise.resolve(owner).then(value => {
        //     let ownerW = value;
        //     let outPrice = ethers.utils.formatUnits(salePrice.toString(), 'ether')
        //     let meta = {
        //       name: name,
        //       image: image,
        //       cost: txPrice,
        //       val: outPrice,
        //       tokenId: token,
        //       wallet: ownerW,
        //       desc
        //     }
  //           //console.log("Mumbai Meta:",meta)
  //           itemArray.push(meta)
  //         })
  //       })
  //     })
  //   }})
  //   }})
  //   await new Promise(r => setTimeout(r, 2000));
  //   MumResellNfts(itemArray)
  //   loadMumSaleNFTs();
  // }

  async function loadMumSaleNFTs(){
    try {
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()
      let marketContract = new ethers.Contract(sepmarket, Market, signer)
      let tokenContract = new ethers.Contract(sepnft, NFT, signer)
      let auctioncontract = new ethers.Contract(sepauction, Auction, signer)
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
          type: meta.data.type,
          verified:meta.data.role,
          username:meta.data.username,
          avatar:meta.data.avatar,
          wichNet:meta.data.wichNet
        }
        return item
      }))
      setProcess(false)
    } catch (err) {
      setProcess(false)
      console.log(err)
    }
  }

  const addrs = window?.ethereum?.selectedAddress;

  async function buyNewMum(nftprice,nfttokenId) {
    try {
      if(!addrs){
        connectUser()
      }else if(addrs){

      setProcess(true)

      const token = Cookies.get('refreshtoken');
      const decodedToken = jwt.decode(token);
      const expr = decodedToken?.exp * 1000 > Date.now();
      if (!token && !expr ) {
        router.push('/login');
      }else{

      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()
      let cosmeta = new ethers.Contract(cri,Token,signer);
      const contract = new ethers.Contract(marketcol, Market, signer);

      nftprice = nftprice.toString()
      let price = ethers.utils.parseUnits(nftprice, 'ether')
      price = price.toString()

      let approve = await cosmeta.approve(marketcol,price);
      await approve.wait()

      const itemids = datas.find(u => u.tokenId == nfttokenId);
      const nftitem = itemids.itemId;

      console.log(nftitem)

      const gasPrice = new ethers.utils.parseUnits('30', 'gwei')

      await cosmeta.increaseAllowance(marketcol, ethers.utils.parseEther(price.toString()))//ethers.utils.parseEther(price.toString())
      const transaction = await contract.CosmetaMarketSale(nftcustom, nftitem)
      await transaction.wait()

      const tokenids = datas.find(u => u.tokenId == nfttokenId);
      const id = tokenids._id;

      const nftdata = {
        id:id,
        sold:true,
        owner:addrs,
        username:decodedToken?.username
      }

      console.log("nftdata",nftdata)
  
      const res = await fetch("https://testmarket.cos-in.com/api/setnft", {
        method: "PUT", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nftdata),
      });
      if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err} })
      dispatch({ type: 'NOTIFY', payload: {success: res.msg} })
      setProcess(false)
      router.reload()
    }
    }else{
      router.push('/connectwallet')
    }
      // loadMumSaleNFTs()
    } catch (err) {
      setProcess(false)
      console.log(err)
    }
  }


  const getNFTs = async () => {
    await fetch('https://testmarket.cos-in.com/api/setnft').then(res => {
      if(!res.ok){
        throw new Error("HTTP ERROR",res.status)
      }
      return res
    }).then(res => res.json()).then(data => {
      setNftData(data)
    })
  }


  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
      slidesToSlide: 1 
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
      slidesToSlide: 1
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1 
    }
  };
  const CustomLeftArrow = ({ onClick }) => {
    return <button type='button' className="custom-left-arrow p-5 rounded-full bg-slate-50 absolute left-4 shadow-2xl shadow-slate-800 top-52" onClick={() => onClick()}><BsChevronLeft size={22} className="text-slate-900"/></button>;
  };
  const CustomRightArrow = ({ onClick }) => {
    return <button type='button' className="custom-right-arrow p-5 rounded-full bg-slate-50 absolute right-20 shadow-2xl shadow-slate-800 top-52" onClick={() => onClick()}><BsChevronRight size={22} className="text-slate-900"/></button>;
  };

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
      <Head>
      <title>Home • Cosmeta NFT Marketplace</title>
      </Head>
    {process ?  <Process/> : null }
    
<div className="w-full flex-col justify-center items-center welcomebg antialiased overflow-hidden">

  <div className='z-10 w-full h-full overflow-hidden object-cover'>
      {/*<Image src={welcome} alt="Welcome" className='w-screen h-screen absolute object-cover mix-blend-overlay'/>*/}
      <div className='white-glassmorphism w-11/12 h-[712px] absolute object-cover top-20 z-0'>&nbsp;</div>
  </div>

  <div className='flex-col'>
      <div className='flex justify-center items-center w-full'>

{/*        <div className='flex-col justify-center items-center w-screen h-full p-7'>
        <div className='text-slate-50 font-bold inset-3 px-2 -skew-y-3 bg-gradient-to-tl to-pink-500 from-purple-500 w-full text-[38px]'><div className='justify-center items-center text-center'><span className='relative top-3'>Create and Sell</span><br/><span className='relative left-14 bottom-3'>your NFT</span></div></div>
        <p className='text-slate-50 font-light text-[45px]'>in the Marketplace</p>
        </div>*/}

        <div className='justify-center items-center w-full mb-10'>{/*flex justify-center items-center w-full relative left-10*/}
        <Container xs>
            <Carousel
            additionalTransfrom={0}
            autoPlaySpeed={3000}
            autoPlay={true}
            centerMode={false}
            className="overflow-hidden"
            containerClass="container-padding-bottom"
            dotListClass=""
            draggable={true}
            focusOnSelect={false}
            itemClass=""
            minimumTouchDrag={80}
            pauseOnHover
            renderArrowsWhenDisabled={false}
            renderButtonGroupOutside
            renderDotsOutside={false}
            rewind={false}
            rewindWithAnimation={false}
            rtl={false}
            shouldResetAutoplay
            showDots={false}
            sliderClass=""
            slidesToSlide={1}
            swipeable
            responsive={responsive}
            ssr={true}
            infinite={true}
            keyBoardControl={true}
            transitionDuration={4000}
            removeArrowOnDeviceType={["tablet", "mobile","desktop"]}>
            
            <div className="flex justify-center items-center">
              <div className='block relative top-24'>
                <Text  h1 weight="bold" size={50} css={{textGradient: "45deg, $yellow600 -20%, $purple600 50%"}} className="w-[300px] relative">Discover</Text>
                <Text  h1 weight="bold" size={25} css={{textGradient: "45deg, $purple600 20%, $yellow500 50%",}} className="w-[300px] relative bottom-3 left-2">The latest lived Legend</Text>
                <Text  h1 weight="bold" size={100} css={{textGradient: "45deg, $yellow500 20%, $red600 50%"}} className="w-[300px] relative bottom-12">NFTs</Text>
              </div>
            </div>
  
            <div className='flex-col justify-center items-center mt-20 w-full'>
            <h3 className='text-slate-50 text-5xl font-bold inset-3 -skew-y-3 py-4 my-3 px-4 bg-gradient-to-tl to-pink-500 from-purple-500 w-full'>Create and Sell your NFT</h3>
            <p className='text-slate-50 text-6xl font-light'>in the Marketplace</p>
            </div>
  
  
          </Carousel>
          </Container>
<div className='flex justify-between z-10 items-center w-[%90] p-5 rounded-xl white-glassmorphism mx-5 mt-10'>

<div className='flex-col justify-start items-center '>
<div className='text-4xl font-bold py-2 text-green-500'>
<TypewriterComponent
options={{
  autoStart:true,
  loop:true
}}
onInit={(typewriter) => {
  typewriter.typeString("Discover")
  .pauseFor(1500)
  .deleteAll()
  .start();
}}
/>
</div>
<div className='text-xs text-justify mt-2 text-slate-400 w-56'>
Buy / Sell wonderful NFTs. Chat live with hundreds of thousands of artists or buyers. Ask your friends for likes and comments on your NFTs. Moreover, 10% artist royalty is waiting for you. More features like this are waiting for you in the world of Cosmeta NFT Marketplace.

</div>
</div>
<div className='flex justify-end items-center w-full'>
  <IoIosArrowDroprightCircle size={50} className='text-green-500 cursor-pointer hover:text-green-400'/>
</div>
</div>
        </div>

      </div>
      
      <div className='flex justify-center items-center'>
    <Container xs css={{marginBottom:'$3'}}>
      <Carousel
        additionalTransfrom={0}
        autoPlaySpeed={3000}
        autoPlay={true}
        centerMode={false}
        className=""
        containerClass="container-padding-bottom"
        dotListClass=""
        draggable={true}
        focusOnSelect={false}
        itemClass=""
        minimumTouchDrag={80}
        pauseOnHover
        renderArrowsWhenDisabled={false}
        renderButtonGroupOutside
        renderDotsOutside={false}
        rewind={false}
        rewindWithAnimation={false}
        rtl={false}
        shouldResetAutoplay
        showDots={false}
        sliderClass=""
        slidesToSlide={1}
        swipeable
        responsive={responsive}
        ssr={true}
        infinite={true}
        keyBoardControl={true}
        transitionDuration={800}
        removeArrowOnDeviceType={["tablet", "mobile"]}>
        {
          datas.filter(i => i.fileType == 'value/mp4' || i.fileType == 'image/png' || i.fileType == 'image/jpeg' || i.fileType == 'image/jpg' || i.fileType == 'audio/mp3' || i.fileType == 'auido/ogg' || i.fileType == 'audio/wav' || i.fileType == 'audio/mpeg').reverse().map((nft) => (
              <div key={nft.id} className="mx-2 border-[1px] border-slate-400 h-[442px] justify-center items-center p-1 rounded-xl overflow-hidden object-cover">
              {nft.fileType == 'video/mp4'
              ? <video src={nft.images} className="w-full h-[250px] bg-transparent" autoPlay muted loop/>
              : nft.fileType == 'image/png' || nft.fileType == 'image/jpeg'  || nft.fileType == 'image/jpg' || nft.fileType == 'image/webp' ? <img src={nft.images} className="w-full h-[296px] rounded-lg object-cover bg-transparent" />
              : nft.fileType == 'audio/mp3' || nft.fileType == 'audio/wav' || nft.fileType == 'audio/ogg' || 'audio/mpeg' ? <AudioPlayer nftname={nft.name} nftid={nft.id} nft={nft.images}/> : null
              }
              <div className='relative top-5 bg-slate-50 px-3 rounded-lg opacity-90 w-full'>
                <div className='flex-col items-center'>
                    <div className='flex-col justify-start items-center py-3'>
                        <h1 className='text-sm font-bold text-slate-800 my-1' key={uid}>{nft.name}</h1>
                        <h1 className='text-sm font-bold text-purple-500 flex items-center gap-x-1 my-1'>{nft.avatar ? <img src={nft.avatar} className="rounded-full w-3 mr-1"/>:null}{!nft.username == "" ? nft.username : user.slice(0,11) + '...'} {nft.verified == 'verified' ? <MdVerified size={18}/>: null}</h1>
                        <div className='flex items-center px-3 rounded-md font-bold text-slate-600 bg-slate-300'>
                        <h1 className='font-bold text-sm flex items-center gap-x-2 my-2 text-slate-500'>{nft.price} CRI<img src='https://etherscan.io/token/images/cosmeta_32.png' className='object-cover w-6' /></h1>
                        </div>
                    </div>
                </div>
            </div>
              </div>
          ))
        }
        {/*<CustomLeftArrow/><CustomRightArrow />*/}
      </Carousel>
    </Container>
        </div>

  </div>
    
<div className='flex justify-center items-center pb-40'>
  <div className='flex justify-between w-full'>

  {/************* FILTER & CHAINS **********************/}
{openFilter &&
  <div className='bg-slate-900 fixed w-full h-full top-0 left-0 z-[60] overflow-scroll'>
  <div className='flex-col w-full h-full text-slate-400'>

   <div className='flex justify-between items-center my-3 w-full'>
      <div className='px-1'><MdClose size={30} className="cursor-pointer hover:opacity-50" onClick={() => setOpenFilter(false)}/></div>
      {/*<div className='w-full justify-center items-center text-center'><center><ConnectChain/></center></div>*/}
    </div>

   <div className='border-[1px] border-slate-800'></div>
  <div className='flex justify-center'>
    <h1 className='text-lg font-bold my-3'>Filter</h1>
  </div>
<div className='grid gap-y-3'>
  {/* RESET */}
  <div className='flex-col mx-4'>
  <div className='bg-slate-800 rounded-lg w-full py-3 px-3 cursor-pointer' onClick={() => {setCheckImage(true),setCheckVideo(true),setCheckMusic(true),setLowCheckPrice(false),setHighCheckPrice(false),setVerifiedArtist(false),setVerifiedSeller(false),setEthereum(false),setPolygon(false),setBinance(false)}}>
  <span className='text-center font-bold antialiased flex justify-center items-center cursor-pointer' onClick={() => {setCheckImage(true),setCheckVideo(true),setCheckMusic(true),setLowCheckPrice(false),setHighCheckPrice(false),setVerifiedArtist(false),setVerifiedSeller(false),setEthereum(false),setPolygon(false),setBinance(false)}} >All</span>
  </div>
  </div>

  {/* PRICE */}
  <div className='flex-col mx-4'>
    <div className='bg-slate-800 rounded-lg w-full px-3 py-3 cursor-pointer' onClick={() => setOpenPrice(!openPrice)}>
    <div className='flex justify-between items-center w-full'><div className='w-full'><h5 className='justify-center text-center font-bold antialiased items-center'>Price</h5></div><div>{!openPrice ?<MdKeyboardArrowDown size={28}/>:<MdKeyboardArrowUp size={28}/>}</div></div>
    </div>
    {openPrice &&
      <div className='bg-slate-800 flex-col relative bottom-4 py-3 px-3 rounded-lg'>
      <div className='grid flex-col items-center my-3 gap-y-2'>
      <button type='button' className='rounded bg-slate-700 px-3 py-2 w-full flex items-center justify-center gap-x-3' onClick={() => {setLowCheckPrice(!lowprice),setHighCheckPrice(false),setVerifiedArtist(false),setVerifiedSeller(false),setEthereum(false),setPolygon(false),setBinance(false),setCheckVideo(false),setCheckMusic(false),setCheckImage(false)}} >{lowprice ? <AiFillCheckCircle size={18} className="text-blue-500"/>:<MdRadioButtonUnchecked size={18}/>}Low to High</button>
      <button type='button' className='rounded bg-slate-700 px-3 py-2 w-full flex items-center justify-center gap-x-3' onClick={() => {setHighCheckPrice(!highprice),setLowCheckPrice(false),setVerifiedArtist(false),setVerifiedSeller(false),setEthereum(false),setPolygon(false),setBinance(false),setCheckVideo(false),setCheckMusic(false),setCheckImage(false)}} >{highprice ? <AiFillCheckCircle size={18} className="text-blue-500"/>:<MdRadioButtonUnchecked size={18}/>}High to Low</button>
      </div>
      </div>
  }
  </div>

  {/* VERIFY */}
  <div className='flex-col mx-4'>
  <div className='bg-slate-800 rounded-lg w-full py-3 px-3 cursor-pointer' onClick={() => setOpenVerify(!openVerify)}>
    <div className='justify-between items-center w-full flex'><div className='w-full'><h5 className='text-center font-bold antialiased justify-center items-center'>Verify </h5></div><div>{!openVerify ? <MdKeyboardArrowDown size={28}/>:<MdKeyboardArrowUp size={28}/>}</div></div>
  </div>
  {openVerify &&
    <div className='bg-slate-800 rounded-lg relative bottom-4 py-3 px-3'>
    <div className='flex items-center gap-x-2 my-2 mx-2 cursor-pointer' onClick={() => {setVerifiedArtist(!verifiedartist),setVerifiedSeller(false),setEthereum(false),setPolygon(false),setBinance(false),setCheckVideo(false),setCheckMusic(false),setCheckImage(false),setLowCheckPrice(false),setHighCheckPrice(false)}}>
    <div className='flex items-center justify-center gap-x-2'>{verifiedartist ? <AiFillCheckCircle size={18} className="text-blue-500"/>:<MdRadioButtonUnchecked size={18}/>}</div><h5>Verified Artists</h5>
    </div>
    <div className='flex items-center gap-x-2 my-2 mx-2 cursor-pointer' onClick={() => {setVerifiedSeller(!verifiedseller),setVerifiedArtist(false),setEthereum(false),setPolygon(false),setBinance(false),setCheckVideo(false),setCheckMusic(false),setCheckImage(false),setLowCheckPrice(false),setHighCheckPrice(false)}}>
    <div className='flex items-center justify-center gap-x-2'>{verifiedseller ?<AiFillCheckCircle size={18} className="text-blue-500"/>:<MdRadioButtonUnchecked size={18}/>}</div><h5>Verified Sellers</h5>
    </div>
    </div>
  }
  </div>

  {/*NETWORK*/}
  <div className='flex-col mx-4'>
  <div className='bg-slate-800 rounded-lg w-full py-3 px-3 cursor-pointer' onClick={() => setOpenNetwork(!openNetwork)} >
    <div className='flex justify-between items-center w-full'><div className='w-full'><h5 className='text-center font-bold antialiased flex justify-center items-center'>Networks</h5></div><div>{!openNetwork ?<MdKeyboardArrowDown size={28} />:<MdKeyboardArrowUp size={28}/>}</div></div>
  </div>
  {openNetwork &&
    <div className='bg-slate-800 relative bottom-4 rounded-lg py-3 px-3'>  
    <div className='flex items-center gap-x-2 my-2 mx-2 cursor-pointer' onClick={() => {setEthereum(!eth),setVerifiedArtist(false),setVerifiedSeller(false),setPolygon(false),setBinance(false),setCheckVideo(false),setCheckMusic(false),setCheckImage(false)}}>
    <div className='flex items-center justify-center gap-x-2'>{eth ?<AiFillCheckCircle size={18} className="text-blue-500"/>:<MdRadioButtonUnchecked size={18}/>}</div><h5>Ethereum</h5>
    </div>
    <div className='flex items-center gap-x-2 my-2 mx-2 cursor-pointer' onClick={() => {setPolygon(!poly),setVerifiedArtist(false),setVerifiedSeller(false),setEthereum(false),setBinance(false),setCheckVideo(false),setCheckMusic(false),setCheckImage(false)}}>
    <div className='flex items-center justify-center gap-x-2'>{poly ?<AiFillCheckCircle size={18} className="text-blue-500"/>:<MdRadioButtonUnchecked size={18}/>}</div><h5>Polygon</h5>
    </div>
    <div className='flex items-center gap-x-2 my-2 mx-2 cursor-pointer' onClick={() => {setBinance(!bsc),setVerifiedArtist(false),setVerifiedSeller(false),setEthereum(false),setPolygon(false),setCheckVideo(false),setCheckMusic(false),setCheckImage(false)}}>
    <div className='flex items-center justify-center gap-x-2'>{bsc ?<AiFillCheckCircle size={18} className="text-blue-500"/>:<MdRadioButtonUnchecked size={18}/>}</div><h5>Binance</h5>
    </div>
    </div>
  }
  </div>

  {/*IMAGE,VIDEO,MUSIC*/}
  <div className='flex-col mx-4'>
  <div className='bg-slate-800 rounded-lg w-full py-3 px-3 cursor-pointer' onClick={() => setOpenNft(!openNft)}>
    <div className='flex justify-between items-center w-full'><div className='w-full'><h5 className='text-center font-bold antialiased justify-center items-center'>NFT's</h5></div><div>{!openNft ?<MdKeyboardArrowDown size={28}/>:<MdKeyboardArrowUp size={28}/>}</div></div>
  </div>
  {openNft &&
    <div className='bg-slate-800 relative bottom-3 py-3 px-3 rounded-lg'>
    <div className='flex items-center gap-x-2 my-2 mx-2 cursor-pointer' onClick={() => {setCheckImage(!checkImage),setVerifiedArtist(false),setVerifiedSeller(false),setEthereum(false),setPolygon(false),setBinance(false),setCheckVideo(false),setCheckMusic(false)}}>
    <div className='flex items-center justify-center gap-x-2'>{checkImage ?<AiFillCheckCircle size={18} className="text-blue-500"/>:<MdRadioButtonUnchecked size={18}/>}</div><h5>Image</h5>
    </div>
    <div className='flex items-center gap-x-2 my-2 mx-2 cursor-pointer' onClick={() => {setCheckVideo(!checkVideo),setVerifiedArtist(false),setVerifiedSeller(false),setEthereum(false),setPolygon(false),setBinance(false),setCheckImage(false),setCheckMusic(false)}}>
    <div className='flex items-center justify-center gap-x-2'>{checkVideo ?<AiFillCheckCircle size={18} className="text-blue-500"/>:<MdRadioButtonUnchecked size={18}/>}</div><h5>Video</h5>
    </div>
    <div className='flex items-center gap-x-2 my-2 mx-2 cursor-pointer' onClick={() => {setCheckMusic(!checkMusic),setVerifiedArtist(false),setVerifiedSeller(false),setEthereum(false),setPolygon(false),setBinance(false),setCheckVideo(false),setCheckImage(false)}}>
    <div className='flex items-center justify-center gap-x-2'>{checkMusic ?<AiFillCheckCircle size={18} className="text-blue-500"/>:<MdRadioButtonUnchecked size={18}/>}</div><h5>Music</h5>
    </div>
    </div>
  }
  </div>

</div>

</div>
</div>
}
  
  {/***************** NFTs ****************************/}
<div className='flex-col justify-end items-center w-full h-full mb-7'>

<div className='flex justify-center items-center my-10 w-full'>
    <div className='flex-col'>
  
      <div className='flex py-3 w-full bg-gradient-to-t to-slate-900 from-transparent rounded-xl justify-center items-center mt-7 mb-10 gap-x-1'>
        <div className='flex justify-between items-center w-full'>
        <div className='w-12 justify-center items-center flex'><FaFilter size={18} className="cursor-pointer z-30 hover:opacity-50" onClick={() => setOpenFilter(!openFilter)}/></div>
          <div className='w-full justify-center items-center flex'><h3 className='text-slate-400 text-xl'>Latest NFT's</h3></div>
          </div>
      </div>
<div className='grid grid-cols-1 gap-y-2'>

{datas.filter(u => u.live == true).reverse().map((nft) => (
  <NFTsAucComponent auth={auth} nft={nft} duration={nft.duration} buyNewMum={buyNewMum}/>
))}

{datas.filter(u => !u.duration).reverse().map((nft) => (
  <NFTsComponent nft={nft} auth={auth} buyNewMum={buyNewMum} />
))}

</div>
    </div>
  </div>{/* LATEST NFT's on GOERLI END*/}

</div>

  </div>
</div>{/***** FILTERS & NFTs END *****/}


{/*** BODY END ****/}
</div>
    </Fragment>
//***************** END SMALL *******************************
    }

    {matches.medium &&
//******************** MEDIUM *******************************
      <Fragment>
      <Head>
      <title>Home • Cosmeta NFT Marketplace</title>
      </Head>
          {process && <Process/>}

<div className="w-full welcomebg antialiased">
<div className='z-10 w-full h-full overflow-hidden object-cover flex justify-center items-center'>
  {/*<Image src={welcome} alt="Welcome" className='w-screen h-screen absolute object-cover mix-blend-overlay'/>*/}
  <div className='white-glassmorphism w-11/12 h-[712px] absolute object-cover top-20 z-0'>&nbsp;</div>
</div>
  <div className='py-28 my-20 '>
      <div className='flex justify-between items-center'>
      <div className='flex-col grid justify-start items-center ml-10 w-[400px]'>
      <span className='hidden'>tesdat</span>
      <Container xs>
      <span className='hidden'>tesdat</span>
          <Carousel
          additionalTransfrom={0}
          autoPlaySpeed={3000}
          autoPlay={true}
          centerMode={false}
          className="overflow-hidden"
          containerClass="container-padding-bottom"
          dotListClass=""
          draggable={true}
          focusOnSelect={false}
          itemClass=""
          minimumTouchDrag={80}
          pauseOnHover
          renderArrowsWhenDisabled={false}
          renderButtonGroupOutside
          renderDotsOutside={false}
          rewind={false}
          rewindWithAnimation={false}
          rtl={false}
          shouldResetAutoplay
          showDots={false}
          sliderClass=""
          slidesToSlide={1}
          swipeable
          responsive={responsive}
          ssr={true}
          infinite={true}
          keyBoardControl={true}
          transitionDuration={4000}
          removeArrowOnDeviceType={["tablet", "mobile","desktop"]}>
          <span className='hidden'>tesdat</span>
          <div className="block">
          <span className='hidden'>tesdat</span>
          <Image title='Landing' src={discover} className='w-[300px]'/>

          </div>

          <div className='block'>
          <span className='hidden'>tesdat</span>
          <Image title='Landing' src={createandsell} className='w-[300px]'/>
          </div>


        </Carousel>
        </Container>
<div className='flex justify-between z-10 items-center w-2/3 p-5 rounded-xl white-glassmorphism mx-5'>

<div className='flex-col justify-start items-center '>
<div className='text-4xl font-bold py-2 text-green-500'>
<TypewriterComponent
options={{
  autoStart:true,
  loop:true
}}
onInit={(typewriter) => {
  typewriter.typeString("Discover")
  .pauseFor(1500)
  .deleteAll()
  .start();
}}
/>
</div>
<div className='text-xs text-justify mt-2 text-slate-400 w-72*'>
Buy / Sell wonderful NFTs. Chat live with hundreds of thousands of artists or buyers. Ask your friends for likes and comments on your NFTs. Moreover, 10% artist royalty is waiting for you. More features like this are waiting for you in the world of Cosmeta NFT Marketplace.

</div>
</div>
<div className='flex justify-end items-center w-full'>
  <IoIosArrowDroprightCircle size={60} className='text-green-500 cursor-pointer hover:text-green-400'/>
</div>
</div>
      </div>
      
        <div className='flex justify-end items-center w-[550px]'>
        <span className='hidden'>test</span>
          <Container xs>
          <span className='hidden'>test</span>
          <Carousel
            additionalTransfrom={0}
            autoPlaySpeed={3000}
            autoPlay={true}
            centerMode={false}
            className="overflow-hidden"
            containerClass="container-padding-bottom"

            dotListClass=""
            draggable={true}
            focusOnSelect={false}
            itemClass=""
            minimumTouchDrag={80}
            pauseOnHover
            renderArrowsWhenDisabled={false}
            renderButtonGroupOutside
            renderDotsOutside={false}
            rewind={false}
            rewindWithAnimation={false}
            rtl={false}
            shouldResetAutoplay
            showDots={false}
            sliderClass=""
            slidesToSlide={1}
            swipeable
            responsive={responsive}
            ssr={true}
            infinite={true}
            keyBoardControl={true}
            transitionDuration={800}
            removeArrowOnDeviceType={["tablet", "mobile"]}>
            <span className='hidden'>test</span>
            {datas.filter(i => i.live == true && i.duration + "000" > Date.now()).reverse().map((nft) => {
              
              return (
              <div key={nft.id}>
              {nft.fileType == 'video/mp4'
              ? <video src={nft.images} className="w-[400px] h-[393px] mt-12 ml-12 bg-transparent object-cover rounded-xl" autoPlay muted loop/>
              : nft.fileType == 'image/png' || nft.fileType == 'image/jpeg'  || nft.fileType == 'image/jpg' || nft.fileType == 'image/webp' ? <img src={nft.images} className="w-[450px] h-[393px] object-cover ml-12 bg-transparent rounded-xl" />
              : nft.fileType == 'audio/mp3' || nft.fileType == 'audio/wav' || nft.fileType == 'audio/ogg' || 'audio/mpeg' ? <AudioPlayer nft={nft.images} nftname={nft.name}/> : null
              }
              <div className='relative bottom-24 left-14 bg-slate-50 px-3 pb-3 rounded-xl opacity-90 w-96'>
                <div className='flex justify-between items-center'>
                    <div className='flex-col justify-start items-center p-2'>
                        <h1 className='text-lg font-bold text-slate-800' key={uid}>{nft.name}</h1>
                        <h1 className='text-lg font-bold text-purple-500 flex items-center gap-x-1'>{nft.avatar ? <img src={nft.avatar} className="rounded-full w-3 mr-1"/>:null}{!nft.username == "" ? nft.username : user.slice(0,11) + '...'} {nft.verified == 'verified' ? <MdVerified size={18}/>: null}</h1>
                    </div>
                  <div onMouseOver={() => setHoverBid(true)} onMouseOut={() => setHoverBid(false)} className={hoverBid ? 'flex cursor-pointer bg-gradient-to-tr to-yellow-500 from-orange-600 text-center justify-center items-center px-7 rounded-md font-bold text-slate-600 w-28' : 'flex justify-end items-center px-3 rounded-md font-bold text-slate-600 bg-slate-300 w-38'}>
                    <Link href={`/placebid/${nft.id}`}><h1 className={hoverBid ? 'font-bold text-lg flex text-center justify-center items-center my-2 px-12' : 'font-bold text-lg flex items-center gap-x-2 my-2 text-slate-500'}>{hoverBid ? "Bid" : nft.price} {hoverBid ? null : "CRI"}{hoverBid ? null : <img src='https://etherscan.io/token/images/cosmeta_32.png' className='object-cover w-6' />}</h1></Link>
                  </div>
                  </div>
                  <div className='flex justify-between items-center w-full gap-x-2'>
                    <CountdownWhite timestamp={nft.duration + '000'}/><span className='bg-red-600 font-bold px-5 py-1 flex justify-center items-center rounded-md animate-pulse'>LIVE</span>
                  </div>
                </div>
              </div>
                )}
              )}
            
            </Carousel>
            </Container>
            </div>
            </div>
  </div>
<div className='flex justify-center items-center'>
  <div className='flex justify-between w-full'>

  {/************* FILTER & CHAINS **********************/}
  <div className='flex-col mx-3 mt-16 mb-60 w-[350px] h-screen text-slate-400 bg-slate-900 rounded-xl border-2 border-slate-800'>

   <div className='flex justify-center items-center my-3 relative left-10'>
      {/*<ConnectChain/>*/}
    </div>

   <div className='border-[1px] border-slate-800'></div>
  <div className='flex justify-center'>
    <h1 className='text-lg font-bold my-3'>Filter</h1>
  </div>
<div className='grid gap-y-3'>
  {/* RESET */}
  <div className='flex-col mx-4'>
  <div className='bg-slate-800 rounded-lg w-full py-3 px-3 cursor-pointer' onClick={() => {setCheckImage(true),setCheckVideo(true),setCheckMusic(true),setLowCheckPrice(false),setHighCheckPrice(false),setVerifiedArtist(false),setVerifiedSeller(false),setEthereum(false),setPolygon(false),setBinance(false)}}>
  <span className='text-center font-bold antialiased flex justify-center items-center cursor-pointer' onClick={() => {setCheckImage(true),setCheckVideo(true),setCheckMusic(true),setLowCheckPrice(false),setHighCheckPrice(false),setVerifiedArtist(false),setVerifiedSeller(false),setEthereum(false),setPolygon(false),setBinance(false)}} >All</span>
  </div>
  </div>

  {/* PRICE */}
  <div className='flex-col mx-4'>
    <div className='bg-slate-800 rounded-lg w-full px-3 py-3 cursor-pointer' onClick={() => setOpenPrice(!openPrice)}>
    <h5 className='text-center font-bold antialiased flex justify-center items-center'>Price {!openPrice ?<MdKeyboardArrowDown size={28} className="relative left-[85px]"/>:<MdKeyboardArrowUp size={28} className="relative left-[85px]"/>}</h5>
    </div>
    {openPrice &&
      <div className='bg-slate-800 flex-col relative bottom-4 py-3 px-3 rounded-lg'>
      <div className='grid flex-col items-center my-3 gap-y-2'>
      <button type='button' className='rounded bg-slate-700 px-3 py-2 w-full flex items-center justify-center gap-x-3' onClick={() => {setLowCheckPrice(!lowprice),setHighCheckPrice(false),setVerifiedArtist(false),setVerifiedSeller(false),setEthereum(false),setPolygon(false),setBinance(false),setCheckVideo(false),setCheckMusic(false),setCheckImage(false)}} >{lowprice ? <AiFillCheckCircle size={18} className="text-blue-500"/>:<MdRadioButtonUnchecked size={18}/>}Low to High</button>
      <button type='button' className='rounded bg-slate-700 px-3 py-2 w-full flex items-center justify-center gap-x-3' onClick={() => {setHighCheckPrice(!highprice),setLowCheckPrice(false),setVerifiedArtist(false),setVerifiedSeller(false),setEthereum(false),setPolygon(false),setBinance(false),setCheckVideo(false),setCheckMusic(false),setCheckImage(false)}} >{highprice ? <AiFillCheckCircle size={18} className="text-blue-500"/>:<MdRadioButtonUnchecked size={18}/>}High to Low</button>
      </div>
      </div>
  }
  </div>

  {/* VERIFY */}
  <div className='flex-col mx-4'>
  <div className='bg-slate-800 rounded-lg w-full py-3 px-3 cursor-pointer' onClick={() => setOpenVerify(!openVerify)}>
  <h5 className='text-center font-bold antialiased flex justify-center items-center'>Verify {!openVerify ?<MdKeyboardArrowDown size={28} className="relative left-20"/>:<MdKeyboardArrowUp size={28} className="relative left-20"/>}</h5>
  </div>
  {openVerify &&
    <div className='bg-slate-800 rounded-lg relative bottom-4 py-3 px-3'>
    <div className='flex items-center gap-x-2 my-2 mx-2 cursor-pointer' onClick={() => {setVerifiedArtist(!verifiedartist),setVerifiedSeller(false),setEthereum(false),setPolygon(false),setBinance(false),setCheckVideo(false),setCheckMusic(false),setCheckImage(false),setLowCheckPrice(false),setHighCheckPrice(false)}}>
    <div className='flex items-center justify-center gap-x-2'>{verifiedartist ? <AiFillCheckCircle size={18} className="text-blue-500"/>:<MdRadioButtonUnchecked size={18}/>}</div><h5>Verified Artists</h5>
    </div>
    <div className='flex items-center gap-x-2 my-2 mx-2 cursor-pointer' onClick={() => {setVerifiedSeller(!verifiedseller),setVerifiedArtist(false),setEthereum(false),setPolygon(false),setBinance(false),setCheckVideo(false),setCheckMusic(false),setCheckImage(false),setLowCheckPrice(false),setHighCheckPrice(false)}}>
    <div className='flex items-center justify-center gap-x-2'>{verifiedseller ?<AiFillCheckCircle size={18} className="text-blue-500"/>:<MdRadioButtonUnchecked size={18}/>}</div><h5>Verified Sellers</h5>
    </div>
    </div>
  }
  </div>

  {/*NETWORK*/}
  <div className='flex-col mx-4'>
  <div className='bg-slate-800 rounded-lg w-full py-3 px-3 cursor-pointer' onClick={() => setOpenNetwork(!openNetwork)} >
  <h5 className='text-center font-bold antialiased flex justify-center items-center'>Networks {!openNetwork ?<MdKeyboardArrowDown size={28} className="relative left-[65px]"/>:<MdKeyboardArrowUp size={28} className="relative left-[65px]"/>}</h5>
  </div>
  {openNetwork &&
    <div className='bg-slate-800 relative bottom-4 rounded-lg py-3 px-3'>  
    <div className='flex items-center gap-x-2 my-2 mx-2 cursor-pointer' onClick={() => {setEthereum(!eth),setVerifiedArtist(false),setVerifiedSeller(false),setPolygon(false),setBinance(false),setCheckVideo(false),setCheckMusic(false),setCheckImage(false)}}>
    <div className='flex items-center justify-center gap-x-2'>{eth ?<AiFillCheckCircle size={18} className="text-blue-500"/>:<MdRadioButtonUnchecked size={18}/>}</div><h5>Ethereum</h5>
    </div>
    <div className='flex items-center gap-x-2 my-2 mx-2 cursor-pointer' onClick={() => {setPolygon(!poly),setVerifiedArtist(false),setVerifiedSeller(false),setEthereum(false),setBinance(false),setCheckVideo(false),setCheckMusic(false),setCheckImage(false)}}>
    <div className='flex items-center justify-center gap-x-2'>{poly ?<AiFillCheckCircle size={18} className="text-blue-500"/>:<MdRadioButtonUnchecked size={18}/>}</div><h5>Polygon</h5>
    </div>
    <div className='flex items-center gap-x-2 my-2 mx-2 cursor-pointer' onClick={() => {setBinance(!bsc),setVerifiedArtist(false),setVerifiedSeller(false),setEthereum(false),setPolygon(false),setCheckVideo(false),setCheckMusic(false),setCheckImage(false)}}>
    <div className='flex items-center justify-center gap-x-2'>{bsc ?<AiFillCheckCircle size={18} className="text-blue-500"/>:<MdRadioButtonUnchecked size={18}/>}</div><h5>Binance</h5>
    </div>
    </div>
  }
  </div>

  {/*IMAGE,VIDEO,MUSIC*/}
  <div className='flex-col mx-4'>
  <div className='bg-slate-800 rounded-lg w-full py-3 px-3 cursor-pointer' onClick={() => setOpenNft(!openNft)}>
  <h5 className='text-center font-bold antialiased flex justify-center items-center'>NFT's {!openNft ?<MdKeyboardArrowDown size={28} className="relative left-20"/>:<MdKeyboardArrowUp size={28} className="relative left-20"/>}</h5>
  </div>
  {openNft &&
    <div className='bg-slate-800 relative bottom-3 py-3 px-3 rounded-lg'>
    <div className='flex items-center gap-x-2 my-2 mx-2 cursor-pointer' onClick={() => {setCheckImage(!checkImage),setVerifiedArtist(false),setVerifiedSeller(false),setEthereum(false),setPolygon(false),setBinance(false),setCheckVideo(false),setCheckMusic(false)}}>
    <div className='flex items-center justify-center gap-x-2'>{checkImage ?<AiFillCheckCircle size={18} className="text-blue-500"/>:<MdRadioButtonUnchecked size={18}/>}</div><h5>Image</h5>
    </div>
    <div className='flex items-center gap-x-2 my-2 mx-2 cursor-pointer' onClick={() => {setCheckVideo(!checkVideo),setVerifiedArtist(false),setVerifiedSeller(false),setEthereum(false),setPolygon(false),setBinance(false),setCheckImage(false),setCheckMusic(false)}}>
    <div className='flex items-center justify-center gap-x-2'>{checkVideo ?<AiFillCheckCircle size={18} className="text-blue-500"/>:<MdRadioButtonUnchecked size={18}/>}</div><h5>Video</h5>
    </div>
    <div className='flex items-center gap-x-2 my-2 mx-2 cursor-pointer' onClick={() => {setCheckMusic(!checkMusic),setVerifiedArtist(false),setVerifiedSeller(false),setEthereum(false),setPolygon(false),setBinance(false),setCheckVideo(false),setCheckImage(false)}}>
    <div className='flex items-center justify-center gap-x-2'>{checkMusic ?<AiFillCheckCircle size={18} className="text-blue-500"/>:<MdRadioButtonUnchecked size={18}/>}</div><h5>Music</h5>
    </div>
    </div>
  }
  </div>

</div>
  </div>
  
  {/***************** NFTs ****************************/}
<div className='flex-col justify-end items-center w-full'>

<div className='flex justify-center items-center my-10'>
    <div className='flex-col'>
  
      <div className='flex py-3 px-10 bg-gradient-to-t to-slate-900 from-transparent rounded-xl justify-center items-center mt-7 mb-10 gap-x-1'>
        <div className='flex justify-center items-center gap-x-5 z-[998]'>
          <h3 className={lanft ? 'text-blue-500 border-b-2 border-blue-500 text-xl p-1 cursor-pointer':'p-1 text-slate-400 text-xl cursor-pointer hover:border-b-2 hover:border-slate-400'} onClick={() => {setLaNft(true),setLaAuc(false)}}>Latest NFT's</h3><span className='text-3xl font-thin text-slate-400'>|</span><h3 className={laauc ? 'text-blue-500 text-xl border-b-2 border-blue-500 p-1 cursor-pointer':'p-1 text-slate-400 text-xl cursor-pointer hover:border-b-2 hover:border-slate-400'} onClick={() => {setLaAuc(true),setLaNft(false)}}>Latest Auctions</h3>
        </div>
      </div>
{laauc ? (
<div className='pb-60'>
<div className='grid grid-cols-2 gap-3'>
{datas.filter(u => u.live == true).reverse().map((nft) => (
  <NFTsAucComponent auth={auth} nft={nft} duration={nft.duration} buyNewMum={buyNewMum}/>
))}
</div>
  
{/*LIVE*/}

{/*<LiveAuctionNftCard />*/}

{/*ALL AUCTION*/}

{/*<AllAuctionNftCard />*/}

</div>
) : null}

{lanft ? (
<div className='pb-60'>

<InfiniteScroll
  className=''
  dataLength={datas.length} //This is important field to render the next data
  next={() => setCount(count + 5)}
  hasMore={true}
  loader={<Loading/>}
  endMessage={
    <p className='my-5 text-xl font-thin text-center'>
    <b>You have seen it all</b>
    </p>
  }
  >
<div className='grid grid-cols-2 gap-3'>
{datas.filter(u => !u.duration).reverse().map((nft) => (
  <NFTsComponent nft={nft} auth={auth} buyNewMum={buyNewMum} />
))}
</div>
</InfiniteScroll>
</div>
) : null}
    </div>
  </div>

</div>

  </div>
</div>{/***** FILTERS & NFTs END *****/}


{/*** BODY END ****/}
</div>
      </Fragment>
//***************** END MEDIUM ******************************
    }

    {matches.large &&
//******************** MEDIUM *******************************
      <Fragment>
      <Head>
      <title>Home • Cosmeta NFT Marketplace</title>
      </Head>
    {loginmodal ? <Loginmodal setLoginModal={setLoginModal}/> : null }
    {process ? <Process/> : null}
    
      <div className="w-full welcomebg antialiased">
      <div className='z-0 w-full h-full overflow-hidden object-cover flex justify-center items-center'>
    {/*<Image src={welcome} alt="Welcome" className='w-screen h-screen absolute object-cover mix-blend-overlay'/>*/}
    <div className='white-glassmorphism w-11/12 h-[812px] absolute object-cover top-20 z-0'>&nbsp;</div>
      </div>

      <div className='p-40'>
      <div className='flex justify-between items-center w-full z-10'>
      <div className='flex-col grid justify-start items-center w-full'>
      <Container xs css={{marginBottom:'$3'}}>
          <Carousel
            additionalTransfrom={0}
            autoPlaySpeed={5000}
            autoPlay={true}
            centerMode={false}
            className="overflow-hidden"
            containerClass="container-padding-bottom"
            dotListClass=""
            draggable={true}
            focusOnSelect={false}
            itemClass=""
            minimumTouchDrag={80}
            pauseOnHover
            renderArrowsWhenDisabled={false}
            renderButtonGroupOutside={false}
            renderDotsOutside={false}
            rewind={false}
            rewindWithAnimation={true}
            rtl={false}
            shouldResetAutoplay
            showDots={false}
            sliderClass=""
            slidesToSlide={1}
            swipeable={true}
            responsive={responsive}
            ssr={true}
            infinite={true}
            keyBoardControl={true}
            transitionDuration={4000}
            removeArrowOnDeviceType={["tablet", "mobile","desktop"]}>
        <div className="flex-col justify-start items-center w-full px-28">
          <Text  h1 weight="bold" size={100} css={{textGradient: "45deg, $yellow600 -20%, $purple600 50%"}} className="w-[750px] relative">Discover</Text>
          <Text  h1 weight="bold" size={45} css={{textGradient: "45deg, $purple600 20%, $yellow500 50%",}} className="w-[750px] relative bottom-7 left-2">The latest lived Legend</Text>
          <Text  h1 weight="bold" size={165} css={{textGradient: "45deg, $yellow500 20%, $red600 50%"}} className="w-[750px] relative bottom-24">NFTs</Text>
        </div>
        <div className='flex-col justify-start items-center w-full mt-20'>
            <h3 className='text-slate-50 text-5xl font-bold inset-3 -skew-y-3 py-4 my-3 px-4 bg-gradient-to-tl to-pink-500 from-purple-500 w-[535px]'>Create and Sell your NFT</h3>
            <p className='text-slate-50 text-6xl font-light'>in the Marketplace</p>
        </div>
        </Carousel>
        </Container>
        <div className='flex justify-between z-10 items-center w-full p-5 rounded-xl white-glassmorphism '>

          <div className='flex-col justify-start items-center '>
          <div className='text-4xl font-bold py-2 text-green-500'>
          <TypewriterComponent
          options={{
            autoStart:true,
            loop:true
          }}
          onInit={(typewriter) => {
            typewriter.typeString("Discover")
            .pauseFor(1500)
            .deleteAll()
            .start();
          }}
          />
          </div>
          <div className='text-sm text-justify mt-2 text-slate-400'>
Buy / Sell wonderful NFTs. Chat live with hundreds of thousands of artists or buyers. Ask your friends for likes and comments on your NFTs. Moreover, 10% artist royalty is waiting for you. More features like this are waiting for you in the world of Cosmeta NFT Marketplace.

          </div>
          </div>
          <div className='flex justify-end items-center w-full pr-4'>
            <IoIosArrowDroprightCircle size={90} className='text-green-500 cursor-pointer hover:text-green-400'/>
          </div>
        </div>
        
      </div>
        <div className='flex justify-end items-center w-full'>
          <Container xs css={{marginBottom:'$3'}}>
          <Carousel
            additionalTransfrom={0}
            autoPlaySpeed={3000}
            autoPlay={true}
            centerMode={false}
            className="overflow-hidden"
            containerClass="container-padding-bottom"
            customRightArrow={<CustomRightArrow />}
            customLeftArrow={<CustomLeftArrow />}
            dotListClass=""
            draggable={true}
            focusOnSelect={false}
            itemClass=""
            minimumTouchDrag={80}
            pauseOnHover
            renderArrowsWhenDisabled={false}
            renderButtonGroupOutside
            renderDotsOutside={false}
            rewind={false}
            rewindWithAnimation={false}
            rtl={false}
            shouldResetAutoplay
            showDots={false}
            sliderClass=""
            slidesToSlide={1}
            swipeable
            responsive={responsive}
            ssr={true}
            infinite={true}
            keyBoardControl={true}
            transitionDuration={800}
            removeArrowOnDeviceType={["tablet", "mobile"]}>
            {datas.filter(i => i.live == true && i.duration + "000" > Date.now()).reverse().map((nft) => {
              
              return (
              <div key={Math.random()}>
              {nft.fileType == 'video/mp4'
              ? <video src={nft.images} className="w-[450px] h-[393px] mt-12 ml-12 bg-transparent rounded-xl object-cover" autoPlay muted loop/>
              : nft.fileType == 'image/png' || nft.fileType == 'image/jpeg'  || nft.fileType == 'image/jpg' || nft.fileType == 'image/webp'   ? <img src={nft.images} className="w-[450px] h-[393px] object-cover ml-12 bg-transparent rounded-xl" />
              : nft.fileType == 'audio/mp3' || nft.fileType == 'audio/wav' || nft.fileType == 'audio/ogg' || 'audio/mpeg' ? <AudioPlayer nft={nft.images} nftname={nft.name}/> : null
              }
              <div className='relative bottom-24 left-20 bg-slate-50 px-3 pb-3 rounded-xl opacity-90 w-96'>
                <div className='flex justify-between items-center'>
                    <div className='flex-col justify-start items-center p-2'>
                        <h1 className='text-lg font-bold text-slate-800'>{nft.name}</h1>
                        <h1 className='text-lg font-bold text-purple-500 flex items-center gap-x-1'>{nft.avatar ? <img src={nft.avatar} className="rounded-full w-3 mr-1"/>:null}{!nft.username == "" ? nft.username : user.slice(0,11) + '...'} {nft.verified == 'verified' ? <MdVerified size={18}/>: null}</h1>
                    </div>
                  <div onMouseOver={() => setHoverBid(true)} onMouseOut={() => setHoverBid(false)} className={hoverBid ? 'flex cursor-pointer bg-gradient-to-tr to-yellow-500 from-orange-600 text-center justify-center items-center px-7 rounded-md font-bold text-slate-600 w-28' : 'flex justify-end items-center px-3 rounded-md font-bold text-slate-600 bg-slate-300 w-38'}>
                    <Link href={`/placebid/${nft.id}`}><h1 className={hoverBid ? 'font-bold text-lg flex text-center justify-center items-center my-2 px-12' : 'font-bold text-lg flex items-center gap-x-2 my-2 text-slate-500'}>{hoverBid ? "Bid" : nft.price} {hoverBid ? null : "CRI"}{hoverBid ? null : <img src='https://etherscan.io/token/images/cosmeta_32.png' className='object-cover w-6' />}</h1></Link>
                  </div>
                  </div>
                  <div className='flex justify-between items-center w-full gap-x-2'>
                    <CountdownWhite timestamp={nft.duration + '000'}/><span className='bg-red-600 font-bold px-5 py-1 flex justify-center items-center rounded-md animate-pulse'>LIVE</span>
                  </div>
                </div>
              </div>
                )}
              )}
            <CustomLeftArrow/><CustomRightArrow />
            </Carousel>
            </Container>
            </div>
            </div>
      </div>
<div className='flex justify-center items-center py-32'>
  <div className='flex justify-between w-full'>

  {/************* FILTER & CHAINS **********************/}
  <div className='flex-col mx-3 mt-16 mb-60 w-[350px] h-screen text-slate-400 bg-slate-900 rounded-xl border-2 border-slate-800'>

   <div className='flex justify-center items-center my-3 relative left-10'>
      {/*<ConnectChain/>*/}
    </div>

   <div className='border-[1px] border-slate-800'></div>
  <div className='flex justify-center'>
    <h1 className='text-lg font-bold my-3'>Filter</h1>
  </div>
<div className='grid gap-y-3'>
  {/* RESET */}
  <div className='flex-col mx-4'>
  <div className='bg-slate-800 rounded-lg w-full py-3 px-3 cursor-pointer' onClick={() => {setCheckImage(true),setCheckVideo(true),setCheckMusic(true),setLowCheckPrice(false),setHighCheckPrice(false),setVerifiedArtist(false),setVerifiedSeller(false),setEthereum(false),setPolygon(false),setBinance(false)}}>
  <span className='text-center font-bold antialiased flex justify-center items-center cursor-pointer' onClick={() => {setCheckImage(true),setCheckVideo(true),setCheckMusic(true),setLowCheckPrice(false),setHighCheckPrice(false),setVerifiedArtist(false),setVerifiedSeller(false),setEthereum(false),setPolygon(false),setBinance(false)}} >All</span>
  </div>
  </div>

  {/* PRICE */}
  <div className='flex-col mx-4'>
    <div className='bg-slate-800 rounded-lg w-full px-3 py-3 cursor-pointer' onClick={() => setOpenPrice(!openPrice)}>
    <h5 className='text-center font-bold antialiased flex justify-center items-center'>Price {!openPrice ?<MdKeyboardArrowDown size={28} className="relative left-[85px]"/>:<MdKeyboardArrowUp size={28} className="relative left-[85px]"/>}</h5>
    </div>
    {openPrice &&
      <div className='bg-slate-800 flex-col relative bottom-4 py-3 px-3 rounded-lg'>
      <div className='grid flex-col items-center my-3 gap-y-2'>
      <button type='button' className='rounded bg-slate-700 px-3 py-2 w-full flex items-center justify-center gap-x-3' onClick={() => {setLowCheckPrice(!lowprice),setHighCheckPrice(false),setVerifiedArtist(false),setVerifiedSeller(false),setEthereum(false),setPolygon(false),setBinance(false),setCheckVideo(false),setCheckMusic(false),setCheckImage(false)}} >{lowprice ? <AiFillCheckCircle size={18} className="text-blue-500"/>:<MdRadioButtonUnchecked size={18}/>}Low to High</button>
      <button type='button' className='rounded bg-slate-700 px-3 py-2 w-full flex items-center justify-center gap-x-3' onClick={() => {setHighCheckPrice(!highprice),setLowCheckPrice(false),setVerifiedArtist(false),setVerifiedSeller(false),setEthereum(false),setPolygon(false),setBinance(false),setCheckVideo(false),setCheckMusic(false),setCheckImage(false)}} >{highprice ? <AiFillCheckCircle size={18} className="text-blue-500"/>:<MdRadioButtonUnchecked size={18}/>}High to Low</button>
      </div>
      </div>
  }
  </div>

  {/* VERIFY */}
  <div className='flex-col mx-4'>
  <div className='bg-slate-800 rounded-lg w-full py-3 px-3 cursor-pointer' onClick={() => setOpenVerify(!openVerify)}>
  <h5 className='text-center font-bold antialiased flex justify-center items-center'>Verify {!openVerify ?<MdKeyboardArrowDown size={28} className="relative left-20"/>:<MdKeyboardArrowUp size={28} className="relative left-20"/>}</h5>
  </div>
  {openVerify &&
    <div className='bg-slate-800 rounded-lg relative bottom-4 py-3 px-3'>
    <div className='flex items-center gap-x-2 my-2 mx-2 cursor-pointer' onClick={() => {setVerifiedArtist(!verifiedartist),setVerifiedSeller(false),setEthereum(false),setPolygon(false),setBinance(false),setCheckVideo(false),setCheckMusic(false),setCheckImage(false),setLowCheckPrice(false),setHighCheckPrice(false)}}>
    <div className='flex items-center justify-center gap-x-2'>{verifiedartist ? <AiFillCheckCircle size={18} className="text-blue-500"/>:<MdRadioButtonUnchecked size={18}/>}</div><h5>Verified Artists</h5>
    </div>
    <div className='flex items-center gap-x-2 my-2 mx-2 cursor-pointer' onClick={() => {setVerifiedSeller(!verifiedseller),setVerifiedArtist(false),setEthereum(false),setPolygon(false),setBinance(false),setCheckVideo(false),setCheckMusic(false),setCheckImage(false),setLowCheckPrice(false),setHighCheckPrice(false)}}>
    <div className='flex items-center justify-center gap-x-2'>{verifiedseller ?<AiFillCheckCircle size={18} className="text-blue-500"/>:<MdRadioButtonUnchecked size={18}/>}</div><h5>Verified Sellers</h5>
    </div>
    </div>
  }
  </div>

  {/*NETWORK*/}
  <div className='flex-col mx-4'>
  <div className='bg-slate-800 rounded-lg w-full py-3 px-3 cursor-pointer' onClick={() => setOpenNetwork(!openNetwork)} >
  <h5 className='text-center font-bold antialiased flex justify-center items-center'>Networks {!openNetwork ?<MdKeyboardArrowDown size={28} className="relative left-[65px]"/>:<MdKeyboardArrowUp size={28} className="relative left-[65px]"/>}</h5>
  </div>
  {openNetwork &&
    <div className='bg-slate-800 relative bottom-4 rounded-lg py-3 px-3'>  
    <div className='flex items-center gap-x-2 my-2 mx-2 cursor-pointer' onClick={() => {setEthereum(!eth),setVerifiedArtist(false),setVerifiedSeller(false),setPolygon(false),setBinance(false),setCheckVideo(false),setCheckMusic(false),setCheckImage(false)}}>
    <div className='flex items-center justify-center gap-x-2'>{eth ?<AiFillCheckCircle size={18} className="text-blue-500"/>:<MdRadioButtonUnchecked size={18}/>}</div><h5>Ethereum</h5>
    </div>
    <div className='flex items-center gap-x-2 my-2 mx-2 cursor-pointer' onClick={() => {setPolygon(!poly),setVerifiedArtist(false),setVerifiedSeller(false),setEthereum(false),setBinance(false),setCheckVideo(false),setCheckMusic(false),setCheckImage(false)}}>
    <div className='flex items-center justify-center gap-x-2'>{poly ?<AiFillCheckCircle size={18} className="text-blue-500"/>:<MdRadioButtonUnchecked size={18}/>}</div><h5>Polygon</h5>
    </div>
    <div className='flex items-center gap-x-2 my-2 mx-2 cursor-pointer' onClick={() => {setBinance(!bsc),setVerifiedArtist(false),setVerifiedSeller(false),setEthereum(false),setPolygon(false),setCheckVideo(false),setCheckMusic(false),setCheckImage(false)}}>
    <div className='flex items-center justify-center gap-x-2'>{bsc ?<AiFillCheckCircle size={18} className="text-blue-500"/>:<MdRadioButtonUnchecked size={18}/>}</div><h5>Binance</h5>
    </div>
    </div>
  }
  </div>

  {/*IMAGE,VIDEO,MUSIC*/}
  <div className='flex-col mx-4'>
  <div className='bg-slate-800 rounded-lg w-full py-3 px-3 cursor-pointer' onClick={() => setOpenNft(!openNft)}>
  <h5 className='text-center font-bold antialiased flex justify-center items-center'>NFT's {!openNft ?<MdKeyboardArrowDown size={28} className="relative left-20"/>:<MdKeyboardArrowUp size={28} className="relative left-20"/>}</h5>
  </div>
  {openNft &&
    <div className='bg-slate-800 relative bottom-3 py-3 px-3 rounded-lg'>
    <div className='flex items-center gap-x-2 my-2 mx-2 cursor-pointer' onClick={() => {setCheckImage(!checkImage),setVerifiedArtist(false),setVerifiedSeller(false),setEthereum(false),setPolygon(false),setBinance(false),setCheckVideo(false),setCheckMusic(false)}}>
    <div className='flex items-center justify-center gap-x-2'>{checkImage ?<AiFillCheckCircle size={18} className="text-blue-500"/>:<MdRadioButtonUnchecked size={18}/>}</div><h5>Image</h5>
    </div>
    <div className='flex items-center gap-x-2 my-2 mx-2 cursor-pointer' onClick={() => {setCheckVideo(!checkVideo),setVerifiedArtist(false),setVerifiedSeller(false),setEthereum(false),setPolygon(false),setBinance(false),setCheckImage(false),setCheckMusic(false)}}>
    <div className='flex items-center justify-center gap-x-2'>{checkVideo ?<AiFillCheckCircle size={18} className="text-blue-500"/>:<MdRadioButtonUnchecked size={18}/>}</div><h5>Video</h5>
    </div>
    <div className='flex items-center gap-x-2 my-2 mx-2 cursor-pointer' onClick={() => {setCheckMusic(!checkMusic),setVerifiedArtist(false),setVerifiedSeller(false),setEthereum(false),setPolygon(false),setBinance(false),setCheckVideo(false),setCheckImage(false)}}>
    <div className='flex items-center justify-center gap-x-2'>{checkMusic ?<AiFillCheckCircle size={18} className="text-blue-500"/>:<MdRadioButtonUnchecked size={18}/>}</div><h5>Music</h5>
    </div>
    </div>
  }
  </div>

</div>
  </div>
  
  {/***************** NFTs ****************************/}
<div className='flex-col justify-end items-center w-full'>

<div className='flex justify-center items-center my-10'>
    <div className='flex-col'>
  
      <div className='flex py-3 px-10 bg-gradient-to-t to-slate-900 from-transparent rounded-xl justify-center items-center mt-7 mb-10 gap-x-1'>
        <div className='flex justify-center items-center gap-x-5 z-[998]'>
          <h3 className={lanft ? 'text-blue-500 border-b-2 border-blue-500 text-xl p-1 cursor-pointer':'p-1 text-slate-400 text-xl cursor-pointer hover:border-b-2 hover:border-slate-400'} onClick={() => {setLaNft(true),setLaAuc(false)}}>Latest NFT's</h3><span className='text-3xl font-thin text-slate-400'>|</span><h3 className={laauc ? 'text-blue-500 text-xl border-b-2 border-blue-500 p-1 cursor-pointer':'p-1 text-slate-400 text-xl cursor-pointer hover:border-b-2 hover:border-slate-400'} onClick={() => {setLaAuc(true),setLaNft(false)}}>Latest Auctions</h3>
        </div>
      </div>
{laauc ? (
<div className='pb-60'>
  
{/*LIVE*/}
<div className='grid grid-cols-5 gap-5'>
{datas.filter(u => u.live == true && u.duration + "000" > Date.now()).reverse().map((nft) => (
  <NFTsAucComponent auth={auth} nft={nft} duration={nft.duration} buyNewMum={buyNewMum}/>
))}
</div>
{/*<LiveAuctionNftCard />*/}

{/*ALL AUCTION*/}

{/*<AllAuctionNftCard />*/}


</div>
) : null}

{lanft ? (
<div className='pb-60'>

<div className='grid grid-cols-5 gap-3'>
{datas.filter(u => !u.duration && u.sold == false).reverse().map((nft) => (
  <NFTsComponent nft={nft} auth={auth} buyNewMum={buyNewMum} />
))}
</div>
<InfiniteScroll
  className=''
  dataLength={datas.length} //This is important field to render the next data
  next={() => setCount(count + 5)}
  hasMore={true}
  loader={<Loading/>}
  endMessage={
    <p className='my-5 text-xl font-thin text-center'>
    <b>You have seen it all</b>
    </p>
  }
  >
  <div className='container wrapper my-2 ease-linear transition-all grid grid-cols-5 gap-4'>
  {!datas.length ? (
    <PreLoader/> ) : 
      null

  } 
    {/***************************************** ETHEREUM NFTS ***********************************************************/}
    </div>
  
</InfiniteScroll>
</div>
) : null}
    </div>
  </div>

</div>

  </div>
</div>{/***** FILTERS & NFTs END *****/}


{/*** BODY END ****/}
</div>
      </Fragment>
//***************** END MEDIUM ******************************
    }
    </Fragment>
)}
</Media>
</div>

  )
}

export default Home;
