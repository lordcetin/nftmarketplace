import React from "react";
import Link from "next/link";
import { MdVerified } from "react-icons/md";
const NftCard = ({nft}) => {
  return (
    <div>
    <div key={nft.tokenId} className="w-[300px] h-[530px] pb-3 relative hover:bottom-2 bg-gradient-to-tr to-slate-600 from-slate-900 border-slate-800 border-r-slate-700 rounded-xl  overflow-hidden border-2">

    <img src={nft.wichNet == 'Ethereum' ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/480px-Ethereum-icon-purple.svg.png' : nft.wichNet == 'Polygon' ? 'https://cryptologos.cc/logos/polygon-matic-logo.png' : nft.wichNet == 'Binance' ? 'https://seeklogo.com/images/B/binance-coin-bnb-logo-97F9D55608-seeklogo.com.png' : null} className="z-30 object-cover w-5 absolute top-2 left-2"/>
    {nft.fileType == 'video/mp4' || nft.fileType == 'video/mov'
        ? <Link href={`/details/${nft.id}`}><video src={nft.images} className="rounded-t-xl w-full h-[296px]" autoPlay muted loop/></Link>
        : nft.fileType == 'image/png' || nft.fileType == 'image/jpeg' || nft.fileType == 'image/jpg' || nft.fileType == 'image/webp' ? <Link href={`/details/${nft.id}`}><img className='rounded-t-xl object-cover w-full h-[296px]' src={nft.images} /></Link>
        : nft.fileType == 'audio/mp3' || nft.fileType == 'audio/wav' || nft.fileType == 'audio/ogg' || nft.fileType == 'audio/mpeg' ? <AudioPlayer nft={nft.images} nftname={nft.name} nftid={nft.id}/> : null
        }
        <div className='flex-col px-5'>
              <div className='flex justify-between items-center w-full my-3'>
                      
              <div className="flex justify-between items-center w-full">
              <div className='justify-start items-center'>
                <h3 className="text-md font-medium cursor-pointer text-purple-500 flex items-center gap-x-1">{nft.avatar ? <img src={nft.avatar} className="rounded-full w-3 mr-1"/>:null}{!nft.username == "" ? nft.username : user.slice(0,11) + '...'} {nft.verified == 'verified' ? <MdVerified size={18}/>: null}</h3>
              </div>
              </div>
              <div className='flex justify-end items-center w-full'>
              <h3 className='font-medium text-sm text-center bg-slate-800 text-slate-500 py-1 px-3 rounded-md'>Token ID : {nft.tokenId}</h3>
              </div>
              
              </div>
              <div>
              <h1 className='font-medium text-lg'>{nft.name}</h1>
              </div>
              <div className='flex justify-between my-4 items-center gap-x-2 border-[1px] border-slate-600 rounded'>
              <div className='w-full '>
              <h1 className='font-bold text-lg flex items-center gap-x-2 py-2 px-3  text-slate-500'>Price : &nbsp;{nft.price}</h1>
              </div>
              <div className='px-3'>
                <img src='https://etherscan.io/token/images/cosmeta_32.png' className='object-cover w-10' title='Crypto International (CRI)' />
              </div>
                </div>
              </div>
              <div className='flex justify-between items-center mx-2 gap-x-2 pb-3'>
              <div className='w-full'>
              <button className='bottom-0 bg-gradient-to-tr to-slate-800 z-30 border-[1px] border-slate-700 rounded-lg from-slate-800 hover:to-purple-600 hover:from-blue-700 relative w-full h-10 text-white' onClick={() => buyNewMum(nft)}>Buy</button>
              </div>
              </div>
              </div>
    </div>
    );
};

export default NftCard;
