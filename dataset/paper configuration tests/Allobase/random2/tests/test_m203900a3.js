const { expect } = require("chai");
const { waffle } = require("hardhat");
const { deployTokens } = require('./helper.js');
const { loadFixture } = waffle;

describe.only("Test ERC20 Mutation", function () {
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

  it("Kill Mutant - Test ERC20WrapperTpl OnlyUnderlying Mutation", async function () {
    const { factory, manager, nft, ft, wft, managerEoaMock, addr2, addr3 } = await loadFixture(deployTokensAndMint);

    await expect(wft.connect(addr2).mintTo(addr3.address, ethers.BigNumber.from("1000000000000000000"))).to.be.revertedWith("Not underlying");
  });
});