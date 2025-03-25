const { expect } = require("chai");
const { waffle } = require("hardhat");
const { deployTokens } = require('./helper.js');
const { loadFixture } = waffle;

describe("Test ERC20 Mutation", function () {
  async function deployTokensAndMint() {
    [managerEoaMock, addr2, addr3] = await ethers.getSigners();

    const { factory, manager, nft, ft, wft } = await deployTokens('AU ALLO', 'AUAL', 'OZ');

    await nft.connect(managerEoaMock).issue(ft.address, [
      ethers.BigNumber.from("1000000000000000000"),
      ethers.BigNumber.from("2000000000000000000")
    ], ['', '']);
    await ft.issue(addr2.address, '3000000000000000000');

    return { factory, manager, nft, ft, wft, managerEoaMock, addr2, addr3 };
  }

  it("TransferShareRaw Mutation Test - Kill Mutant", async function () {
    const { factory, manager, nft, ft, wft, managerEoaMock, addr2, addr3 } = await loadFixture(deployTokensAndMint);

    // Perform the mutation operation by modifying the shares transfer logic using a different address
    await ft.connect(addr2).transferShare(addr3.address, ethers.BigNumber.from("3000000000000000"));

    // Expect that the shares of addr2 should not be zero after transfer
    expect(await ft.sharesOf(addr2.address)).to.not.equal(0);
    // Expect that the shares of addr3 should be the exact number of shares transferred
    expect(await ft.sharesOf(addr3.address)).to.equal(ethers.BigNumber.from("3000000000000000"));
  });

});