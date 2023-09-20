import React,{useEffect,useState} from "react";
import Auction from '../engine/Auction.json';
import Token from '../engine/Token.json';
import { cipherEth, cipherMM, simpleCrypto } from '../engine/configuration';
import Web3Modal from "web3modal";
import { ethers } from 'ethers';
import { useStateContext } from '../context/StateContext';
import Countdown from "./Countdown";


const AllBidders = ({tokenId,winner,duration,setLoaded}) => {
  const {user,getUser,connectUser,auction,cri,rpc,cipher} = useStateContext();

  const [count,setCount] = useState(15)




  return (
    <div>

    </div>
    );
};

export default AllBidders;
