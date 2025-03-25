const { expect } = require("chai");
const { deployTokens } = require('./helper.js');

describe("Test ERC20 Mutation", function () {
  it("Check if mutant is killed", async function () {
    [managerEoaMock, addr2, addr3] = await ethers.getSigners();
    const { factory, manager, nft, ft, wft } = await deployTokens('AU ALLO', 'AUAL', 'OZ');

    await nft.connect(managerEoaMock).issue(ft.address, [
      ethers.BigNumber.from("1000000000000000000"),
      ethers.BigNumber.from("2000000000000000000")
    ], ['', '']);

    await ft.issue(addr2.address, '3000000000000000000');

    // Transfer shares of 2nd address to 3rd address
    await ft.connect(addr2).transferShare(addr3.address, ethers.BigNumber.from("3"));

    // Verify balances and shares after transfer
    // Mutant: Change != to > at line 52
    expect(await ft.sharesOf(addr2.address)).to.be.above(ethers.BigNumber.from("29999999999999999999999997"));
    expect(await ft.sharesOf(addr3.address)).to.be.above(ethers.BigNumber.from("2")); // Fixing the test to kill the mutant
  });
});