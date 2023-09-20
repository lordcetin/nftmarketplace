/* eslint-disable jsx-a11y/alt-text */
import React,{useState,useEffect,Fragment} from "react";
import {Navbar,Footer,Welcome} from './';
import Notify from "./Notify";
import Image from "next/image";
import { useStateContext } from "../context/StateContext";
import Logo from '../public/logo.png'
import {AiOutlineLoading} from 'react-icons/ai'
import {ethers} from 'ethers';
import Web3Modal from "web3modal";
import Token from '../engine/Token.json';
import Auction from '../engine/Auction.json';
import Market from '../engine/Market.json';
import NFT from '../engine/NFT.json';
import { cipherEth,seprpc,sepmarket,sepauction,sepnft } from "@/engine/configuration";
import { useRouter } from "next/router";
import CustomButton from "./CustomButton";
import { Loading } from "@nextui-org/react";
import { AiOutlineClose } from "react-icons/ai";

import Media from 'react-media'

const Layout = ({children}) => {

  const {user,getUser,connectUser,} = useStateContext();
  const router = useRouter();
  const [nowallet,setNoWallet] = useState(false);
  const [selectedAddress,setSelectedAddress] = useState(`${user}`);
  const [conn,setConn] = useState(false)

  useEffect(() => {

    if(window?.ethereum?.selectedAddress){
      const acc = window?.ethereum?.selectedAddress;
      setSelectedAddress(acc)
    }else if(!window.ethereum){
      setNoWallet(true)
      connectUser()
    }
    else{
      setNoWallet(true)
      connectUser()
    }
  },[])

  useEffect(() => {
    if(user.lenght){
      router.reload()
    }
  },[conn])

  return (
    <div className={
    router.pathname == '/' ? "scrollbar-thumb-slate-900 scrollbar-thin scrollbar-thumb-rounded-full scroll-smooth"
    :router.pathname == '/create' ? "welcomebg scrollbar-thumb-slate-900 scrollbar-thin scrollbar-thumb-rounded-full scroll-smooth"
    :router.pathname == '/[profile]' ? "welcomebg scrollbar-thumb-slate-900 scrollbar-thin scrollbar-thumb-rounded-full scroll-smooth"
    :router.pathname == '/explore' ? "gradient-bg-services scrollbar-thumb-slate-900 scrollbar-thin scrollbar-thumb-rounded-full scroll-smooth"
    :router.pathname == '/notifications' ? "overflow-hidden gradient-bg-services"
    : "gradient-bg-services w-full"
    }>
    <Media queries={{
      small: "(max-width: 599px)", // < 600px
      medium: "(min-width: 1024px) and (max-width: 1366px)", // < 1366px
      large: "(min-width: 1400px)" // >= 1400px
    }}>
    {mathes => (
    <Fragment>
    {mathes.small &&
    <Fragment>
    {nowallet ?
      <div className="flex fixed justify-center items-center w-screen h-screen z-[9999] backdrop-blur-lg">
      {!user.length ? null : <AiOutlineClose onClick={() => setNoWallet(false)} size={22} className="z-[999] text-white font-bold border border-white rounded-full absolute top-5 right-5 w-12 h-12 p-1 hover:animate-spin hover:cursor-pointer"/>}
      <div className="flex-col transition-all duration-300 ease-out grid gap-y-5 justify-center items-center w-[530px] rounded-xl bg-white text-slate-950 p-10 z-50 shadow-xl shadow-slate-950 text-justify">
      <img src="https://media2.giphy.com/media/AA4N5haI6ldIfPfZqE/giphy.gif" className="w-52"/>
      <h1 className="text-xl font-bold">A crypto wallet is not defined in your browser. Re-enter this site by downloading one of the crypto wallet plugins to your browser and creating an account.
      </h1>
      <div className="flex-col justify-center items-center w-full border border-slate-400 p-5 rounded-full">
      <h1 className="flex justify-center items-center w-full text-lg font-bold">OR CONNECT WALLET</h1>
      <div className="flex w-full justify-center items-center mt-3">
      <div>{!user.length ? <Loading size="xs" color="primary"/> : setConn(true)} <span>{!user.length ? "Connecting" : "Connected" }</span></div>
      </div>
      </div>
      <div className="flex-col grid text-sm "><strong>Example Crypto Wallets :</strong>
      <div className="flex justify-center items-center gap-x-3 mt-5">
      <div className="flex justify-center items-center gap-x-1">
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/1024px-MetaMask_Fox.svg.png" className="w-6 h-6"/>Metamask
      </div>
      <div className="flex justify-center items-center gap-x-1">
      <img src="https://trustwallet.com/assets/images/media/assets/TWT.png" className="w-6 h-6"/>TrustWallet
      </div>
      <div className="flex justify-center items-center gap-x-1">
      <img src="https://app.coinmerge.io/assets/images/wallets/coinbasewallet-logo.png" className="w-6 h-6"/>Coinbase
      </div>
      <div className="flex justify-center items-center gap-x-1">
      <img src="https://assets-cdn.trustwallet.com/blockchains/binance/info/logo.png" className="w-6 h-6"/>Binance Wallet
      </div>
      </div>
      </div>
      </div>
      </div>
      : null }
    <div className=" scrollbar-thumb-slate-900 scrollbar-thin scrollbar-thumb-rounded-full scroll-smooth">
    {router.pathname == '/login' ? null
    : router.pathname == '/register' ? null
    : router.pathname == '/connectwallet' ? null
    : <Navbar/> 
    }
    <Notify/>
    <main className={router.pathname == '/register' ? 'flex justify-center items-center w-full'
    : router.pathname == '/admin/edit' ? 'w-full'
    : router.pathname == '/inbox' ? 'w-full px-3'
    : router.pathname == '/create' ? 'w-full px-3 my-28'
    : router.pathname == '/inbox/chat' ? 'w-full'
    : router.pathname == '/inbox/chat/[conversationId]' ? 'w-full px-3'
    : router.pathname == '/admin/users' ? 'w-full'
    : router.pathname == '/admin/posts' ? 'w-full'
    : router.pathname == '/[profile]' ? 'w-full'
    : router.pathname == '/notification' ? 'w-full px-3'
    : router.pathname == '/' ? 'w-full'
    : router.pathname == '/login' ? 'w-full'
    : router.pathname == '/academy' ? 'flex justify-center items-center w-full'
    : 'flex justify-center items-center w-full container mx-auto my-28'}>
    {children}
    </main>
    {router.pathname == '/login' ? null
    : router.pathname == '/register' ? null
    : router.pathname == '/connectwallet' ? null
    : <Footer/> 
    }
    </div>
    </Fragment>
    }
    {mathes.medium &&
      <Fragment>
      {nowallet ?
        <div className="flex fixed justify-center items-center w-screen h-screen z-[9999] backdrop-blur-lg">
        {!user.length ? null : <AiOutlineClose onClick={() => setNoWallet(false)} size={22} className="z-[999] text-white font-bold border border-white rounded-full absolute top-5 right-5 w-12 h-12 p-1 hover:animate-spin hover:cursor-pointer"/>}
        <div className="flex-col transition-all duration-300 ease-out grid gap-y-5 justify-center items-center w-[530px] rounded-xl bg-white text-slate-950 p-10 z-50 shadow-xl shadow-slate-950 text-justify">
        <img src="https://media2.giphy.com/media/AA4N5haI6ldIfPfZqE/giphy.gif" className="w-52"/>
        <h1 className="text-xl font-bold">A crypto wallet is not defined in your browser. Re-enter this site by downloading one of the crypto wallet plugins to your browser and creating an account.
        </h1>
        <div className="flex-col justify-center items-center w-full border border-slate-400 p-5 rounded-full">
        <h1 className="flex justify-center items-center w-full text-lg font-bold">OR CONNECT WALLET</h1>
        <div className="flex w-full justify-center items-center mt-3">
        <div>{!user.length ? <Loading size="xs" color="primary"/> : setConn(true)} <span>{!user.length ? "Connecting" : "Connected" }</span></div>
        </div>
        </div>
        <div className="flex-col grid text-sm "><strong>Example Crypto Wallets :</strong>
        <div className="flex justify-center items-center gap-x-3 mt-5">
        <div className="flex justify-center items-center gap-x-1">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/1024px-MetaMask_Fox.svg.png" className="w-6 h-6"/>Metamask
        </div>
        <div className="flex justify-center items-center gap-x-1">
        <img src="https://trustwallet.com/assets/images/media/assets/TWT.png" className="w-6 h-6"/>TrustWallet
        </div>
        <div className="flex justify-center items-center gap-x-1">
        <img src="https://app.coinmerge.io/assets/images/wallets/coinbasewallet-logo.png" className="w-6 h-6"/>Coinbase
        </div>
        <div className="flex justify-center items-center gap-x-1">
        <img src="https://assets-cdn.trustwallet.com/blockchains/binance/info/logo.png" className="w-6 h-6"/>Binance Wallet
        </div>
        </div>
        </div>
        </div>
        </div>
        : null }
    <div className=" scrollbar-thumb-slate-900 scrollbar-thin scrollbar-thumb-rounded-full scroll-smooth">
    {router.pathname == '/login' ? null
    : router.pathname == '/register' ? null
    : router.pathname == '/connectwallet' ? null
    : <Navbar/> 
    }
    <Notify/>
    <main className={router.pathname == '/register' ? 'flex justify-center items-center w-full'
    : router.pathname == '/admin/edit' ? 'w-full'
    : router.pathname == '/inbox' ? 'w-full px-3'
    : router.pathname == '/create' ? 'w-full px-3 my-28'
    : router.pathname == '/inbox/chat' ? 'w-full'
    : router.pathname == '/inbox/chat/[conversationId]' ? 'w-full px-3'
    : router.pathname == '/admin/users' ? 'w-full'
    : router.pathname == '/admin/posts' ? 'w-full'
    : router.pathname == '/[profile]' ? 'w-full'
    : router.pathname == '/notification' ? 'w-full px-3'
    : router.pathname == '/' ? 'w-full'
    : 'flex justify-center items-center w-full container mx-auto my-28'}>
    {children}
    </main>
    {router.pathname == '/login' ? null
    : router.pathname == '/register' ? null
    : router.pathname == '/connectwallet' ? null
    : <Footer/> 
    }
    </div>
    </Fragment>
    }
    {mathes.large &&
      <Fragment>
      {nowallet ?
        <div className="flex-col grid fixed justify-center items-center w-screen h-screen z-[9999] backdrop-blur-lg">

        {!user.length ? null : <AiOutlineClose onClick={() => setNoWallet(false)} size={22} className="z-[999] text-white font-bold border border-white rounded-full absolute top-5 right-5 w-12 h-12 p-1 hover:animate-spin hover:cursor-pointer"/>}

        <div className="flex-col transition-all duration-300 ease-out grid gap-y-5 justify-center items-center w-[530px] rounded-xl bg-white text-slate-950 p-10 z-50 shadow-xl shadow-slate-950 text-justify">
        <img src="https://media2.giphy.com/media/AA4N5haI6ldIfPfZqE/giphy.gif" className="w-52"/>
        <h1 className="text-xl font-bold">A crypto wallet is not defined in your browser. Re-enter this site by downloading one of the crypto wallet plugins to your browser and creating an account.
        </h1>
        <div className="flex-col justify-center items-center w-full border border-slate-400 p-5 rounded-full">
        <h1 className="flex justify-center items-center w-full text-lg font-bold">OR CONNECT WALLET</h1>
        <div className="flex w-full justify-center items-center mt-3">
        <div>{!user.length ? <Loading size="xs" color="primary"/> : setConn(true)} <span>{!user.length ? "Connecting" : "Connected" }</span></div>
        </div>
        </div>
        <div className="flex-col grid text-sm "><strong>Example Crypto Wallets :</strong>
        <div className="flex justify-center items-center gap-x-3 mt-5">
        <div className="flex justify-center items-center gap-x-1">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/1024px-MetaMask_Fox.svg.png" className="w-6 h-6"/>Metamask
        </div>
        <div className="flex justify-center items-center gap-x-1">
        <img src="https://trustwallet.com/assets/images/media/assets/TWT.png" className="w-6 h-6"/>TrustWallet
        </div>
        <div className="flex justify-center items-center gap-x-1">
        <img src="https://app.coinmerge.io/assets/images/wallets/coinbasewallet-logo.png" className="w-6 h-6"/>Coinbase
        </div>
        <div className="flex justify-center items-center gap-x-1">
        <img src="https://assets-cdn.trustwallet.com/blockchains/binance/info/logo.png" className="w-6 h-6"/>Binance Wallet
        </div>
        </div>
        </div>
        </div>
        </div>
        : null }
    <div className=" scrollbar-thumb-slate-900 scrollbar-thin scrollbar-thumb-rounded-full scroll-smooth">
    {router.pathname == '/login' ? null
    : router.pathname == '/register' ? null
    : router.pathname == '/connectwallet' ? null
    : <Navbar/> 
    }
    <Notify/>
    <main className={router.pathname == '/' ? 'w-full'
    : router.pathname == '/inbox' ? 'w-full px-7'
    : router.pathname == '/connectwallet' ? 'w-full'
    : router.pathname == '/inbox/chat' ? 'w-full'
    : router.pathname == '/inbox/chat/[conversationId]' ? 'w-full px-7'
    : router.pathname == '/[profile]' ? 'w-full'
    : router.pathname == '/admin/posts' ? 'w-full'
    : router.pathname == '/register' ? 'w-full'
    : router.pathname == '/login' ? 'w-full'
    : router.pathname == '/academy' ? 'flex justify-center items-center w-full'
    : 'flex justify-center items-center w-full container mx-auto my-28'}>
    {children}
    </main>
    {router.pathname == '/login' ? null
    : router.pathname == '/register' ? null
    : router.pathname == '/connectwallet' ? null
    : <Footer/> 
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

export default Layout;

