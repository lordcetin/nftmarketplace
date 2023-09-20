import React,{useState} from "react";
import { cipherSep,seprpc,sepmarket,sepauction,sepnft,septoken,simpleCrypto } from "@/engine/configuration";
import NFT from '@/engine/NFT.json';
import Market from '@/engine/Market.json';
import Auction from '@/engine/Auction.json';
import Token from '@/engine/Token.json';
import { ethers } from "ethers";
import axios from "axios";


const contentnfts = async () => {

    const network = seprpc
    const key = simpleCrypto.decrypt(cipherSep)
    const provider = new ethers.providers.JsonRpcProvider(network)
    const wallet = new ethers.Wallet(key, provider);
    let marketContract = new ethers.Contract(sepmarket, Market, wallet)
    let auctionContract = new ethers.Contract(sepauction, Auction, wallet)
    let nftContract = new ethers.Contract(sepnft, NFT, wallet)
    const data1 = await marketContract.getAvailableNft()
    const data2 = await auctionContract.getAllAuctions()
    const mumnfts = await Promise.all(data1.map(async i => {
      const tokenUri = await nftContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.holder,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }

      return item
    }))
    const allauctions = await Promise.all(data2.map(async i => {
      const tokenUri = await nftContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }

      return item
    }))

    let convall = Object.values(allauctions)
    let convertarr = Object.values(mumnfts)
    let allcontent = convertarr.concat(convall)
    
    return allcontent
  }

export default contentnfts;
