const { expect } = require("chai");

describe("Test Case to Kill the Mutant FEE_BASE in ERC20TplMutated Contract", function () {
  it("Should correctly retrieve the mutated FEE_BASE constant value", async function () {
    const ERC20Tpl = await ethers.getContractFactory("ERC20Tpl");
    const ft = await ERC20Tpl.deploy();

    // Access the mutated constant FEE_BASE using an internal function from the contract
    const result = await ft.FEE_BASE();

    // Verify that the retrieved value matches the expected value of the mutated constant
    expect(result).to.equal(10**12);
  });
});