const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Test ERC20 - Mutant Test", function () {
  it("Mint to Zero Address - Kill Mutant", async function () {
    const ERC20Tpl = await ethers.getContractFactory("ERC20Tpl");
    const ft = await ERC20Tpl.deploy();
    await ft.deployed();

    // Mutating the require statement in the contract
    await expect(ft.wrap(ethers.BigNumber.from("1"))).to.be.revertedWith("Wrap zero");
  });
});