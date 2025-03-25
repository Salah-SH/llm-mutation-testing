const { expect } = require("chai");
const { waffle } = require("hardhat");
const { deployTokens } = require('./helper.js');
const { loadFixture } = waffle;

describe("Test ERC20WrapperTpl", function () {
  async function deployTokensAndMint() {
    [managerEoaMock, addr2] = await ethers.getSigners();

    const { factory, manager, nft, ft, wft } = await deployTokens('AU ALLO', 'AUAL', 'OZ');

    await nft.connect(managerEoaMock).issue(ft.address, [
      ethers.BigNumber.from("1000000000000000000"),
      ethers.BigNumber.from("2000000000000000000")
    ], ['', '']);
    await ft.issue(addr2.address, '3000000000000000000');

    return { factory, manager, nft, ft, wft, managerEoaMock, addr2 };
  }

  it("Test Mutant_Killer_Function", async function () {
    const { factory, manager, nft, ft, wft, managerEoaMock, addr2 } = await loadFixture(deployTokensAndMint);

    // Mint tokens to an address
    await ft.connect(managerEoaMock).issue(addr2.address, ethers.BigNumber.from("500000000000000000"));

    // Access underlying ERC20 token address for mintTo function call
    const underlyingAddress = (await wft.underlying()).address;

    // Attempt to mint tokens to addr2 address from the underlying ERC20 contract
    await expect(wft.mintTo(addr2.address, ethers.BigNumber.from("500000000000000000"))).to.be.revertedWith("Not underlying");
  });
});