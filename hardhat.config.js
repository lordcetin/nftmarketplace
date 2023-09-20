require("@nomiclabs/hardhat-waffle");
require('dotenv').config()

const quiknode_sepolia = 'https://icy-late-research.ethereum-sepolia.discover.quiknode.pro/0fd889280a5eda3fbc4e4f782bd37b1047a01cef/';
const sepolia_privatekey = '0x843a8f4966061debcbda878af122eb824b3ff99a847f456caa17dddc17223281';

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork:"hardhat",
  networks:{
    sepolia:{
      url:quiknode_sepolia,
      accounts: [sepolia_privatekey]
    },
    "op-goerli": {
      url: 'https://opt-goerli.g.alchemy.com/v2/CrEvPexrxqkTPJQu_NFYz4ZRNi9vYK5i',
      accounts: [process.env.OPRVKEY],
    },
    "goerli": {
      url: 'https://eth-goerli.g.alchemy.com/v2/0bq0-rwNnSdclAvMMSa8F2t4wSz-1L4i',
      accounts: [process.env.GOPRVKEY],
    }
  },
  solidity: {
    version: "0.8.18",
    settings:{
      optimizer:{
        enabled: true,
        runs:200
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
};
