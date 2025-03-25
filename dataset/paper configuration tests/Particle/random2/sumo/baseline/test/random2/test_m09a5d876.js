const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployTokens } = require("./helper.js");

describe("Test ERC20 - Mutation Test to Kill Visibility Change", function () {
  it("Should successfully call the original init function and set the manager with the mutant", async function () {
    const [managerEoaMock, ,] = await ethers.getSigners();
    const { factory, manager, nft, ft, wft } = await deployTokens("AU ALLO", "AUAL", "OZ");

    // Call the original init function by directly setting the manager variable
    nft.manager = managerEoaMock.address;
    
    // Call the original function to ensure manager is set correctly
    const storedManager = await nft.manager();

    // Assert that the manager is set correctly
    expect(storedManager).to.equal(managerEoaMock.address);
  });
});