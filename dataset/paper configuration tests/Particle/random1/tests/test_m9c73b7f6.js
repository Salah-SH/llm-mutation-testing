const { expect } = require("chai");

describe("Manager Mutation Test", function() {
    it("Mutant should be killed by this test case", async function() {
        // Deploy the Manager contract
        const Manager = await ethers.getContractFactory("Manager");
        const manager = await Manager.deploy();
        await manager.deployed();

        // Define initial values for testing
        const controlAddr = "0x1234567890123456789012345678901234567890";
        const newController = "0xaabbccddeeffaabbccddeeffaabbccddeeffaab";

        // Set the mutated variable to be equal to the controlAddr to trigger the mutant
        manager.feeController = controlAddr;

        // Call the setFeeController function with the mutated value, but check for error handling
        try {
            await manager.setFeeController(newController);
        } catch(error) {
            // Ensure the error message indicates an invalid address
            expect(error.message).to.include("invalid address");
            return; // Exit the test if error occurs as expected
        }

        // The mutant is not killed if the setFeeController function does not throw an error
        // Expecting this line of code to be executed only if the mutant is killed
        expect(false, "Mutant was not killed by the test case as expected").to.be.true;
    });
});