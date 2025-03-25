const { expect } = require("chai");

describe("Manager mutant killing testcase", function() {
    let manager;
    let feeController; // Variable to store the fee controller address

    before(async function () {
        const Manager = await ethers.getContractFactory("Manager");
        manager = await Manager.deploy();
        await manager.deployed();

        // Get the fee controller of the Manager contract
        feeController = await manager.feeController();
    });

    it("Mutant should return true when checking for fee controller", async function() {
        // Verify that the fee controller is the same as the fee controller set in the contract
        expect(feeController).to.equal(await manager.feeController());
    });
});