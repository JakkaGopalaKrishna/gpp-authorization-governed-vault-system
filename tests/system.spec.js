const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Authorization-Governed Vault", function () {
  it("allows valid withdrawal and prevents replay", async function () {
    const [authorizer, user, recipient] = await ethers.getSigners();

    const Auth = await ethers.getContractFactory("AuthorizationManager");
    const auth = await Auth.deploy(authorizer.address);

    const Vault = await ethers.getContractFactory("SecureVault");
    const vault = await Vault.deploy(auth.target);

    await user.sendTransaction({
      to: vault.target,
      value: ethers.parseEther("1"),
    });

    const nonce = 1;
    const amount = ethers.parseEther("0.5");

    const hash = ethers.solidityPackedKeccak256(
      ["uint256", "address", "address", "uint256", "uint256"],
      [31337, vault.target, recipient.address, amount, nonce]
    );

    const signature = await authorizer.signMessage(
      ethers.getBytes(hash)
    );

    await vault.withdraw(recipient.address, amount, nonce, signature);

    await expect(
      vault.withdraw(recipient.address, amount, nonce, signature)
    ).to.be.revertedWith("Authorization already used");
  });
});
