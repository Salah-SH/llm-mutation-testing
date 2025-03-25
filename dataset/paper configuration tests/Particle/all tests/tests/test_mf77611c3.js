const { expect } = require("chai");
const { waffle } = require("hardhat");
const { deployTokens } = require('./helper.js');
const { loadFixture } = waffle;

describe("Test ERC20_Mutant", function () {
  async function deployTokensAndMint() {
    [managerEoaMock, addr2] = await ethers.getSigners();

    const { factory, manager, nft, ft, wft } = await deployTokens('AU ALLO', 'AUAL', 'OZ');

    await nft.connect(managerEoaMock).issue(ft.address, [
      ethers.BigNumber.from("1000000000000000000"),
      ethers.BigNumber.from("2000000000000000000")
    ], ['', '']);
    await ft.issue(addr2.address, '3000000000000000000');

    return { factory, manager, nft, ft, wft, managerEoaMock, addr2 };
  }

  it("Upgrade_Mutant", async function () {
    const { factory, manager, nft, ft, wft, managerEoaMock, addr2 } = await loadFixture(deployTokensAndMint);

    let newImpl = await ethers.getContractFactory("ERC20TplV2");
    erc20NewImpl = await newImpl.deploy();

    await ft.connect(managerEoaMock).upgradeTo(erc20NewImpl.address);

    expect(await ft.connect(managerEoaMock).implementation()).to.equal(erc20NewImpl.address);

    // Check if the upgraded contract uses the new implementation
    expect(await ft.name()).to.equal("AU ALLOv2");

    // Check if the old implementation can be called through the new contract
    const shareBase = await ft.shareBase();
    expect(await ft.symbol()).to.equal("AUAL");
    expect(await ft.balanceOf(addr2.address)).to.equal(ethers.BigNumber.from("3000000000000000000"));
    expect(await ft.sharesOf(addr2.address)).to.equal(ethers.BigNumber.from("3000000000000000000").mul(shareBase));
    expect(await ft.totalSupply()).to.equal(ethers.BigNumber.from("3000000000000000000"));
    expect(await ft.totalShares()).to.equal(ethers.BigNumber.from("3000000000000000000").mul(shareBase));
  });
});