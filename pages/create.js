/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React from "react";
import {useState,useEffect,useContext, Fragment} from 'react';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import Web3Modal from "web3modal";
import NFT from '../engine/NFT.json';
import Auction from '../engine/Auction.json';
import Market from '../engine/Market.json';
import Token from '../engine/Token.json';
import { hhnft, hhmarket,hhtoken, sepauction, sepmarket } from '../engine/configuration';
//import { sepnft, sepmarket,septoken } from '../engine/configuration';
//import { goenft, goemarket,goetoken } from '../engine/configuration';
//import { bsctnft, bsctmarket,bsctoken } from '../engine/configuration';
import { Button, Input } from '@nextui-org/react';
import { client } from '../engine/configuration';
import { useStateContext } from '../context/StateContext';
import detectEthereumProvider from '@metamask/detect-provider';
import {MdKeyboardArrowDown,MdKeyboardArrowUp,MdVerified} from 'react-icons/md'
import jwt from 'jsonwebtoken';
import { DataContext } from '../store/GlobalState';
import uniqid from 'uniqid';
import logo from '../public/logo.png';
import {AiFillPlayCircle,AiFillBackward,AiFillForward,AiFillPauseCircle,AiOutlineLoading3Quarters} from 'react-icons/ai'
import { BiTrash } from 'react-icons/bi'
import styles from '../styles/AudioPlayer.module.css'
import { AudioPlayer } from '../components';
import Media from 'react-media';
import { postData } from "@/utils/fetchData";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import axios from "axios";
import Process from "@/components/Process";
import { toast } from "react-toastify";
import Head from 'next/head';

 const CreateMarket = () => {


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
      setNftCustom,
      setTokenCol,
      setNftCol,
      setMarket,
      auction,
      getAuction,
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
      owners,setOwners
    } = useStateContext();
    const [fileUrl, setFileUrl] = useState(null)
    //const [nftcontract, getNft] = useState([])
    //const [cri,setTokenCri] = useState([])
    //const [market, getMarket] = useState([])
    const [fileType,setFileType] = useState(null);
    const [formInput, updateFormInput] = useState({ price: '', name: '', description: '',website:'' })
    const [loading,setLoading] = useState(false);
    const [openNetwork,setOpenNetwork] = useState(false);
    const [activeEth,setEth] = useState(false);
    const [activeMtc,setMtc] = useState(false);
    const [activeBsc,setBsc] = useState(false);
    const [wichNet,setNet] = useState("Ethereum");
    const [process,setProcess] = useState(false);
    const [detoken,setToken] = useState(null);
    const [openPreview,setOpenPreview] = useState(false)
    const [openAuction,setOpenAuction] = useState(false)
    const [openNFT,setOpenNft] = useState(true)
    const [uid,setUid] = useState(null);
    const [datas,setDatas] = useState([]);
    const [selectedAddress,setAddress] = useState('')
    const [nftitem,setNFTItem] = useState([])
    const [properties, setProperties] = useState([{trait_type: '', value: ''}]);

    const handleAddProperty = () => {
      setProperties([...properties, {trait_type: '', value: ''}]);
    }

    const handleDeleteProperty = (index) => {
      const newProperties = [...properties];
      newProperties.splice(index, 1);
      setProperties(newProperties);
    }

    const {state,dispatch} = useContext(DataContext)
    const {auth} = state

    const router = useRouter();

    useEffect(() => {

      const token = Cookies.get('refreshtoken');
      const decodedToken = jwt.decode(token);
      const expr = decodedToken?.exp * 1000 > Date.now()

      if (!token || token == undefined || !expr) {
        router.push('/login');
      }
    }, [auth.user, router]);

    useEffect(() => {
      // window.addEventListener('load', async () => {
      //   try {
      //              await ethereum.enable();
      //          } catch (error) {}
      //   });
      setAddress(window?.ethereum?.selectedAddress)
      setNftCustom()
      setTokenCol()
      setNftCol()
      setMarket()
      setRpc()
      setUid(uniqid())
      //setTokenCol();
    },[getUser,
      //getMarket,
      //getNft, 
      //setTokenCol
    ])

    const subdomain = "https://cosmeta.infura-ipfs.io";

    async function onChange(e) {
        setLoading(true);
        setFileType(e.target.files[0].type);
        const file = e.target.files[0]
        try {
            const added = await client.add(
                file,
                {
                    progress: (prog) => console.log("",/*received: ${prog}*/)
                }
            )
            const url = `${subdomain}/ipfs/${added.path}`;
            setFileUrl(url)
        } catch (error) {
            console.log('Error uploading file: ', error)
        }
        setLoading(false);
    }

    async function createMarket() {
        setProcess(true);
        const { name, description, price,website } = formInput
        if (!name || !description || !price || !fileUrl) return
        const data = JSON.stringify({
            name:name, description:description, image: fileUrl, external_url:website, traits:[...properties],
        })

        try {
            const added = await client.add(data)
            const url = `${subdomain}/ipfs/${added.path}`;
            
            //console.log(datas);
            createNFT(url)
        } catch (error) {
            setProcess(false)
        }
    }

    async function createAuctionMarket() {
      setProcess(true);
      const { name, description, price, website } = formInput
      if (!name || !description || !price || !fileUrl) return
      const data = JSON.stringify({
        name:name, description:description, image: fileUrl, external_url:website, traits:[...properties],
      })
      try {
          const added = await client.add(data)
          const url = `${subdomain}/ipfs/${added.path}`;
          
          //console.log(datas);
          createAuctionNFT(url)

      } catch (error) {
          setProcess(false)
      }
    }

    // async function setTokenCol(){
    //   var hh = "0x7a69";
    //   var goe = "0x5";
    //   var mm = "0x13881";
    //   var bsct = "0x61";
    //   const connected = await detectEthereumProvider();
    //   if (connected.chainId == hh) {
    //     var cri = hhtoken
    //   }
    //   else if (connected.chainId == goe) {
    //     var cri = goetoken
    //   }
    //   else if (connected.chainId == mm) {
    //     var cri = septoken
    //   }
    //   else if (connected.chainId == bsct) {
    //     var cri = bsctoken
    //   }
    //   setTokenCri(cri);
    //   //console.log(mainnet)
    //   setNft();
    // }

    // async function setNft(){
    //   const web3Modal = new Web3Modal()
    //   await web3Modal.connect();
    //   var hh = "0x7a69";
    //   var goe = "0x5";
    //   var mm = "0x13881";
    //   var bsct = "0x61";
    //   const connected = await detectEthereumProvider();
    //   if (connected.chainId == hh) {
    //     var nftcontract = hhnft
    //   }
    //   else if (connected.chainId == goe) {
    //     var nftcontract = goenft
    //   }
    //   else if (connected.chainId == mm) {
    //     var nftcontract = sepnft
    //   }
    //   else if (connected.chainId == bsct) {
    //     var nftcontract = bsctnft
    //   }
    //   getNft(nftcontract);
    //   //console.log(nftcontract)
    //   setMarket();
    // }

    // async function setMarket(){
    //   var hh = "0x7a69";
    //   var goe = "0x5";
    //   var mm = "0x13881";
    //   var bsct = "0x61";
    //   const connected = await detectEthereumProvider();
    //   if (connected.chainId == hh) {
    //     var market = hhmarket
    //   }
    //   else if (connected.chainId == goe) {
    //     var market = goemarket
    //   }
    //   else if (connected.chainId == mm) {
    //     var market = sepmarket
    //   }
    //   else if (connected.chainId == bsct) {
    //     var market = bsctmarket
    //   }
    //   getMarket(market);
    //   //console.log(market)
    // }

    async function createNFT(url) {
      try{
        if(user){

        //let amount = 999999999999999;
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        let cosmeta = new ethers.Contract(cri,Token,signer)
        const nft = new ethers.Contract(nftcustom, NFT, signer)
        const marketcontract = new ethers.Contract(marketcol, Market, signer)

        let nftcreate = await nft.createNFT(url)
        let txnft = await nftcreate.wait()
        let tokenId = txnft.events[0].args.tokenId.toNumber()

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

        await cosmeta.increaseAllowance(marketcol, ethers.utils.parseEther(listingFee.toString()))//ethers.utils.parseEther(listingFee.toString())
        let transaction = await marketcontract.createVaultItem(nftcustom, tokenId, price, {gasPrice:gasPrice,value: listingFee })
        let tx = await transaction.wait()
        let event = tx.events[4]
        let itemIds = event.args.itemId.toNumber()
        console.log("tx",tx);
        console.log("itemIds",itemIds);
        // console.log("value",value);
        // console.log("tokenId",tokenId);

        const nftdata = {
          id:uid,
          itemId:Number(itemIds),
          tokenId:tokenId,
          name:formInput.name,
          description:formInput.description,
          price:formInput.price,
          images:fileUrl,
          owner:selectedAddress,
          avatar:auth?.user?.avatar,
          role:auth?.user?.role,
          username:auth?.user?.username,
          createdWallet:selectedAddress,
          fileType:fileType,
          wichNet:wichNet,
          website:formInput.website,
          tokenURI:url,
          website:formInput.website,
          sold:false,
          traits:[...properties]
        }

        const res = await fetch("https://testmarket.cos-in.com/api/setnft", {
          method: "POST", // or 'PUT'
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(nftdata),
        });
        if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err} })
        dispatch({ type: 'NOTIFY', payload: {success: res.msg} })
        toast("NFT is Created!");

        setProcess(false);
        router.push(`/${auth.user.username}`);
      }else{
        connectUser()
      }
      }catch(err){
        setProcess(false)
        console.log(err);
      }
    }

    async function createAuctionNFT(url) {
      try{
        if(user){

        const {name,description} = formInput
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        let cosmeta = new ethers.Contract(cri,Token,signer)
        let nftauction = new ethers.Contract(auction,Auction, signer)
        let marketcontract = new ethers.Contract(marketcol, Market, signer)
        let nft = new ethers.Contract(nftcustom,NFT, signer)

        let listingFee = await nftauction.getListingPrice()
        listingFee = listingFee.toString()

        let nftcreate = await nft.createNFT(url)
        let tx = await nftcreate.wait()
        let tokenId = await nft._tokenIds()
        let event = tx.events[0]
        let value = event.args[2]
        let tokenIds = event.args.tokenId.toNumber()

        // console.log("tx",tx);
        // console.log("event",event);
        // console.log("value",value);
        // console.log("tokenId",tokenIds);
        // let tokenId = tokenIds.toString()
        // console.log("tokenId",tokenId)

        let price = new ethers.utils.parseUnits(formInput.price, 'ether')
        price = price.toString()

        let gasPrice = new ethers.utils.parseUnits('20', 'gwei')

        let approve = await cosmeta.approve(auction,listingFee)
        await approve.wait()

        await cosmeta.increaseAllowance(auction, ethers.utils.parseEther(listingFee.toString()))//ethers.utils.parseEther(listingFee.toString())
        let transaction = await nftauction.createAuction(nftcustom,tokenIds,name,description,fileUrl,price, {gasPrice:gasPrice,value:listingFee})
        let tx2 = await transaction.wait()
        let events2 = tx2.events[3]
        let transactionHash = tx2.transactionHash;
        let itemIds = events2.args.itemId.toNumber()
        // console.log("tx",transaction);
        // console.log("tx",tx2);
        // console.log("event",events2);
        // console.log("value",value2);
        // console.log("tokenId",tokenIds2);
        // console.log("itemId",itemIds);
        // console.log("transactionHash",transactionHash)


        const data = await nftauction.getAuction(tokenIds)
        // console.log("data",data)

        const nftdata = {
          id:uid,
          itemId:Number(itemIds),
          transactionHash:transactionHash,
          tokenId:Number(tokenId),
          name:formInput.name,
          description:formInput.description,
          price:formInput.price,
          images:fileUrl,
          avatar:auth?.user?.avatar,
          role:auth?.user?.role,
          username:auth?.user?.username,
          createdWallet:selectedAddress,
          fileType:fileType,
          wichNet:wichNet,
          website:formInput.website,
          tokenURI:url,
          seller: data.seller,
          owner: data.owner,
          winner: data.winner,
          sold:data.sold,
          live:data.live,
          biddable:data.biddable,
          bids:Number(data.bids),
          bidprice:Number(data.bidprice),
          duration:Number(data.duration),
          website:formInput.website,
          traits:[...properties]
        }
        // console.log("nftdata",nftdata)

        const res = await fetch("https://testmarket.cos-in.com/api/setnft", {
          method: "POST", // or 'PUT'
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(nftdata),
        });

        if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err} })
        dispatch({ type: 'NOTIFY', payload: {success: res.msg} })
        toast("Auction NFT is Created")
        setProcess(false);
        router.push(`/${auth.user.username}`);
      }else{
        connectUser()        
      }
      }catch(err){
        setProcess(false)
        console.log(err)
      }
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
          <title>Create an NFTs • Cosmeta NFT Marketplace</title>
          </Head>
          {process && <Process/>}
          <div className='flex-col justify-center items-center w-full white-glassmorphism px-3 pb-10'>
           <div className='flex-col justify-center items-center my-5 white-glassmorphism shadow-2xl shadow-slate-900 w-full'>
            <div className="flex justify-center items-center py-3">
              <div className="flex text-2xl antialiased gap-x-2"><strong>CREATE</strong>and<strong>SELL</strong></div>
            </div>
            <div className="flex justify-between items-center gap-x-2 pb-3 px-3 w-full">
            <div className="flex justify-start items-center">
            <div className="flex items-center rounded-full w-[150px] bg-deepdark">
            <button onClick={() => {setOpenAuction(false),setOpenNft(true)}} className={openNFT ? "shadow-lg shadow-green-900 rounded-full p-3 text-xs font-bold bg-green-600 text-green-950" : "rounded-full p-3 text-xs font-bold px-3 bg-deepdark "}>DEFAULT</button>
            <button onClick={() => {setOpenAuction(true),setOpenNft(false)}} className={openAuction ? "shadow-lg shadow-green-900 rounded-full p-3 text-xs font-bold bg-green-600 text-green-950" : "rounded-full p-3 text-xs font-bold px-3 bg-deepdark "}>AUCTION</button>
            </div>
            </div>
            <div className="flex justify-center items-center px-3 py-2 boxgradient gap-x-1 rounded-full text-xs"><strong>0.005</strong><img src='https://etherscan.io/token/images/cosmeta_32.png' className='object-cover w-5' title='Crypto International (CRI)' /> <span>CRI</span></div>
            </div>
           </div>
        
          <div className='flex-col justify-center items-center text-slate-400 rounded-3xl w-full white-glassmorphism shadow-xl shadow-slate-900 px-3'>

      
          {openNFT &&
          <div className='flex-col justify-center items-center w-full py-7'>
          <div className='flex-col justify-center items-center'>
            <div className='w-full'>
            <h1 className='text-lg font-bold flex items-center'>Upload to Image, Video and Audio<span className='text-[20px] flex mt-2 px-2 items-center text-red-600'>*</span></h1>
            <p className='text-sm mb-3'>File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV</p>
            
            <label className='w-full cursor-pointer flex h-52 justify-center items-center text-center border-2 rounded-lg border-dashed bg-slate-800 hover:bg-slate-900 border-slate-400 text-slate-400'>Upload
                <input
                  className='hidden absolute h-52 -left-96'
                  type="file"
                  name="Asset"
                  onChange={onChange}
                />
              </label>
            </div>
            <div className='flex-col items-center my-3'>
            <h1 className='text-lg font-bold flex items-center'>Name :<span className='text-[20px] mt-2 px-2 items-center text-red-600'>*</span></h1>
            <input
            tabIndex={1}
            type="text"
            className='w-full bg-slate-800 hover:bg-slate-900 py-2 px-3 rounded-lg border-2 border-slate-700 hover:border-blue-500'
            placeholder='NFT Name'
            onChange={e => updateFormInput({ ...formInput, name: e.target.value })}/>
            </div>
            <div className="flex-col items-center my-3">
            <h1 className='text-lg font-bold flex items-center my-2'>Description :</h1>
            <textarea
            tabIndex={2}
            className='w-full bg-slate-800 hover:bg-slate-900  border-slate-700 py-2 px-3 rounded-lg border-2 hover:border-blue-500'
            placeholder="NFT Description"
            onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
            />
            </div>
            <div className='flex-col my-3'>
            <h1 className='text-lg font-bold flex items-center my-2'>Price :<span className='text-[20px] mt-2 px-2 items-center text-red-600'>*</span></h1>
            <input
            tabIndex={3}
            type="number"
            className='w-full bg-slate-800 hover:bg-slate-900 border-2 border-slate-700 hover:border-blue-500 py-2 px-3 rounded-lg'
            placeholder="Price"
            onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
            />
            </div>
            <div className="my-3">
              <h1 className="text-lg font-bold flex items-center mt-4">Properties</h1>
              <p>Enter the properties of the nft you will create</p>
              <div className="flex-col items-center w-full">
                <div className="flex justify-between items-center w-full gap-x-3">
                <div className="flex-col">
                {properties.map((property, index) => (
                  <div key={index} className="flex gap-x-2 items-center justify-center">
                    <button onClick={() => handleDeleteProperty(index)} className="bg-red-500 h-[28px] rounded-md text-slate-900 hover:bg-red-900"><BiTrash size={22}/></button>
                    <input
                    className="w-full block bg-slate-800 my-2 hover:bg-slate-900 border-2 border-slate-700 hover:border-blue-500 py-2 px-3 rounded-lg"
                    value={property.trait_type}
                    placeholder="Property Type"
                    onChange={(event) => {
                      const newProperties = [...properties];
                      newProperties[index].trait_type = event.target.value;
                      setProperties(newProperties);
                    }}
                    />      
                    <input
                      className="w-full block bg-slate-800 my-2 hover:bg-slate-900 border-2 border-slate-700 hover:border-blue-500 py-2 px-3 rounded-lg"
                      value={property.value}
                      placeholder="Property Value"
                      onChange={(event) => {
                        const newProperties = [...properties];
                        newProperties[index].value = event.target.value;
                        setProperties(newProperties);
                      }}
                    />
                  </div>
                ))}
                </div>
                </div>
                <button onClick={handleAddProperty} className="bg-blue-500 hover:bg-blue-600 text-slate-900 px-5 py-1 my-3 rounded-md">Add More</button>
              </div>
            </div>
    {/*     <h1 className='text-lg font-bold flex items-center my-2'>Blockchain :<span className='text-[20px] mt-2 px-2 items-center text-red-600'>*</span></h1>
            <div className='mb-10 bg-slate-800 border-2 border-slate-700 rounded-lg w-96 py-3 px-3 cursor-pointer' onClick={() => setOpenNetwork(!openNetwork)} >
            <h5 className='text-center font-bold antialiased flex justify-center items-center'>{wichNet ? wichNet : "Blockchain"} {!openNetwork ?<MdKeyboardArrowDown size={28} className="relative right-0"/>:<MdKeyboardArrowUp size={28} className="relative right-0"/>}</h5>
            </div>
            {openNetwork &&
            <div className='my-3'>  
            <div className='flex items-center gap-x-2 my-2 mx-2'>
            <div className={!activeEth ? "rounded-full bg-slate-700 w-5 h-5 cursor-pointer" : 'rounded-full bg-blue-500 w-5 h-5 cursor-pointer'} onClick={() => {setEth(!activeEth),setNet("Ethereum"),setMtc(false),setBsc(false)}}>&nbsp;</div><h5 className={!activeEth ? "text-slate-400" : "text-blue-500"}>Ethereum</h5>
            </div>
            <div className='flex items-center gap-x-2 my-2 mx-2'>
            <div className={!activeMtc ? "rounded-full bg-slate-700 w-5 h-5 cursor-pointer" : 'rounded-full bg-blue-500 w-5 h-5 cursor-pointer'} onClick={() => {setMtc(!activeMtc),setNet("Polygon"),setEth(false),setBsc(false)}}>&nbsp;</div><h5 className={!activeMtc ? "text-slate-400" : "text-blue-500"}>Polygon</h5>
            </div>
            <div className='flex items-center gap-x-2 my-2 mx-2'>
            <div className={!activeBsc ? "rounded-full bg-slate-700 w-5 h-5 cursor-pointer" : 'rounded-full bg-blue-500 w-5 h-5 cursor-pointer'} onClick={() => {setBsc(!activeBsc),setNet("Binance"),setMtc(false),setEth(false)}}>&nbsp;</div><h5 className={!activeBsc ? "text-slate-400" : "text-blue-500"}>Binance</h5>
            </div>
            </div>
            }*/}
            <div className='flex-col mb-3'>
            <h1 className='text-lg font-bold flex items-center my-2'>Website Link :</h1>
            <p className='w-full text-sm mb-3'>Cosmeta will include a link to this URL on this item's detail page, so that users can click to learn more about it.</p>
            <input
            tabIndex={3}
            className='w-full bg-slate-800 hover:bg-slate-900 border-2 border-slate-700 hover:border-blue-500 py-2 px-3 rounded-lg'
            placeholder="https://"
            onChange={e => updateFormInput({ ...formInput, website: e.target.value })}
            />
            </div>
            <div className='flex justify-center items-center w-full mt-10 mb-10'>
            <button className='bg-gradient-to-tl to-purple-400 from-blue-500 text-slate-50 text-xl -skew-y-3 py-3 shadow-xl shadow-slate-900 mt-5 rounded-lg w-full' onClick={createMarket} >
            List your NFT!
            </button>
          </div>
          </div>   
          </div>
          }

          {openAuction &&
          <div className='flex justify-center items-center w-full py-7'>
          <div className='flex-col justify-center items-center'>
          <div className='w-full'>
          <h1 className='text-lg font-bold flex items-center'>Upload to Image, Video and Audio<span className='text-[20px] flex mt-2 px-2 items-center text-red-600'>*</span></h1>
          <p className='text-sm mb-3'>File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV</p>
          
          <label className='w-full cursor-pointer flex h-52 justify-center items-center text-center border-2 rounded-lg border-dashed bg-slate-800 hover:bg-slate-900 border-slate-400 text-slate-400'>Upload
              <input
                className='hidden absolute h-52 -left-96'
                type="file"
                name="Asset"
                onChange={onChange}
              />
            </label>
          </div>
          <div className='flex-col items-center my-3'>
          <h1 className='text-lg font-bold flex items-center'>Name :<span className='text-[20px] mt-2 px-2 items-center text-red-600'>*</span></h1>
          <input
          tabIndex={1}
          type="text"
          className='w-full bg-slate-800 hover:bg-slate-900 py-2 px-3 rounded-lg border-2 border-slate-700 hover:border-blue-500'
          placeholder='NFT Name'
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}/>
          </div>
          <div className="flex-col items-center my-3">
          <h1 className='text-lg font-bold flex items-center my-2'>Description :</h1>
          <textarea
          tabIndex={2}
          className='w-full bg-slate-800 hover:bg-slate-900  border-slate-700 py-2 px-3 rounded-lg border-2 hover:border-blue-500'
          placeholder="NFT Description"
          onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
          />
          </div>
          <div className='flex-col my-3'>
          <h1 className='text-lg font-bold flex items-center my-2'>Price :<span className='text-[20px] mt-2 px-2 items-center text-red-600'>*</span></h1>
          <input
          tabIndex={3}
          type="number"
          className='w-full bg-slate-800 hover:bg-slate-900 border-2 border-slate-700 hover:border-blue-500 py-2 px-3 rounded-lg'
          placeholder="Price"
          onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
          />
          </div>
          <div className="my-3">
          <h1 className="text-lg font-bold flex items-center mt-4">Properties</h1>
          <p>Enter the properties of the nft you will create</p>
          <div className="flex-col items-center w-full">
            <div className="flex justify-between items-center w-full gap-x-3">
            <div className="flex-col">
            {properties.map((property, index) => (
              <div key={index} className="flex gap-x-2 items-center justify-center">
                <button onClick={() => handleDeleteProperty(index)} className="bg-red-500 h-[28px] rounded-md text-slate-900 hover:bg-red-900"><BiTrash size={22}/></button>
                <input
                className="w-full block bg-slate-800 my-2 hover:bg-slate-900 border-2 border-slate-700 hover:border-blue-500 py-2 px-3 rounded-lg"
                value={property.trait_type}
                placeholder="Property Type"
                onChange={(event) => {
                  const newProperties = [...properties];
                  newProperties[index].trait_type = event.target.value;
                  setProperties(newProperties);
                }}
                />      
                <input
                  className="w-full block bg-slate-800 my-2 hover:bg-slate-900 border-2 border-slate-700 hover:border-blue-500 py-2 px-3 rounded-lg"
                  value={property.value}
                  placeholder="Property Value"
                  onChange={(event) => {
                    const newProperties = [...properties];
                    newProperties[index].value = event.target.value;
                    setProperties(newProperties);
                  }}
                />
              </div>
            ))}
            </div>
            </div>
            <button onClick={handleAddProperty} className="bg-blue-500 hover:bg-blue-600 text-slate-900 px-5 py-1 my-3 rounded-md">Add More</button>
          </div>
          </div>
    {/*   <h1 className='text-lg font-bold flex items-center my-2'>Blockchain :<span className='text-[20px] mt-2 px-2 items-center text-red-600'>*</span></h1>
          <div className='w-full mb-10 bg-slate-800 border-2 border-slate-700 rounded-lg py-3 px-3 cursor-pointer' onClick={() => setOpenNetwork(!openNetwork)} >
          <h5 className='text-center font-bold antialiased flex justify-center items-center'>{wichNet ? wichNet : "Blockchain"} {!openNetwork ?<MdKeyboardArrowDown size={28} className="relative right-0"/>:<MdKeyboardArrowUp size={28} className="relative right-0"/>}</h5>
          </div>
          {openNetwork &&
          <div className='my-3'>  
          <div className='flex items-center gap-x-2 my-2 mx-2'>
          <div className={!activeEth ? "rounded-full bg-slate-700 w-5 h-5 cursor-pointer" : 'rounded-full bg-blue-500 w-5 h-5 cursor-pointer'} onClick={() => {setEth(!activeEth),setNet("Ethereum"),setMtc(false),setBsc(false)}}>&nbsp;</div><h5 className={!activeEth ? "text-slate-400" : "text-blue-500"}>Ethereum</h5>
          </div>
          <div className='flex items-center gap-x-2 my-2 mx-2'>
          <div className={!activeMtc ? "rounded-full bg-slate-700 w-5 h-5 cursor-pointer" : 'rounded-full bg-blue-500 w-5 h-5 cursor-pointer'} onClick={() => {setMtc(!activeMtc),setNet("Polygon"),setEth(false),setBsc(false)}}>&nbsp;</div><h5 className={!activeMtc ? "text-slate-400" : "text-blue-500"}>Polygon</h5>
          </div>
          <div className='flex items-center gap-x-2 my-2 mx-2'>
          <div className={!activeBsc ? "rounded-full bg-slate-700 w-5 h-5 cursor-pointer" : 'rounded-full bg-blue-500 w-5 h-5 cursor-pointer'} onClick={() => {setBsc(!activeBsc),setNet("Binance"),setMtc(false),setEth(false)}}>&nbsp;</div><h5 className={!activeBsc ? "text-slate-400" : "text-blue-500"}>Binance</h5>
          </div>
          </div>
          }*/}
          <div className='flex-col mb-3'>
          <h1 className='text-lg font-bold flex items-center my-2'>Website Link :</h1>
          <p className='w-full text-sm mb-3'>Cosmeta will include a link to this URL on this item's detail page, so that users can click to learn more about it.</p>
          <input
          tabIndex={3}
          className='w-full bg-slate-800 hover:bg-slate-900 border-2 border-slate-700 hover:border-blue-500 py-2 px-3 rounded-lg'
          placeholder="https://"
          onChange={e => updateFormInput({ ...formInput, website: e.target.value })}
          />
          </div>
          <div className='flex justify-center items-center w-full mt-10 mb-10'>
            <button className='bg-gradient-to-tl to-purple-400 from-blue-500 text-slate-50 text-xl -skew-y-3 py-3 shadow-xl shadow-slate-900 mt-5 rounded-lg w-full' onClick={createAuctionMarket} >
            List your NFT!
            </button>
          </div>
          </div>
          </div>
          }

          <div className='flex-col justify-center items-center w-full'>
          <div className='flex justify-center items-center w-full pb-10'>
          {fileUrl && <div className={loading ? 'flex-col items-center w-[350px] h-full bg-slate-900 rounded-xl animate-pulse' : ' flex-col items-center w-[350px] pb-7 bg-slate-900 rounded-xl'}>
          {fileUrl && <h1 className='text-xl ml-3 my-2'>Preview</h1>}
                {loading &&
                  <div className='mx-3'>
                  <div className='rounded-lg bg-slate-800 w-[312px] h-52 relative border-2 border-slate-700 animate-pulse'>&nbsp;</div>
                  <div className='my-3 bg-slate-800 py-2 px-3 border-2 border-slate-700 rounded flex justify-between items-center animate-pulse'><span className='justify-start'>&nbsp;</span></div>
                  <div className='my-3 bg-slate-800 py-2 px-3 border-2 border-slate-700 rounded flex justify-between items-center animate-pulse'><span className='justify-start'>&nbsp;</span></div>
                  <div className='my-3 bg-slate-800 py-2 px-3 border-2 border-slate-700 rounded flex justify-between items-center animate-pulse'><span className='justify-start'>&nbsp;</span></div>
                  <div className='my-3 bg-slate-800 py-2 px-3 border-2 border-slate-700 rounded flex justify-between items-center animate-pulse'><span className='justify-start'>&nbsp;</span></div>
                  <div className='my-3 bg-slate-800 py-2 mb-5 px-3 border-2 border-slate-700 rounded flex justify-between items-center animate-pulse'><span className='justify-start'>&nbsp;</span></div>
                  </div>
                }
                {fileUrl ? 
                  (<div className='px-3 flex justify-center items-center w-full'>

                  <div className="w-[300px] justify-center items-center relative hover:bottom-2 border-slate-800 border-r-slate-700 rounded-xl overflow-hidden border-2">
                  <div className='bg-gradient-to-tr to-slate-600 from-slate-900 text-slate-400 cursor-pointer'>
                  <img src={activeEth == 'Ethereum' ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/480px-Ethereum-icon-purple.svg.png' : activeMtc == 'Polygon' ? 'https://cryptologos.cc/logos/polygon-matic-logo.png' : activeBsc == 'Binance' ? 'https://seeklogo.com/images/B/binance-coin-bnb-logo-97F9D55608-seeklogo.com.png' : null} className="z-30 object-cover w-5 absolute top-2 left-2"/>
                  {fileType == 'video/mp4' || fileType == 'video/mov'
                      ? <video src={fileUrl} className="rounded-t-xl w-full h-[296px]" autoPlay muted loop/>
                      : fileType == 'image/png' || fileType == 'image/jpeg' || fileType == 'image/jpg' || fileType == 'image/webp' ? <img className='rounded-t-xl object-cover w-full h-[296px]' src={fileUrl} />
                      : fileType == 'audio/mp3' || fileType == 'audio/wav' || fileType == 'audio/ogg' || fileType == 'audio/mpeg' ? <AudioPlayer nft={fileUrl} nftname={formInput.name}/> : null
                      }
                      <div className='flex-col px-5'>
                            <div className='flex justify-between items-center w-full my-3'>
                                    
                            <div className="flex justify-between items-center w-full">
                            <div className='justify-start items-center'>
                              <h3 className="text-md font-medium cursor-pointer text-purple-500 flex items-center gap-x-1">{auth?.user?.username} {auth?.user?.verified == 'verified' ? <MdVerified size={18}/> : null}</h3>
                            </div>
                            </div>
                            <div className='flex justify-end items-center w-full'>
                            <h3 className='font-medium text-sm text-center bg-slate-800 text-slate-500 py-1 px-3 rounded-md'>Token ID : 1</h3>
                            </div>
                            
                            </div>
                            <div>
                            <h1 className='font-medium text-lg'>{formInput.name}</h1>
                            <p className='font-medium text-sm'>{formInput.description}</p>
                            </div>
                            <div className='flex justify-between my-4 items-center gap-x-2 border-[1px] border-slate-600 rounded'>
                            <div className='w-full '>
                            <h1 className='font-bold text-lg flex items-center gap-x-2 py-2 px-3  text-slate-500'>Price : &nbsp;{formInput.price}</h1>
                            </div>
                            <div className='px-3'>
                              <img src='https://etherscan.io/token/images/cosmeta_32.png' className='object-cover w-10' title='Crypto International (CRI)' />
                            </div>
                              </div>
                            </div>
                            <div className='flex justify-between items-center mx-2 gap-x-2 pb-3'>
                            <div className='w-full'>
                            <button className='bg-gradient-to-tr to-slate-800 z-30 border-[1px] border-slate-700 rounded-lg from-slate-800 hover:to-purple-600 hover:from-blue-700 relative w-full h-10 text-white'>Buy</button>
                            </div>
                            </div>
                            </div>
                  </div>

                  </div>)
                  : null
                }
              </div>}
            </div>
          </div>

        </div>
        
        </div>
          </Fragment>
        }
        
        {matches.medium &&
          <Fragment>
          <Head>
          <title>Create an NFTs • Cosmeta NFT Marketplace</title>
          </Head>
          {process && <Process/>}
          <div className='flex-col justify-center items-center w-full white-glassmorphism p-7'>
           <div className='flex justify-between items-center gap-x-5 relative top-0 z-50 my-5 p-7 white-glassmorphism shadow-2xl shadow-slate-900'>
            <div className="flex justify-start items-center">
              <div className="flex items-center rounded-full w-[170px] bg-deepdark">
              <button onClick={() => {setOpenAuction(false),setOpenNft(true)}} className={openNFT ? "shadow-lg shadow-green-900 rounded-full p-5 text-xs font-bold bg-green-600 text-green-950" : "rounded-full p-5 text-xs font-bold px-3 bg-deepdark "}>DEFAULT</button>
              <button onClick={() => {setOpenAuction(true),setOpenNft(false)}} className={openAuction ? "shadow-lg shadow-green-900 rounded-full p-5 text-xs font-bold bg-green-600 text-green-950" : "rounded-full p-5 text-xs font-bold px-3 bg-deepdark "}>AUCTION</button>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <div className="flex text-2xl antialiased gap-x-2"><strong>CREATE</strong>and<strong>SELL</strong></div>
            </div>
            <div className="flex justify-end items-center gap-x-2 bg-deepdark py-2 pl-3 pr-2 rounded-full opacity-80">
              <span>Listing Fee :</span> <div className="flex justify-center items-center px-3 py-2 boxgradient gap-x-1 rounded-full"><strong>0.005</strong><img src='https://etherscan.io/token/images/cosmeta_32.png' className='object-cover w-5' title='Crypto International (CRI)' /> <span>CRI</span></div>
            </div>
           </div>
        
          <div className='flex justify-between items-center text-slate-400 rounded-3xl w-full white-glassmorphism shadow-xl shadow-slate-900'>
            
          <div className='flex-col justify-start items-start p-7 w-[400px]'>
          <div className='flex justify-center items-center w-full'>
          {!fileUrl && 
          <div className="flex justify-center items-center border py-10 rounded-xl white-glassmorphism animate-pulse">
          <div className='mx-5'>
          <div className='rounded-lg white-glassmorphism w-[312px] h-52 relative border-2 animate-pulse'>&nbsp;</div>
          <div className='my-3 white-glassmorphism py-2 px-3  rounded flex justify-between items-center animate-pulse'><span className='justify-start'>&nbsp;</span></div>
          <div className='my-3 white-glassmorphism py-2 px-3  rounded flex justify-between items-center animate-pulse'><span className='justify-start'>&nbsp;</span></div>
          <div className='my-3 white-glassmorphism py-2 px-3  rounded flex justify-between items-center animate-pulse'><span className='justify-start'>&nbsp;</span></div>
          <div className='my-3 white-glassmorphism py-2 px-3  rounded flex justify-between items-center animate-pulse'><span className='justify-start'>&nbsp;</span></div>
          <div className='my-3 white-glassmorphism py-2 mb-5 px-3  rounded flex justify-between items-center animate-pulse'><span className='justify-start'>&nbsp;</span></div>
          </div>
          </div>
          }
          {fileUrl && <div className={loading ? 'flex-col items-center w-[350px] h-full bg-slate-900 rounded-xl animate-pulse' : ' flex-col items-center w-[350px] pb-7 bg-slate-900 rounded-xl'}>
          {fileUrl && <h1 className='relative bottom-10 ml-3 text-xl'>Preview</h1>}
                {loading &&
                  <div className='mx-5'>
                  <div className='rounded-lg bg-slate-800 w-[312px] h-52 relative border-2 border-slate-700 animate-pulse'>&nbsp;</div>
                  <div className='my-3 bg-slate-800 py-2 px-3 border-2 border-slate-700 rounded flex justify-between items-center animate-pulse'><span className='justify-start'>&nbsp;</span></div>
                  <div className='my-3 bg-slate-800 py-2 px-3 border-2 border-slate-700 rounded flex justify-between items-center animate-pulse'><span className='justify-start'>&nbsp;</span></div>
                  <div className='my-3 bg-slate-800 py-2 px-3 border-2 border-slate-700 rounded flex justify-between items-center animate-pulse'><span className='justify-start'>&nbsp;</span></div>
                  <div className='my-3 bg-slate-800 py-2 px-3 border-2 border-slate-700 rounded flex justify-between items-center animate-pulse'><span className='justify-start'>&nbsp;</span></div>
                  <div className='my-3 bg-slate-800 py-2 mb-5 px-3 border-2 border-slate-700 rounded flex justify-between items-center animate-pulse'><span className='justify-start'>&nbsp;</span></div>
                  </div>
                }
                {fileUrl ? 
                  (<div className='px-6'>

                  <div className="w-[300px] relative hover:bottom-2 border-slate-800 border-r-slate-700 rounded-xl  overflow-hidden border-2">
                  <div className='bg-gradient-to-tr to-slate-600 from-slate-900 text-slate-400 cursor-pointer'>
                  <img src={activeEth == 'Ethereum' ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/480px-Ethereum-icon-purple.svg.png' : activeMtc == 'Polygon' ? 'https://cryptologos.cc/logos/polygon-matic-logo.png' : activeBsc == 'Binance' ? 'https://seeklogo.com/images/B/binance-coin-bnb-logo-97F9D55608-seeklogo.com.png' : null} className="z-30 object-cover w-5 absolute top-2 left-2"/>
                  {fileType == 'video/mp4' || fileType == 'video/mov'
                      ? <video src={fileUrl} className="rounded-t-xl w-full h-[296px]" autoPlay muted loop/>
                      : fileType == 'image/png' || fileType == 'image/jpeg' || fileType == 'image/jpg' || fileType == 'image/webp' ? <img className='rounded-t-xl object-cover w-full h-[296px]' src={fileUrl} />
                      : fileType == 'audio/mp3' || fileType == 'audio/wav' || fileType == 'audio/ogg' || fileType == 'audio/mpeg' ? <AudioPlayer nft={fileUrl} nftname={formInput.name}/> : null
                      }
                      <div className='flex-col px-5'>
                            <div className='flex justify-between items-center w-full my-3'>
                                    
                            <div className="flex justify-between items-center w-full">
                            <div className='justify-start items-center'>
                              <h3 className="text-md font-medium cursor-pointer text-purple-500 flex items-center gap-x-1">{auth?.user?.username} {auth?.user?.verified == 'verified' ? <MdVerified size={18}/> : null}</h3>
                            </div>
                            </div>
                            <div className='flex justify-end items-center w-full'>
                            <h3 className='font-medium text-sm text-center bg-slate-800 text-slate-500 py-1 px-3 rounded-md'>Token ID : 1</h3>
                            </div>
                            
                            </div>
                            <div>
                            <h1 className='font-medium text-lg'>{formInput.name}</h1>
                            <p className='font-medium text-sm'>{formInput.description}</p>
                            </div>
                            <div className='flex justify-between my-4 items-center gap-x-2 border-[1px] border-slate-600 rounded'>
                            <div className='w-full '>
                            <h1 className='font-bold text-lg flex items-center gap-x-2 py-2 px-3  text-slate-500'>Price : &nbsp;{formInput.price}</h1>
                            </div>
                            <div className='px-3'>
                              <img src='https://etherscan.io/token/images/cosmeta_32.png' className='object-cover w-10' title='Crypto International (CRI)' />
                            </div>
                              </div>
                            </div>
                            <div className='flex justify-between items-center mx-2 gap-x-2 pb-3'>
                            <div className='w-full'>
                            <button className='bg-gradient-to-tr to-slate-800 z-30 border-[1px] border-slate-700 rounded-lg from-slate-800 hover:to-purple-600 hover:from-blue-700 relative w-full h-10 text-white'>Buy</button>
                            </div>
                            </div>
                            </div>
                  </div>

                  </div>)
                  : null
                }
              </div>}
            </div>
            <div className="w-[450px] h-[300px]">
            </div>
          </div>
      
      {openNFT &&
      <div className='flex justify-center items-center w-full p-7 z-50 px-[70px]'>
      <div className='flex-col justify-center items-center'>
        <div className='w-full'>
        <h1 className='text-lg font-bold flex items-center'>Upload to Image, Video and Audio<span className='text-[20px] flex mt-2 px-2 items-center text-red-600'>*</span></h1>
        <p className='text-sm mb-3'>File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV</p>
        
        <label className='w-96 cursor-pointer flex h-52 justify-center items-center text-center border-2 rounded-lg border-dashed bg-slate-800 hover:bg-slate-900 border-slate-400 text-slate-400'>Upload
            <input
              className='hidden absolute h-52 -left-96'
              type="file"
              name="Asset"
              onChange={onChange}
            />
          </label>
        </div>
        <div className='flex-col items-center my-3'>
        <h1 className='text-lg font-bold flex items-center'>Name :<span className='text-[20px] mt-2 px-2 items-center text-red-600'>*</span></h1>
        <input
        tabIndex={1}
        type="text"
        className='w-96 bg-slate-800 hover:bg-slate-900 py-2 px-3 rounded-lg border-2 border-slate-700 hover:border-blue-500'
        placeholder='NFT Name'
        onChange={e => updateFormInput({ ...formInput, name: e.target.value })}/>
        </div>
        <div className="flex-col items-center my-3">
        <h1 className='text-lg font-bold flex items-center my-2'>Description :</h1>
        <textarea
        tabIndex={2}
        className='w-96 bg-slate-800 hover:bg-slate-900  border-slate-700 py-2 px-3 rounded-lg border-2 hover:border-blue-500'
        placeholder="NFT Description"
        onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
        />
        </div>
        <div className='flex-col my-3'>
        <h1 className='text-lg font-bold flex items-center my-2'>Price :<span className='text-[20px] mt-2 px-2 items-center text-red-600'>*</span></h1>
        <input
        tabIndex={3}
        type="number"
        className='w-96 bg-slate-800 hover:bg-slate-900 border-2 border-slate-700 hover:border-blue-500 py-2 px-3 rounded-lg'
        placeholder="Price"
        onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
        />
        </div>
        <div className="my-3">
          <h1 className="text-lg font-bold flex items-center mt-4">Properties</h1>
          <p>Enter the properties of the nft you will create</p>
          <div className="flex-col items-center w-96">
            <div className="flex justify-between items-center w-96 gap-x-3">
            <div className="flex-col">
            {properties.map((property, index) => (
              <div key={index} className="flex gap-x-2 items-center justify-center">
                <button onClick={() => handleDeleteProperty(index)} className="bg-red-500 h-[28px] rounded-md text-slate-900 hover:bg-red-900"><BiTrash size={22}/></button>
                <input
                className="w-full block bg-slate-800 my-2 hover:bg-slate-900 border-2 border-slate-700 hover:border-blue-500 py-2 px-3 rounded-lg"
                value={property.trait_type}
                placeholder="Property Type"
                onChange={(event) => {
                  const newProperties = [...properties];
                  newProperties[index].trait_type = event.target.value;
                  setProperties(newProperties);
                }}
                />      
                <input
                  className="w-full block bg-slate-800 my-2 hover:bg-slate-900 border-2 border-slate-700 hover:border-blue-500 py-2 px-3 rounded-lg"
                  value={property.value}
                  placeholder="Property Value"
                  onChange={(event) => {
                    const newProperties = [...properties];
                    newProperties[index].value = event.target.value;
                    setProperties(newProperties);
                  }}
                />
              </div>
            ))}
            </div>
            </div>
            <button onClick={handleAddProperty} className="bg-blue-500 hover:bg-blue-600 text-slate-900 px-5 py-1 my-3 rounded-md">Add More</button>
          </div>
        </div>
{/*     <h1 className='text-lg font-bold flex items-center my-2'>Blockchain :<span className='text-[20px] mt-2 px-2 items-center text-red-600'>*</span></h1>
        <div className='mb-10 bg-slate-800 border-2 border-slate-700 rounded-lg w-96 py-3 px-3 cursor-pointer' onClick={() => setOpenNetwork(!openNetwork)} >
        <h5 className='text-center font-bold antialiased flex justify-center items-center'>{wichNet ? wichNet : "Blockchain"} {!openNetwork ?<MdKeyboardArrowDown size={28} className="relative right-0"/>:<MdKeyboardArrowUp size={28} className="relative right-0"/>}</h5>
        </div>
        {openNetwork &&
        <div className='my-3'>  
        <div className='flex items-center gap-x-2 my-2 mx-2'>
        <div className={!activeEth ? "rounded-full bg-slate-700 w-5 h-5 cursor-pointer" : 'rounded-full bg-blue-500 w-5 h-5 cursor-pointer'} onClick={() => {setEth(!activeEth),setNet("Ethereum"),setMtc(false),setBsc(false)}}>&nbsp;</div><h5 className={!activeEth ? "text-slate-400" : "text-blue-500"}>Ethereum</h5>
        </div>
        <div className='flex items-center gap-x-2 my-2 mx-2'>
        <div className={!activeMtc ? "rounded-full bg-slate-700 w-5 h-5 cursor-pointer" : 'rounded-full bg-blue-500 w-5 h-5 cursor-pointer'} onClick={() => {setMtc(!activeMtc),setNet("Polygon"),setEth(false),setBsc(false)}}>&nbsp;</div><h5 className={!activeMtc ? "text-slate-400" : "text-blue-500"}>Polygon</h5>
        </div>
        <div className='flex items-center gap-x-2 my-2 mx-2'>
        <div className={!activeBsc ? "rounded-full bg-slate-700 w-5 h-5 cursor-pointer" : 'rounded-full bg-blue-500 w-5 h-5 cursor-pointer'} onClick={() => {setBsc(!activeBsc),setNet("Binance"),setMtc(false),setEth(false)}}>&nbsp;</div><h5 className={!activeBsc ? "text-slate-400" : "text-blue-500"}>Binance</h5>
        </div>
        </div>
        }*/}
        <div className='flex-col mb-3'>
        <h1 className='text-lg font-bold flex items-center my-2'>Website Link :</h1>
        <p className='w-96 text-sm mb-3'>Cosmeta will include a link to this URL on this item's detail page, so that users can click to learn more about it.</p>
        <input
        tabIndex={3}
        className='w-96 bg-slate-800 hover:bg-slate-900 border-2 border-slate-700 hover:border-blue-500 py-2 px-3 rounded-lg'
        placeholder="https://"
        onChange={e => updateFormInput({ ...formInput, website: e.target.value })}
        />
        </div>
        <div className='flex justify-center items-center w-full mt-10 mb-10'>
        <button className='bg-gradient-to-tl to-purple-400 from-blue-500 text-slate-50 text-xl -skew-y-3 py-3 shadow-xl shadow-slate-900 mt-5 rounded-lg w-full' onClick={createMarket} >
        List your NFT!
        </button>
      </div>
      </div>   
      </div>
      }

      {openAuction &&
      <div className='flex justify-center items-center w-full py-7 px-[70px] z-50'>
      <div className='flex-col justify-center items-center'>
      <div className='w-full'>
      <h1 className='text-lg font-bold flex items-center'>Upload to Image, Video and Audio<span className='text-[20px] flex mt-2 px-2 items-center text-red-600'>*</span></h1>
      <p className='text-sm mb-3'>File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV</p>
      
      <label className='w-96 cursor-pointer flex h-52 justify-center items-center text-center border-2 rounded-lg border-dashed bg-slate-800 hover:bg-slate-900 border-slate-400 text-slate-400'>Upload
          <input
            className='hidden absolute h-52 -left-96'
            type="file"
            name="Asset"
            onChange={onChange}
          />
        </label>
      </div>
      <div className='flex-col items-center my-3'>
      <h1 className='text-lg font-bold flex items-center'>Name :<span className='text-[20px] mt-2 px-2 items-center text-red-600'>*</span></h1>
      <input
      tabIndex={1}
      type="text"
      className='w-96 bg-slate-800 hover:bg-slate-900 py-2 px-3 rounded-lg border-2 border-slate-700 hover:border-blue-500'
      placeholder='NFT Name'
      onChange={e => updateFormInput({ ...formInput, name: e.target.value })}/>
      </div>
      <div className="flex-col items-center my-3">
      <h1 className='text-lg font-bold flex items-center my-2'>Description :</h1>
      <textarea
      tabIndex={2}
      className='w-96 bg-slate-800 hover:bg-slate-900  border-slate-700 py-2 px-3 rounded-lg border-2 hover:border-blue-500'
      placeholder="NFT Description"
      onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
      />
      </div>
      <div className='flex-col my-3'>
      <h1 className='text-lg font-bold flex items-center my-2'>Price :<span className='text-[20px] mt-2 px-2 items-center text-red-600'>*</span></h1>
      <input
      tabIndex={3}
      type="number"
      className='w-96 bg-slate-800 hover:bg-slate-900 border-2 border-slate-700 hover:border-blue-500 py-2 px-3 rounded-lg'
      placeholder="Price"
      onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
      />
      </div>
      <div className="my-3">
      <h1 className="text-lg font-bold flex items-center mt-4">Properties</h1>
      <p>Enter the properties of the nft you will create</p>
      <div className="flex-col items-center w-96">
        <div className="flex justify-between items-center w-96 gap-x-3">
        <div className="flex-col">
        {properties.map((property, index) => (
          <div key={index} className="flex gap-x-2 items-center justify-center">
            <button onClick={() => handleDeleteProperty(index)} className="bg-red-500 h-[28px] rounded-md text-slate-900 hover:bg-red-900"><BiTrash size={22}/></button>
            <input
            className="w-full block bg-slate-800 my-2 hover:bg-slate-900 border-2 border-slate-700 hover:border-blue-500 py-2 px-3 rounded-lg"
            value={property.trait_type}
            placeholder="Property Type"
            onChange={(event) => {
              const newProperties = [...properties];
              newProperties[index].trait_type = event.target.value;
              setProperties(newProperties);
            }}
            />      
            <input
              className="w-full block bg-slate-800 my-2 hover:bg-slate-900 border-2 border-slate-700 hover:border-blue-500 py-2 px-3 rounded-lg"
              value={property.value}
              placeholder="Property Value"
              onChange={(event) => {
                const newProperties = [...properties];
                newProperties[index].value = event.target.value;
                setProperties(newProperties);
              }}
            />
          </div>
        ))}
        </div>
        </div>
        <button onClick={handleAddProperty} className="bg-blue-500 hover:bg-blue-600 text-slate-900 px-5 py-1 my-3 rounded-md">Add More</button>
      </div>
      </div>
{/*   <h1 className='text-lg font-bold flex items-center my-2'>Blockchain :<span className='text-[20px] mt-2 px-2 items-center text-red-600'>*</span></h1>
      <div className='w-full mb-10 bg-slate-800 border-2 border-slate-700 rounded-lg py-3 px-3 cursor-pointer' onClick={() => setOpenNetwork(!openNetwork)} >
      <h5 className='text-center font-bold antialiased flex justify-center items-center'>{wichNet ? wichNet : "Blockchain"} {!openNetwork ?<MdKeyboardArrowDown size={28} className="relative right-0"/>:<MdKeyboardArrowUp size={28} className="relative right-0"/>}</h5>
      </div>
      {openNetwork &&
      <div className='my-3'>  
      <div className='flex items-center gap-x-2 my-2 mx-2'>
      <div className={!activeEth ? "rounded-full bg-slate-700 w-5 h-5 cursor-pointer" : 'rounded-full bg-blue-500 w-5 h-5 cursor-pointer'} onClick={() => {setEth(!activeEth),setNet("Ethereum"),setMtc(false),setBsc(false)}}>&nbsp;</div><h5 className={!activeEth ? "text-slate-400" : "text-blue-500"}>Ethereum</h5>
      </div>
      <div className='flex items-center gap-x-2 my-2 mx-2'>
      <div className={!activeMtc ? "rounded-full bg-slate-700 w-5 h-5 cursor-pointer" : 'rounded-full bg-blue-500 w-5 h-5 cursor-pointer'} onClick={() => {setMtc(!activeMtc),setNet("Polygon"),setEth(false),setBsc(false)}}>&nbsp;</div><h5 className={!activeMtc ? "text-slate-400" : "text-blue-500"}>Polygon</h5>
      </div>
      <div className='flex items-center gap-x-2 my-2 mx-2'>
      <div className={!activeBsc ? "rounded-full bg-slate-700 w-5 h-5 cursor-pointer" : 'rounded-full bg-blue-500 w-5 h-5 cursor-pointer'} onClick={() => {setBsc(!activeBsc),setNet("Binance"),setMtc(false),setEth(false)}}>&nbsp;</div><h5 className={!activeBsc ? "text-slate-400" : "text-blue-500"}>Binance</h5>
      </div>
      </div>
      }*/}
      <div className='flex-col mb-3'>
      <h1 className='text-lg font-bold flex items-center my-2'>Website Link :</h1>
      <p className='w-96 text-sm mb-3'>Cosmeta will include a link to this URL on this item's detail page, so that users can click to learn more about it.</p>
      <input
      tabIndex={3}
      className='w-96 bg-slate-800 hover:bg-slate-900 border-2 border-slate-700 hover:border-blue-500 py-2 px-3 rounded-lg'
      placeholder="https://"
      onChange={e => updateFormInput({ ...formInput, website: e.target.value })}
      />
      </div>
      <div className='flex justify-center items-center w-full mt-10 mb-10'>
        <button className='bg-gradient-to-tl to-purple-400 from-blue-500 text-slate-50 text-xl -skew-y-3 py-3 shadow-xl shadow-slate-900 mt-5 rounded-lg w-full' onClick={createAuctionMarket} >
        List your NFT!
        </button>
      </div>
      </div>
      </div>
      }

        </div>
        
        </div>
          </Fragment>
        }

        {matches.large &&
          <Fragment>
          <Head>
          <title>Create an NFTs • Cosmeta NFT Marketplace</title>
          </Head>
          {process && <Process/>}
          <div className='flex-col justify-center items-center w-full white-glassmorphism p-7'>
           <div className='flex justify-between items-center gap-x-5 relative top-0 z-50 my-5 p-7 white-glassmorphism shadow-2xl shadow-slate-900'>
            <div className="flex justify-start items-center">
              <div className="flex items-center rounded-full w-[170px] bg-deepdark">
              <button onClick={() => {setOpenAuction(false),setOpenNft(true)}} className={openNFT ? "shadow-lg shadow-green-900 rounded-full p-5 text-xs font-bold bg-green-600 text-green-950" : "rounded-full p-5 text-xs font-bold px-3 bg-deepdark "}>DEFAULT</button>
              <button onClick={() => {setOpenAuction(true),setOpenNft(false)}} className={openAuction ? "shadow-lg shadow-green-900 rounded-full p-5 text-xs font-bold bg-green-600 text-green-950" : "rounded-full p-5 text-xs font-bold px-3 bg-deepdark "}>AUCTION</button>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <div className="flex text-2xl antialiased gap-x-2"><strong>CREATE</strong>and<strong>SELL</strong></div>
            </div>
            <div className="flex justify-end items-center gap-x-2 bg-deepdark py-2 pl-3 pr-2 rounded-full opacity-80">
              <span>Listing Fee :</span> <div className="flex justify-center items-center px-3 py-2 boxgradient gap-x-1 rounded-full"><strong>0.005</strong><img src='https://etherscan.io/token/images/cosmeta_32.png' className='object-cover w-5' title='Crypto International (CRI)' /> <span>CRI</span></div>
            </div>
           </div>
        
          <div className='flex justify-between items-center text-slate-400 rounded-3xl w-full white-glassmorphism shadow-xl shadow-slate-900'>
            
          <div className='flex-col justify-start items-start p-7 w-[450px]'>
          <div className='flex justify-center items-center w-full'>
          {fileUrl && <div className={loading ? 'flex-col items-center w-[350px] h-full bg-slate-900 rounded-xl animate-pulse' : ' flex-col items-center w-[350px] pb-7 bg-slate-900 rounded-xl'}>
          {fileUrl && <h1 className='relative bottom-10 ml-3 text-xl'>Preview</h1>}
                {loading &&
                  <div className='mx-5'>
                  <div className='rounded-lg bg-slate-800 w-[312px] h-52 relative border-2 border-slate-700 animate-pulse'>&nbsp;</div>
                  <div className='my-3 bg-slate-800 py-2 px-3 border-2 border-slate-700 rounded flex justify-between items-center animate-pulse'><span className='justify-start'>&nbsp;</span></div>
                  <div className='my-3 bg-slate-800 py-2 px-3 border-2 border-slate-700 rounded flex justify-between items-center animate-pulse'><span className='justify-start'>&nbsp;</span></div>
                  <div className='my-3 bg-slate-800 py-2 px-3 border-2 border-slate-700 rounded flex justify-between items-center animate-pulse'><span className='justify-start'>&nbsp;</span></div>
                  <div className='my-3 bg-slate-800 py-2 px-3 border-2 border-slate-700 rounded flex justify-between items-center animate-pulse'><span className='justify-start'>&nbsp;</span></div>
                  <div className='my-3 bg-slate-800 py-2 mb-5 px-3 border-2 border-slate-700 rounded flex justify-between items-center animate-pulse'><span className='justify-start'>&nbsp;</span></div>
                  </div>
                }
                {fileUrl ? 
                  (<div className='px-6'>

                  <div className="w-[300px] relative hover:bottom-2 border-slate-800 border-r-slate-700 rounded-xl  overflow-hidden border-2">
                  <div className='bg-gradient-to-tr to-slate-600 from-slate-900 text-slate-400 cursor-pointer'>
                  <img src={activeEth == 'Ethereum' ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/480px-Ethereum-icon-purple.svg.png' : activeMtc == 'Polygon' ? 'https://cryptologos.cc/logos/polygon-matic-logo.png' : activeBsc == 'Binance' ? 'https://seeklogo.com/images/B/binance-coin-bnb-logo-97F9D55608-seeklogo.com.png' : null} className="z-30 object-cover w-5 absolute top-2 left-2"/>
                  {fileType == 'video/mp4' || fileType == 'video/mov'
                      ? <video src={fileUrl} className="rounded-t-xl w-full h-[296px]" autoPlay muted loop/>
                      : fileType == 'image/png' || fileType == 'image/jpeg' || fileType == 'image/jpg' || fileType == 'image/webp' ? <img className='rounded-t-xl object-cover w-full h-[296px]' src={fileUrl} />
                      : fileType == 'audio/mp3' || fileType == 'audio/wav' || fileType == 'audio/ogg' || fileType == 'audio/mpeg' ? <AudioPlayer nft={fileUrl} nftname={formInput.name}/> : null
                      }
                      <div className='flex-col px-5'>
                            <div className='flex justify-between items-center w-full my-3'>
                                    
                            <div className="flex justify-between items-center w-full">
                            <div className='justify-start items-center'>
                              <h3 className="text-md font-medium cursor-pointer text-purple-500 flex items-center gap-x-1">{auth?.user?.username} {auth?.user?.verified == 'verified' ? <MdVerified size={18}/> : null}</h3>
                            </div>
                            </div>
                            <div className='flex justify-end items-center w-full'>
                            <h3 className='font-medium text-sm text-center bg-slate-800 text-slate-500 py-1 px-3 rounded-md'>Token ID : 1</h3>
                            </div>
                            
                            </div>
                            <div>
                            <h1 className='font-medium text-lg'>{formInput.name}</h1>
                            <p className='font-medium text-sm'>{formInput.description}</p>
                            </div>
                            <div className='flex justify-between my-4 items-center gap-x-2 border-[1px] border-slate-600 rounded'>
                            <div className='w-full '>
                            <h1 className='font-bold text-lg flex items-center gap-x-2 py-2 px-3  text-slate-500'>Price : &nbsp;{formInput.price}</h1>
                            </div>
                            <div className='px-3'>
                              <img src='https://etherscan.io/token/images/cosmeta_32.png' className='object-cover w-10' title='Crypto International (CRI)' />
                            </div>
                              </div>
                            </div>
                            <div className='flex justify-between items-center mx-2 gap-x-2 pb-3'>
                            <div className='w-full'>
                            <button className='bg-gradient-to-tr to-slate-800 z-30 border-[1px] border-slate-700 rounded-lg from-slate-800 hover:to-purple-600 hover:from-blue-700 relative w-full h-10 text-white'>Buy</button>
                            </div>
                            </div>
                            </div>
                  </div>

                  </div>)
                  : null
                }
              </div>}
            </div>
            <div className="w-[450px] h-[300px]">
            </div>
          </div>
      
      {openNFT &&
      <div className='flex justify-center items-center w-full p-7 z-50 px-[140px]'>
      <div className='flex-col justify-center items-center'>
        <div className='w-full'>
        <h1 className='text-2xl font-bold flex items-center'>Upload to Image, Video and Audio<span className='text-[20px] flex mt-2 px-2 items-center text-red-600'>*</span></h1>
        <p className='text-sm mb-3'>File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV</p>
        
        <label className='w-96 cursor-pointer flex h-52 justify-center items-center text-center border-2 rounded-lg border-dashed bg-slate-800 hover:bg-slate-900 border-slate-400 text-slate-400'>Upload
            <input
              className='hidden absolute h-52 -left-96'
              type="file"
              name="Asset"
              onChange={onChange}
            />
          </label>
        </div>
        <div className='flex-col items-center my-3'>
        <h1 className='text-lg font-bold flex items-center'>Name :<span className='text-[20px] mt-2 px-2 items-center text-red-600'>*</span></h1>
        <input
        tabIndex={1}
        type="text"
        className='w-96 bg-slate-800 hover:bg-slate-900 py-2 px-3 rounded-lg border-2 border-slate-700 hover:border-blue-500'
        placeholder='NFT Name'
        onChange={e => updateFormInput({ ...formInput, name: e.target.value })}/>
        </div>
        <div className="flex-col items-center my-3">
        <h1 className='text-lg font-bold flex items-center my-2'>Description :</h1>
        <textarea
        tabIndex={2}
        className='w-96 bg-slate-800 hover:bg-slate-900  border-slate-700 py-2 px-3 rounded-lg border-2 hover:border-blue-500'
        placeholder="NFT Description"
        onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
        />
        </div>
        <div className='flex-col my-3'>
        <h1 className='text-lg font-bold flex items-center my-2'>Price :<span className='text-[20px] mt-2 px-2 items-center text-red-600'>*</span></h1>
        <input
        tabIndex={3}
        type="number"
        className='w-96 bg-slate-800 hover:bg-slate-900 border-2 border-slate-700 hover:border-blue-500 py-2 px-3 rounded-lg'
        placeholder="Price"
        onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
        />
        </div>
        <div className="my-3">
          <h1 className="text-lg font-bold flex items-center mt-4">Properties</h1>
          <p>Enter the properties of the nft you will create</p>
          <div className="flex-col items-center w-96">
            <div className="flex justify-between items-center w-96 gap-x-3">
            <div className="flex-col">
            {properties.map((property, index) => (
              <div key={index} className="flex gap-x-2 items-center justify-center">
                <button onClick={() => handleDeleteProperty(index)} className="bg-red-500 h-[28px] rounded-md text-slate-900 hover:bg-red-900"><BiTrash size={22}/></button>
                <input
                className="w-full block bg-slate-800 my-2 hover:bg-slate-900 border-2 border-slate-700 hover:border-blue-500 py-2 px-3 rounded-lg"
                value={property.trait_type}
                placeholder="Property Type"
                onChange={(event) => {
                  const newProperties = [...properties];
                  newProperties[index].trait_type = event.target.value;
                  setProperties(newProperties);
                }}
                />      
                <input
                  className="w-full block bg-slate-800 my-2 hover:bg-slate-900 border-2 border-slate-700 hover:border-blue-500 py-2 px-3 rounded-lg"
                  value={property.value}
                  placeholder="Property Value"
                  onChange={(event) => {
                    const newProperties = [...properties];
                    newProperties[index].value = event.target.value;
                    setProperties(newProperties);
                  }}
                />
              </div>
            ))}
            </div>
            </div>
            <button onClick={handleAddProperty} className="bg-blue-500 hover:bg-blue-600 text-slate-900 px-5 py-1 my-3 rounded-md">Add More</button>
          </div>
        </div>
{/*     <h1 className='text-lg font-bold flex items-center my-2'>Blockchain :<span className='text-[20px] mt-2 px-2 items-center text-red-600'>*</span></h1>
        <div className='mb-10 bg-slate-800 border-2 border-slate-700 rounded-lg w-96 py-3 px-3 cursor-pointer' onClick={() => setOpenNetwork(!openNetwork)} >
        <h5 className='text-center font-bold antialiased flex justify-center items-center'>{wichNet ? wichNet : "Blockchain"} {!openNetwork ?<MdKeyboardArrowDown size={28} className="relative right-0"/>:<MdKeyboardArrowUp size={28} className="relative right-0"/>}</h5>
        </div>
        {openNetwork &&
        <div className='my-3'>  
        <div className='flex items-center gap-x-2 my-2 mx-2'>
        <div className={!activeEth ? "rounded-full bg-slate-700 w-5 h-5 cursor-pointer" : 'rounded-full bg-blue-500 w-5 h-5 cursor-pointer'} onClick={() => {setEth(!activeEth),setNet("Ethereum"),setMtc(false),setBsc(false)}}>&nbsp;</div><h5 className={!activeEth ? "text-slate-400" : "text-blue-500"}>Ethereum</h5>
        </div>
        <div className='flex items-center gap-x-2 my-2 mx-2'>
        <div className={!activeMtc ? "rounded-full bg-slate-700 w-5 h-5 cursor-pointer" : 'rounded-full bg-blue-500 w-5 h-5 cursor-pointer'} onClick={() => {setMtc(!activeMtc),setNet("Polygon"),setEth(false),setBsc(false)}}>&nbsp;</div><h5 className={!activeMtc ? "text-slate-400" : "text-blue-500"}>Polygon</h5>
        </div>
        <div className='flex items-center gap-x-2 my-2 mx-2'>
        <div className={!activeBsc ? "rounded-full bg-slate-700 w-5 h-5 cursor-pointer" : 'rounded-full bg-blue-500 w-5 h-5 cursor-pointer'} onClick={() => {setBsc(!activeBsc),setNet("Binance"),setMtc(false),setEth(false)}}>&nbsp;</div><h5 className={!activeBsc ? "text-slate-400" : "text-blue-500"}>Binance</h5>
        </div>
        </div>
        }*/}
        <div className='flex-col mb-3'>
        <h1 className='text-lg font-bold flex items-center my-2'>Website Link :</h1>
        <p className='w-96 text-sm mb-3'>Cosmeta will include a link to this URL on this item's detail page, so that users can click to learn more about it.</p>
        <input
        tabIndex={3}
        className='w-96 bg-slate-800 hover:bg-slate-900 border-2 border-slate-700 hover:border-blue-500 py-2 px-3 rounded-lg'
        placeholder="https://"
        onChange={e => updateFormInput({ ...formInput, website: e.target.value })}
        />
        </div>
        <div className='flex justify-center items-center w-full mt-10 mb-10'>
        <button className='bg-gradient-to-tl to-purple-400 from-blue-500 text-slate-50 text-xl -skew-y-3 py-3 shadow-xl shadow-slate-900 mt-5 rounded-lg w-full' onClick={createMarket} >
        List your NFT!
        </button>
      </div>
      </div>   
      </div>
      }

      {openAuction &&
      <div className='flex justify-center items-center w-full py-7 px-[140px] z-50'>
      <div className='flex-col justify-center items-center'>
      <div className='w-full'>
      <h1 className='text-2xl font-bold flex items-center'>Upload to Image, Video and Audio<span className='text-[20px] flex mt-2 px-2 items-center text-red-600'>*</span></h1>
      <p className='text-sm mb-3'>File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV</p>
      
      <label className='w-96 cursor-pointer flex h-52 justify-center items-center text-center border-2 rounded-lg border-dashed bg-slate-800 hover:bg-slate-900 border-slate-400 text-slate-400'>Upload
          <input
            className='hidden absolute h-52 -left-96'
            type="file"
            name="Asset"
            onChange={onChange}
          />
        </label>
      </div>
      <div className='flex-col items-center my-3'>
      <h1 className='text-lg font-bold flex items-center'>Name :<span className='text-[20px] mt-2 px-2 items-center text-red-600'>*</span></h1>
      <input
      tabIndex={1}
      type="text"
      className='w-96 bg-slate-800 hover:bg-slate-900 py-2 px-3 rounded-lg border-2 border-slate-700 hover:border-blue-500'
      placeholder='NFT Name'
      onChange={e => updateFormInput({ ...formInput, name: e.target.value })}/>
      </div>
      <div className="flex-col items-center my-3">
      <h1 className='text-lg font-bold flex items-center my-2'>Description :</h1>
      <textarea
      tabIndex={2}
      className='w-96 bg-slate-800 hover:bg-slate-900  border-slate-700 py-2 px-3 rounded-lg border-2 hover:border-blue-500'
      placeholder="NFT Description"
      onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
      />
      </div>
      <div className='flex-col my-3'>
      <h1 className='text-lg font-bold flex items-center my-2'>Price :<span className='text-[20px] mt-2 px-2 items-center text-red-600'>*</span></h1>
      <input
      tabIndex={3}
      type="number"
      className='w-96 bg-slate-800 hover:bg-slate-900 border-2 border-slate-700 hover:border-blue-500 py-2 px-3 rounded-lg'
      placeholder="Price"
      onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
      />
      </div>
      <div className="my-3">
      <h1 className="text-lg font-bold flex items-center mt-4">Properties</h1>
      <p>Enter the properties of the nft you will create</p>
      <div className="flex-col items-center w-96">
        <div className="flex justify-between items-center w-96 gap-x-3">
        <div className="flex-col">
        {properties.map((property, index) => (
          <div key={index} className="flex gap-x-2 items-center justify-center">
            <button onClick={() => handleDeleteProperty(index)} className="bg-red-500 h-[28px] rounded-md text-slate-900 hover:bg-red-900"><BiTrash size={22}/></button>
            <input
            className="w-full block bg-slate-800 my-2 hover:bg-slate-900 border-2 border-slate-700 hover:border-blue-500 py-2 px-3 rounded-lg"
            value={property.trait_type}
            placeholder="Property Type"
            onChange={(event) => {
              const newProperties = [...properties];
              newProperties[index].trait_type = event.target.value;
              setProperties(newProperties);
            }}
            />      
            <input
              className="w-full block bg-slate-800 my-2 hover:bg-slate-900 border-2 border-slate-700 hover:border-blue-500 py-2 px-3 rounded-lg"
              value={property.value}
              placeholder="Property Value"
              onChange={(event) => {
                const newProperties = [...properties];
                newProperties[index].value = event.target.value;
                setProperties(newProperties);
              }}
            />
          </div>
        ))}
        </div>
        </div>
        <button onClick={handleAddProperty} className="bg-blue-500 hover:bg-blue-600 text-slate-900 px-5 py-1 my-3 rounded-md">Add More</button>
      </div>
      </div>
{/*   <h1 className='text-lg font-bold flex items-center my-2'>Blockchain :<span className='text-[20px] mt-2 px-2 items-center text-red-600'>*</span></h1>
      <div className='w-full mb-10 bg-slate-800 border-2 border-slate-700 rounded-lg py-3 px-3 cursor-pointer' onClick={() => setOpenNetwork(!openNetwork)} >
      <h5 className='text-center font-bold antialiased flex justify-center items-center'>{wichNet ? wichNet : "Blockchain"} {!openNetwork ?<MdKeyboardArrowDown size={28} className="relative right-0"/>:<MdKeyboardArrowUp size={28} className="relative right-0"/>}</h5>
      </div>
      {openNetwork &&
      <div className='my-3'>  
      <div className='flex items-center gap-x-2 my-2 mx-2'>
      <div className={!activeEth ? "rounded-full bg-slate-700 w-5 h-5 cursor-pointer" : 'rounded-full bg-blue-500 w-5 h-5 cursor-pointer'} onClick={() => {setEth(!activeEth),setNet("Ethereum"),setMtc(false),setBsc(false)}}>&nbsp;</div><h5 className={!activeEth ? "text-slate-400" : "text-blue-500"}>Ethereum</h5>
      </div>
      <div className='flex items-center gap-x-2 my-2 mx-2'>
      <div className={!activeMtc ? "rounded-full bg-slate-700 w-5 h-5 cursor-pointer" : 'rounded-full bg-blue-500 w-5 h-5 cursor-pointer'} onClick={() => {setMtc(!activeMtc),setNet("Polygon"),setEth(false),setBsc(false)}}>&nbsp;</div><h5 className={!activeMtc ? "text-slate-400" : "text-blue-500"}>Polygon</h5>
      </div>
      <div className='flex items-center gap-x-2 my-2 mx-2'>
      <div className={!activeBsc ? "rounded-full bg-slate-700 w-5 h-5 cursor-pointer" : 'rounded-full bg-blue-500 w-5 h-5 cursor-pointer'} onClick={() => {setBsc(!activeBsc),setNet("Binance"),setMtc(false),setEth(false)}}>&nbsp;</div><h5 className={!activeBsc ? "text-slate-400" : "text-blue-500"}>Binance</h5>
      </div>
      </div>
      }*/}
      <div className='flex-col mb-3'>
      <h1 className='text-lg font-bold flex items-center my-2'>Website Link :</h1>
      <p className='w-96 text-sm mb-3'>Cosmeta will include a link to this URL on this item's detail page, so that users can click to learn more about it.</p>
      <input
      tabIndex={3}
      className='w-96 bg-slate-800 hover:bg-slate-900 border-2 border-slate-700 hover:border-blue-500 py-2 px-3 rounded-lg'
      placeholder="https://"
      onChange={e => updateFormInput({ ...formInput, website: e.target.value })}
      />
      </div>
      <div className='flex justify-center items-center w-full mt-10 mb-10'>
        <button className='bg-gradient-to-tl to-purple-400 from-blue-500 text-slate-50 text-xl -skew-y-3 py-3 shadow-xl shadow-slate-900 mt-5 rounded-lg w-full' onClick={createAuctionMarket} >
        List your NFT!
        </button>
      </div>
      </div>
      </div>
      }

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
export default CreateMarket;