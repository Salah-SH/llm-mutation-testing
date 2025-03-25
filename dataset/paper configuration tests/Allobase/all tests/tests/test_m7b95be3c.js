const { expect } = require("chai");
const { waffle } = require("hardhat");
const { deployTokens } = require('./helper.js');
const { loadFixture } = waffle;

describe("Test ERC20 Mutation", function () {
  it("Kill Mutation Test - Manager Immutable State", async function () {
    const [managerEoaMock, addr2, addr3] = await ethers.getSigners();
    const { factory, nft, ft, wft } = await deployTokens('AU ALLO', 'AUAL', 'OZ');

    // Define a new function to access the mutated 'manager' variable
    const getManager = async () => {
      return await ft.manager();
    };

    // Set the mutated 'manager' variable using internal variable instead of the function
    ft.manager = managerEoaMock.address;

    // Verify that the 'manager' variable is set to the mock manager address
    expect(await getManager()).to.equal(managerEoaMock.address);
  });
});