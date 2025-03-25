const { expect } = require("chai");

describe("Test ERC20 Mutation", function () {
  it("Test Mutated getTokenByShares Function", async function () {
    const { ethers, upgrades } = require("hardhat");

    let ERC20Tpl;
    let erc20Tpl;
    
    beforeEach(async () => {
      ERC20Tpl = await ethers.getContractFactory("ERC20Tpl");
      erc20Tpl = await upgrades.deployProxy(ERC20Tpl);
      await erc20Tpl.deployed();
    });

    it("should calculate the token amount correctly using the mutated function", async function () {
      // Calculate expected token amount based on share amount using the original function
      const shareAmount = ethers.BigNumber.from("100000000");
      const expectedTokenAmount = ethers.BigNumber.from("3000000000000000000"); // 3 eth

      // Call the original function to get the token amount
      const tokenAmountOriginal = await erc20Tpl.callStatic.getTokenByShares(shareAmount);

      // Expect the calculated token amount from the original function to match the expected token amount
      expect(tokenAmountOriginal).to.equal(expectedTokenAmount);

      // Redeploy the contract with the mutated line and calculate the token amount
      const ERC20TplMutated = await ethers.getContractFactory("ERC20Tpl");
      ERC20TplMutated.bytecode = ERC20TplMutated.bytecode.replace(">= ", " != ");
      erc20Tpl = await upgrades.deployProxy(ERC20TplMutated);
      await erc20Tpl.deployed();

      // Call the mutated function to get the token amount
      const tokenAmountMutated = await erc20Tpl.callStatic.getTokenByShares(shareAmount);

      // Expect the calculated token amount from the mutated function to not match the expected token amount
      expect(tokenAmountMutated).to.not.equal(expectedTokenAmount);
    });
  });
});