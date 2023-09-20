// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {

  // const CRIL1 = await hre.ethers.getContractFactory("CRI");
  // const cril1 = await CRIL1.deploy("Cosmeta","CRI","1000000000000000000000000","10000000000000000000000","1");

  const CRIL2 = await hre.ethers.getContractFactory("CRIL2");
  const cril2 = await CRIL2.deploy("","CRI","1000000000000000000000000","10000000000000000000000","1");

  // await cril1.deployed();
  await cril2.deployed();

  console.log(
    `CRI deployed to ${cril2.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
