const { expect } = require("chai");

describe("Test case to kill the solidity mutant", function() {
  it("Should revert when Redeeming with invalid token IDs and not emit Redeemed event", async function() {
    const { ethers } = require("hardhat");
    
    let factory, manager, nft, ft, wft, managerEoaMock, addr2, addr3;
    
    // Deploy ERC20Tpl contract and set up necessary variables for testing
    const deployContracts = async () => {
      const Factory = await ethers.getContractFactory("ERC20Tpl");
      factory = await Factory.deploy();
      await factory.deployed();

      // Deploy mock contracts for testing
      const ManagerEoaMock = await ethers.getContractFactory("ManagerEoaMock");
      managerEoaMock = await ManagerEoaMock.deploy();
      await managerEoaMock.deployed();

      const NFT = await ethers.getContractFactory("MockERC721Tpl");
      nft = await NFT.deploy();
      await nft.deployed();

      const FT = await ethers.getContractFactory("MockERC20WrapperTpl");
      ft = await FT.deploy();
      await ft.deployed();

      const WFT = await ethers.getContractFactory("MockERC20WrapperTpl");
      wft = await WFT.deploy();
      await wft.deployed();

      // Set addresses for testing
      manager = managerEoaMock.address;
      addr2 = ethers.Wallet.createRandom().address;
      addr3 = ethers.Wallet.createRandom().address;

      // Initialize ERC20Tpl contract with mock contract addresses
      await factory.initialize("Token", "TKN", manager, nft.address, wft.address);
    }

    // Redeem with invalid token ID
    it("reverts when redeeming with invalid token IDs", async () => {
      await deployContracts();

      // Move tokens to managerEoaMock for redemption
      await ft.connect(addr2).transfer(managerEoaMock.address, ethers.BigNumber.from("1000000000000000000"));

      // Expect the redeem function to revert when using an invalid token ID
      await expect(
        ft.connect(managerEoaMock).redeem(ethers.BigNumber.from("3000000000000000000"), [ethers.BigNumber.from("1000")]) // Using an invalid token ID
      ).to.be.reverted;
    });

    // Check if Redeemed event is not emitted
    it("does not emit Redeemed event when redeeming with invalid token IDs", async () => {
      await deployContracts();

      await ft.connect(addr2).transfer(managerEoaMock.address, ethers.BigNumber.from("1000000000000000000"));

      // Expect the redeem function to not emit Redeemed event when using invalid token IDs
      await expect(
        ft.connect(managerEoaMock).redeem(ethers.BigNumber.from("2000000000000000000"), [ethers.BigNumber.from("1")])
      ).to.not.emit(ft, "Redeemed");
    });

    // Additional checks for state changes
    it("ensures correct state changes after redeeming with invalid token IDs", async () => {
      await deployContracts();

      await ft.connect(addr2).transfer(managerEoaMock.address, ethers.BigNumber.from("1000000000000000000"));

      await ft.connect(managerEoaMock).redeem(ethers.BigNumber.from("2000000000000000000"), [ethers.BigNumber.from("1")]);

      // Check if totalSupply, totalShares, balances, and NFT states have not changed after unsuccessful redeem
      expect(await ft.totalSupply()).to.not.equal(0);
      expect(await ft.totalShares()).to.not.equal(0);
      expect(await ft.sharesOf(managerEoaMock.address)).to.not.equal(0);
      expect(await nft.balanceOf(managerEoaMock.address)).to.not.equal(0);
      expect(await nft.totalSupply()).to.not.equal(0);
      expect(await nft.balanceOf(ft.address)).to.not.equal(0);
    });
  });
});