import React, { Fragment,useEffect } from "react";
import Media from "react-media";
import { useRouter } from "next/router";
import CustomButton from "@/components/CustomButton";
import Head from 'next/head';

const Connectwallet = () => {
	const router = useRouter()

		useEffect(() => {
			if(window?.ethereum){
				router.push('/')
			}
		  },[])

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
						<title>Connect Wallet • Cosmeta NFT Marketplace</title>
						</Head>
						<div className="overflow-hidden">
							
							<div className="flex-col transition-all duration-300 ease-out relative grid gap-y-5 justify-center items-center w-[300px] rounded-xl bg-white text-slate-950 p-10 z-[9999] shadow-xl shadow-slate-950 text-center">
							<img src="https://media2.giphy.com/media/AA4N5haI6ldIfPfZqE/giphy.gif"/>
							<h1 className="text-xl font-bold">A crypto wallet is not defined in your browser. Re-enter this site by downloading one of the crypto wallet plugins to your browser and creating an account.
							</h1>
							<div className="flex-col justify-center items-center w-full border border-slate-400 p-5 rounded-full">
							<h1 className="flex justify-center items-center w-full text-xs font-bold">OR CONNECT WALLET</h1>
							<div className="flex w-full justify-center items-center mt-3">
							<CustomButton/>
							</div>
							</div>
							<div className="flex-col grid text-sm "><strong>Example Crypto Wallets :</strong>
							<div className="flex-col justify-center items-center text-left gap-y-3 mt-5">
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
							<div className="fixed w-screen h-screen top-0 left-0 z-0 scale-150 blur-xl opacity-80">
							<video src="https://nftstorage.link/ipfs/bafybeif5ltkwsjf735sh3hpjlix6d5pmwmenqmrcfohssw6vywobhqjxua" className="" autoPlay loop />
							</div>
						</div>

						</Fragment>
					}
					{matches.medium &&
						<Fragment>
						<Head>
						<title>Connect Wallet • Cosmeta NFT Marketplace</title>
						</Head>
						<div className="overflow-hidden">
							
							<div className="flex-col transition-all duration-300 ease-out relative grid gap-y-5 justify-center items-center w-[530px] rounded-xl bg-white text-slate-950 p-10 z-[9999] shadow-xl shadow-slate-950 text-justify">
							<img src="https://media2.giphy.com/media/AA4N5haI6ldIfPfZqE/giphy.gif"/>
							<h1 className="text-xl font-bold">A crypto wallet is not defined in your browser. Re-enter this site by downloading one of the crypto wallet plugins to your browser and creating an account.
							</h1>
							<div className="flex-col justify-center items-center w-full border border-slate-400 p-5 rounded-full">
							<h1 className="flex justify-center items-center w-full text-lg font-bold">OR CONNECT WALLET</h1>
							<div className="flex w-full justify-center items-center mt-3">
							<CustomButton/>
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
							<div className="fixed w-screen h-screen top-0 left-0 z-0 scale-150 blur-xl opacity-80">
							<video src="https://nftstorage.link/ipfs/bafybeif5ltkwsjf735sh3hpjlix6d5pmwmenqmrcfohssw6vywobhqjxua" className="" autoPlay loop />
							</div>
						</div>
						</Fragment>
					}
					{matches.large &&
						<Fragment>
						<Head>
						<title>Connect Wallet • Cosmeta NFT Marketplace</title>
						</Head>
						<div className="absolute w-screen h-screen justify-center items-center flex">
							
							<div className="flex-col transition-all duration-300 ease-out grid gap-y-5 justify-center items-center w-[530px] rounded-xl bg-white text-slate-950 p-10 z-50 shadow-xl shadow-slate-950 text-justify">
							<img src="https://media2.giphy.com/media/AA4N5haI6ldIfPfZqE/giphy.gif"/>
							<h1 className="text-xl font-bold">A crypto wallet is not defined in your browser. Re-enter this site by downloading one of the crypto wallet plugins to your browser and creating an account.
							</h1>
							<div className="flex-col justify-center items-center w-full border border-slate-400 p-5 rounded-full">
							<h1 className="flex justify-center items-center w-full text-lg font-bold">OR CONNECT WALLET</h1>
							<div className="flex w-full justify-center items-center mt-3">
							<CustomButton/>
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
							<div className="fixed w-screen h-screen top-0 left-96 z-0 scale-150 blur-xl opacity-80">
							<video src="https://nftstorage.link/ipfs/bafybeif5ltkwsjf735sh3hpjlix6d5pmwmenqmrcfohssw6vywobhqjxua" className="" autoPlay loop />
							</div>
{/*						<div className='fixed top-0 left-0'>
						<div className="absolute w-screen h-screen top-0 left-0 bg-black opacity-20 z-0">
						<iframe className="PhotoZoom_iframe__LeuQM w-full h-screen absolute z-0 scale-150 blur-lg saturate-100" allowFullScreen="" frameBorder="0" src="//player.vimeo.com/video/471585055?title=0&amp;horizontal=1&amp;byline=1&amp;autoplay=true&amp;muted=true&amp;loop=true"__idm_id__="27967492"></iframe>
						</div>
						</div>*/}
						</Fragment>
					}
				</Fragment>
    	)}
      </Media>
    </div>
    );
};

export default Connectwallet;
