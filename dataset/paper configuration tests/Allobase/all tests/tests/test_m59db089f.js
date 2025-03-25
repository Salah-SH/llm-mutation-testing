const { expect } = require("chai");

describe("Test killing ERC20ExtPermit Mutant", function () {
  it("Kill ERC20ExtPermit Mutant by accessing internal __gap variable", async function () {
    const { ethers } = require("hardhat");

    const owner = await ethers.getSigners()[0];

    const deployERC20ExtPermit = async () => {
      const ERC20ExtPermitFactory = await ethers.getContractFactory("ERC20ExtPermit");
      return ERC20ExtPermitFactory;
    };

    it("Should access the internal __gap variable", async () => {
      const ERC20ExtPermitFactory = await deployERC20ExtPermit();
      const erc20ExtPermit = await ERC20ExtPermitFactory.deploy();

      const slot = 50;
      // Accessing the internal __gap variable by using getStorageAt
      const gapSlot = (await owner.provider.getStorageAt(erc20ExtPermit.address, slot)).replace(/^0x/, '');
      const gap = ethers.utils.hexZeroPad(gapSlot, 32); // 32 bytes slot
      const gapValue = ethers.BigNumber.from(gap).toNumber();

      expect(gapValue).to.equal(0); // Assert that the value of gap is 0, indicating the mutation is killed
    });
  });
});