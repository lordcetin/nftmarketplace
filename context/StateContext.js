import React,{createContext,useContext,useState,useEffect,useReducer} from "react";
import {ethers} from 'ethers';
import Web3Modal from "web3modal";
import axios from "axios";
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import { hhnft,hhrpc,hhmarket,hhtoken,hhauction,hhnftcol,cipherHH} from '../engine/configuration';
import { sepnft,seprpc,septoken,sepmarket,sepauction,sepnftcol,cipherSep } from '../engine/configuration';
import { mmnft,mmrpc,mmtoken,mmmarket,mmauction,mmnftcol,cipherMM } from '../engine/configuration';
import { goenft,goenftcol,goerpc,goetoken,goemarket,goeauction} from '../engine/configuration';
import { bsctnft,bsctnftcol,bsctrpc,bsctmarket,bsctoken,bsctauction } from '../engine/configuration';
import { bscChain, polyChain, ethChain, hardChain, bscTest, ethTest, polyTest } from '../engine/chainchange';
import { cipherEth, simpleCrypto } from '../engine/configuration';
import uniqid from 'uniqid';


const Context = createContext();


export const StateContext = ({children}) => {
    const [user, getUser] = useState([])
    const [CRIBalance,setCRIBalance] = useState("0");

    const [fileUrl, setFileUrl] = useState(null)
    const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
    const [contAdr,setContAddr] = useState(null);
    const [nfts, setNfts] = useState([]);
    const [chain, getChainName] = useState([])
    const [cipher, getCipher] = useState([])
    const [rpc, getRpc] = useState([])
    const [nftcol, getNftCol] = useState([])
    const [cri,setTokenCri] = useState([])
    const [nftcustom, getNftCustom] = useState([])
    const [nftresell, getNftResell] = useState([])
    const [auction, getAuction] = useState([])
    const [owners,setOwners] = useState([]);
    const [marketcol, getMarket] = useState([])
    const [Token, getTokenAbi] = useState([])
    const [readData,setReadData] = useState([])
    const [conWallet,setConWallet] = useState(false);

    useEffect(() => {
      handleAdmin()
    }, []);

async function connectUser() {
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = await provider.getSigner();

      if (window.ethereum) {
        var web3 = new Web3(window.ethereum);
        await window.ethereum.send("eth_requestAccounts");
        var accounts = await web3.eth.getAccounts();
        var account = accounts[0];
        getUser(account)
      }
}

const handleAdmin = async () => {
        await fetch("https://testnet.cos-in.com/api/admin",{
        method:'GET',
        headers: {
          "Content-Type":"application/json"
        }
      }).then(res => {
        if(!res.ok){
          throw new Error("HTTP ERROR", res.status)
        }
        return res;
      }).then(res => res.json()).then((data) => {
        setReadData(data)
      }).catch(error => console.log(error))
      }

async function getNfts(){ 
      const options = {
        method: 'GET',
        url: 'https://polygon-mumbai.g.alchemy.com/nft/v2/M78G2nrd0Xjjj1KUyNfB82BZZYf_F9AT/getNFTs',
        params: {owner: user, pageSize: '5', withMetadata: 'true'},
        headers: {accept: 'application/json'}
      };
      
      axios
        .request(options)
        .then(res => {
          //console.log(res.data.ownedNfts)
          const cdata = res.data.ownedNfts.map((n) => {
              //console.log(n)
              setContAddr(n.contract.address);
            return{
                  contractAddres:n.contract.address,
                  tokenid:n.id.tokenId/*n.metadata.edition*/,
                  date:n.metadata.date,
                  description:n.metadata.description,
                  img:n.media[0].gateway,
                  name:n.metadata.name,
                  totalSupply:n.contractMetadata.totalSupply,
                  tokenUri:n.tokenUri.gateway
                  }
          })
          setNfts(cdata);
          //console.log("NFTS : ",nfts)
        }
        )
        .catch(function (error) {
          if (error.response){
              //console.log(error.response)
            }else if(error.request){
              //console.log(error.request)
            }else if(error.message){
              //console.log(error.message)
            }
        }); 
      }
async function getOwners(){
    const options = {
        method: 'GET',
        url: 'https://polygon-mumbai.g.alchemy.com/nft/v2/M78G2nrd0Xjjj1KUyNfB82BZZYf_F9AT/getOwnersForToken',
        params: {contractAddress: nfts.contractAddres, tokenId: nfts.tokenid},
        headers: {accept: 'application/json'}
      };
      
      axios
        .request(options)
        .then(function (response) {
          setOwners(response.data.owners)
          //console.log(owners)
        })
        .catch(function (error) {
          console.error(error);
        });
}      
async function bscChain() {
  try {
      await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x38' }],
      });
  } catch (switchError) {
      if (switchError.code === 4902) {
          try {
              await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [{
                      chainId: '0x38',
                      chainName: 'Binance Cosmeta',
                      nativeCurrency: {
                          name: 'BNB',
                          symbol: 'BNB',
                          decimals: 18,
                      },
                      rpcUrls: ['https://bsc-dataseed2.defibit.io'],
                      blockExplorerUrls: ['https://bscscan.com/'],
                  }]
              })
          } catch (addError) {
              console.log('Error adding Chain');
          }
      }
  }
}
async function polyChain() {
  try {
      await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x89' }],
      });
  } catch (switchError) {
      if (switchError.code === 4902) {
          try {
              await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [{
                      chainId: '0x89',
                      chainName: 'Polygon Cosmeta',
                      nativeCurrency: {
                          name: 'MATIC',
                          symbol: 'MATIC',
                          decimals: 18,
                      },
                      rpcUrls: ['https://matic-mainnet.chainstacklabs.com'],
                      blockExplorerUrls: ['https://polygonscan.com/'],
                  }]
              })
          } catch (addError) {
              console.log('Error adding Chain');
          }
      }
  }
}
async function ethChain() {
  try {
      await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x1' }],
      });
  } catch (switchError) {
      console.log('Wallet Not Connected')
  }
}
async function hardChain() {
  try {
      await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x7A69' }],
      });
  } catch (switchError) {
      if (switchError.code === 4902) {
          try {
              await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [{
                      chainId: '0x7A69',
                      chainName: 'HardHat',
                      nativeCurrency: {
                          name: 'ETH',
                          symbol: 'ETH',
                          decimals: 18,
                      },
                      rpcUrls: ['http://node.a3b.io:8545'],
                      blockExplorerUrls: [''],
                  }]
              })
          } catch (addError) {
              console.log('Error adding Chain');
          }
      }
  }
}
async function bscTest() {
  try {
      await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x61' }],
      });
  } catch (switchError) {
      if (switchError.code === 4902) {
          try {
              await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [{
                      chainId: '0x61',
                      chainName: 'BSC Testnet',
                      nativeCurrency: {
                          name: 'BNB',
                          symbol: 'BNB',
                          decimals: 18,
                      },
                      rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
                      blockExplorerUrls: ['https://testnet.bscscan.com/'],
                  }]
              })
          } catch (addError) {
              console.log('Error adding Chain');
          }
      }
  }
}
async function ethTest() {
  try {
      await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x5' }],
      });
  } catch (switchError) {
      console.log('Wallet Not Connected')
  }
}
async function polyTest() {
  try {
      await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x13881' }],
      });
  } catch (switchError) {
      if (switchError.code === 4902) {
          try {
              await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [{
                      chainId: '0x13881',
                      chainName: 'Polygon Mumbai',
                      nativeCurrency: {
                          name: 'MATIC',
                          symbol: 'MATIC',
                          decimals: 18,
                      },
                      rpcUrls: ['https://matic-mumbai.chainstacklabs.com'],
                      blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
                  }]
              })
          } catch (addError) {
              console.log('Error adding Chain');
          }
      }
  }
}
async function setChiper(){
  var hh = "0x7a69";
  var goe = "0x5";
  var mm = "0x13881";
  var sep = "0xaa36a7";
  var bsct = "0x61";
  const connected = await detectEthereumProvider();
  if (connected.chainId == hh) {
    var cipher = cipherHH
  }
  else if (connected.chainId == goe) {
    var cipher = cipherEth
  }
  else if (connected.chainId == mm) {
    var cipher = cipherMM
  }
  else if (connected.chainId == bsct) {
    var cipher = cipherEth
  }
  else if (connected.chainId == sep) {
    var cipher = cipherSep
  }
  getCipher(cipher);
  //console.log(mainnet)
  setRpc();
}
async function setRpc(){
    var hh = "0x7a69";
    var goe = "0x5";
    var mm = "0x13881";
    var sep = "0xaa36a7";
    var bsct = "0x61";
    const connected = await detectEthereumProvider();
    if (connected.chainId == hh) {
      var mainnet = hhrpc
    }
    else if (connected.chainId == goe) {
      var mainnet = goerpc
    }
    else if (connected.chainId == mm) {
      var mainnet = seprpc
    }
    else if (connected.chainId == bsct) {
      var mainnet = bsctrpc
    }
    else if (connected.chainId == sep) {
      var mainnet = seprpc
    }
    getRpc(mainnet);
    //console.log(mainnet)
    setNftCol();
  }
async function setNftCol(){
    var hh = "0x7a69";
    var goe = "0x5";
    var mm = "0x13881";
    var sep = "0xaa36a7";
    var bsct = "0x61";
    const connected = await detectEthereumProvider();
    if (connected.chainId == hh) {
      var nftcol = hhnftcol
    }
    else if (connected.chainId == goe) {
      var nftcol = goenftcol
    }
    else if (connected.chainId == mm) {
      var nftcol = sepnftcol
    }
    else if (connected.chainId == bsct) {
      var nftcol = bsctnftcol
    }
    else if (connected.chainId == sep) {
      var nftcol = sepnftcol
    }
    getNftCol(nftcol);
    //console.log(nftcol)
    setTokenCol();
  }
async function setTokenCol(){
    var hh = "0x7a69";
    var goe = "0x5";
    var mm = "0x13881";
    var sep = "0xaa36a7";
    var bsct = "0x61";
    const connected = await detectEthereumProvider();
    if (connected.chainId == hh) {
      var cri = hhtoken
    }
    else if (connected.chainId == goe) {
      var cri = goetoken
    }
    else if (connected.chainId == mm) {
      var cri = septoken
    }
    else if (connected.chainId == bsct) {
      var cri = bsctoken
    }
    else if (connected.chainId == sep) {
      var cri = septoken
    }
    setTokenCri(cri)
    //console.log(nftcol)
    setNftCustom();
  }
async function setNftCustom(){
    var hh = "0x7a69";
    var goe = "0x5";
    var mm = "0x13881";
    var sep = "0xaa36a7";
    var bsct = "0x61";
    const connected = await detectEthereumProvider();
    if (connected.chainId == hh) {
      var nft = hhnft
    }
    else if (connected.chainId == goe) {
      var nft = goenft
    }
    else if (connected.chainId == mm) {
      var nft = sepnft
    }
    else if (connected.chainId == bsct) {
      var nft = bsctnft
    }
    else if (connected.chainId == sep) {
      var nft = sepnft
    }
    getNftCustom(nft);
    //console.log("NFT CUSTOM :",nft)
    setMarket();
  }
async function setMarket(){
    var hh = "0x7a69";
    var goe = "0x5";
    var mm = "0x13881";
    var sep = "0xaa36a7";
    var bsct = "0x61";
    const connected = await detectEthereumProvider();
    if (connected.chainId == hh) {
      var market = hhmarket
    }
    else if (connected.chainId == goe) {
      var market = goemarket
    }
    else if (connected.chainId == mm) {
      var market = sepmarket
    }
    else if (connected.chainId == bsct) {
      var market = bsctmarket
    }
    else if (connected.chainId == sep) {
      var market = sepmarket
    }
    getMarket(market);
    //console.log("Market :",market)
    setAuction();
  }
async function setAuction(){
    var hh = "0x7a69";
    var goe = "0x5";
    var mm = "0x13881";
    var sep = "0xaa36a7";
    var bsct = "0x61";
    const connected = await detectEthereumProvider();
    if (connected.chainId == hh) {
      var auction = hhauction
    }
    else if (connected.chainId == goe) {
      var auction = goeauction
    }
    else if (connected.chainId == mm) {
      var auction = sepauction
    }
    else if (connected.chainId == bsct) {
      var auction = bsctauction
    }
    else if (connected.chainId == sep) {
      var auction = sepauction
    }
    getAuction(auction);
    //console.log("Market :",market)
    getChain();
  }
async function getChain(){
    var hh = "0x7a69";
    var goe = "0x5";
    var mm = "0x13881";
    var sep = "0xaa36a7";
    var bsct = "0x61";
    const connected = await detectEthereumProvider();
    if (connected.chainId == hh) {
      var chainname = "HardHat"
    }
    else if (connected.chainId == goe) {
      var chainname = "Goerli Testnet"
    }
    else if (connected.chainId == mm) {
      var chainname = "Mumbai Testnet"
    }
    else if (connected.chainId == bsct) {
      var chainname = "BSC Testnet"
    }
    else if (connected.chainId == sep) {
      var chainname = "Sepolia"
    }
    getChainName(chainname);
    //console.log(chainname)
  }

    return(
        <Context.Provider value={{
            user,
            getUser,
            CRIBalance,
            connectUser,
            conWallet,
            setConWallet,
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
            setRpc,
            setChiper,
            chain,
            getChainName,
            cipher,
            rpc,
            getRpc,
            marketcol,
            getMarket,
            auction,
            getAuction,
            nftcol, getNftCol,
            cri,setTokenCri,
            nftcustom, getNftCustom,
            nftresell, getNftResell,
            owners,setOwners,
            readData
        }}>
        {children}
        </Context.Provider>
        );
}

export const useStateContext = () => useContext(Context);