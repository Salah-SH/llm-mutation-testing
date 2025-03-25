const { expect } = require("chai");
const { waffle } = require("hardhat");
const { deployTokens } = require('./helper.js');
const { loadFixture } = waffle;

describe("Test Mutated ERC20WrapperImplSet", function () {
  async function deployFactoryAndTokens() {
    const [managerEoaMock, addr2] = await ethers.getSigners();
    const { factory, manager, nft, ft, wft } = await deployTokens('AU ALLO', 'AUAL', 'OZ');

    return { factory, manager, nft, ft, wft, managerEoaMock, addr2 };
  }

  it("Test ERC20WrapperImplSet mutation", async function () {
    const { factory, manager, nft, ft, wft, managerEoaMock, addr2 } = await loadFixture(deployFactoryAndTokens);

    const oldERC20WrapperImpl = await factory.ERC20WrapperImpl();
    
    // Create a test contract with the same interface as ERC20WrapperImplV2
    const ERC20WrapperImplV2 = await ethers.getContractFactory("ERC20WrapperTplV2");
    const newImpl = await ERC20WrapperImplV2.deploy();

    // Test the mutated function with the new implementation
    await expect(factory.connect(managerEoaMock).setERC20WrapperImpl(newImpl.address)).to.emit(factory, 'ERC20WrapperImplSet').withArgs(oldERC20WrapperImpl, newImpl.address);

    expect(await factory.ERC20WrapperImpl()).to.be.equal(newImpl.address);
  });
});