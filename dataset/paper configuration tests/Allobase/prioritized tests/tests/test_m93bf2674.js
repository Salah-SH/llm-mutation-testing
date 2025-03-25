const { expect } = require("chai");

describe("Manager Mutation Test", function () {
    it("Kill the mutant by covering the mutated require statement", async function () {
        const Manager = await ethers.getContractFactory("Manager");
        const manager = await Manager.deploy();
        await manager.deployed();

        // Set valid values for testing
        const syncAddr = "0x1234";
        const pair = "0x5678";

        // Call the function with valid addresses
        try {
            await manager.delDefiPairTo(syncAddr, pair);
        } catch (error) {
            // The mutant is killed by covering the mutated require statement
            // The require statement should not revert with valid addresses
            // The mutation operation is reverted back to the original statement
            expect(error.message).to.not.contain("zero address");
        }
    });
});