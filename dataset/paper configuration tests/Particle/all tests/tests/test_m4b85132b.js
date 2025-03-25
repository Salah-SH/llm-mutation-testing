const { expect } = require("chai");
const { waffle } = require("hardhat");
const { deployTokens } = require('./helper.js');
const { loadFixture } = waffle;

describe("Test ERC20 Factory Mutation", function () {

  it("Create Triple with Existing Symbol", async function () {
    const [managerEoaMock, addr2, addr3] = await ethers.getSigners();
    const { factory, manager, nft, ft, wft } = await deployTokens('AU ALLO', 'AUAL', 'OZ');

    // Call createTriple with the same symbol twice
    await expect(factory.connect(managerEoaMock).createTriple('Test NFT', 'AUAL', 'OZ'))
      .to.be.revertedWith('already exists');
  });

});