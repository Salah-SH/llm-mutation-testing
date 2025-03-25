const { expect } = require("chai");
const { waffle } = require("hardhat");
const { deployTokens } = require('./helper.js');

describe("Test ERC20 Mutation", function () {
  it("Test Mutated Contract Name", async function () {
    const { factory, manager, nft, ft, wft, managerEoaMock, addr2, addr3 } = await deployTokens('AU ALLO', 'AUAL', 'OZ');
    
    // Test if mutated _name is not equal to original _name
    expect(await ft.name()).to.equal("AU ALLO");
  });
});