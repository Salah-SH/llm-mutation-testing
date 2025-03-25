const { expect } = require("chai");
const { waffle } = require("hardhat");
const { deployTokens } = require('./helper.js');

describe("Test ERC20Mutant", function () {
  it("UpgradeMutation", async function () {
    const [managerEoaMock, addr2, addr3] = await ethers.getSigners();
    const {factory, manager, nft, ft, wft} = await deployTokens("AU ALLO", "AUAL", "OZ");

    let oldImpl = await ft.connect(managerEoaMock).implementation();
    let newImpl = await ethers.getContractFactory("ERC20TplV2");
    let erc20NewImpl = await newImpl.deploy();

    await ft.connect(managerEoaMock).upgradeTo(erc20NewImpl.address);
    
    expect(await ft.name()).to.equal("AU ALLOv2");
  });
});