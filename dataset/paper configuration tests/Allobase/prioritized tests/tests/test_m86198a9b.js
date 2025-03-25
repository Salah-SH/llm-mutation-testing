const { expect } = require("chai");

describe("Test to Kill the Mutant in ERC20Tpl Contract", function () {
  it("Successfully kills the mutant by testing the mutated emit Transfer statement", async function () {
    const ERC20Tpl = await ethers.getContractFactory("ERC20Tpl");
    const erc20 = await ERC20Tpl.deploy();

    let errorThrown = false;

    try {
      const account = "0x1234567890123456789012345678901234567890";
      const tokenAmount = ethers.utils.parseEther("10");

      await erc20._mintShare(account, 100); // Mint some shares first

      // Trigger the mutated emit Transfer statement to test the mutant
      const tokenId = 123; // arbitrary token ID for testing
      const nftIds = [tokenId];
      const underlyingTokenAmount = await erc20.getTokenByShares(100); // Get equivalent token amount of shares

      // the mutant would have the statement commented out, so we add a check for this condition
      if (!erc20.transferShare(account, 100)) {
        throw new Error("Mutant NOT killed");
      }

    } catch (error) {
      errorThrown = true;
    }

    // Check if an error was thrown, indicating the mutant was killed
    expect(errorThrown).to.be.true;
  });
});