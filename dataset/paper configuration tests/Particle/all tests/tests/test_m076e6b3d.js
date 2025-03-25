const { expect } = require("chai");
const { waffle } = require("hardhat");
const { loadFixture } = waffle;
const { deployTokens } = require('./helper.js');

describe("Testcase to Kill Mutant", function () {

  it("Kill Mutant by Testing setSyncImpl Function", async function () {
    const [managerEoaMock, addr2] = await ethers.getSigners();
    const { factory, manager, nft, ft, wft } = await deployTokens('AU ALLO', 'AUAL', 'OZ');

    // Change the syncImpl address to trigger the mutation
    await factory.setSyncImpl(addr2.address);

    // Check if the mutation was killed
    const newSyncImpl = await factory.syncImpl();
    expect(newSyncImpl).to.equal(addr2.address);
  });

});