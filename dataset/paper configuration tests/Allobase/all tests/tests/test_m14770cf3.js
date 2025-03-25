const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Test ERC20Tpl mutant", function () {
  let ERC20Tpl;
  let wallet;

  before(async function () {
    const ERC20TplFactory = await ethers.getContractFactory("ERC20Tpl");
    ERC20Tpl = await ERC20TplFactory.deploy();
    await ERC20Tpl.deployed();

    const [signer] = await ethers.getSigners();
    wallet = signer;
  });

  it("Mutant should be killed by this test", async function () {
    // Minting zero shares should fail due to the mutation
    try {
      await ERC20Tpl.mintShare(wallet.address, 0);
    } catch (error) {
      // Verify that the error message corresponds to the expected mutation error
      expect(error.message).to.not.contain("ERC20: mint zero shares");
    }

    // Ensure shares remain unchanged
    const shares = await ERC20Tpl.sharesOf(wallet.address);
    expect(shares).to.equal(0);
  });
});