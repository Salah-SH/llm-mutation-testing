const { expect } = require("chai");

describe("MutantTest: ", function() {
    it("Check factoryController mutation", async function() {
        const Manager = await ethers.getContractFactory("Manager");
        const manager = await Manager.deploy();
        await manager.deployed();

        const initialFactoryController = await manager.factoryController();

        // Mutation: comment out the factoryController check
        // require(factoryController != newController, 'can not be the same to the old address');
        await expect(manager.setFactoryController(initialFactoryController)).to.be.reverted;
    });
});