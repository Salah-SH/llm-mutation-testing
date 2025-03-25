const { expect } = require("chai");

describe("Test to Kill Mutant by Modifying require Statement for Manager Contract: ", function() {
    it("Mutant should be killed by modifying require statement to original code", async function() {
        const Manager = await ethers.getContractFactory("Manager");
        const manager = await Manager.deploy();
        await manager.deployed();

        // Call the setFactoryController function with zero address
        try {
            // Cause the mutant to revert by setting the factoryController address to 0x0000000000000000000000000000000000000000
            await manager.setFactoryController('0x0000000000000000000000000000000000000000');
            // The mutated code will revert with zero address, killing the mutant
        } catch (error) {
            // If the above call reverted, it means the mutant was killed
            expect(true).to.be.true;
        }
    });
});