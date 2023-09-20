/*

  /$$$$$$                                                /$$              
 /$$__  $$                                              | $$              
| $$  \__/  /$$$$$$   /$$$$$$$ /$$$$$$/$$$$   /$$$$$$  /$$$$$$    /$$$$$$ 
| $$       /$$__  $$ /$$_____/| $$_  $$_  $$ /$$__  $$|_  $$_/   |____  $$
| $$      | $$  \ $$|  $$$$$$ | $$ \ $$ \ $$| $$$$$$$$  | $$      /$$$$$$$
| $$    $$| $$  | $$ \____  $$| $$ | $$ | $$| $$_____/  | $$ /$$ /$$__  $$
|  $$$$$$/|  $$$$$$/ /$$$$$$$/| $$ | $$ | $$|  $$$$$$$  |  $$$$/|  $$$$$$$
 \______/  \______/ |_______/ |__/ |__/ |__/ \_______/   \___/   \_______/
                                                                          
*/

import SimpleCrypto from "simple-crypto-js";
const { Buffer } = require("buffer");

const cipherKey = "0x$65468fgdag5645s6d4gsdgdsgdg5665448dsg4";
const ethraw = "0xa100739045cca2b3e61fd99d72af833a4f4d33e6d57882a30f04ff889afeea9a"; // eth private key
const mmraw = "0xa100739045cca2b3e61fd99d72af833a4f4d33e6d57882a30f04ff889afeea9a"; // eth private key
const hhraw =  "0xa100739045cca2b3e61fd99d72af833a4f4d33e6d57882a30f04ff889afeea9a"; // hardhat private key
const sepraw =  "0x843a8f4966061debcbda878af122eb824b3ff99a847f456caa17dddc17223281"; // sepolia private key

export const simpleCrypto = new SimpleCrypto(cipherKey);
export const cipherEth = simpleCrypto.encrypt(ethraw);
export const cipherMM = simpleCrypto.encrypt(mmraw);
export const cipherHH = simpleCrypto.encrypt(hhraw);
export const cipherSep = simpleCrypto.encrypt(sepraw);

// IPFS CONFIGURATION
import {create as ipfsHttpClient} from 'ipfs-http-client';

const projectId = "2FraJroGw9rXeeUTFgGRO7P7sFy";
const projectSecretKey = "0a5ffc989190cb176f8729872bfbf76d";
const auth = `Basic ${Buffer.from(`${projectId}:${projectSecretKey}`).toString(
  "base64"
)}`;

export const client = ipfsHttpClient({
  host: "infura-ipfs.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

// HARDHAT TESTNET
export var hhnftcol = "0x4A679253410272dd5232B3Ff7cF5dbB88f295319";
export var hhresell = "0x220a5D87A7Ee47C18616E563056C52595A8aaDE9";
export var hhmarket = "0xFA3ce0007281F5e4b96eb346318f1B8767A3fa20";
export var hhnft = "0x2145FFF5a7281bC95899cA5aa5D24a99CE08A234";
export var hhauction = "0xbC5CaA736579fB6Bd984F0cFc105929eB01a0A64";
export var hhtoken = "0xDaedb370515bD24261988cD217901E82ef7Fa74F";
export var hhrpc = "http://127.0.0.1:8545"//"https://mainnet.infura.io/v3/";

// SEPOLIA
export var sepnftcol = "0x6c176B32F693d420F64fb5fFAe14Ea93a19C0Cd4";
export var sepresell = "0x3fA509e2c1bd5bb6E630e187f350dc61E0E4de0b";
export var sepmarket = "0xD8AeE775542fE662a259CE83DF3923563502597A";
export var sepauction = "0x2ecb2efA9ad215Fc9726B10fc4af4736eEBd699C";
export var sepnft     = "0xE338a08138ED3896D665dCbb2CbA12b0FbeDf980";
export var septoken = "0xc5dB175704037Fc1DF7c9b0Ee8e7a91C6C0D6776";
export var seprpc = "https://icy-late-research.ethereum-sepolia.discover.quiknode.pro/0fd889280a5eda3fbc4e4f782bd37b1047a01cef/";

// ETH
export var ethmarket = "0xF92F565811E05Cd7CEb9270025952de5b234E264";
export var ethauction = "0xad639A9F446A9B184c69DF8dB09E5b72c0FD7741";
export var ethnft = "0xBe011f94Af4E3b45156B91ad9067bA1cc9B79eFA";
export var ethtoken = "0x12E951934246186F50146235d541D3bD1D463E4d";
export var ethrpc = "https://eth-mainnet.g.alchemy.com/v2/PnRnZoXWYeokroVtzY2pfdxTeDTaaBfu";

// GOERLI TESTNET
export var goenftcol = "0x6c176B32F693d420F64fb5fFAe14Ea93a19C0Cd4";
export var goeresell = "0xe48c0E89364B171b5DD44618611977376ea33740";
export var goemarket = "0x494A40553882df596afcE1348dE05cEB9A0d1091";
export var goeauction = "0xB4A6D67DF7dE9Ee0D6954e550Ca8B45C4c7D10fB";
export var goenft = "0x654112347E34eab559Ea0b175185438B47da1fF4";
export var goetoken = "0x8Af1c45aDe5EC4494AE64A019c35da99fBe182c7";
export var goerpc = "https://rpc.ankr.com/eth_goerli";

// BSC TESTNET
export var bsctnftcol = "0x22646942F753282AA6931c6C159f4d2AB1A7845a";
export var bsctresell = "0x4172CA3EEa130D9753E5EBc4d28C0F480eD7b920";
export var bsctmarket = "0x847C13Ca5fd3Ff58E0a6f8c294Da0c5022Bc58c4";
export var bsctauction = "";
export var bsctnft = "0x65A625b7bc221526b298c42959b88Ee36CD602Af";
export var bsctoken = "0x5A1499Db78697247da3C7ec00F19D414F7E20aB1";
export var bsctrpc = "https://data-seed-prebsc-1-s1.binance.org:8545";

/* MUMBAI */
export var mmnftcol    = "0x3F72119152737dd6216b400F6c0CD15988A61F5e";
export var fakecosmeta = "0x2BeB51e7CaAA3937EEc769e7D8E59FC7e6F74bbd";
export var mmresell    = "0x4f540D42121F4B8B62BBe17fDE4ae011AC05aeF5";
export var mmystery    = "0xba5bACb4F3bA587c44B0d6D74A6012908580fF6c";
export var mmmarket    = "0xeca65a1815A07776dAc85137D06B83362D46845B";
export var mmauction   = "0xac70B49D8e594C4E5a677b65f02088cf11E58A66";
export var mmnft       = "0xF194471fd8A0Bf537Ceb58B370F37ce22677C748";
export var mmtoken     = "0x2a72fd336aD4Dd7Adff3E32cC3c49189B9e58882";
export var mmrpc       = "https://rpc-mumbai.maticvigil.com";
let ipfsUri = "https://ipfs.io/ipfs/QmYZUtsQkPCdKnmS8ya6JmwtL8GKPnUmavcJ4DZkLAbz3p";
/*
NETWORK RPC ADDRESSES, Choose one then 
change the value of "hhrpc" below.
*/
// var mumbai = 'https://endpoints.omniatech.io/v1/matic/mumbai/public';
// var goerli = 'https://rpc.ankr.com/eth_goerli';
// var binance = 'https://data-seed-prebsc-2-s3.binance.org:8545';

// //if you can change the hhrpc value goerli variable or "http://localhost:8545/"
// var hhrpc = "http://localhost:8545/";
// /*
// Global Parameters
// */
export var mainnet = seprpc
