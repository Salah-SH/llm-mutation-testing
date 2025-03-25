const { expect } = require("chai");
const { waffle } = require("hardhat");
const { deployTokens } = require('./helper.js');
const { loadFixture } = waffle;

describe("Test ERC20WrapperTpl", function () {
  async function deployTokensAndMint() {
    [manager, addr2] = await ethers.getSigners();

    const { factory, nft, ft, wft } = await deployTokens('AU ALLO', 'AUAL', 'OZ');

    await nft.connect(manager).issue(ft.address, [
      ethers.BigNumber.from("1000000000000000000"),
      ethers.BigNumber.from("2000000000000000000")
    ], ['','']);

    await ft.issue(addr2.address, '3000000000000000000');

    return { factory, nft, ft, wft, manager, addr2 };
  }

  it("Ensure 'underlying' is private", async function () {
    const { factory, nft, ft, wft, manager, addr2 } = await loadFixture(deployTokensAndMint);

    await expect(factory.underlying).to.be.undefined;
  });
});