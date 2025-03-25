const { expect } = require("chai");

describe("Test Factory Contract Mutation", function () {
  it("Test mutant killing case with >= mutation", async function () {
    const Factory = await ethers.getContractFactory("Factory");
    const factory = await Factory.deploy();
    await factory.deployed();

    // Set ERC721Impl to a different address than current manager
    const newERC721Impl = await ethers.getContractFactory("ERC721Tpl");
    const erc721Tpl = await newERC721Impl.deploy();
    await erc721Tpl.deployed();

    // Call setERC721Impl function with a different address than the current manager
    await expect(factory.setERC721Impl(erc721Tpl.address)).to.be.revertedWith('onlyManager');

    // Verify that the ERC721Impl has not been set to a different address
    expect(await factory.ERC721Impl()).to.not.equal(erc721Tpl.address);
  });
});