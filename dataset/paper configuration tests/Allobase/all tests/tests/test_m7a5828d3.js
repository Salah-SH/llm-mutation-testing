const { expect } = require("chai");
const { waffle } = require("hardhat");
const { deployTokens } = require('./helper.js');
const { loadFixture } = waffle;

describe("Kill Mutant Test", function () {
  async function deployTokensAndMint() {
    const [managerEoaMock, addr2, addr3] = await ethers.getSigners();

    const { ft } = await deployTokens('AU ALLO', 'AUAL', 'OZ');

    await ft.issue(addr2.address, '3000000000000000000');

    return { ft, addr2, addr3 };
  }

  it("Kill Mutant", async function () {
    const { ft, addr2, addr3 } = await loadFixture(deployTokensAndMint);
    
    // Transfer tokens from addr2 to addr3
    await ft.connect(addr2).transfer(addr3.address, ethers.BigNumber.from("1500000000000000000"));

    // Check balances after transfer
    expect(await ft.balanceOf(addr2.address)).to.equal(ethers.BigNumber.from("1500000000000000000"));
    expect(await ft.balanceOf(addr3.address)).to.equal(ethers.BigNumber.from("1500000000000000000"));
  });
});