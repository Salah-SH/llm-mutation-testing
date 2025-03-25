const { expect } = require("chai");

describe("Test ERC20 Mutant", function () {
  it("Burn from zero address - Kill Mutant", async function () {
    const { ethers } = require("hardhat");
    
    let ERC20Tpl;
    let managerEoaMock;

    beforeEach(async () => {
      const ERC20TplFactory = await ethers.getContractFactory("ERC20Tpl");
      const managerEoaMockFactory = await ethers.getContractFactory("ManagerEoaMock");

      ERC20Tpl = await ERC20TplFactory.deploy();
      managerEoaMock = await managerEoaMockFactory.deploy();
    });

    // Function to burn tokens from a zero address
    const burnFromZero = async () => {
      try {
        // Attempting to burn tokens from the zero address
        await ERC20Tpl.connect(managerEoaMock)._burn("0x0000000000000000000000000000000000000000", ethers.BigNumber.from("1000000000000000000"));
      } catch (error) {
        // If an error is thrown, return false
        return false; // The mutation should trigger the error
      }
      return true;
    };

    // Checking if the mutation is triggered successfully
    it("Should revert when burning tokens from zero address", async function () {
      expect(await burnFromZero()).to.be.false;
    });
  });
});