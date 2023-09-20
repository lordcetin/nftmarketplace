import React from "react";
import { cipherEth,seprpc,sepmarket,sepnft,simpleCrypto,cipherSep } from "@/engine/configuration";
import axios from "axios";
import { ethers } from "ethers";
import NFT from '@/engine/NFT.json';

async function creatednfts() {
    var network = seprpc
    const provider = new ethers.providers.JsonRpcProvider(network)
    const key = simpleCrypto.decrypt(cipherSep)//cipherEth
    const wallet = new ethers.Wallet(key, provider);
    const contract = new ethers.Contract(sepnft, NFT, wallet);
    const itemArray = [];
      contract._tokenIds().then(result => {
        for (let i = 0; i < result; i++) {
          let token = i + 1                         
          const owner = contract.ownerOf(token)
          const rawUri = contract.tokenURI(token)
          const Uri = Promise.resolve(rawUri)
          const getUri = Uri.then(value => {
            let cleanUri = value.replace('ipfs://', 'https://ipfs.io/ipfs/')
            let metadata = axios.get(cleanUri)
            return metadata;
          })
          getUri.then(value => {
            let rawImg = value.data.image
            let type = value.data.fileType
            let website = value.data.website
            let blockchain = value.data.wichNet
            let name = value.data.name
            let username = value.data.username
            let verified = value.data.role
            let desc = value.data.description
            let createdWallet = value.data.createdWallet
            let price = value.data.price
            let id = value.data.id
            let image = rawImg.replace('ipfs://', 'https://ipfs.io/ipfs/')
            Promise.resolve(owner).then(value => {
              let ownerW = value;
              let meta = {
                id:id,
                name: name,
                username:username,
                verified:verified,
                img: image,
                type:type,
                blockchain:blockchain,
                website:website,
                tokenId: token,
                ownerW: ownerW,
                createdWallet:createdWallet,
                description:desc,
                price:price,
              }
  
              itemArray.push(meta)
            })
          })
        }
  
      })
      return (itemArray)
  }

export default creatednfts;
