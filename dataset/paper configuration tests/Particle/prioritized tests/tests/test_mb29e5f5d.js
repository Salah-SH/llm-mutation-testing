const { expect } = require("chai");

describe("MutantKillingTest", function() {
    it("should revert if the caller is not the rebase controller when setting rebase controller", async function() {
        // Create an instance of the Manager contract
        const Manager = await ethers.getContractFactory("Manager");
        const manager = await Manager.deploy();

        // Emulate the emission of the RebaseControllerSet event with the mutated code
        const newController = "0x1234567890123456789012345678901234567890"; // Random new controller address

        // Call the setRebaseController function with a non-rebase controller address
        await expect(manager.connect((await ethers.getSigners())[0]).setRebaseController(newController))
            .to.be.revertedWith('onlyRebaseController');
    });
});