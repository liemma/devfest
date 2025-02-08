// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const Marketplace = await hre.ethers.getContractFactory("CarbonCredit");
  const marketplace = await Marketplace.deploy();          // Deploy
  await marketplace.waitForDeployment();                   // Wait for it
  console.log("Marketplace deployed to:", await marketplace.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
