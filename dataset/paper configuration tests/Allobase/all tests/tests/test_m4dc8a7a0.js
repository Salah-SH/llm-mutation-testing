const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Test ERC20WrapperTpl Mutant Killer", function () {
  it("Should revert transaction when emit statement is mutated", async function () {
    const ERC20WrapperTpl = await ethers.getContractFactory("ERC20WrapperTpl");
    const erc20WrapperTpl = await ERC20WrapperTpl.deploy();
    await erc20WrapperTpl.deployed();

    // Call the mintTo function from the ERC20WrapperTpl contract with mutated emit statement
    // In the mutated emit, emit Transfer statement is commented out
    await expect(erc20WrapperTpl.mintTo(ethers.constants.AddressZero, ethers.BigNumber.from("1000")))
      .to.be.revertedWith("Not underlying");
  });
});