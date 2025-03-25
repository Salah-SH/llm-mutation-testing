const { expect } = require("chai");

describe("Manager Mutation Test", function () {
    it("Should fail if the mutated line is not changed to >= instead of !=", async function () {
        let errorCaught = false;

        try {
            // Create an instance of the Manager contract
            const Manager = await ethers.getContractFactory("Manager");
            const manager = await Manager.deploy();
            await manager.deployed();

            // Initialize the contract with required addresses
            await manager.initialize(owner, issueFeeRecipient, redeemFeeRecipient, managementFeeRecipient, ctrlAddr, spender, freezeAddr, oversightAddr);

            // Set the rebaseFeeRate to a value
            await manager.setRebaseFeeRateTo(symbol, 0); // This should fail due to the mutated line

        } catch (error) {
            // If an error is caught, the test is successful in killing the mutant
            errorCaught = true;
        }

        expect(errorCaught).to.be.true;
    });
});