const { expect } = require("chai");
const { waffle } = require("hardhat");
const { deployTokens } = require('./helper.js');
const { loadFixture } = waffle;

describe("Test ERC721Base with Mutation", function () {
  async function deployTokensAndMint() {
    [managerEoaMock, addr2, addr3] = await ethers.getSigners();

    const {factory, manager, nft, ft, wft} = await deployTokens('AU ALLO', 'AUAL', 'OZ');

    await nft.connect(managerEoaMock).issue(ft.address, [
      ethers.BigNumber.from("1000000000000000000"),
      ethers.BigNumber.from("2000000000000000000")
    ], ['', '']);
    await ft.issue(addr2.address, '3000000000000000000');

    return {factory, manager, nft, ft, wft, managerEoaMock, addr2, addr3};
  }

  it("TransferFrom Mutation Test", async function () {
    const { factory, manager, nft, ft, wft, managerEoaMock, addr2, addr3 } = await loadFixture(deployTokensAndMint);

    // Get the tokenId of the NFT owned by addr2
    let tokenId = 1; // assuming addr2 owns the first NFT token

    // Approve addr3 to transfer tokenId
    await ft.connect(addr2).approve(addr3.address, tokenId);

    // Transfer the NFT from addr2 to addr3
    await expect(ft.connect(addr3).transferFrom(addr2.address, addr3.address, tokenId)).to.not.be.reverted;
  });

});