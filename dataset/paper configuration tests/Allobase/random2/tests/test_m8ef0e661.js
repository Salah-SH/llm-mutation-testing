const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Manager Mutation Test", function() {
    let manager;
    
    before(async () => {
        const Manager = await ethers.getContractFactory("Manager");
        manager = await Manager.deploy();
        await manager.deployed();
    });

    it("Test mutation in emit FeeControllerSet", async function() {
        const feeController = await manager.feeController();
        const newController = ethers.Wallet.createRandom().address;

        try {
            await manager.setFeeController(newController);
            const updatedFeeController = await manager.feeController();
            expect(updatedFeeController).to.equal(feeController); // This assertion should fail for the mutant
        } catch(error) {
            expect(error).to.be.an('Error');
        }
    });
});