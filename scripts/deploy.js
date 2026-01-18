const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Network:", (await ethers.provider.getNetwork()).chainId);

  const Auth = await ethers.getContractFactory("AuthorizationManager");
  const auth = await Auth.deploy(deployer.address);

  const Vault = await ethers.getContractFactory("SecureVault");
  const vault = await Vault.deploy(auth.target);

  console.log("AuthorizationManager:", auth.target);
  console.log("SecureVault:", vault.target);
}

main().catch(console.error);
