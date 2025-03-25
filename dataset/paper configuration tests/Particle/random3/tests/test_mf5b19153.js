const { expect } = require("chai");
const { loadFixture } = require("ethereum-waffle");
const { waffle } = require("hardhat");
const { deployTokens } = require('./helper.js');

describe("Test ERC20 Contract Mutant", function () {
  it("Require mutated function to revert", async function () {
    const [managerEoaMock, addr2, addr3] = await ethers.getSigners();
    const { factory, manager, nft, ft, wft } = await deployTokens('AU ALLO', 'AUAL', 'OZ');

    await ft.connect(managerEoaMock).freeze(addr2.address);
    
    // Expect the transfer to revert due to frozen address
    await expect(ft.connect(addr2).transfer(addr3.address, ethers.BigNumber.from("1"))).to.be.revertedWith("Address frozen");
  });
});