const { expect } = require("chai");
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

  it("Mutate ERC20 Contract - Redeem", async function () {
    const { factory, manager, nft, ft, wft, managerEoaMock, addr2, addr3 } = await loadFixture(deployTokensAndMint);
    
    await ft.connect(addr2).transfer(managerEoaMock.address, ethers.BigNumber.from("1000000000000000000"));

    await expect(ft.connect(managerEoaMock).redeem(ethers.BigNumber.from("3000000000000000000"), [
      ethers.BigNumber.from("1"),
      ethers.BigNumber.from("2")
    ])).to.be.revertedWith("ERC20: burn amount exceeds balance");
  });

});