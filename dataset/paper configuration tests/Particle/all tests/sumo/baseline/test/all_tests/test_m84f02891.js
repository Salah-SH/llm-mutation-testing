// Import the necessary packages and functions from Hardhat for testing
const { expect } = require("chai");

// Test case to kill the Solidity mutant by accessing the _totalShares variable indirectly through a public getter function
it("Mutant TotalShares Test Kill - Access Mutated TotalShares Indirectly", async function () {
    // Deploy the contract and necessary tokens
    const ERC20Tpl = await ethers.getContractFactory("ERC20Tpl");
    const ft = await ERC20Tpl.deploy();
    await ft.deployed();

    let errorOccurred = false;

    // Accessing the mutated _totalShares variable indirectly through the public getter function
    try {
        await ft.totalShares();
    } catch (error) {
        errorOccurred = true;
    }

    // Verify that accessing the mutated _totalShares variable indirectly does not throw an error
    expect(errorOccurred).to.equal(false);
});