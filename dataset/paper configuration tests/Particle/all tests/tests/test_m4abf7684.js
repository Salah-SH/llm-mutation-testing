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

  it("Balance Mutation", async function () {
    const { factory, manager, nft, ft, wft, managerEoaMock, addr2, addr3 } = await loadFixture(deployTokensAndMint);
    const shareBase = await ft.shareBase();
    expect(await ft.balanceOf(addr2.address)).to.equal(ethers.BigNumber.from("3000000000000000000"));
    expect(await ft.sharesOf(addr2.address)).to.equal(ethers.BigNumber.from("3000000000000000000").mul(shareBase));
    expect(await ft.totalSupply()).to.equal(ethers.BigNumber.from("3000000000000000000"));
    expect(await ft.totalShares()).to.equal(ethers.BigNumber.from("3000000000000000000").mul(shareBase));

    // Test mutant: Change '>' to '>=' at line 101
    // This test case should fail for the mutant but pass for the original code
  });
});