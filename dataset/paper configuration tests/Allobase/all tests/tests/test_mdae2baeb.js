const { expect } = require("chai");
const { deployMockContract } = require("ethereum-waffle");
const { waffle } = require("hardhat");
const { deployTokens } = require('./helper.js');
const { loadFixture } = waffle;

describe("Test ERC20 Mutation", function () {
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

  it("Test ERC20 Mutation", async function () {
    const { factory, manager, nft, ft, wft, managerEoaMock, addr2, addr3 } = await loadFixture(deployTokensAndMint);

    // Set balance to less than transfer amount
    await ft.connect(addr2).transfer(addr3.address, ethers.BigNumber.from("2000000000000000000"));
    expect(await ft.balanceOf(addr2.address)).to.equal(ethers.BigNumber.from("1000000000000000000"));
    expect(await ft.balanceOf(addr3.address)).to.equal(ethers.BigNumber.from("2000000000000000000"));
  });
});