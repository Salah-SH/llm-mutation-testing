const { expect } = require("chai");

describe("Test ERC20 Mutation", function () {
  it("Kill Mutant by Accessing Internal Variable", async function () {
    // Deploy the ERC20Tpl contract
    const ERC20Tpl = await ethers.getContractFactory("ERC20Tpl");
    const erc20Tpl = await ERC20Tpl.deploy();
    await erc20Tpl.deployed();

    // Access the mutated internal variable wrappedToken
    const internalWrappedToken = await erc20Tpl.wrappedToken();

    // Perform an assertion to validate if the internal variable is accessible
    expect(internalWrappedToken).to.not.be.undefined;
  });
});