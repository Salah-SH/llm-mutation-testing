const { expect } = require("chai");
const { ethers } = require("hardhat");

javascript: `
describe("Factory Mutation Test", function () {
    it("Test mutation at line 196", async function () {
      const [owner] = await ethers.getSigners();
  
      const Factory = await ethers.getContractFactory("Factory");
      const factory = await Factory.deploy();
      await factory.deployed();
  
      await factory.initialize(
        owner.address,  // ERC721Impl
        owner.address,  // ERC20Impl
        owner.address,  // ERC20WrapperImpl
        owner.address,  // syncImpl
        owner.address
      );
  
      expect(await factory.getTriplesLength()).to.be.greaterThan(0); // Killing the mutant
    });
  });
`;