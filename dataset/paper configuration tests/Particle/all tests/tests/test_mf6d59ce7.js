const { expect } = require("chai");
const { waffle } = require("hardhat");
const { deployTokens } = require('./helper.js');
const { loadFixture } = waffle;

describe("KillMutantTest", function () {
  it("Test Empty Name and Symbol to Kill Mutant", async function () {
    async function deployFactory() {
      [managerEoaMock, addr2, addr3] = await ethers.getSigners();
      const { factory, manager, nft, ft, wft } = await deployTokens('AU ALLO', 'AUAL', 'OZ');
      return { factory, manager, nft, ft, wft, managerEoaMock, addr2, addr3 };
    }

    it("should revert if name or symbol is empty", async function () {
      let { factory, manager, nft, ft, wft, managerEoaMock, addr2, addr3 } = await loadFixture(deployFactory);

      const name = '';
      const symbol = 'TestSymbol';
      const underlyingUnit = 'TestUnit';

      await expect(
        factory.connect(manager).createTriple(name, symbol, underlyingUnit)
      ).to.be.revertedWith('empty string');

      const name2 = 'TestName';
      const symbol2 = '';
      const underlyingUnit2 = 'TestUnit';

      await expect(
        factory.connect(manager).createTriple(name2, symbol2, underlyingUnit2)
      ).to.be.revertedWith('empty string');
    });
  });
});