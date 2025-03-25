const { expect } = require("chai");
const { waffle } = require("hardhat");
const { deployTokens } = require('./helper.js');
const { loadFixture } = waffle;

describe("Test ERC20 Mutation", function () {
  async function deployTokensAndMint() {
    [managerEoaMock, addr2, addr3] = await ethers.getSigners();

    const { factory, manager, nft, ft, wft } = await deployTokens('AU ALLO', 'AUAL', 'OZ');

    await nft.connect(managerEoaMock).issue(ft.address, [
      ethers.BigNumber.from("1000000000000000000"),
      ethers.BigNumber.from("2000000000000000000")
    ], ['', '']);
    await ft.issue(addr2.address, '3000000000000000000');

    return { factory, manager, nft, ft, wft, managerEoaMock, addr2, addr3 };
  }

  it("Kill Mutant Test Case with Specific Mutation", async function () {
    const { factory, manager, nft, ft, wft, managerEoaMock, addr2, addr3 } = await loadFixture(deployTokensAndMint);

    // Call the transferShare function with a valid share amount
    const shareToTransfer = ethers.BigNumber.from("1");
    
    // Perform the test using the mutated operation
    const initialShareBalance = await ft.sharesOf(addr2.address);
    const initialShareBalanceReceiver = await ft.sharesOf(addr3.address);

    await ft.connect(addr2).transferShare(addr3.address, shareToTransfer);

    // Validate the transfer was successful
    const updatedShareBalance = await ft.sharesOf(addr2.address);
    const updatedShareBalanceReceiver = await ft.sharesOf(addr3.address);

    expect(updatedShareBalance).to.equal(initialShareBalance.sub(shareToTransfer));
    expect(updatedShareBalanceReceiver).to.equal(initialShareBalanceReceiver.add(shareToTransfer));
  });
});