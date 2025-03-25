const { expect } = require("chai");

describe("Test to kill the mutant: != mutated to >", function() {
    it("Check if the mutation is killed by using > instead of !=", async function() {
        const Manager = await ethers.getContractFactory("Manager");
        const manager = await Manager.deploy();
        await manager.deployed();

        // Setting the fee controller address to a different address to trigger the mutation
        const newFeeController = "0x9876543210987654321098765432109876543210";
        
        // Set the fee controller address using the onlyFeeController modifier to kill the mutant
        await expect(manager.setFeeController(newFeeController)).to.be.revertedWith("onlyFeeController");

        // Check if the fee controller address has not been updated due to the mutation
        expect(await manager.feeController()).to.not.equal(newFeeController);
        
        // Additional check to ensure the fee controller address was not changed as expected
        expect(await manager.feeController()).to.not.equal("0x9876543210");
    });
});